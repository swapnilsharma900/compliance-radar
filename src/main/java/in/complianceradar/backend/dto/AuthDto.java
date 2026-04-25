package in.complianceradar.backend.dto;

import in.complianceradar.backend.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
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

    public record UserProfileResponse(
        UUID userId,
        String fullName,
        String email,
        UserRole role,
        String phoneNumber,
        String district,
        LocalDateTime createdAt
    ) {}
}
