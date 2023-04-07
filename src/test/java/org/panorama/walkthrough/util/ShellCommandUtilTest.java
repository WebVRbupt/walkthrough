package org.panorama.walkthrough.util;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ShellCommandUtilTest.java
 * @Description TODO
 * @createTime 2023/03/20
 */
@SpringBootTest
@Slf4j
class ShellCommandUtilTest {
    @Value("#{'${customer.work-dir}' ?: systemProperties['user.dir']}")
    private String WORK_DIR;
    private static final String PY_PATH = "imageStitchPy/src/main.py";
    private static final String IMGS_DIR = "tmp/1/stitch";

    @Test
    void runCommandRelativePath() throws Exception {
        String[] command = new String[]{"python", PY_PATH, IMGS_DIR, IMGS_DIR};
        ShellCommandUtil.runCommand(command, null);
    }

    @Test
    void runCommandAbsolutePath() throws Exception {
        String[] command = new String[]{"python", WORK_DIR + "/" + PY_PATH, WORK_DIR + "/" + IMGS_DIR};
        log.info(ShellCommandUtil.runCommand(command, "/").toString());
    }
}