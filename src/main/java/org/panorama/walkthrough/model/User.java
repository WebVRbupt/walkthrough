package org.panorama.walkthrough.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName User.java
 * @Description TODO
 * @createTime 2023/02/20
 */
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
            @Setter@Getter
    Long userId;
    @Setter@Getter
    String userName;
    @Setter@Getter
    String password;

    public User(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }
}
