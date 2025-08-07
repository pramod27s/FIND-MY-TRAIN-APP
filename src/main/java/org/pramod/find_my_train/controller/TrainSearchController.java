package org.pramod.find_my_train.controller;


import org.pramod.find_my_train.entity.TrainSchedule;
import org.pramod.find_my_train.service.TrainSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
@RequestMapping("/search")
public class TrainSearchController {

    @Autowired
    private TrainSearchService trainSearchService;

       public TrainSearchController(TrainSearchService trainSearchService ){
           this.trainSearchService = trainSearchService;
       }

         @GetMapping("/code")
       public List<TrainSchedule>   searchTrainByCode(@RequestParam  String sourceCode,@RequestParam  String destinationCode){
           return    trainSearchService.searchTrainByCode(sourceCode.toUpperCase(),destinationCode.toUpperCase());
       }

        @GetMapping("/name")
    public List<TrainSchedule>   searchTrainByName(@RequestParam  String sourceName,@RequestParam  String destinationName){
        return    trainSearchService.searchTrainByName(sourceName.toUpperCase(),destinationName.toUpperCase());
    }


}
