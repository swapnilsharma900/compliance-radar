package com.rspcb.complianceradar.entity;

import com.rspcb.complianceradar.enums.SensorType;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "sensor_nodes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SensorNode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "node_code", nullable = false, unique = true, length = 50)
    private String nodeCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SensorType type;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private IndustrialUnit unit;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
