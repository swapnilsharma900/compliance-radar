package in.complianceradar.backend.repository;

import in.complianceradar.backend.entity.SensorReading;
import in.complianceradar.backend.enums.AlertLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReading, UUID> {
    List<SensorReading> findByNodeId(UUID nodeId);
    List<SensorReading> findByIsAnomalyTrue();
    List<SensorReading> findByAlertLevel(AlertLevel alertLevel);

    // Fetch anomalous readings from nodes near a given coordinate
    @Query("SELECT r FROM SensorReading r JOIN r.node n WHERE r.isAnomaly = true AND " +
           "n.lat BETWEEN :lat - 0.0045 AND :lat + 0.0045 AND " +
           "n.lon BETWEEN :lon - 0.0045 AND :lon + 0.0045")
    List<SensorReading> findAnomaliesNear(@Param("lat") double lat, @Param("lon") double lon);

    @Query("SELECT r FROM SensorReading r JOIN r.node n WHERE n.unit.id = :unitId ORDER BY r.recordedAt DESC")
    List<SensorReading> findLatestByUnitId(@Param("unitId") UUID unitId);
}
