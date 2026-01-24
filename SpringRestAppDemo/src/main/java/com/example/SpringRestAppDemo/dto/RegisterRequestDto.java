/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.dto;

/**
 *
 * @author Milena
 */
public class RegisterRequestDto {

     private String email;
    private String lozinka;
    private Long ulogaID;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLozinka() { return lozinka; }
    public void setLozinka(String lozinka) { this.lozinka = lozinka; }

    public Long getUlogaID() { return ulogaID; }
    public void setUlogaID(Long ulogaID) { this.ulogaID = ulogaID; }
}
