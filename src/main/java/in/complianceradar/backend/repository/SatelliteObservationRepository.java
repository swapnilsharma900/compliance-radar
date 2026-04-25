package in.complianceradar.backend.repository;

import in.complianceradar.backend.entity.SatelliteObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SatelliteObservationRepository extends JpaRepository<SatelliteObservation, UUID> {

    // Find satellite anomalies within 500m bounding box
    @Query("SELECT s FROM SatelliteObservation s WHERE " +
           "s.lat BETWEEN :lat - 0.0045 AND :lat + 0.0045 AND " +
           "s.lon BETWEEN :lon - 0.0045 AND :lon + 0.0045")
    List<SatelliteObservation> findNear(@Param("lat") double lat, @Param("lon") double lon);

    List<SatelliteObservation> findAllByOrderByDetectedAtDesc();
}
