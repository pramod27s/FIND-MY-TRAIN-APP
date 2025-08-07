package org.pramod.find_my_train.controller;

import org.pramod.find_my_train.entity.TrainSchedule;
import org.pramod.find_my_train.service.TrainSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "*")
public class TrainSearchController {

    @Autowired
    private TrainSearchService trainSearchService;

    public TrainSearchController(TrainSearchService trainSearchService ){
        this.trainSearchService = trainSearchService;
    }

    @GetMapping("/search")
    public List<TrainSchedule> searchTrainByCode(@RequestParam String from, @RequestParam String to){
        // Remove .toUpperCase() to allow flexible searching
        return trainSearchService.searchTrainByName(from, to);
    }

    @GetMapping("/name")
    public List<TrainSchedule> searchTrainByName(@RequestParam String sourceName, @RequestParam String destinationName){
        // Remove .toUpperCase() to allow flexible searching
        return trainSearchService.searchTrainByName(sourceName, destinationName);
    }


}
