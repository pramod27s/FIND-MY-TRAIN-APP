package org.pramod.find_my_train.service;

import org.pramod.find_my_train.entity.Train;
import org.pramod.find_my_train.repo.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainService {
    @Autowired
    private TrainRepository trainRepository;


      public TrainService(TrainRepository trainRepository) {
          this.trainRepository = trainRepository;
      }

    public List<Train> getAllTrains() {

        return trainRepository.findAll();
    }


    public Train addTrain(Train train) {
          return trainRepository.save(train);
    }


}
