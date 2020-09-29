TRUNCATE users, categories, habits, tasks, frequency RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password, first_name, last_name) VALUES
    ('bmbachow', 'Thinkful!123', 'Brian', 'Bachow'),
    ('JayPee', 'SickBulkBro!', 'JP', 'Holland');

INSERT INTO categories (user_id, category_name, category_description, date_created) VALUES
    ('1', 'Health', 'Habits related to helping me stay
     healthy such as taking vitamins, eating well, getting enough sleep,
     and exercising', '2020-09-25'),
    ('1', 'Productivity', 'Habits designed to help me get more done in less time',
    '2020-09-25'),
    ('2', 'Weight Gain', 'I want to get huge!', '2020-09-26');

INSERT INTO habits (category_id, habit_name, habit_description, date_created) VALUES
    ('1', 'Vitamins', 'Take all of my vitamins and medication', '2020-09-25'),
    ('1', 'Veggies', 'Eat 2 servings of vegetables', '2020-09-25'),
    ('2', 'Awake by 8AM', 'Get up and out of bed by 8AM', '2020-09-25'),
    ('3', 'Eat 6 eggs', '', '2020-09-26')