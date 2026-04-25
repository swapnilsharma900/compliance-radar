package in.complianceradar.backend.repository;

import in.complianceradar.backend.entity.SensorNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SensorNodeRepository extends JpaRepository<SensorNode, UUID> {
    List<SensorNode> findByUnitId(UUID unitId);
    List<SensorNode> findByIsActiveTrue();
}
