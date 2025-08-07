package org.pramod.find_my_train.entity;


import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.persistence.*;
import lombok.*;



@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
public class TrainSchedule {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name="train_id")
    private Train train;

    @ManyToOne
    @JoinColumn(name="source_station_id")
    private Station source;

    @ManyToOne
    @JoinColumn(name="destination_station_id")
    private Station destination;

    private String  departureTime;

    private String  arrivalTime;



   

}
