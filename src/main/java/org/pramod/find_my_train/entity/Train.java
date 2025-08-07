package org.pramod.find_my_train.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
      @JsonBackReference
      private List<TrainSchedule>  trainSchedule;






}
