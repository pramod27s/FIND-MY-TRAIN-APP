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
        // First try exact match, then case-insensitive
        List<TrainSchedule> results = trainScheduleRepo.findBySource_StationCodeAndDestination_StationCode(sourceCode, destinationCode);
        if (results.isEmpty()) {
            results = trainScheduleRepo.findByStationCodesIgnoreCase(sourceCode, destinationCode);
        }
        return results;
    }

    public List<TrainSchedule> searchTrainByName(String sourceName, String destinationName) {
        // First try exact match, then case-insensitive with partial matching
        List<TrainSchedule> results = trainScheduleRepo.findBySource_StationNameAndDestination_StationName(sourceName, destinationName);
        if (results.isEmpty()) {
            results = trainScheduleRepo.findByStationNamesIgnoreCase(sourceName, destinationName);
        }
        return results;
    }

}
