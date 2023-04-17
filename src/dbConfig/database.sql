CREATE DATABASE fileserver;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_role VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id)
);


CREATE TABLE files(
    file_id SERIAL,
    user_id UUID,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    downloads INT,
    mails_sent INT,
    image VARCHAR(255) NOT NULL, 
    PRIMARY KEY (file_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
CREATE TABLE files(
    file_id SERIAL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    downloads INT,
    mails_sent INT,
    image VARCHAR(255) NOT NULL, 
    PRIMARY KEY (file_id)
);