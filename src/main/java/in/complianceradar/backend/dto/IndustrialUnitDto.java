package in.complianceradar.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class IndustrialUnitDto {

    public record Response(
        UUID id,
        String name,
        String district,
        Double lat,
        Double lon,
        Integer complianceScore
    ) {}
}
