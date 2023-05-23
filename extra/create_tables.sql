-- Creazione della tabella "user"
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  secondName VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  profession VARCHAR(255),
  city VARCHAR(255),
  address VARCHAR(255)
);

-- Creazione della tabella "working_hours"
CREATE TABLE working_hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  week_day VARCHAR(255),
  start TIME,
  finish TIME
);

-- Creazione della tabella "booking"
CREATE TABLE booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id1 INT,
  user_id2 INT,
  date_time DATETIME
);
