package in.complianceradar.backend.controller;

import in.complianceradar.backend.dto.CitizenReportDto;
import in.complianceradar.backend.service.CitizenReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class CitizenReportController {

    private final CitizenReportService reportService;

    /** Submit a new pollution report (Citizen, Inspector, Admin) */
    @PostMapping
    public ResponseEntity<CitizenReportDto.Response> submit(
            @Valid @RequestBody CitizenReportDto.CreateRequest request,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(reportService.submit(request, email));
    }

    /** Get the logged-in citizen's own reports */
    @GetMapping("/mine")
    public ResponseEntity<List<CitizenReportDto.Response>> myReports(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(reportService.getMyReports(email));
    }

    /** Get logged-in citizen's total SaafPoints */
    @GetMapping("/points")
    public ResponseEntity<Integer> myPoints(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(reportService.getMyPoints(email));
    }

    /** Get all reports — Inspector/Admin only */
    @GetMapping
    @PreAuthorize("hasAnyRole('INSPECTOR', 'ADMIN')")
    public ResponseEntity<List<CitizenReportDto.Response>> all() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    /** Mark report as resolved — Inspector/Admin only */
    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('INSPECTOR', 'ADMIN')")
    public ResponseEntity<CitizenReportDto.Response> resolve(@PathVariable UUID id) {
        return ResponseEntity.ok(reportService.resolve(id));
    }
}
