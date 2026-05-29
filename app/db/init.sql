-- ============================================================================
-- Genpact Onboarding Portal — Sprint 1: MVP Schema
-- PostgreSQL 15+
-- Run: psql -U <user> -d <dbname> -f app/db/init.sql
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Function: auto-update updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Table: tools  (US-01 — Required Software & Tools)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tools (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(255)  NOT NULL,
    description   TEXT          NOT NULL DEFAULT '',
    category      VARCHAR(100)  NOT NULL DEFAULT 'General',
    download_url  VARCHAR(500),
    is_required   BOOLEAN       NOT NULL DEFAULT TRUE,
    display_order INTEGER       NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),

    CONSTRAINT chk_tools_category CHECK (category IN (
        'IDE', 'Communication', 'Version Control', 'Office Suite',
        'Security', 'Development', 'Cloud', 'General'
    ))
);

CREATE INDEX idx_tools_category ON tools (category);
CREATE INDEX idx_tools_display   ON tools (display_order, name);

CREATE TRIGGER trg_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================================
-- Table: courses  (US-02 — Mandatory Week 1 Training Courses)
-- ============================================================================
CREATE TABLE IF NOT EXISTS courses (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title            VARCHAR(255)  NOT NULL,
    description      TEXT          NOT NULL DEFAULT '',
    category         VARCHAR(100)  NOT NULL DEFAULT 'General',
    duration_minutes INTEGER       NOT NULL DEFAULT 0,  -- estimated completion
    is_mandatory     BOOLEAN       NOT NULL DEFAULT TRUE,
    week_number      INTEGER       NOT NULL DEFAULT 1,   -- Sprint 1 = Week 1
    content_url      VARCHAR(500),
    display_order    INTEGER       NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),

    CONSTRAINT chk_courses_category CHECK (category IN (
        'Compliance', 'Technical', 'HR', 'Security', 'Culture', 'General'
    )),
    CONSTRAINT chk_duration_positive CHECK (duration_minutes >= 0),
    CONSTRAINT chk_week_positive CHECK (week_number >= 1)
);

CREATE INDEX idx_courses_week     ON courses (week_number);
CREATE INDEX idx_courses_category ON courses (category);
CREATE INDEX idx_courses_display  ON courses (display_order, title);

CREATE TRIGGER trg_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================================
-- Table: contacts  (US-03 — Mentor & Support Team Contacts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contacts (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(255)  NOT NULL,
    role          VARCHAR(100)  NOT NULL,
    department    VARCHAR(255)  NOT NULL DEFAULT '',
    email         VARCHAR(320)  NOT NULL,
    phone         VARCHAR(50),
    is_primary    BOOLEAN       NOT NULL DEFAULT FALSE,
    display_order INTEGER       NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),

    CONSTRAINT chk_contacts_role CHECK (role IN (
        'Mentor', 'HR Support', 'IT Support', 'Manager',
        'Buddy', 'Admin', 'Other'
    ))
);

CREATE INDEX idx_contacts_role    ON contacts (role);
CREATE INDEX idx_contacts_primary ON contacts (is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_contacts_display ON contacts (display_order, name);

CREATE TRIGGER trg_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================================
-- MVP Seed Data
-- ============================================================================

-- Tools
INSERT INTO tools (name, description, category, download_url, is_required, display_order) VALUES
('Microsoft Teams',    'Enterprise chat, calling, and video meetings platform',           'Communication',  'https://teams.microsoft.com/downloads', TRUE,  1),
('Outlook',             'Email and calendar client for corporate communication',           'Communication',  'https://outlook.office.com',             TRUE,  2),
('Visual Studio Code', 'Lightweight but powerful source code editor',                      'IDE',            'https://code.visualstudio.com/download', TRUE,  3),
('Git + GitHub Desktop','Distributed version control and GUI client',                      'Version Control','https://desktop.github.com',              TRUE,  4),
('Microsoft 365',       'Word, Excel, PowerPoint, and OneDrive for business productivity', 'Office Suite',   'https://www.office.com',                  TRUE,  5),
('VPN Client',          'Secure remote access to Genpact corporate network',               'Security',       NULL,                                     TRUE,  6),
('Postman',             'API development and testing tool',                                'Development',    'https://www.postman.com/downloads',       FALSE, 7),
('Docker Desktop',      'Container platform for local development',                        'Development',    'https://www.docker.com/products/docker-desktop', FALSE, 8);

-- Courses (Week 1)
INSERT INTO courses (title, description, category, duration_minutes, is_mandatory, week_number, display_order) VALUES
('Genpact Code of Conduct',         'Core ethical standards, integrity policies, and professional behavior expected of every Genpact employee',             'Compliance', 45,  TRUE, 1, 1),
('Information Security Essentials', 'Data protection principles, phishing awareness, password hygiene, and secure handling of client information',           'Security',   30,  TRUE, 1, 2),
('Welcome to Genpact Culture',      'Company history, values, leadership vision, and what makes Genpact a great place to work',                             'Culture',    20,  TRUE, 1, 3),
('Workplace Safety & Emergency Procedures', 'Fire drills, evacuation routes, first-aid contacts, and occupational health guidelines',                       'HR',         25,  TRUE, 1, 4),
('Introduction to Agile @ Genpact', 'How Genpact teams use Scrum, Kanban, and Jira to deliver client projects iteratively',                                 'Technical',  40,  TRUE, 1, 5),
('Data Privacy & GDPR Basics',      'Understanding personally identifiable information (PII), GDPR compliance, and client confidentiality obligations',     'Compliance', 35,  TRUE, 1, 6);

-- Contacts
INSERT INTO contacts (name, role, department, email, phone, is_primary, display_order) VALUES
('Priya Sharma',   'Mentor',     'Digital Transformation',    'priya.sharma@genpact.com',     '+91-9876543210', TRUE,  1),
('Rajesh Kumar',   'HR Support', 'Human Resources — APAC',    'rajesh.kumar@genpact.com',    '+91-9876543211', FALSE, 2),
('Anita Desai',    'IT Support', 'Global IT Service Desk',    'anita.desai@genpact.com',     '+91-9876543212', TRUE,  3),
('Michael Chen',   'Manager',    'Digital Transformation',    'michael.chen@genpact.com',    '+65-91234567',   FALSE, 4),
('Sneha Patel',    'Buddy',      'Digital Transformation',    'sneha.patel@genpact.com',     '+91-9876543214', FALSE, 5);

COMMIT;
