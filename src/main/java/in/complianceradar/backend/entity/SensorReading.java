package in.complianceradar.backend.entity;

import in.complianceradar.backend.enums.AlertLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sensor_reading")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "node_id", nullable = false)
    private SensorNode node;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    // Water metrics
    @Column(name = "tds_ppm")
    private Float tdsPpm;

    @Column(name = "ph_value")
    private Float phValue;

    @Column(name = "turbidity_ntu")
    private Float turbidityNtu;

    // Air metrics
    @Column(name = "pm25")
    private Float pm25;

    @Column(name = "co_ppm")
    private Float coPpm;

    @Column(name = "is_anomaly", nullable = false)
    @Builder.Default
    private Boolean isAnomaly = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_level")
    private AlertLevel alertLevel;
}
