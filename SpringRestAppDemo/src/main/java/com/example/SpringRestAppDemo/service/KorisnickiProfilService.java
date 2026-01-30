/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.example.SpringRestAppDemo.service;

import com.example.SpringRestAppDemo.dto.LoginRequestDto;
import com.example.SpringRestAppDemo.dto.LoginResponseDto;
import com.example.SpringRestAppDemo.dto.RegisterRequestDto;
import com.example.SpringRestAppDemo.dto.RegisterResponseDto;

/**
 *
 * @author Milena
 */
public interface KorisnickiProfilService {
    LoginResponseDto login(LoginRequestDto request) throws Exception;
    RegisterResponseDto register(RegisterRequestDto request) throws Exception;
    RegisterResponseDto confirmEmail(String email, String kod) throws Exception;
    RegisterResponseDto resendVerificationCode(String email) throws Exception;
}
