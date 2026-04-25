-- ============================================================
-- ComplianceRadar Seed Data — Rajasthan Districts
-- Passwords are BCrypt hash of "password123"
-- ============================================================

-- USERS
INSERT INTO users (id, full_name, email, password, phone_number, role, district) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Ramesh Sharma',   'admin@rspcb.gov.in',       '$2a$10$hoLFNIH2AvFaxHslc2JjZ.bV/W3lW3PaCcZo9uWFPLk.jjaRgRLy2', '9414000001', 'ADMIN',     'Jaipur'),
  ('a1000000-0000-0000-0000-000000000002', 'Suresh Meena',    'inspector1@rspcb.gov.in',  '$2a$10$hoLFNIH2AvFaxHslc2JjZ.bV/W3lW3PaCcZo9uWFPLk.jjaRgRLy2', '9414000002', 'INSPECTOR', 'Pali'),
  ('a1000000-0000-0000-0000-000000000003', 'Kavita Joshi',    'inspector2@rspcb.gov.in',  '$2a$10$hoLFNIH2AvFaxHslc2JjZ.bV/W3lW3PaCcZo9uWFPLk.jjaRgRLy2', '9414000003', 'INSPECTOR', 'Jodhpur'),
  ('a1000000-0000-0000-0000-000000000004', 'Priya Verma',     'citizen1@saaf.in',         '$2a$10$hoLFNIH2AvFaxHslc2JjZ.bV/W3lW3PaCcZo9uWFPLk.jjaRgRLy2', '9414000004', 'CITIZEN',   'Pali'),
  ('a1000000-0000-0000-0000-000000000005', 'Anil Kumar',      'citizen2@saaf.in',         '$2a$10$hoLFNIH2AvFaxHslc2JjZ.bV/W3lW3PaCcZo9uWFPLk.jjaRgRLy2', '9414000005', 'CITIZEN',   'Jodhpur'),
  ('a1000000-0000-0000-0000-000000000006', 'Sunita Rathore',  'citizen3@saaf.in',         '$2a$10$hoLFNIH2AvFaxHslc2JjZ.bV/W3lW3PaCcZo9uWFPLk.jjaRgRLy2', '9414000006', 'CITIZEN',   'Bhilwara')
ON CONFLICT (email) DO NOTHING;

-- INDUSTRIAL UNITS (Real Rajasthan industrial towns)
INSERT INTO industrial_units (id, name, district, lat, lon, compliance_score) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Pali Textile Dyeing Unit A',     'Pali',     25.7711, 73.3234, 42),
  ('b1000000-0000-0000-0000-000000000002', 'Pali Textile Dyeing Unit B',     'Pali',     25.7730, 73.3251, 67),
  ('b1000000-0000-0000-0000-000000000003', 'Bhilwara Synthetic Mills',       'Bhilwara', 25.3462, 74.6359, 55),
  ('b1000000-0000-0000-0000-000000000004', 'Jodhpur Stone Processing Plant', 'Jodhpur',  26.2389, 73.0243, 78),
  ('b1000000-0000-0000-0000-000000000005', 'Kota Chemical Works',            'Kota',     25.1802, 75.8069, 30),
  ('b1000000-0000-0000-0000-000000000006', 'Alwar Auto Parts Factory',       'Alwar',    27.5530, 76.6346, 88)
ON CONFLICT DO NOTHING;

-- SENSOR NODES
INSERT INTO sensor_nodes (id, node_code, type, lat, lon, unit_id, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'WN-PALI-01',    'WATER', 25.7711, 73.3234, 'b1000000-0000-0000-0000-000000000001', TRUE),
  ('c1000000-0000-0000-0000-000000000002', 'WN-PALI-02',    'WATER', 25.7730, 73.3251, 'b1000000-0000-0000-0000-000000000002', TRUE),
  ('c1000000-0000-0000-0000-000000000003', 'AN-BHILWARA-01','AIR',   25.3462, 74.6359, 'b1000000-0000-0000-0000-000000000003', TRUE),
  ('c1000000-0000-0000-0000-000000000004', 'WN-KOTA-01',    'WATER', 25.1802, 75.8069, 'b1000000-0000-0000-0000-000000000005', TRUE),
  ('c1000000-0000-0000-0000-000000000005', 'AN-JODHPUR-01', 'AIR',   26.2389, 73.0243, 'b1000000-0000-0000-0000-000000000004', TRUE)
ON CONFLICT (node_code) DO NOTHING;

-- SENSOR READINGS (Mix of anomaly and normal)
INSERT INTO sensor_reading (id, node_id, recorded_at, tds_ppm, ph_value, turbidity_ntu, pm25, co_ppm, is_anomaly, alert_level) VALUES
  -- Pali Unit A — Critical water violation
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 hours',  2450.0, 3.2, 180.0, NULL, NULL, TRUE,  'RED'),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 hours',  2100.0, 3.8, 155.0, NULL, NULL, TRUE,  'RED'),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '6 hours',  890.0,  7.1,  22.0, NULL, NULL, FALSE, NULL),
  -- Pali Unit B — Yellow warning
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 hour',   1750.0, 4.5, 120.0, NULL, NULL, TRUE,  'YELLOW'),
  -- Bhilwara Air — Critical
  ('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003', NOW() - INTERVAL '90 minutes', NULL, NULL, NULL, 285.0, 45.0, TRUE, 'RED'),
  ('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003', NOW() - INTERVAL '3 hours',   NULL, NULL, NULL, 310.0, 52.0, TRUE, 'RED'),
  -- Kota — Normal
  ('d1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000004', NOW() - INTERVAL '30 minutes', 480.0, 7.4, 18.0, NULL, NULL, FALSE, NULL),
  -- Jodhpur — Normal
  ('d1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000005', NOW() - INTERVAL '45 minutes', NULL, NULL, NULL, 62.0, 8.5, FALSE, NULL)
ON CONFLICT DO NOTHING;

-- SATELLITE OBSERVATIONS (Mock Sentinel-2 NDWI anomalies)
INSERT INTO satellite_observations (id, detected_at, lat, lon, anomaly_type, ndwi_value) VALUES
  -- Near Pali Unit A (within 500m — will trigger fusion)
  ('e1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 hours', 25.7715, 73.3238, 'NDWI Drop > 15%',  -0.42),
  ('e1000000-0000-0000-0000-000000000002', NOW() - INTERVAL '5 hours', 25.7708, 73.3230, 'NDWI Drop > 20%',  -0.61),
  -- Near Bhilwara (within 500m — will trigger fusion)
  ('e1000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 hours', 25.3468, 74.6363, 'Sediment Plume',    0.08),
  -- Far from any unit — no fusion
  ('e1000000-0000-0000-0000-000000000004', NOW() - INTERVAL '6 hours', 26.9124, 75.7873, 'NDWI Drop > 10%',  -0.28),
  -- Near Kota
  ('e1000000-0000-0000-0000-000000000005', NOW() - INTERVAL '1 hour',  25.1810, 75.8075, 'NDWI Drop > 18%',  -0.53)
ON CONFLICT DO NOTHING;

-- CITIZEN REPORTS
INSERT INTO citizen_reports (id, user_id, submitted_at, issue_type, lat, lon, status, photo_link, saaf_points) VALUES
  -- Near Pali Unit A (within 500m — fusion candidate)
  ('f1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 hour',  'WATER', 25.7713, 73.3236, 'SUBMITTED', 'https://storage.saaf.in/reports/pali_001.jpg', 50),
  ('f1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 hours', 'WATER', 25.7719, 73.3241, 'SUBMITTED', 'https://storage.saaf.in/reports/pali_002.jpg', 50),
  -- Jodhpur report
  ('f1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005', NOW() - INTERVAL '30 minutes', 'AIR', 26.2392, 73.0247, 'SUBMITTED', 'https://storage.saaf.in/reports/jdh_001.jpg', 50),
  -- Bhilwara report (near unit — fusion candidate)
  ('f1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000006', NOW() - INTERVAL '90 minutes', 'AIR', 25.3465, 74.6361, 'SUBMITTED', NULL, 50),
  -- Resolved report
  ('f1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', NOW() - INTERVAL '3 days', 'WASTE', 26.2400, 73.0260, 'RESOLVED', 'https://storage.saaf.in/reports/jdh_002.jpg', 50)
ON CONFLICT DO NOTHING;
