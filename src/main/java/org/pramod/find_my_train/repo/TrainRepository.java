package org.pramod.find_my_train.repo;

import org.pramod.find_my_train.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainRepository  extends JpaRepository<Train,Long
        > {



}
