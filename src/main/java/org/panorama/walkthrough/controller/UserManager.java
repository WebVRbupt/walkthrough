package org.panorama.walkthrough.controller;

import lombok.extern.slf4j.Slf4j;
import org.panorama.walkthrough.model.User;
import org.panorama.walkthrough.repositories.UserRepository;
import org.panorama.walkthrough.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName UserManager.java
 * @Description TODO
 * @createTime 2023/02/27
 */
@RestController
@RequestMapping("/user")
@Slf4j
public class UserManager {
    @Autowired
    UserService userService;

    @PostMapping("signin")
    public String signin(@RequestBody User registrant) {
        String msg;
        if (userService.doSignin(registrant)) {
            msg = "success" + userService.findUserByName(registrant.getUserName());
        } else {
            msg = "failed";
        }
        return msg;
    }

    @PostMapping("login")
    public String login(@RequestBody User user) {
        String msg;
        if(userService.userCheck(user)){
            msg="登录成功";
        }else{
            msg = "failed";
        }
        return msg;
    }
}
