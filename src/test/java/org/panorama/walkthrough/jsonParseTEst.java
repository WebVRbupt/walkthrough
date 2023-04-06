package org.panorama.walkthrough;

import com.alibaba.fastjson2.JSON;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.panorama.walkthrough.model.Scene;
import org.panorama.walkthrough.util.ReadUtil;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName jsonParseTEst.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@Log4j2
public class jsonParseTEst {
    @Test
    void json2Scene() {
        String path = getClass().getResource("/").getPath() + "scene.json";
        String jsonString = ReadUtil.readLocalFile2String(path);
        log.info(jsonString);
        Scene scene = JSON.parseObject(jsonString, Scene.class);
    }
}
