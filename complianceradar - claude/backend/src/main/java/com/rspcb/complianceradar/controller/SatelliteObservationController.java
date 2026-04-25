package com.rspcb.complianceradar.controller;

import com.rspcb.complianceradar.entity.SatelliteObservation;
import com.rspcb.complianceradar.repository.SatelliteObservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/satellite")
@RequiredArgsConstructor
public class SatelliteObservationController {

    private final SatelliteObservationRepository satelliteRepository;

    @GetMapping
    public ResponseEntity<List<SatelliteObservation>> getAll() {
        return ResponseEntity.ok(satelliteRepository.findAllByOrderByDetectedAtDesc());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<SatelliteObservation>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon) {
        return ResponseEntity.ok(satelliteRepository.findNear(lat, lon));
    }
}
