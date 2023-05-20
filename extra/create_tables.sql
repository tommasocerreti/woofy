-- Creazione della tabella "user"
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  surname VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  profession VARCHAR(255),
  taxcode VARCHAR(255),
  city VARCHAR(255),
  address VARCHAR(255),
  cap VARCHAR(255)
);

-- Creazione della tabella "booking"
CREATE TABLE booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  time TIME
);

-- Creazione della tabella "calendar"
CREATE TABLE calendar (
  id INT AUTO_INCREMENT PRIMARY KEY
);
