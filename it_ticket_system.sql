
-- IT Ticket System schema (MySQL 8+)
-- Charset & engine
SET NAMES utf8mb4;
SET time_zone = '+07:00';

-- 1) Create database
CREATE DATABASE IF NOT EXISTS it_ticket_system
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE it_ticket_system;

-- 2) Users table
CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(191) NOT NULL UNIQUE,
  phone           VARCHAR(30)  NOT NULL,
  department      VARCHAR(50)  NOT NULL,
  role            ENUM('admin','user') NOT NULL DEFAULT 'user',
  password_hash   VARCHAR(255) NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_users_email (email)
) ENGINE=InnoDB;

-- 3) Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id           INT UNSIGNED NOT NULL,
  title             VARCHAR(200) NOT NULL,
  short_description VARCHAR(255) NOT NULL,
  detail_request    TEXT NOT NULL,
  request_type      ENUM('Bug Fixing','Website') NOT NULL,
  bug_url           VARCHAR(512) NULL,
  website_title     VARCHAR(200) NULL,
  priority          ENUM('urgent','high','medium','low') NOT NULL DEFAULT 'medium',
  status            ENUM('open','in-progress','resolved','closed') NOT NULL DEFAULT 'open',
  deadline          DATE NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tickets_user (user_id),
  KEY idx_tickets_status (status),
  KEY idx_tickets_created (created_at),
  CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4) Attachments table (optional)
CREATE TABLE IF NOT EXISTS attachments (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id    BIGINT UNSIGNED NOT NULL,
  link_or_note TEXT NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_attachments_ticket (ticket_id),
  CONSTRAINT fk_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5) Minimal seed data (replace password_hash with your own bcrypt hash)
-- Example bcrypt for the string "password" must be generated app-side; placeholder below won't work for login.
INSERT INTO users (name,email,phone,department,role,password_hash) VALUES
('Admin User','admin@company.com','1234567890','IT','admin','$2y$12$REPLACE_ME_WITH_A_REAL_BCRYPT_HASH'),
('John Doe','john@company.com','0987654321','HR','user','$2y$12$REPLACE_ME_WITH_A_REAL_BCRYPT_HASH');

-- 6) Sample queries
-- Create a ticket for user id = 2
-- INSERT INTO tickets (user_id,title,short_description,detail_request,request_type,priority,status,deadline)
-- VALUES (2,'Computer not starting','PC mati setelah listrik padam','Mohon dicek PSU','Bug Fixing','high','open','2025-10-01');

-- List tickets for a given user
-- SELECT * FROM tickets WHERE user_id = 2 ORDER BY created_at DESC;

-- Admin view all tickets
-- SELECT t.*, u.name AS user_name, u.department AS user_department
-- FROM tickets t JOIN users u ON u.id = t.user_id
-- ORDER BY t.created_at DESC;

-- Update ticket status
-- UPDATE tickets SET status='in-progress' WHERE id=1;

-- Delete a ticket
-- DELETE FROM tickets WHERE id=1;
