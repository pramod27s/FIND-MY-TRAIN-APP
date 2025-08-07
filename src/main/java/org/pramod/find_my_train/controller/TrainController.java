package org.pramod.find_my_train.controller;
import org.pramod.find_my_train.entity.Train;
import org.pramod.find_my_train.service.TrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trains")
public class TrainController {
    @Autowired
    private TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping
    public List<Train> getTrains() {
        return trainService.getAllTrains();

    }

    @PostMapping
    public Train addTrain(@RequestBody Train train) {
         return  trainService.addTrain(train);

    }


}
