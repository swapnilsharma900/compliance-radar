package com.rspcb.complianceradar.controller;

import com.rspcb.complianceradar.dto.AlertDto;
import com.rspcb.complianceradar.service.FusionEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fusion")
@RequiredArgsConstructor
public class FusionController {

    private final FusionEngineService fusionEngineService;

    /**
     * POST /api/fusion/trigger
     * Manually kicks off the 3-layer correlation engine.
     * Accessible by INSPECTOR and ADMIN roles.
     */
    @PostMapping("/trigger")
    @PreAuthorize("hasAnyRole('INSPECTOR', 'ADMIN')")
    public ResponseEntity<AlertDto.FusionResult> triggerFusion() {
        AlertDto.FusionResult result = fusionEngineService.triggerFusion();
        return ResponseEntity.ok(result);
    }
}
