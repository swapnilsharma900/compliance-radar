package com.rspcb.complianceradar.dto;

import com.rspcb.complianceradar.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class AuthDto {

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record RegisterRequest(
        @NotBlank String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password,
        String phoneNumber,
        String district
    ) {}

    public record AuthResponse(
        String token,
        UUID userId,
        String fullName,
        String email,
        UserRole role,
        String district
    ) {}
}
