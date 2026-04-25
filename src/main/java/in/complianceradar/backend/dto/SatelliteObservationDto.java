package in.complianceradar.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class SatelliteObservationDto {

    public record Response(
        UUID id,
        LocalDateTime detectedAt,
        Double lat,
        Double lon,
        String anomalyType,
        Float ndwiValue
    ) {}
}
