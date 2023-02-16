package org.panorama.walkthrough;

import org.springframework.stereotype.Controller;
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
@Controller
public class ProjectShareController {
    @RequestMapping("/test")
    public String th(Model model){
        String msg="123";
        model.addAttribute("msg",msg);
        return "walkthrough";
    }

}
