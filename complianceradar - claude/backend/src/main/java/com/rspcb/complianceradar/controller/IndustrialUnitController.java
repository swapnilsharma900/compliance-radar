package com.rspcb.complianceradar.controller;

import com.rspcb.complianceradar.entity.IndustrialUnit;
import com.rspcb.complianceradar.repository.IndustrialUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class IndustrialUnitController {

    private final IndustrialUnitRepository unitRepository;

    @GetMapping
    public ResponseEntity<List<IndustrialUnit>> getAll() {
        return ResponseEntity.ok(unitRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IndustrialUnit> getById(@PathVariable UUID id) {
        return unitRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<IndustrialUnit>> getByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(unitRepository.findByDistrict(district));
    }

    @GetMapping("/low-compliance")
    public ResponseEntity<List<IndustrialUnit>> getLowCompliance(
            @RequestParam(defaultValue = "70") int threshold) {
        return ResponseEntity.ok(unitRepository.findByComplianceScoreLessThan(threshold));
    }
}
