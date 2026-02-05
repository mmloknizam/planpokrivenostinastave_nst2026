/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.dto;


import com.example.SpringRestAppDemo.entity.Uloga;
import java.io.Serializable;

/**
 *
 * @author Milena
 */
public class KorisnickiProfilDto implements Serializable{
    private Long korisnickiProfilID;
    private String email;
    private String lozinka;
    private Uloga uloga;
    
    public KorisnickiProfilDto() {
    }

    public KorisnickiProfilDto(Long korisnickiProfilID, String email, String lozinka, Uloga uloga) {
        this.korisnickiProfilID = korisnickiProfilID;
        this.email = email;
        this.lozinka = lozinka;
        this.uloga = uloga;
    }

    public Long getKorisnickiProfilID() {
        return korisnickiProfilID;
    }

    public void setKorisnickiProfilID(Long korisnickiProfilID) {
        this.korisnickiProfilID = korisnickiProfilID;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLozinka() {
        return lozinka;
    }

    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }

    public Uloga getUloga() {
        return uloga;
    }

    public void setUloga(Uloga uloga) {
        this.uloga = uloga;
    }
}
