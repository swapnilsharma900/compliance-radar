package in.complianceradar.backend.dto;

import in.complianceradar.backend.enums.IssueType;
import in.complianceradar.backend.enums.ReportStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public class CitizenReportDto {

    public record CreateRequest(
        @NotNull IssueType issueType,
        @NotNull Double lat,
        @NotNull Double lon,
        String photoLink
    ) {}

    public record Response(
        UUID id,
        UUID userId,
        String userName,
        LocalDateTime submittedAt,
        IssueType issueType,
        Double lat,
        Double lon,
        ReportStatus status,
        String photoLink,
        Integer saafPoints
    ) {}

    public record LeaderboardEntry(
        UUID userId,
        String fullName,
        String district,
        Integer totalPoints,
        Long totalReports
    ) {}
}
