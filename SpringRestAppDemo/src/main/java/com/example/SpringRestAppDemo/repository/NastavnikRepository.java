/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.example.SpringRestAppDemo.repository;

import com.example.SpringRestAppDemo.entity.Nastavnik;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Milena
 */
@Repository
public interface NastavnikRepository extends JpaRepository<Nastavnik, Long>{

    @Query("SELECT n FROM Nastavnik n WHERE n.nastavnikID NOT IN " +
           "(SELECT k.nastavnik.nastavnikID FROM KorisnickiProfil k WHERE k.nastavnik IS NOT NULL)")
    public List<Nastavnik> findSlobodniNastavnici();

    
}
