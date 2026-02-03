/*
  # Create Core Tables for Review Management System

  1. New Tables
    - `companies` - Store company information
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `website` (text)
      - `industry` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `platforms` - Store platform configurations
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `platform_name` (text) - 'google', 'reddit', 'twitter', etc
      - `business_id` (text) - platform-specific identifier
      - `is_active` (boolean)
      - `last_sync` (timestamp)
      - `created_at` (timestamp)

    - `reviews` - Store all fetched reviews
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `platform_id` (uuid, foreign key)
      - `platform_name` (text)
      - `review_id` (text) - unique ID from platform
      - `author` (text)
      - `content` (text)
      - `rating` (numeric)
      - `sentiment` (text) - 'positive', 'negative', 'neutral'
      - `url` (text)
      - `reviewed_at` (timestamp)
      - `fetched_at` (timestamp)
      - `created_at` (timestamp)

    - `api_keys` - Store encrypted API keys
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `platform_name` (text)
      - `key_name` (text)
      - `encrypted_value` (text)
      - `created_at` (timestamp)

    - `notifications` - Store notification settings
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `notification_type` (text) - 'email', 'sms', 'whatsapp'
      - `recipient` (text)
      - `alert_type` (text) - 'negative_review', 'rating_change', 'spike'
      - `is_active` (boolean)
      - `created_at` (timestamp)

    - `notification_logs` - Track sent notifications
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `notification_id` (uuid, foreign key)
      - `review_id` (uuid, foreign key)
      - `status` (text) - 'sent', 'failed', 'pending'
      - `message` (text)
      - `sent_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for company ownership verification
    - Encrypt sensitive API keys with pgcrypto
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  website text,
  industry text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  business_id text NOT NULL,
  is_active boolean DEFAULT true,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform_id uuid REFERENCES platforms(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  review_id text NOT NULL,
  author text,
  content text,
  rating numeric,
  sentiment text CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  url text,
  reviewed_at timestamptz,
  fetched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, platform_name, review_id)
);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  key_name text NOT NULL,
  encrypted_value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('email', 'sms', 'whatsapp')),
  recipient text NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('negative_review', 'rating_change', 'spike', 'all')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  notification_id uuid REFERENCES notifications(id) ON DELETE SET NULL,
  review_id uuid REFERENCES reviews(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  message text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sync_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'running', 'success', 'failed')),
  error_message text,
  reviews_fetched integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own companies"
  ON companies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies"
  ON companies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view platforms for their companies"
  ON platforms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = platforms.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert platforms for their companies"
  ON platforms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view reviews for their companies"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = reviews.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view notifications for their companies"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = notifications.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert notifications for their companies"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update notifications for their companies"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = notifications.company_id
      AND companies.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sync jobs for their companies"
  ON sync_jobs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = sync_jobs.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_platforms_company_id ON platforms(company_id);
CREATE INDEX idx_platforms_platform_name ON platforms(platform_name);
CREATE INDEX idx_reviews_company_id ON reviews(company_id);
CREATE INDEX idx_reviews_platform_name ON reviews(platform_name);
CREATE INDEX idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_api_keys_company_id ON api_keys(company_id);
CREATE INDEX idx_notifications_company_id ON notifications(company_id);
CREATE INDEX idx_notification_logs_company_id ON notification_logs(company_id);
CREATE INDEX idx_sync_jobs_company_id ON sync_jobs(company_id);
