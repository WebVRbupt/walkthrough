package org.panorama.walkthrough.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName Project.java
 * @Description TODO
 * @createTime 2023/02/20
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter
    @Getter
    Integer projectID;
    @Getter
    @Setter
    String projectName;
    @Getter
    @Setter
    String projectPath;
    @Getter
    @Setter
    Integer userId;

}
