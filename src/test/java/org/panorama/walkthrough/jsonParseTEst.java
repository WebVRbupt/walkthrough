package org.panorama.walkthrough;

import com.alibaba.fastjson2.JSON;
import lombok.extern.log4j.Log4j2;
import org.assertj.core.util.Strings;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.panorama.walkthrough.model.Scene;
import org.panorama.walkthrough.util.ReadUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.junit.jupiter.SpringExtension;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName jsonParseTEst.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@ExtendWith(SpringExtension.class)
@Log4j2
public class jsonParseTEst {
    @Value("#{'${customer.work-dir}' ?: systemProperties['user.dir']}")
    private String CUSTOM_DIR;
    @Test
    void json2Scene() {
        String path = getClass().getResource("/").getPath() + "scene.json";
        String jsonString = ReadUtil.readLocalFile2String(path);
        log.info(jsonString);
        Scene scene = JSON.parseObject(jsonString, Scene.class);
    }
    @Test
    void test(){
        Assert.assertTrue(!Strings.isNullOrEmpty(CUSTOM_DIR));
        log.info(CUSTOM_DIR);
    }
}
