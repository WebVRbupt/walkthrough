package org.panorama.walkthrough.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.context.properties.ConfigurationProperties;

import javax.annotation.PostConstruct;

/**
 * @author WangZx
 * @version 1.0
 * @className StorageProperties
 * @date 2023/3/28
 * @createTime 10:47
 */

@ConfigurationProperties("storage")
public class StorageProperties implements BeanPostProcessor {

    @Value("${customer.work-dir}")
    private String WORK_DIR;
    @Value("#{systemProperties['file.separator']}")
    private String SEPARATOR;
    private final String STORE_DIR = "userData";
    private String location;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @PostConstruct
    private void init() {
        if (null == location) {
            setLocation(WORK_DIR + SEPARATOR + STORE_DIR);
        }
    }
}
