package org.pramod.find_my_train.repo;

import org.pramod.find_my_train.entity.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainScheduleRepo extends JpaRepository<TrainSchedule,Long> {

    List<TrainSchedule> findBySource_StationCodeAndDestination_StationCode(String sourceCode, String destinationCode);

    List<TrainSchedule> findBySource_StationNameAndDestination_StationName(String sourceName, String destinationName);

    // Add case-insensitive search methods
    @Query("SELECT ts FROM TrainSchedule ts WHERE " +
           "UPPER(ts.source.stationName) LIKE UPPER(CONCAT('%', :sourceName, '%')) AND " +
           "UPPER(ts.destination.stationName) LIKE UPPER(CONCAT('%', :destinationName, '%'))")
    List<TrainSchedule> findByStationNamesIgnoreCase(@Param("sourceName") String sourceName,
                                                     @Param("destinationName") String destinationName);

    @Query("SELECT ts FROM TrainSchedule ts WHERE " +
           "UPPER(ts.source.stationCode) = UPPER(:sourceCode) AND " +
           "UPPER(ts.destination.stationCode) = UPPER(:destinationCode)")
    List<TrainSchedule> findByStationCodesIgnoreCase(@Param("sourceCode") String sourceCode,
                                                     @Param("destinationCode") String destinationCode);
}