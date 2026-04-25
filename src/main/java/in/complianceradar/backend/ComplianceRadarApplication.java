package in.complianceradar.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;

@SpringBootApplication
public class ComplianceRadarApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComplianceRadarApplication.class, args);
    }

}
