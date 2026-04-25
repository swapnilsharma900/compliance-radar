package in.complianceradar.backend.repository;

import in.complianceradar.backend.entity.IndustrialUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IndustrialUnitRepository extends JpaRepository<IndustrialUnit, UUID> {
    List<IndustrialUnit> findByDistrict(String district);
    List<IndustrialUnit> findByComplianceScoreLessThan(int score);

    // Bounding box query — ±0.0045 degrees ≈ 500m
    @Query("SELECT u FROM IndustrialUnit u WHERE " +
           "u.lat BETWEEN :lat - 0.0045 AND :lat + 0.0045 AND " +
           "u.lon BETWEEN :lon - 0.0045 AND :lon + 0.0045")
    List<IndustrialUnit> findNearby(@Param("lat") double lat, @Param("lon") double lon);
}
