package org.panorama.walkthrough.service.algorithm;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName imageStitchServiceImplTest.java
 * @Description TODO
 * @createTime 2023/03/20
 */
@SpringBootTest
class imageStitchServiceImplTest {
    @Value("${customer.work-dir}")
    String work_dir_prefix;
    String work_dir;
    @Autowired
    ImgStitchService imgStitchService;

    @BeforeEach
    void setUp() {
        work_dir = work_dir_prefix + "/tmp/1/stitch";
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void stitch() {
        imgStitchService.stitch(work_dir);
    }
}