# ComplianceRadar + SaafSaathi

Predictive pollution enforcement platform for the Rajasthan State Pollution Control Board (RSPCB).

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              THREE-LAYER FUSION ENGINE              │
│                                                     │
│  IoT Layer → sensor_reading (anomaly detection)    │
│  Satellite  → satellite_observations (NDWI drop)   │
│  Citizen    → citizen_reports (crowdsourced GPS)   │
│                                                     │
│  Overlap within 500m radius → RED ALERT            │
│  Single layer trigger       → YELLOW ALERT         │
└─────────────────────────────────────────────────────┘
         ↓
Spring Boot 3 REST API (port 8080)
         ↓
React Vite PWA — SaafSaathi (port 5173)
```

---

## Prerequisites

- Java 21
- Maven 3.9+
- PostgreSQL 15+
- Node.js 20+

---

## Database Setup

```sql
-- Run in psql as superuser
CREATE DATABASE complianceradar;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE complianceradar TO postgres;
```

The schema and seed data are applied automatically on first boot via `schema.sql` and `data.sql`.

---

## Backend Setup

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

To change DB credentials, edit `src/main/resources/application.properties`.

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The PWA will be available at `http://localhost:5173`.

---

## Demo Accounts

All passwords: `password123`

| Role      | Email                       | District |
|-----------|-----------------------------|----------|
| ADMIN     | admin@rspcb.gov.in          | Jaipur   |
| INSPECTOR | inspector1@rspcb.gov.in     | Pali     |
| INSPECTOR | inspector2@rspcb.gov.in     | Jodhpur  |
| CITIZEN   | citizen1@saaf.in            | Pali     |
| CITIZEN   | citizen2@saaf.in            | Jodhpur  |
| CITIZEN   | citizen3@saaf.in            | Bhilwara |

---

## API Reference

All protected endpoints require: `Authorization: Bearer <token>`

### Auth (Public)

| Method | Endpoint            | Body                                      | Description        |
|--------|---------------------|-------------------------------------------|--------------------|
| POST   | /api/auth/login     | `{email, password}`                       | Returns JWT token  |
| POST   | /api/auth/register  | `{fullName, email, password, district}`   | Citizen self-reg   |

### Fusion Engine

| Method | Endpoint              | Role               | Description                          |
|--------|-----------------------|--------------------|--------------------------------------|
| POST   | /api/fusion/trigger   | INSPECTOR, ADMIN   | Runs the 3-layer correlation engine  |

### Enforcement Alerts

| Method | Endpoint                  | Role               | Description               |
|--------|---------------------------|--------------------|---------------------------|
| GET    | /api/alerts               | INSPECTOR, ADMIN   | All alerts (newest first) |
| GET    | /api/alerts/open          | INSPECTOR, ADMIN   | Open alerts only          |
| GET    | /api/alerts/mine          | INSPECTOR, ADMIN   | Alerts assigned to me     |
| PATCH  | /api/alerts/{id}/resolve  | INSPECTOR, ADMIN   | Mark alert as resolved    |

### Citizen Reports

| Method | Endpoint                   | Role       | Description              |
|--------|----------------------------|------------|--------------------------|
| POST   | /api/reports               | ALL        | Submit a new report      |
| GET    | /api/reports/mine          | ALL        | My own reports           |
| GET    | /api/reports/points        | ALL        | My total SaafPoints      |
| GET    | /api/reports               | INSPECTOR+ | All reports              |
| PATCH  | /api/reports/{id}/resolve  | INSPECTOR+ | Resolve a report         |

### Industrial Units

| Method | Endpoint                              | Role               | Description                        |
|--------|---------------------------------------|--------------------|------------------------------------|
| GET    | /api/units                            | INSPECTOR, ADMIN   | All units                          |
| GET    | /api/units/{id}                       | INSPECTOR, ADMIN   | Single unit                        |
| GET    | /api/units/district/{district}        | INSPECTOR, ADMIN   | Units in a district                |
| GET    | /api/units/low-compliance?threshold=70| INSPECTOR, ADMIN   | Units below compliance threshold   |

### Satellite Observations

| Method | Endpoint                          | Role               | Description                   |
|--------|-----------------------------------|--------------------|-------------------------------|
| GET    | /api/satellite                    | INSPECTOR, ADMIN   | All satellite observations    |
| GET    | /api/satellite/nearby?lat=&lon=   | INSPECTOR, ADMIN   | Observations within 500m      |

---

## Fusion Engine Logic

```
For each industrial_unit:
  1. IoT check  — find sensor_readings where is_anomaly=true within ±0.0045° (≈500m)
  2. Satellite  — find satellite_observations within ±0.0045°
  3. Citizen    — find citizen_reports within ±0.0045°

  layers_hit = count of layers with at least 1 match

  if layers_hit >= 2 → RED enforcement_alert  (compliance_score -= 20)
  if layers_hit == 1 → YELLOW enforcement_alert (compliance_score -= 10)
  if layers_hit == 0 → no action

  Alert is auto-assigned to an INSPECTOR in the same district.
  Duplicate open alerts for the same unit are skipped.
```

---

## Project Structure

```
complianceradar/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/rspcb/complianceradar/
│       │   ├── ComplianceRadarApplication.java
│       │   ├── config/         (SecurityConfig, GlobalExceptionHandler)
│       │   ├── controller/     (Auth, Fusion, Alert, Report, Unit, Satellite)
│       │   ├── dto/            (AuthDto, AlertDto, CitizenReportDto)
│       │   ├── entity/         (7 JPA entities)
│       │   ├── enums/          (6 enums)
│       │   ├── repository/     (6 Spring Data JPA repos)
│       │   ├── security/       (JwtUtil, JwtAuthFilter)
│       │   └── service/        (Auth, Fusion, Alert, Report services)
│       └── resources/
│           ├── application.properties
│           ├── schema.sql      (full DDL)
│           └── data.sql        (Rajasthan seed data)
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx             (router + protected routes)
        ├── main.jsx
        ├── api/api.js          (Axios + all API calls)
        ├── context/AuthContext.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── CitizenDashboard.jsx   (report submit + history + points)
            └── InspectorDashboard.jsx (fusion trigger + alerts + units)
```

---

## Spatial Logic Note

PostGIS is not used. Proximity checks use a plain SQL bounding box:

```sql
lat BETWEEN :lat - 0.0045 AND :lat + 0.0045
lon BETWEEN :lon - 0.0045 AND :lon + 0.0045
```

`0.0045 degrees ≈ 500 meters` at Rajasthan's latitude. For production, migrate to PostGIS and use `ST_DWithin`.
