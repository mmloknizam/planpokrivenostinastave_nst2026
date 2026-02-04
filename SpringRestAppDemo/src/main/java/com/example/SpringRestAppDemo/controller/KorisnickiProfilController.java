/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.SpringRestAppDemo.controller;

import com.example.SpringRestAppDemo.dto.ConfirmEmailRequestDto;
import com.example.SpringRestAppDemo.dto.LoginRequestDto;
import com.example.SpringRestAppDemo.dto.LoginResponseDto;
import com.example.SpringRestAppDemo.dto.RegisterRequestDto;
import com.example.SpringRestAppDemo.dto.RegisterResponseDto;
import com.example.SpringRestAppDemo.dto.ResendCodeRequestDto;
import com.example.SpringRestAppDemo.service.KorisnickiProfilService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Marija
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class KorisnickiProfilController {

    private final KorisnickiProfilService korisnickiProfilService;

    public KorisnickiProfilController(KorisnickiProfilService korisnickiProfilService) {
        this.korisnickiProfilService = korisnickiProfilService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) throws Exception {
        return ResponseEntity.ok(korisnickiProfilService.login(loginRequestDto));
    }
    
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@RequestBody RegisterRequestDto request) throws Exception {
        return ResponseEntity.ok(korisnickiProfilService.register(request));
    }
    
    @PostMapping("/confirm")
    public ResponseEntity<RegisterResponseDto> confirmEmail(@RequestBody ConfirmEmailRequestDto request) throws Exception {
        return ResponseEntity.ok(
            korisnickiProfilService.confirmEmail(request.getEmail(),request.getKod(),request.getLozinka(),request.getUlogaID()));
    }

    @PostMapping("/resend-code")
    public ResponseEntity<RegisterResponseDto> resendVerificationCode(@RequestBody ResendCodeRequestDto request) throws Exception {
        return ResponseEntity.ok(korisnickiProfilService.resendVerificationCode(request.getEmail()));
    }
    
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<String> handleException(Exception e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
