package org.panorama.walkthrough.service.storage;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.InputStream;
import java.nio.charset.Charset;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName FileSystemStorageServiceTest.java
 * @Description TODO
 * @createTime 2023/04/14
 */
@SpringBootTest
class FileSystemStorageServiceTest {
    @Autowired
    private StorageService storageService;

    @Test
    void getSourceTest() throws Exception {
        InputStream inputStream = storageService.getSource("9/A6ASt8VZuLHKOkTGt/", "projectConfig.json");
        byte[] bytes = new byte[inputStream.available()];
        inputStream.read(bytes, 0, inputStream.available());
        System.out.println(new String(bytes, Charset.defaultCharset()));
    }
}