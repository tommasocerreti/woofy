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
 `start_mon` TIME,
 `finish_mon` TIME,
 `start_tue` TIME,
 `finish_tue` TIME,
 `start_wed` TIME,
 `finish_wed` TIME,
 `start_thu` TIME,
 `finish_thu` TIME,
 `start_fri` TIME,
 `finish_fri` TIME,
 `start_sat` TIME,
 `finish_sat` TIME,
 `start_sun` TIME,
 `finish_sun` TIME
);

-- Creazione della tabella "booking"
CREATE TABLE booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id1 INT,
  user_id2 INT,
  date DATE,
  time TIME
);
