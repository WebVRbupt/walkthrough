package org.panorama.walkthrough.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectShareController.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@Log4j2
//@Controller
public class ProjectShareController {
    @RequestMapping("/")
    public String th(){
        log.info("*******"+"*******");
        return "login";
    }
    @RequestMapping("{page}")
    public String page(@PathVariable("page") String page){
        return page;
    }
}
