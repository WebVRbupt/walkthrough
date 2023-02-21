package org.panorama.walkthrough;

import lombok.extern.log4j.Log4j2;
import org.springframework.ui.Model;
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
@RestController
public class ProjectShareController {
    @RequestMapping("/test")
    public String th(Model model){
        String msg="123";
        model.addAttribute("msg",msg);
        return "importJsonFile";
    }
}
