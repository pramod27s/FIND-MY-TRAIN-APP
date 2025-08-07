package org.pramod.find_my_train.service;

import org.pramod.find_my_train.entity.TrainSchedule;
import org.pramod.find_my_train.repo.TrainScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainSearchService  {
       private TrainScheduleRepo trainScheduleRepo;

       public TrainSearchService(TrainScheduleRepo trainScheduleRepo) {
           this.trainScheduleRepo = trainScheduleRepo;
       }


    public List<TrainSchedule> searchTrainByCode(String sourceCode, String destinationCode) {
        return trainScheduleRepo.findBySource_StationCodeAndDestination_StationCode( sourceCode, destinationCode);
    }


    public List<TrainSchedule> searchTrainByName(String sourceName, String destinationName) {
        return trainScheduleRepo.findBySource_StationNameAndDestination_StationName( sourceName, destinationName);
    }


}
