CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (225) NOT NULL,
    first_name VARCHAR (225) NOT NULL,
    last_name VARCHAR (225) NOT NULL,
    nick_name VARCHAR (225) NOT NULL
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    category_name VARCHAR (255) NOT NULL,
    is_deleted INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE habits (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    category_id INTEGER
        REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    habit_name VARCHAR (255) NOT NULL,
    finished INTEGER NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    habit_id INTEGER
        REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    task_name VARCHAR (255) NOT NULL,
    finished INTEGER NOT NULL
);

CREATE TABLE frequency (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    task_id INTEGER
        REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
    number_of_days INTEGER NOT NULL
);