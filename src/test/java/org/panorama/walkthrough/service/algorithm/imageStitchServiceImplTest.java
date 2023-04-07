package org.panorama.walkthrough.service.algorithm;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Stream;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName imageStitchServiceImplTest.java
 * @Description TODO
 * @createTime 2023/03/20
 */
@SpringBootTest
@Slf4j
class imageStitchServiceImplTest {
    @Value("#{'${customer.work-dir}' ?: systemProperties['user.dir']}")
    String work_dir_prefix;
    String work_dir;
    @Autowired
    ImgStitchService imgStitchService;

    @BeforeEach
    void setUp() {
        work_dir = work_dir_prefix + "/tmp/9/stitch";
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void stitch() {
        imgStitchService.stitch(work_dir);
    }

    @Test
    void cleanUpTest1() throws IOException, InterruptedException {
        String images_path = work_dir_prefix + "/tmp/9/stitch/";
        Path path = Paths.get(images_path);
        Path path1 = Paths.get(images_path + "test.png");
        Path path2 = Paths.get(images_path + "test2.png");

        Files.createDirectories(path);
        Files.createFile(path1);
        Files.createFile(path2);

        TimeUnit.SECONDS.sleep(3L);
        Consumer<Path> consumer=new Consumer<Path>() {
            @Override
            public void accept(Path path) {
                log.info((Files.isDirectory(path)?"删除目录":"删除文件")+path.getFileName());
                try{
                    Files.delete(path);
                }catch (Exception ex){
                    log.error("删除失败:",ex);
                }
            }
        };

        try (Stream<Path> pathStream = Files.walk(path)) {
            pathStream.sorted(Comparator.reverseOrder())
                    .forEach(consumer);
        }
    }
    void cleanUpTest2(){

    }
}