
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS see;
USE see;

-- Create users table (sign_up in the original code)
CREATE TABLE IF NOT EXISTS sign_up (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  ph_no VARCHAR(20),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_freelancer BOOLEAN DEFAULT FALSE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  deadline DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  skills JSON,
  client_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  cover_letter TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (user_id) REFERENCES sign_up(id)
);

-- Insert admin user if not exists
INSERT INTO sign_up (name, email, password, is_freelancer)
SELECT 'Admin', 'adminkareskillhive@klu.ac.in', '$2b$10$D8HUOo938nU4M1KCQR8EC.5DckEh/fZMy0JIOgm9ux9mFQMdCqwyW', 0
FROM dual
WHERE NOT EXISTS (
    SELECT 1 FROM sign_up WHERE email = 'adminkareskillhive@klu.ac.in'
);
