package in.complianceradar.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "industrial_units")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IndustrialUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lon;

    @Column(name = "compliance_score", nullable = false)
    @Builder.Default
    private Integer complianceScore = 100;
}
