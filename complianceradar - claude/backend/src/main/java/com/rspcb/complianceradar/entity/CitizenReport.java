package com.rspcb.complianceradar.entity;

import com.rspcb.complianceradar.enums.IssueType;
import com.rspcb.complianceradar.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "citizen_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CitizenReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", nullable = false)
    private IssueType issueType;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.SUBMITTED;

    @Column(name = "photo_link", length = 500)
    private String photoLink;

    @Column(name = "saaf_points", nullable = false)
    private Integer saafPoints = 50;
}
