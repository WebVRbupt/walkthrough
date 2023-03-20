package org.panorama.walkthrough.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName MainController.java
 * @Description TODO
 * @createTime 2023/03/02
 */
@Controller
public class MainController {
    @RequestMapping("/")
    public String main(){
        return "login";
    }
}
