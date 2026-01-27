/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.example.SpringRestAppDemo.repository;

import com.example.SpringRestAppDemo.entity.PokrivenostNastave;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Marija
 */
@Repository
public interface PokrivenostNastaveRepository extends JpaRepository<PokrivenostNastave, Long>{

    public List<PokrivenostNastave> findAllBySkolskaGodina_SkolskaGodinaID(Long skolskaGodinaID);

    public List<PokrivenostNastave> findByPredmet_PredmetIDAndSkolskaGodina_SkolskaGodinaID(Long predmetID,Long skolskaGodinaID);
    
}
