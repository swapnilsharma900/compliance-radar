package com.rspcb.complianceradar.controller;

import com.rspcb.complianceradar.dto.AlertDto;
import com.rspcb.complianceradar.entity.User;
import com.rspcb.complianceradar.repository.UserRepository;
import com.rspcb.complianceradar.service.EnforcementAlertService;
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
    private final UserRepository userRepository;

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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(alertService.getMyAlerts(user.getId()));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<AlertDto.AlertResponse> resolve(@PathVariable UUID id) {
        return ResponseEntity.ok(alertService.resolve(id));
    }
}
