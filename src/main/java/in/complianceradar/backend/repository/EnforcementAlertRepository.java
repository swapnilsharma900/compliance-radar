package in.complianceradar.backend.repository;

import in.complianceradar.backend.entity.EnforcementAlert;
import in.complianceradar.backend.enums.AlertLevel;
import in.complianceradar.backend.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EnforcementAlertRepository extends JpaRepository<EnforcementAlert, UUID> {

    List<EnforcementAlert> findByStatus(AlertStatus status);
    List<EnforcementAlert> findByUnitId(UUID unitId);
    List<EnforcementAlert> findByAssignedToId(UUID inspectorId);
    List<EnforcementAlert> findByAlertLevel(AlertLevel level);
    List<EnforcementAlert> findAllByOrderByCreatedAtDesc();
    boolean existsByUnitIdAndStatus(UUID unitId, AlertStatus status);
}
