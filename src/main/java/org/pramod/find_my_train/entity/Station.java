package org.pramod.find_my_train.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String stationName;
    private String stationCode;  // Changed from stationNumber to stationCode


    @ManyToOne
    @JoinColumn(name="train_id")
    private Train train;
}
