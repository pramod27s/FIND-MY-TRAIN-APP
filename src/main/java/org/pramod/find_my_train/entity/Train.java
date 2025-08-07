package org.pramod.find_my_train.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

      private String trainName;
      private String trainNumber;


      @OneToMany( mappedBy ="train",cascade =CascadeType.ALL, fetch = FetchType.LAZY)
      private List<TrainSchedule>  trainSchedule;






}
