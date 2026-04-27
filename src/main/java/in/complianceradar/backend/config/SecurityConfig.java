package in.complianceradar.backend.config;

import in.complianceradar.backend.security.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Swagger UI & API Docs
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/swagger-auto-auth.js").permitAll()
                // Public endpoints
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                // Citizen endpoints
                .requestMatchers("/api/reports/**").hasAnyRole("CITIZEN", "INSPECTOR", "ADMIN")
                // Inspector & Admin only
                .requestMatchers("/api/fusion/**").hasAnyRole("INSPECTOR", "ADMIN")
                .requestMatchers("/api/alerts/**").hasAnyRole("INSPECTOR", "ADMIN")
                .requestMatchers("/api/units/**").hasAnyRole("INSPECTOR", "ADMIN")
                .requestMatchers("/api/sensors/**").hasAnyRole("INSPECTOR", "ADMIN")
                .requestMatchers("/api/satellite/**").hasAnyRole("INSPECTOR", "ADMIN")
                // Admin only
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    String body = String.format(
                        "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication is required to access this resource.\",\"timestamp\":\"%s\"}",
                        LocalDateTime.now());
                    response.getOutputStream().write(body.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                    response.getOutputStream().flush();
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    String body = String.format(
                        "{\"status\":403,\"error\":\"Forbidden\",\"message\":\"You do not have permission to access this resource.\",\"timestamp\":\"%s\"}",
                        LocalDateTime.now());
                    response.getOutputStream().write(body.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                    response.getOutputStream().flush();
                })
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
