package org.panorama.walkthrough.repositories;

import org.panorama.walkthrough.model.User;
import org.springframework.data.repository.CrudRepository;

import javax.persistence.Table;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName UserRepositories.java
 * @Description TODO
 * @createTime 2023/02/20
 */
public interface UserRepository extends CrudRepository<User, Long> {
    User findByUserId(Long id);
    User findUserByUserName(String userName);
}
