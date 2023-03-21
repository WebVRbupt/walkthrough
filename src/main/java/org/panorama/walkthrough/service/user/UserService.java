package org.panorama.walkthrough.service.user;

import org.panorama.walkthrough.model.User;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName userService.java
 * @Description TODO
 * @createTime 2023/02/27
 */
public interface UserService {
    /**
     * @title signin
     * @description 用户注册
     */
    Boolean signin(User registrant);
    /**
     * @title login
     * @description 用户登录
     */
    User login(User user);
    /**
     * @title logout
     * @description 用户登出
     */
    Boolean logout(User user);
}
