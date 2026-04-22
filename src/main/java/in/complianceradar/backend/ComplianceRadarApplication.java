package in.complianceradar.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class ComplianceRadarApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComplianceRadarApplication.class, args);
    }

}
