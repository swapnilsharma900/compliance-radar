package in.complianceradar.backend.repository;

import in.complianceradar.backend.entity.CitizenReport;
import in.complianceradar.backend.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CitizenReportRepository extends JpaRepository<CitizenReport, UUID> {

    List<CitizenReport> findByUserId(UUID userId);
    List<CitizenReport> findByStatus(ReportStatus status);

    // Find citizen reports within 500m bounding box
    @Query("SELECT r FROM CitizenReport r WHERE " +
           "r.lat BETWEEN :lat - 0.0045 AND :lat + 0.0045 AND " +
           "r.lon BETWEEN :lon - 0.0045 AND :lon + 0.0045")
    List<CitizenReport> findNear(@Param("lat") double lat, @Param("lon") double lon);

    List<CitizenReport> findAllByOrderBySubmittedAtDesc();

    @Query("SELECT SUM(r.saafPoints) FROM CitizenReport r WHERE r.user.id = :userId")
    Integer sumSaafPointsByUserId(@Param("userId") UUID userId);
}
