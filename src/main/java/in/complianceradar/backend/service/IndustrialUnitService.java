package in.complianceradar.backend.service;

import in.complianceradar.backend.dto.IndustrialUnitDto;
import in.complianceradar.backend.entity.IndustrialUnit;
import in.complianceradar.backend.repository.IndustrialUnitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndustrialUnitService {

    private final IndustrialUnitRepository unitRepository;

    public List<IndustrialUnitDto.Response> getAll() {
        return unitRepository.findAll()
                .stream().map(this::toResponse).toList();
    }

    public Optional<IndustrialUnitDto.Response> getById(UUID id) {
        return unitRepository.findById(id).map(this::toResponse);
    }

    public List<IndustrialUnitDto.Response> getByDistrict(String district) {
        return unitRepository.findByDistrict(district)
                .stream().map(this::toResponse).toList();
    }

    public List<IndustrialUnitDto.Response> getLowCompliance(int threshold) {
        return unitRepository.findByComplianceScoreLessThan(threshold)
                .stream().map(this::toResponse).toList();
    }

    private IndustrialUnitDto.Response toResponse(IndustrialUnit u) {
        return new IndustrialUnitDto.Response(
                u.getId(),
                u.getName(),
                u.getDistrict(),
                u.getLat(),
                u.getLon(),
                u.getComplianceScore()
        );
    }
}
