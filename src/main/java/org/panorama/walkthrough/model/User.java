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
    @Setter@Getter
    String salt;
    @Setter@Getter
    String email;
    @Setter@Getter
    Integer status=0;

    public User(String userName, String password, String salt) {
        this.userName = userName;
        this.password = password;
        this.salt = salt;
    }

    public User(String userName, String password, String salt, String email) {
        this.userName = userName;
        this.password = password;
        this.salt = salt;
        this.email = email;
    }

    public User(String userName, String password) {
        this(userName,password,"xyw");
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", salt='" + salt + '\'' +
                ", email='" + email + '\'' +
                ", status=" + status +
                '}';
    }
}
