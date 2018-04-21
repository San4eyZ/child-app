from enum import Enum
import random


def sign(y):
    if y >= 0:
        return 1
    return -1


class Number:
    def __init__(self, x, max_length):
        self.X = x
        self.list_a = [] #mod 5 в разрядах
        self.list_b = [] #цифры в 10сс
        self.list_c = [] #флаги пятерки в разрядах
        x = abs(x)
        numeral = x % 10
        number = x // 10
        while True:
            self.list_a.append(numeral)
            self.list_b.append(numeral % 5)
            self.list_c.append(numeral // 5)
            if number == 0:
                break
            numeral = number % 10
            number //= 10

        while len(self.list_a) < max_length:
            self.list_a.append(0)
            self.list_b.append(0)
            self.list_c.append(0)

    def __str__(self):
        return str(self.list_a) + '\r\n' + str(self.list_b) + '\r\n' \
               + str(self.list_c) + '\r\n______________\r\n'


class SumType(Enum):
    simple = 0
    brother = 1
    friend = 2
    brother_and_friend = 3


class TypeAndNumber:
    def __init__(self, _type, number):
        self._type = _type
        """SumType"""
        self.number = number
        """цифра со знаком"""

    def get_opposite(self):
        return TypeAndNumber(self._type, (-1) * self.number)

    def __eq__(self, other):
        return self._type == other._type and self.number == other.number

    def __str__(self):
        return 'type: ' + str(self._type) + ', number:' + str(self.number)

    def __hash__(self):
        return self._type * 401 + self.number


class Generator:
    def __init__(self, length, types_and_numbers, count_of_numbers):
        """ length - максимальная длина числа
            types_and_numbers - list TypeAndNumber-ов
        """
        self.current_number = 0
        self.length_of_number = length + 1
        self.types_and_numbers = set(types_and_numbers)
        self._type = 0
        opposite = []
        for _x in types_and_numbers:
            self._type = max(self._type, _x._type)
            opposite.append(_x.get_opposite())
        for _x in opposite:
            self.types_and_numbers.add(_x)
        self.types_and_numbers.add(TypeAndNumber(0, 0))
        self.count_of_numbers = count_of_numbers
        self.rating = 0
        self.list_of_numbers = []

    def get_list_of_numbers(self):
        self.refresh()
        return self.list_of_numbers

    def refresh(self):
        self.list_of_numbers = []
        self.current_number = 0
        self.rating = 0
        for i in range(self.count_of_numbers):
            a = self.get_next_number()
            self.list_of_numbers.append(a)
            self.rating += self.get_rating(a, self.current_number - a)
        self.rating *= 1 + 0.25 * self._type
        if self._type == 2:
            self.rating /= 2
        if self._type == 3:
            self.rating /= 1.5
        self.rating = int(self.rating)

    def check_answer(self, ans):
        return self.current_number == ans

    def get_rating(self, x, y):
        x = Number(x, self.length_of_number)
        y = Number(y, self.length_of_number)
        rating = 0
        for i in range(len(x.list_b)):
            rating += abs(x.list_b[i] - y.list_b[i]) + (x.list_c[i] != y.list_c[i])
        return rating

    def get_next_number(self):
        x = self.current_number
        number = Number(x, self.length_of_number)
        delta = [0, 0]
        is_ok_type = [0, 0]
        result = [self.current_number, self.current_number]
        for i in range(len(number.list_a) - 1):

            _x = number.list_a[i]

            cur0 = self.generate_number(_x, 1, delta[0], i == len(number.list_a) - 2)
            cur1 = self.generate_number(_x, -1, delta[1], i == len(number.list_a) - 2)

            is_ok_type[0] = is_ok_type[0] or self.get_type(_x, cur0) == self._type
            is_ok_type[1] = is_ok_type[1] or self.get_type(_x, cur1) == self._type

            delta[0] = _x + cur0 > 9
            delta[1] = -(_x + cur0 < 0)

            result[0] += cur0 * (10 ** i)
            result[1] += cur1 * (10 ** i)

        y = [0, 0]
        y[0] = result[0] - self.current_number
        y[1] = result[1] - self.current_number
        types = [self.get_type(self.current_number, y[0]),
                 self.get_type(self.current_number, y[1])]
        if y[1] + x < 0\
                or y[1] == 0\
                or ((types[0] > types[1]) and types[0] == self._type)\
                or 10 ** (self.length_of_number - 2) > abs(y[1]) \
                or types[1] > self._type:
            ans = y[0]
        elif y[0] == 0\
                or ((types[1] > types[0]) and types[1] == self._type)\
                or 10 ** (self.length_of_number - 2) > abs(y[0])\
                or types[0] > self._type:
            ans = y[1]
        else:
            if self.current_number > 10 ** (self.length_of_number - 1) * 1.3:
                for i in range(2):
                    y.append(y[1])
            ans = random.choice(y)

        if self.get_type(self.current_number, ans) > self._type or ans == 0:
            return self.get_next_number()
        self.current_number += ans
        return ans

    def generate_number(self, x, _sign, delta, is_last=False, is_ok_type=False):
        candidates = []
        for i in range(-9, 10, 1):
            y = i+delta
            if y == 0 \
                    or (_sign == -1 and is_last and abs(x) <= abs(y)) \
                    or y < -9 \
                    or y > 9:
                continue
            _type = self.get_type(x, y)
            tn = TypeAndNumber(_type, y)
            if tn in self.types_and_numbers and _sign == sign(y):
                candidates.append(tn)
        if len(candidates) == 0 or (is_ok_type and (len(candidates) < 2)):
            for y in range(-9, 10, 1):
                _type = self.get_type(x, y)
                tn = TypeAndNumber(_type, y)
                if tn._type == 0 and (_sign == sign(y) or tn.number == 0):
                    candidates.append(tn)

        return random.choice(candidates).number

    def get_type(self, _x, _y, type2_3_detect=True):
        sum = Number(_x + _y, self.length_of_number)
        x = Number(_x, self.length_of_number)
        y = Number(_y, self.length_of_number)
        type = [0, 0, 0, 0]
        is_transfered = False
        for i in range(self.length_of_number):
            is_transfered = (((x.list_a[i] + sign(_y)
                               * (y.list_a[i] + is_transfered)) >= 10) or
                             (x.list_a[i] + sign(_y)
                              * (y.list_a[i] + is_transfered) < 0))
            type[0] = type[0] or (
                ((_y >= 0 and sum.list_b[i] >= x.list_b[i]
                  and sum.list_c[i] >= x.list_c[i])
                 or (_y < 0 and sum.list_b[i] <= x.list_b[i]
                     and sum.list_c[i] <= x.list_c[i])))

            type[1] = type[1] or (
                ((_y >= 0 and sum.list_b[i] < x.list_b[i]
                  and sum.list_c[i] > x.list_c[i])
                 or (_y < 0 and sum.list_b[i] > x.list_b[i]
                     and sum.list_c[i] < x.list_c[i]))
            )

            if not type2_3_detect:
                continue

            type[2] = type[2] or (
                is_transfered and
                ((_y >= 0
                  and self.get_type(x.list_a[i], (y.list_a[i] - 10),
                                    type2_3_detect=False) == 0)
                 or (_y < 0
                     and self.get_type(x.list_a[i], (10 - y.list_a[i]),
                                       type2_3_detect=False) == 0))
            )

            type[3] = type[3] or (
                is_transfered and
                ((_y >= 0
                  and self.get_type(x.list_a[i], (y.list_a[i] - 10),
                                    type2_3_detect=False) == 1)
                 or (_y < 0
                     and self.get_type(x.list_a[i], (10 - y.list_a[i]),
                                       type2_3_detect=False) == 1))
            )

        for i in range(3, 0, -1):
            if type[i]:
                return i
        return 0


def generate(theme_options, speed, capacity, quantity):
    difficulties = []
    for theme, level in theme_options:
        difficulties.append(TypeAndNumber(int(theme), int(level)))
    g = Generator(capacity, difficulties, quantity)
    return g.get_list_of_numbers()
