package org.panorama.walkthrough;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectShareController.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@Log4j2
@Controller
public class ProjectShareController {
    @GetMapping("/{page}")
    public String th(@PathVariable("page") String page){
        log.info("*******"+page+"*******");
        return page;
    }
}
