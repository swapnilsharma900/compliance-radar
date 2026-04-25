package in.complianceradar.backend.service;

import in.complianceradar.backend.dto.AlertDto;
import in.complianceradar.backend.entity.*;
import in.complianceradar.backend.enums.AlertLevel;
import in.complianceradar.backend.enums.AlertStatus;
import in.complianceradar.backend.enums.UserRole;
import in.complianceradar.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * The Fusion Engine correlates IoT anomalies, satellite observations, and
 * citizen reports within a 500m bounding box (±0.0045 degrees) around each
 * industrial unit. When ≥2 layers agree, a RED enforcement alert is created.
 * When only 1 layer triggers, a YELLOW alert is created.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FusionEngineService {

    private final IndustrialUnitRepository unitRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final SatelliteObservationRepository satelliteRepository;
    private final CitizenReportRepository citizenReportRepository;
    private final EnforcementAlertRepository alertRepository;
    private final UserRepository userRepository;

    @Transactional
    public AlertDto.FusionResult triggerFusion() {
        log.info("=== FUSION ENGINE TRIGGERED ===");

        List<IndustrialUnit> allUnits = unitRepository.findAll();
        List<AlertDto.AlertResponse> newAlerts = new ArrayList<>();

        for (IndustrialUnit unit : allUnits) {
            // Skip if an OPEN alert already exists for this unit
            if (alertRepository.existsByUnitIdAndStatus(unit.getId(), AlertStatus.OPEN)) {
                log.debug("Skipping unit {} — active alert already exists", unit.getName());
                continue;
            }

            double lat = unit.getLat();
            double lon = unit.getLon();

            // Layer 1: IoT anomaly check
            List<SensorReading> iotAnomalies = sensorReadingRepository.findAnomaliesNear(lat, lon);
            boolean iotTriggered = !iotAnomalies.isEmpty();

            // Layer 2: Satellite observation check
            List<SatelliteObservation> satObs = satelliteRepository.findNear(lat, lon);
            boolean satelliteTriggered = !satObs.isEmpty();

            // Layer 3: Citizen report check
            List<CitizenReport> citizenReports = citizenReportRepository.findNear(lat, lon);
            boolean citizenTriggered = !citizenReports.isEmpty();

            int layersTriggered = (iotTriggered ? 1 : 0) +
                                  (satelliteTriggered ? 1 : 0) +
                                  (citizenTriggered ? 1 : 0);

            log.info("Unit: {} | IoT:{} | Satellite:{} | Citizen:{} | Layers:{}",
                    unit.getName(), iotTriggered, satelliteTriggered, citizenTriggered, layersTriggered);

            if (layersTriggered == 0) continue;

            // Determine alert level and trigger source
            AlertLevel level;
            String triggerSource;

            if (layersTriggered >= 2) {
                level = AlertLevel.RED;
                triggerSource = buildTriggerSource(iotTriggered, satelliteTriggered, citizenTriggered);
            } else {
                level = AlertLevel.YELLOW;
                triggerSource = buildTriggerSource(iotTriggered, satelliteTriggered, citizenTriggered);
            }

            // Assign to an available inspector in the same district
            User assignedInspector = userRepository.findByRole(UserRole.INSPECTOR)
                    .stream()
                    .filter(u -> unit.getDistrict().equalsIgnoreCase(u.getDistrict()))
                    .findFirst()
                    .orElse(userRepository.findByRole(UserRole.INSPECTOR)
                            .stream().findFirst().orElse(null));

            // Reduce compliance score on violation
            unit.setComplianceScore(Math.max(0, unit.getComplianceScore() - (level == AlertLevel.RED ? 20 : 10)));
            unitRepository.save(unit);

            // Create enforcement alert
            EnforcementAlert alert = EnforcementAlert.builder()
                    .alertLevel(level)
                    .unit(unit)
                    .assignedTo(assignedInspector)
                    .status(AlertStatus.OPEN)
                    .lat(lat)
                    .lon(lon)
                    .triggerSource(triggerSource)
                    .build();

            alertRepository.save(alert);

            // Console log — Twilio integration placeholder
            log.warn("🚨 {} ALERT created for unit: {} | Source: {} | Assigned to: {}",
                    level,
                    unit.getName(),
                    triggerSource,
                    assignedInspector != null ? assignedInspector.getFullName() : "UNASSIGNED");

            newAlerts.add(toResponse(alert));
        }

        String message = newAlerts.isEmpty()
                ? "No new violations detected. All units nominal."
                : String.format("%d enforcement alert(s) generated.", newAlerts.size());

        log.info("=== FUSION ENGINE COMPLETE: {} alerts created ===", newAlerts.size());
        return new AlertDto.FusionResult(newAlerts.size(), newAlerts, message);
    }

    private String buildTriggerSource(boolean iot, boolean sat, boolean citizen) {
        List<String> sources = new ArrayList<>();
        if (iot) sources.add("IOT");
        if (sat) sources.add("SATELLITE");
        if (citizen) sources.add("CITIZEN");
        return "FUSED_" + String.join("_", sources);
    }

    private AlertDto.AlertResponse toResponse(EnforcementAlert a) {
        return new AlertDto.AlertResponse(
                a.getId(),
                a.getCreatedAt(),
                a.getAlertLevel(),
                a.getUnit().getId(),
                a.getUnit().getName(),
                a.getUnit().getDistrict(),
                a.getAssignedTo() != null ? a.getAssignedTo().getId() : null,
                a.getAssignedTo() != null ? a.getAssignedTo().getFullName() : null,
                a.getStatus(),
                a.getLat(),
                a.getLon(),
                a.getTriggerSource()
        );
    }
}
