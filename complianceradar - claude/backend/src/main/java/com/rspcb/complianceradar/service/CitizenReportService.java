package com.rspcb.complianceradar.service;

import com.rspcb.complianceradar.dto.CitizenReportDto;
import com.rspcb.complianceradar.entity.CitizenReport;
import com.rspcb.complianceradar.entity.User;
import com.rspcb.complianceradar.enums.ReportStatus;
import com.rspcb.complianceradar.repository.CitizenReportRepository;
import com.rspcb.complianceradar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CitizenReportService {

    private final CitizenReportRepository reportRepository;
    private final UserRepository userRepository;

    @Transactional
    public CitizenReportDto.Response submit(CitizenReportDto.CreateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CitizenReport report = CitizenReport.builder()
                .user(user)
                .submittedAt(LocalDateTime.now())
                .issueType(request.issueType())
                .lat(request.lat())
                .lon(request.lon())
                .status(ReportStatus.SUBMITTED)
                .photoLink(request.photoLink())
                .saafPoints(50)
                .build();

        reportRepository.save(report);
        log.info("New citizen report submitted by {} at ({}, {})", userEmail, request.lat(), request.lon());

        return toResponse(report);
    }

    public List<CitizenReportDto.Response> getMyReports(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reportRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<CitizenReportDto.Response> getAllReports() {
        return reportRepository.findAllByOrderBySubmittedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public CitizenReportDto.Response resolve(UUID reportId) {
        CitizenReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(ReportStatus.RESOLVED);
        reportRepository.save(report);
        return toResponse(report);
    }

    public Integer getMyPoints(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Integer points = reportRepository.sumSaafPointsByUserId(user.getId());
        return points != null ? points : 0;
    }

    private CitizenReportDto.Response toResponse(CitizenReport r) {
        return new CitizenReportDto.Response(
                r.getId(),
                r.getUser().getId(),
                r.getUser().getFullName(),
                r.getSubmittedAt(),
                r.getIssueType(),
                r.getLat(),
                r.getLon(),
                r.getStatus(),
                r.getPhotoLink(),
                r.getSaafPoints()
        );
    }
}
