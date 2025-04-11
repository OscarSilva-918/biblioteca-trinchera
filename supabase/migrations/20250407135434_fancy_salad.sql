/*
  # Library Management System Schema

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `isbn` (text)
      - `created_at` (timestamp)
    
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `created_at` (timestamp)
    
    - `loans`
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `loan_date` (timestamp)
      - `return_date` (timestamp, nullable)
      - `is_returned` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text,
  created_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  loan_date timestamptz DEFAULT now(),
  return_date timestamptz,
  is_returned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read books"
  ON books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read loans"
  ON loans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert loans"
  ON loans FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update loans"
  ON loans FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);