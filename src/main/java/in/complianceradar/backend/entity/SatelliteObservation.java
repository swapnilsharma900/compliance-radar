package in.complianceradar.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "satellite_observations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SatelliteObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "detected_at", nullable = false)
    private LocalDateTime detectedAt;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lon;

    @Column(name = "anomaly_type", nullable = false, length = 100)
    private String anomalyType;

    @Column(name = "ndwi_value", nullable = false)
    private Float ndwiValue;
}
