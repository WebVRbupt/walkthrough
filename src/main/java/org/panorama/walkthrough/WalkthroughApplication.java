package org.panorama.walkthrough;

import org.panorama.walkthrough.service.storage.StorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class WalkthroughApplication {

	public static void main(String[] args) {
		SpringApplication.run(WalkthroughApplication.class, args);
	}
}
