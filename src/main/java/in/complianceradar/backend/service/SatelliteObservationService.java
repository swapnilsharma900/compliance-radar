package in.complianceradar.backend.service;

import in.complianceradar.backend.dto.SatelliteObservationDto;
import in.complianceradar.backend.entity.SatelliteObservation;
import in.complianceradar.backend.repository.SatelliteObservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SatelliteObservationService {

    private final SatelliteObservationRepository satelliteRepository;

    public List<SatelliteObservationDto.Response> getAll() {
        return satelliteRepository.findAllByOrderByDetectedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public List<SatelliteObservationDto.Response> getNearby(double lat, double lon) {
        return satelliteRepository.findNear(lat, lon)
                .stream().map(this::toResponse).toList();
    }

    private SatelliteObservationDto.Response toResponse(SatelliteObservation s) {
        return new SatelliteObservationDto.Response(
                s.getId(),
                s.getDetectedAt(),
                s.getLat(),
                s.getLon(),
                s.getAnomalyType(),
                s.getNdwiValue()
        );
    }
}
