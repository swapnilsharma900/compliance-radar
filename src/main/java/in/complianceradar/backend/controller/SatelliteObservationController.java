package in.complianceradar.backend.controller;

import in.complianceradar.backend.dto.SatelliteObservationDto;
import in.complianceradar.backend.service.SatelliteObservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/satellite")
@RequiredArgsConstructor
public class SatelliteObservationController {

    private final SatelliteObservationService satelliteService;

    @GetMapping
    public ResponseEntity<List<SatelliteObservationDto.Response>> getAll() {
        return ResponseEntity.ok(satelliteService.getAll());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<SatelliteObservationDto.Response>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon) {
        return ResponseEntity.ok(satelliteService.getNearby(lat, lon));
    }
}
