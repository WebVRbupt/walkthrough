package org.panorama.walkthrough.service.algorithm;

import lombok.extern.slf4j.Slf4j;
import org.panorama.walkthrough.util.ShellCommandUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.function.Consumer;
import java.util.stream.Stream;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName imageStitchServiceImpl.java
 * @Description TODO
 * @createTime 2023/03/20
 */
@Service("imageStitchService")
@Slf4j
public final class ImageStitchServiceImpl extends ImgStitchService {

    @Value("${customer.stitchImagePyFile}")
    private String PYTHON_MAIN_FILE;

    /**
     * @param images_dir images' absolute path
     * @title doStich
     * @description
     */
    @Override
    Boolean doStich(String images_dir) {
        String[] command = new String[]{"python", PYTHON_MAIN_FILE, images_dir, images_dir};
        int exitCode = 0;
        try {
            exitCode = ShellCommandUtil.runCommand(command).intValue();
        } catch (Exception ex) {
            return false;
        } finally {
            return exitCode == 0 ? true : false;
        }
    }

    @Override
    Boolean prepare(String images_dir) {
        return true;
    }

    @Override
    Boolean after(String images_dir) {
        return true;
    }

    @Override
    public Boolean cleanUp(String images_dir) {
        Path path= Paths.get(images_dir);
        Consumer<Path> consumer = new Consumer<Path>() {
            @Override
            public void accept(Path path) {
                log.info((Files.isDirectory(path) ? "删除目录" : "删除文件") + path.getFileName());
                try {
                    Files.delete(path);
                } catch (Exception ex) {
                    log.error("删除失败:", ex);
                }
            }
        };

        try (Stream<Path> pathStream = Files.walk(path)) {
            pathStream.sorted(Comparator.reverseOrder())
                    .forEach(consumer);
        }catch (Exception ex){
            log.error("cleanUp failed",ex);
            return false;
        }
        return true;
    }
}
