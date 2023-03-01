package org.panorama.walkthrough.controller;

import lombok.extern.slf4j.Slf4j;
import org.panorama.walkthrough.model.ResponseEntity;
import org.panorama.walkthrough.model.ResponseEnum;
import org.panorama.walkthrough.model.User;
import org.panorama.walkthrough.repositories.UserRepository;
import org.panorama.walkthrough.service.UserService;
import org.panorama.walkthrough.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

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
    public ResponseEntity signin(@RequestBody User registrant) {
        if(userService.doSignin(registrant)){
            return  ResponseUtil.success();
        }else{
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }

    @PostMapping("login")
    public ResponseEntity login(@RequestBody User user, HttpServletRequest request) {
        if(userService.userCheck(user)){
            request.setAttribute("userId",user.getUserId());
            return ResponseUtil.success();
        }else{
            return ResponseUtil.error(ResponseEnum.FAIL);
        }
    }
}
