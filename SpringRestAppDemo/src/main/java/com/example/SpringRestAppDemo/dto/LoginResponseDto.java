/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.dto;

import java.io.Serializable;

/**
 *
 * @author Milena
 */
public class LoginResponseDto implements Serializable{
    private String token;
    private String email;
    private String uloga;

    public LoginResponseDto() {
    }

    public LoginResponseDto(String token, String email, String uloga) {
        this.token = token;
        this.email = email;
        this.uloga = uloga;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getUloga() {
        return uloga;
    }

}
