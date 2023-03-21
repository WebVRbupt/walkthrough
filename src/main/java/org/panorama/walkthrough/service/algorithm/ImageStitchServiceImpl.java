package org.panorama.walkthrough.service.algorithm;

import lombok.extern.slf4j.Slf4j;
import org.panorama.walkthrough.util.ShellCommandUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName imageStitchServiceImpl.java
 * @Description TODO
 * @createTime 2023/03/20
 */
@Service("imageStitchService")
@Slf4j
public class ImageStitchServiceImpl extends ImgStitchService {

    @Value("${customer.stitchImagePyFile}")
    private String PYTHON_MAIN_FILE;

    /**
     * @title doStich
     * @description
     * @param images_dir images' absolute path
     */
    @Override
    protected Boolean doStich(String images_dir) {
        String[] command = new String[]{"python", PYTHON_MAIN_FILE, images_dir, images_dir};
        int exitCode = 0;
        try {
            exitCode = ShellCommandUtil.runCommand(command, "/").intValue();
        } catch (Exception ex) {
            return false;
        } finally {
            return exitCode == 0 ? true : false;
        }
    }

    @Override
    protected Boolean prepare(String images_dir) {
        return true;
    }

    @Override
    protected Boolean cleanUp(String images_dir) {
        return true;
    }
}
