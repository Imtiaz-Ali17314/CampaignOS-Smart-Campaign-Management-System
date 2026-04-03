-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) DEFAULT 'Lead Strategist',
  rank VARCHAR(100) DEFAULT 'Commander',
  specialty VARCHAR(100) DEFAULT 'Performance Marketing',
  bio TEXT DEFAULT 'Architecting high-conversion campaign systems.',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('active', 'paused', 'completed', 'draft')) DEFAULT 'draft',
  budget NUMERIC(12,2) NOT NULL CHECK (budget > 0),
  spend NUMERIC(12,2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  creative_content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL  -- soft delete
);

-- Alert rules (for Task 2.3)
CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  metric VARCHAR(50) NOT NULL,  -- 'ctr', 'spend_pct'
  operator VARCHAR(10) NOT NULL, -- 'lt', 'gt'
  threshold NUMERIC(10,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert history (for Task 2.3)
CREATE TABLE alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  rule_id UUID REFERENCES alert_rules(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_deleted_at ON campaigns(deleted_at);
CREATE INDEX idx_alert_history_campaign ON alert_history(campaign_id);

-- Seed Data
INSERT INTO users (email, password_hash) VALUES ('admin@campaignos.com', '$2a$10$lKzp3f8CtsmJYZHCeLslvE4m8kQ.3OidxzmEDOm1r3BA5Q/K');
INSERT INTO clients (name, industry) VALUES ('Lumiere Skincare', 'Beauty');
INSERT INTO clients (name, industry) VALUES ('Zenith Tech', 'Technology');
INSERT INTO clients (name, industry) VALUES ('Global Eats', 'Food & Beverage');