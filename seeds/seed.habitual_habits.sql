TRUNCATE users, categories, habits, tasks, frequency RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password, first_name, last_name, is_deleted) VALUES
    ('bmbachow', 'Thinkful!123', 'Brian', 'Bachow', 0),
    ('JayPee', 'SickBulkBro!', 'JP', 'Holland', 0);

INSERT INTO categories (user_id, category_name, category_description, is_deleted, date_created) VALUES
    ('1', 'Health', 'Habits related to helping me stay
     healthy such as taking vitamins, eating well, getting enough sleep,
     and exercising', 0, '2020-09-25'),
    ('1', 'Productivity', 'Habits designed to help me get more done in less time',
     0, '2020-09-25'),
    ('2', 'Weight Gain', 'I want to get huge!', 0, '2020-09-26');

INSERT INTO habits (category_id, habit_name, habit_description, is_deleted, date_created) VALUES
    ()