package org.panorama.walkthrough.service.storage;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName StoragePropertiesTest.java
 * @Description TODO
 * @createTime 2023/04/06
 */
@Slf4j
@SpringBootTest
class StoragePropertiesTest {
    @Autowired
    StorageProperties storageProperties;
    @Test
    void test(){
        log.info(storageProperties.getLocation());
    }
}