-- ============================================================
-- ComplianceRadar + SaafSaathi DB Schema
-- PostgreSQL (no PostGIS — bounding box math for spatial ops)
-- Uses CREATE TABLE IF NOT EXISTS — safe to re-run.
-- Hibernate manages column types via @Enumerated(EnumType.STRING)
-- ============================================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    phone_number  VARCHAR(20),
    role          VARCHAR(20) NOT NULL DEFAULT 'CITIZEN',
    district      VARCHAR(100),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. INDUSTRIAL UNITS
CREATE TABLE IF NOT EXISTS industrial_units (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              VARCHAR(200) NOT NULL,
    district          VARCHAR(100) NOT NULL,
    lat               DOUBLE PRECISION NOT NULL,
    lon               DOUBLE PRECISION NOT NULL,
    compliance_score  INTEGER NOT NULL DEFAULT 100
);

-- 3. SENSOR NODES
CREATE TABLE IF NOT EXISTS sensor_nodes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_code  VARCHAR(50) NOT NULL UNIQUE,
    type       VARCHAR(20) NOT NULL,
    lat        DOUBLE PRECISION NOT NULL,
    lon        DOUBLE PRECISION NOT NULL,
    unit_id    UUID NOT NULL REFERENCES industrial_units(id) ON DELETE CASCADE,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. SENSOR READINGS
CREATE TABLE IF NOT EXISTS sensor_reading (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id        UUID NOT NULL REFERENCES sensor_nodes(id) ON DELETE CASCADE,
    recorded_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    tds_ppm        FLOAT,
    ph_value       FLOAT,
    turbidity_ntu  FLOAT,
    pm25           FLOAT,
    co_ppm         FLOAT,
    is_anomaly     BOOLEAN NOT NULL DEFAULT FALSE,
    alert_level    VARCHAR(20)
);

-- 5. SATELLITE OBSERVATIONS
CREATE TABLE IF NOT EXISTS satellite_observations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    detected_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    lat           DOUBLE PRECISION NOT NULL,
    lon           DOUBLE PRECISION NOT NULL,
    anomaly_type  VARCHAR(100) NOT NULL,
    ndwi_value    FLOAT NOT NULL
);

-- 6. CITIZEN REPORTS
CREATE TABLE IF NOT EXISTS citizen_reports (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submitted_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    issue_type    VARCHAR(20) NOT NULL,
    lat           DOUBLE PRECISION NOT NULL,
    lon           DOUBLE PRECISION NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    photo_link    VARCHAR(500),
    saaf_points   INTEGER NOT NULL DEFAULT 50
);

-- 7. ENFORCEMENT ALERTS (Fusion Engine Output)
CREATE TABLE IF NOT EXISTS enforcement_alert (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    alert_level     VARCHAR(20) NOT NULL,
    unit_id         UUID NOT NULL REFERENCES industrial_units(id) ON DELETE CASCADE,
    assigned_to     UUID REFERENCES users(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    lat             DOUBLE PRECISION NOT NULL,
    lon             DOUBLE PRECISION NOT NULL,
    trigger_source  VARCHAR(200) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sensor_reading_node ON sensor_reading(node_id);
CREATE INDEX IF NOT EXISTS idx_sensor_reading_anomaly ON sensor_reading(is_anomaly) WHERE is_anomaly = TRUE;
CREATE INDEX IF NOT EXISTS idx_satellite_obs_lat_lon ON satellite_observations(lat, lon);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_user ON citizen_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_alert_unit ON enforcement_alert(unit_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_alert_status ON enforcement_alert(status);