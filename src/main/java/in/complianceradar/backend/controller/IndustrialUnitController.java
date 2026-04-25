package in.complianceradar.backend.controller;

import in.complianceradar.backend.dto.IndustrialUnitDto;
import in.complianceradar.backend.service.IndustrialUnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class IndustrialUnitController {

    private final IndustrialUnitService unitService;

    @GetMapping
    public ResponseEntity<List<IndustrialUnitDto.Response>> getAll() {
        return ResponseEntity.ok(unitService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IndustrialUnitDto.Response> getById(@PathVariable UUID id) {
        return unitService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<IndustrialUnitDto.Response>> getByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(unitService.getByDistrict(district));
    }

    @GetMapping("/low-compliance")
    public ResponseEntity<List<IndustrialUnitDto.Response>> getLowCompliance(
            @RequestParam(defaultValue = "70") int threshold) {
        return ResponseEntity.ok(unitService.getLowCompliance(threshold));
    }
}
