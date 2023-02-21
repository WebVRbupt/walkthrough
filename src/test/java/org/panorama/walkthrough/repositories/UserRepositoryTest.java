package org.panorama.walkthrough.repositories;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.panorama.walkthrough.WalkthroughApplication;
import org.panorama.walkthrough.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName UserRepositoriesTest.java
 * @Description TODO
 * @createTime 2023/02/20
 */
@DataJpaTest
@Log4j2
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;
    @BeforeEach
    void setUp() {
        userRepository.save(new User("test1","123"));
        userRepository.save(new User("test2","123"));
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void findUserByUserName() {
        User user = userRepository.findUserByUserName("test2");
        log.info(user);
    }
}