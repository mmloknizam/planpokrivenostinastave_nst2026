/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 *
 * @author Marija
 */
@Entity
@Table(name = "predmet")
public class Predmet {
    @Id
    @Column(name = "predmetID")
    private Long predmetID;
    @Column(name = "naziv")
    private String naziv;
    @Column(name = "brojEspb")
    private int brojEspb;

    public Predmet() {
    }

    public Predmet(Long predmetID, String naziv, int brojEspb) {
        this.predmetID = predmetID;
        this.naziv = naziv;
        this.brojEspb = brojEspb;
    }

    public Long getPredmetID() {
        return predmetID;
    }

    public void setPredmetID(Long predmetID) {
        this.predmetID = predmetID;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public int getBrojEspb() {
        return brojEspb;
    }

    public void setBrojEspb(int brojEspb) {
        this.brojEspb = brojEspb;
    }

    @Override
    public String toString() {
        return "Predmet{" + "naziv=" + naziv + '}';
    }
    
    
    
}
