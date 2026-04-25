package com.rspcb.complianceradar.dto;

import com.rspcb.complianceradar.enums.AlertLevel;
import com.rspcb.complianceradar.enums.AlertStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class AlertDto {

    public record AlertResponse(
        UUID id,
        LocalDateTime createdAt,
        AlertLevel alertLevel,
        UUID unitId,
        String unitName,
        String district,
        UUID assignedToId,
        String assignedToName,
        AlertStatus status,
        Double lat,
        Double lon,
        String triggerSource
    ) {}

    public record FusionResult(
        int alertsCreated,
        List<AlertResponse> alerts,
        String message
    ) {}

    public record ResolveRequest(UUID alertId) {}
}
