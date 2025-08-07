package org.pramod.find_my_train.repo;

import org.pramod.find_my_train.entity.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainScheduleRepo extends JpaRepository<TrainSchedule,Long> {


    List<TrainSchedule> findBySource_StationCodeAndDestination_StationCode(String sourceCode, String destinationCode);


    List<TrainSchedule> findBySource_StationNameAndDestination_StationName(String sourceName, String destinationName);


}