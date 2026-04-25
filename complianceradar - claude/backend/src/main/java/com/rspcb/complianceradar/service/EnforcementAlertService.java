package com.rspcb.complianceradar.service;

import com.rspcb.complianceradar.dto.AlertDto;
import com.rspcb.complianceradar.entity.EnforcementAlert;
import com.rspcb.complianceradar.enums.AlertStatus;
import com.rspcb.complianceradar.repository.EnforcementAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnforcementAlertService {

    private final EnforcementAlertRepository alertRepository;

    public List<AlertDto.AlertResponse> getAll() {
        return alertRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public List<AlertDto.AlertResponse> getOpen() {
        return alertRepository.findByStatus(AlertStatus.OPEN)
                .stream().map(this::toResponse).toList();
    }

    public List<AlertDto.AlertResponse> getMyAlerts(UUID inspectorId) {
        return alertRepository.findByAssignedToId(inspectorId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public AlertDto.AlertResponse resolve(UUID alertId) {
        EnforcementAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found: " + alertId));
        alert.setStatus(AlertStatus.RESOLVED);
        alertRepository.save(alert);
        log.info("Alert {} resolved for unit: {}", alertId, alert.getUnit().getName());
        return toResponse(alert);
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
