-- ============================================================
-- ComplianceRadar + SaafSaathi DB Schema
-- PostgreSQL (no PostGIS — bounding box math for spatial ops)
-- Uses CREATE TABLE IF NOT EXISTS — safe to re-run.
-- Hibernate manages column types via @Enumerated(EnumType.STRING)
-- ============================================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(150) NOT NULL UNIQUE,
    password            VARCHAR(255) NOT NULL,
    phone_number        VARCHAR(20),
    role                VARCHAR(20) NOT NULL DEFAULT 'CITIZEN', -- Allowed: CITIZEN | INSPECTOR | ADMIN
    district            VARCHAR(100),
    ward_number         INTEGER,
    ward_name           VARCHAR(100),
    saaf_points         INTEGER NOT NULL DEFAULT 0,
    streak_days         INTEGER NOT NULL DEFAULT 0,
    last_report_date    DATE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. INDUSTRIAL UNITS
CREATE TABLE IF NOT EXISTS industrial_units (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(200) NOT NULL,
    owner_name          VARCHAR(150),
    owner_email         VARCHAR(150),
    category            VARCHAR(50), -- Allowed: TEXTILE | DISTILLERY | CHEMICAL | CEMENT | OTHER
    district            VARCHAR(100) NOT NULL,
    address             TEXT,
    lat                 DOUBLE PRECISION NOT NULL,
    lon                 DOUBLE PRECISION NOT NULL,
    compliance_score    INTEGER NOT NULL DEFAULT 100,
    consent_number      VARCHAR(100),
    registered_at       DATE,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. SENSOR NODES
CREATE TABLE IF NOT EXISTS sensor_nodes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_code           VARCHAR(50) NOT NULL UNIQUE,
    type                VARCHAR(20) NOT NULL, -- Allowed: WATER | AIR
    lat                 DOUBLE PRECISION NOT NULL,
    lon                 DOUBLE PRECISION NOT NULL,
    unit_id             UUID NOT NULL REFERENCES industrial_units(id) ON DELETE CASCADE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    last_ping           TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. SENSOR READINGS
CREATE TABLE IF NOT EXISTS sensor_reading (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id             UUID NOT NULL REFERENCES sensor_nodes(id) ON DELETE CASCADE,
    recorded_at         TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Water sensors (NULL if node type = AIR)
    tds_ppm             FLOAT,
    ph_value            FLOAT,
    turbidity_ntu       FLOAT,
    temperature_c       FLOAT,

    -- Air sensors (NULL if node type = WATER)
    pm25                FLOAT,
    pm10                FLOAT,
    co_ppm              FLOAT,
    so2_ppm             FLOAT,
    nox_ppm             FLOAT,

    -- Alert classification
    is_anomaly          BOOLEAN NOT NULL DEFAULT FALSE,
    alert_level         VARCHAR(20) -- Allowed: NORMAL | YELLOW | ORANGE | RED
);

-- 5. SATELLITE OBSERVATIONS
CREATE TABLE IF NOT EXISTS satellite_observations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    detected_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    lat                 DOUBLE PRECISION NOT NULL,
    lon                 DOUBLE PRECISION NOT NULL,
    anomaly_type        VARCHAR(100) NOT NULL,
    ndwi_value          FLOAT NOT NULL,
    ndwi_baseline       FLOAT,
    change_percent      FLOAT, -- 4-week rolling average for comparison
    unit_id             UUID REFERENCES industrial_units(id) ON DELETE SET NULL,
    is_resolved         BOOLEAN NOT NULL DEFAULT FALSE
);

-- 6. CITIZEN REPORTS
CREATE TABLE IF NOT EXISTS citizen_reports (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submitted_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    issue_type          VARCHAR(20) NOT NULL, -- Allowed: WATER_DUMPING | AIR_POLLUTION | ILLEGAL_WASTE | SEWAGE | FACTORY_EMISSION | OTHER
    description         TEXT,
    lat                 DOUBLE PRECISION NOT NULL,
    lon                 DOUBLE PRECISION NOT NULL,
    district            VARCHAR(100),
    photo_link          VARCHAR(500),
    ai_classification   VARCHAR(100), -- Output from Google Vision API
    ai_confidence       FLOAT, -- Range: 0.0 to 1.0
    status              VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED', -- Allowed: SUBMITTED | UNDER_REVIEW | ASSIGNED | RESOLVED | REJECTED
    saaf_points         INTEGER NOT NULL DEFAULT 50,
    resolved_at         TIMESTAMP
);

-- 7. ENFORCEMENT ALERTS (Fusion Engine Output)
CREATE TABLE IF NOT EXISTS enforcement_alert (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    alert_level         VARCHAR(20) NOT NULL, -- Allowed: YELLOW | ORANGE | RED
    unit_id             UUID NOT NULL REFERENCES industrial_units(id) ON DELETE CASCADE, -- Factory being flagged

    -- Evidence links (all optional — depends on what triggered it)
    sensor_reading_id   UUID REFERENCES sensor_reading(id) ON DELETE SET NULL,
    satellite_obs_id    UUID REFERENCES satellite_observations(id) ON DELETE SET NULL,
    citizen_report_id   UUID REFERENCES citizen_reports(id) ON DELETE SET NULL,

    sources_count       INTEGER NOT NULL DEFAULT 1, -- How many sources confirmed this alert (1, 2, or 3)
    assigned_to         UUID REFERENCES users(id),
    status              VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- Allowed: OPEN | ASSIGNED | RESOLVED
    lat                 DOUBLE PRECISION NOT NULL,
    lon                 DOUBLE PRECISION NOT NULL,
    trigger_source      VARCHAR(200) NOT NULL, -- Human-readable summary of what triggered this
    resolved_at         TIMESTAMP,
    resolution_notes    TEXT
);

-- 8. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id           UUID NOT NULL REFERENCES citizen_reports(id) ON DELETE CASCADE,
    sender_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_role         VARCHAR(20) NOT NULL, -- Allowed: CITIZEN | INSPECTOR | ADMIN
    message             TEXT NOT NULL,
    sent_at             TIMESTAMP NOT NULL DEFAULT NOW(),
    is_read             BOOLEAN NOT NULL DEFAULT FALSE
);



-- ============================================================
-- Indexes for performance
-- ============================================================

-- users
CREATE INDEX IF NOT EXISTS idx_users_role               ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_district           ON users(district);
CREATE INDEX IF NOT EXISTS idx_users_ward               ON users(ward_number);

-- industrial_units
CREATE INDEX IF NOT EXISTS idx_units_district           ON industrial_units(district);
CREATE INDEX IF NOT EXISTS idx_units_lat_lon            ON industrial_units(lat, lon);
CREATE INDEX IF NOT EXISTS idx_units_score              ON industrial_units(compliance_score);

-- sensor_nodes
CREATE INDEX IF NOT EXISTS idx_nodes_unit               ON sensor_nodes(unit_id);
CREATE INDEX IF NOT EXISTS idx_nodes_type               ON sensor_nodes(type);
CREATE INDEX IF NOT EXISTS idx_nodes_active             ON sensor_nodes(is_active)              WHERE is_active = TRUE;

-- sensor_reading
CREATE INDEX IF NOT EXISTS idx_sensor_reading_node      ON sensor_reading(node_id);
CREATE INDEX IF NOT EXISTS idx_sensor_reading_time      ON sensor_reading(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_reading_anomaly   ON sensor_reading(is_anomaly)           WHERE is_anomaly = TRUE;

-- satellite_observations
CREATE INDEX IF NOT EXISTS idx_satellite_lat_lon        ON satellite_observations(lat, lon);
CREATE INDEX IF NOT EXISTS idx_satellite_unit           ON satellite_observations(unit_id);
CREATE INDEX IF NOT EXISTS idx_satellite_unresolved     ON satellite_observations(is_resolved)  WHERE is_resolved = FALSE;

-- citizen_reports
CREATE INDEX IF NOT EXISTS idx_citizen_reports_user     ON citizen_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_status   ON citizen_reports(status);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_district ON citizen_reports(district);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_lat_lon  ON citizen_reports(lat, lon);

-- enforcement_alert
CREATE INDEX IF NOT EXISTS idx_enforcement_unit         ON enforcement_alert(unit_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_status       ON enforcement_alert(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_assigned     ON enforcement_alert(assigned_to);
CREATE INDEX IF NOT EXISTS idx_enforcement_level        ON enforcement_alert(alert_level);
CREATE INDEX IF NOT EXISTS idx_enforcement_open         ON enforcement_alert(status)            WHERE status = 'OPEN';

-- chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_report              ON chat_messages(report_id);
CREATE INDEX IF NOT EXISTS idx_chat_sender              ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_unread              ON chat_messages(is_read)               WHERE is_read = FALSE;