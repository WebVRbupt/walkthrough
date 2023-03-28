package org.panorama.walkthrough.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author WangZx
 * @version 1.0
 * @className StorageProperties
 * @date 2023/3/28
 * @createTime 10:47
 */

@ConfigurationProperties("storage")
public class StorageProperties {

    @Value("${customer.work-dir}\\userData")
    private String location;

    public String getLocation(){
        return location;
    }

    public void setLocation(String location){
        this.location = location;
    }

}
