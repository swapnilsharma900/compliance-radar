package in.complianceradar.backend.controller;

import in.complianceradar.backend.dto.AlertDto;
import in.complianceradar.backend.service.EnforcementAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class EnforcementAlertController {

    private final EnforcementAlertService alertService;

    @GetMapping
    public ResponseEntity<List<AlertDto.AlertResponse>> getAll() {
        return ResponseEntity.ok(alertService.getAll());
    }

    @GetMapping("/open")
    public ResponseEntity<List<AlertDto.AlertResponse>> getOpen() {
        return ResponseEntity.ok(alertService.getOpen());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<AlertDto.AlertResponse>> getMyAlerts(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(alertService.getMyAlerts(email));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<AlertDto.AlertResponse> resolve(@PathVariable UUID id) {
        return ResponseEntity.ok(alertService.resolve(id));
    }
}
