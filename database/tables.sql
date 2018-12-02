/* Guide for reconstructing database */

CREATE TABLE IF NOT EXISTS "users"
(
    "username" varchar(32) PRIMARY KEY,
    "password" char(60) NOT NULL
)

CREATE TABLE IF NOT EXISTS "category"
(
    "category_id" serial PRIMARY KEY,
    "username" varchar(32) REFERENCES users(username),
    "category_title" varchar(32),
    "category_index" int NOT NULL
)

CREATE TABLE IF NOT EXISTS "card"
(
    "card_id" serial PRIMARY KEY,
    "category_id" serial REFERENCES category(category_id),
    "card_index" int NOT NULL,
    "card_front" varchar(150),
    "card_back" varchar(300)
)
