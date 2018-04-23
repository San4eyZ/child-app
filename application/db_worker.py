import MySQLdb as mdb
from abc import ABCMeta, abstractmethod


__all__ = ['DBHandler']


class Table:
    __metaclass__ = ABCMeta

    def _generate_string(self, str, count_repeat):
        return ', '.join([''.join(str) for _ in range(count_repeat)])

    def insert(self, db_inst, db_name, table_name, columns, values):
        with db_inst:
            cur = db_inst.cursor()
            cols = ','.join(columns)
            query = '''INSERT INTO {}.{} ({}) VALUES ({})'''. \
                format(db_name, table_name, cols, self._generate_string('%s', len(columns)))
            cur.executemany(query, values)

    def execute(self, query, db_inst):
        with db_inst:
            cur = db_inst.cursor()
            cur.execute(query)
            try:
                rows = cur.fetchall()
            except mdb.Error:
                return None
        return rows

    @abstractmethod
    def create(self):
        pass

    @abstractmethod
    def insert_records(self, records):
        pass


class StudentsTable(Table):
    def __init__(self, db_name, db_instance):
        self.db = db_instance
        self.tb_name = 'Students'
        self.db_name = db_name
        self.columns = ('Id', 'Name', 'Surname', 'Number_of_group', 'Rating',
                        'Teachers_id')
        self.student_count = 0

    def create(self):
        with self.db:
            cur = self.db.cursor()
            query = '''CREATE TABLE IF NOT EXISTS {}.{} (
            Id INT,
            Name VARCHAR(25),
            Surname VARCHAR(25),
            Number_of_group INT,
            Rating INT,
            Teachers_id INT
            )'''.format(self.db_name, self.tb_name)
            cur.execute(query)

    def fetch_full_students_information(self, id):
        query = '''SELECT Name, Surname, Number_of_group, Rating FROM {}.{} WHERE Id={}'''.\
            format(self.db_name, self.tb_name, id)
        res = super().execute(query, self.db)
        if res:
            return res

    def fetch_teachers_id(self, id):
        query = '''SELECT Teachers_id FROM {}.{} WHERE Id={}'''. \
            format(self.db_name, self.tb_name, id)
        res = super().execute(query, self.db)
        if res:
            return res

    def fetch_rating_of_student(self, id):
        query = '''SELECT Rating FROM {}.{} WHERE Id={}'''.\
            format(self.db_name, self.tb_name, id)
        res = super().execute(query, self.db)
        if res:
            return res

    def fetch_score_table(self):
        query = '''SELECT Name, Surname, Rating FROM {}.{}
                   ORDER BY Rating DESC'''.\
            format(self.db_name, self.tb_name)
        res = super().execute(query, self.db)
        if res:
            return res

    def fetch_group(self, group_number):
        query = '''SELECT Name, Surname FROM {}.{} WHERE Number_of_group={}'''.\
            format(self.db_name, self.tb_name, group_number)
        res = super().execute(query, self.db)
        if res:
            return res

    def fetch_students_of_teacher(self, id):
        query = '''SELECT Name, Surname FROM {}.{}
        WHERE Teachers_id={}'''.\
            format(self.db_name, self.tb_name, id)
        res = super().execute(query, self.db)
        if res:
            return res

    def fetch_all(self):
        query = '''SELECT * FROM {}.{}'''. \
            format(self.db_name, self.tb_name)
        res = super().execute(query, self.db)
        if res:
            return res

    def update_rating_of_student(self, id, new_rating):
        query = '''UPDATE LOW_PRIORITY {}.{}
        SET Rating={} WHERE Id={}'''.\
            format(self.db_name, self.tb_name, new_rating, id)
        super().execute(query, self.db)

    def update_group_of_student(self, id, new_group_number):
        query = '''UPDATE LOW_PRIORITY {}.{}
                SET Number_of_group={} WHERE Id={}'''. \
            format(self.db_name, self.tb_name, new_group_number, id)
        super().execute(query, self.db)

    def update_teacher_of_student(self, students_id, teachers_id):
        query = '''UPDATE LOW_PRIORITY {}.{}
                SET Teachers_id={} WHERE Id={}'''. \
            format(self.db_name, self.tb_name, teachers_id, students_id)
        super().execute(query, self.db)

    def drop_student(self, id):
        query = '''DELETE LOW_PRIORITY FROM {}.{} WHERE Id={}'''.\
            format(self.db_name, self.tb_name, id)
        super().execute(query, self.db)

    def insert_records(self, records):
        self.student_count += 1
        records = [self.student_count] + records
        super().insert(self.db, self.db_name, self.tb_name, self.columns, records)


class HWHistoryTable(Table):
    def __init__(self, db_name, db_instance):
        self.db = db_instance
        self.tb_name = 'HWHistory'
        self.db_name = db_name
        self.columns = ('Date', 'Result', 'Type_of_hw', 'Student_id')

    def create(self):
        with self.db:
            cur = self.db.cursor()
            query = '''CREATE TABLE IF NOT EXISTS {}.{} (
                   Id INT PRIMARY KEY AUTO_INCREMENT,
                   Date DATE,
                   Result INT,
                   Type_of_hw VARCHAR(25),
                   Student_id INT
                   )'''.format(self.db_name, self.tb_name)
            cur.execute(query)

    def fetch_recent_history(self, student_id):
        query = '''SELECT Date, Result, Type_of_hw FROM {}.{}
        WHERE Student_id={}
        ORDER BY Date DESC
        LIMIT 10'''.format(self.db_name, self.tb_name, student_id)
        res = super().execute(query, self.db)
        if res:
            return res

    def insert_records(self, records):
        super().insert(self.db, self.db_name, self.tb_name, self.columns, records)

    def drop_history_of_student(self, id):
        query = '''DELETE LOW_PRIORITY FROM {}.{} WHERE Student_id={}'''.\
            format(self.db_name, self.tb_name, id)
        super().execute(query, self.db)

    def fetch_all(self):
        query = '''SELECT * FROM {}.{}'''. \
            format(self.db_name, self.tb_name)
        res = super().execute(query, self.db)
        if res:
            return res


class TeachersTable(Table):
    def __init__(self, db_name, db_instance):
        self.db = db_instance
        self.tb_name = 'Teachers'
        self.db_name = db_name
        self.columns = ('Id','Teachers_name', 'Teachers_surname')
        self.teacher_count = 0

    def create(self):
        with self.db:
            cur = self.db.cursor()
            query = '''CREATE TABLE IF NOT EXISTS {}.{} (
                   Id INT PRIMARY KEY AUTO_INCREMENT,
                   Teachers_name VARCHAR(100),
                   Teachers_surname VARCHAR(100)
                   )'''.format(self.db_name, self.tb_name)
            cur.execute(query)

    def insert_records(self, records):
        self.teacher_count += 1
        records = [self.teacher_count] + records
        super().insert(self.db, self.db_name, self.tb_name, self.columns, records)

    def fetch_full_name(self, id):
        query = '''SELECT Teachers_name, Teachers_surname FROM {}.{} WHERE Id={}'''.\
            format(self.db_name, self.tb_name, id)
        res = super().execute(query, self.db)
        if res:
            return res

    def drop_teacher(self, id):
        query = '''DELETE LOW_PRIORITY FROM {}.{} WHERE Id={}'''.\
            format(self.db_name, self.tb_name, id)
        super().execute(query, self.db)


class StudentAuthorizationTable(Table):
    def __init__(self, db_name, db_instance):
        self.db = db_instance
        self.tb_name = 'StudentAuthorization'
        self.db_name = db_name
        self.columns = ('student_id', 'login', 'hash')

    def create(self):
        with self.db:
            cur = self.db.cursor()
            query = '''CREATE TABLE IF NOT EXISTS {}.{} (
                   Id INT PRIMARY KEY AUTO_INCREMENT,
                   student_id INT,
                   login VARCHAR(256),
                   hash VARCHAR(256)
                   )'''.format(self.db_name, self.tb_name)
            cur.execute(query)

    def insert_records(self, records):
        super().insert(self.db, self.db_name, self.tb_name, self.columns, records)

    def select_student_id(self, login, student_hash):
        query = '''SELECT student_id, FROM {}.{} WHERE login={} AND hash={}'''.\
            format(self.db_name, self.tb_name, login, student_hash)
        res = super().execute(query, self.db)
        if res:
            return res[0]


class TeacherAuthorizationTable(Table):
    def __init__(self, db_name, db_instance):
        self.db = db_instance
        self.tb_name = 'TeacherAuthorization'
        self.db_name = db_name
        self.columns = ('teacher_id','login', 'hash')

    def create(self):
        with self.db:
            cur = self.db.cursor()
            query = '''CREATE TABLE IF NOT EXISTS {}.{} (
                   Id INT PRIMARY KEY AUTO_INCREMENT,
                   teacher_id INT,
                   login VARCHAR(256),
                   hash VARCHAR(256)
                   )'''.format(self.db_name, self.tb_name)
            cur.execute(query)

    def insert_records(self, records):
        super().insert(self.db, self.db_name, self.tb_name, self.columns, records)

    def select_teacher_id(self, login, student_hash):
        query = '''SELECT teacher_id, FROM {}.{} WHERE login={} AND hash={}'''.\
            format(self.db_name, self.tb_name, login, student_hash)
        res = super().execute(query, self.db)
        if res:
            return res[0]


class DBHandler:
    def __init__(self, host, user, passwd, db_name):
        self.db_name = db_name
        self.host = host
        self.user = user
        self.passwd = passwd
        self.db = mdb.connect(
            host=self.host, user=self.user, passwd=self.passwd, db=self.db_name)
        self.tables = {'students': StudentsTable(self.db_name, self.db),
                       'hw': HWHistoryTable(self.db_name, self.db),
                       'teachers': TeachersTable(self.db_name, self.db),
                       'teacher_auth': TeacherAuthorizationTable(self.db_name, self.db),
                       'student_auth': StudentAuthorizationTable(self.db_name, self.db)}
        for key in self.tables:
            self.tables[key].create()

    def fetch_score_table(self):
        return self.tables['students'].fetch_score_table()

    def fetch_recent_history(self, student_id):
        return self.tables['hw'].fetch_recent_history(student_id)

    def fetch_rating_of_student(self, students_id):
        return self.tables['students'].fetch_rating_of_student(students_id)[0][0]

    def fetch_group(self, group_number):
        return self.tables['students'].fetch_group(group_number)

    def fetch_students_of_teacher(self, teachers_id):
        return self.tables['students'].fetch_students_of_teacher(teachers_id)

    def _fetch_all_students_information(self, students_id):
        return self.tables['students'].fetch_full_students_information(students_id)[0] + \
               self.tables['teachers'].fetch_full_name(
                   self.tables['students'].fetch_teachers_id(students_id)[0][0])[0]

    def update_group_of_student(self, student_id, new_group_number):
        self.tables['students'].update_group_of_student(student_id, new_group_number)

    def update_rating_of_student(self, student_id, new_rating):
        self.tables['students'].update_rating_of_student(student_id, new_rating)

    def update_teacher_of_student(self, student_id, teacher_id):
        self.tables['students'].update_teacher_of_student(student_id, teacher_id)

    def drop_student(self, student_id):
        self.tables['students'].drop_student(student_id)

    def drop_teacher(self, teacher_id):
        self.tables['teachers'].drop_teacher(teacher_id)

    def drop_history_of_student(self, student_id):
        self.tables['hw'].drop_history_of_student(student_id)

    def insert_records(self, table_name, records):
        self.tables[table_name].insert_records(records)

    def teacher_exist(self, login, teacher_hash):
        if self.tables['teacher_auth'].select_teacher_id(login, teacher_hash):
            return True
        return False

    def student_exist(self, login, student_hash):
        if self.tables['student_auth'].select_student_id(login, student_hash):
            return True
        return False

    def fetch_student_information(self, login, student_hash):
        student_id = self.tables['student_auth'].select_student_id(login, student_hash)
        if student_id:
            return [student_id] + self._fetch_all_students_information(student_id)

    def register_student(self, login, student_hash, student_information):
        self.insert_records('students', [student_information])
        self.insert_records('student_auth', [
            (self.tables['students'].student_count, login, student_hash)
            ])

    def register_teacher(self, login, teacher_hash, teacher_information):
        self.insert_records('teachers', [teacher_information])
        self.insert_records('teacher_auth', [
            (self.tables['teachers'].teacher_count, login, teacher_hash)
            ])

    def close(self):
        self.db.close()
