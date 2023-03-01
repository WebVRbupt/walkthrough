package org.panorama.walkthrough.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.persistence.criteria.CriteriaBuilder;
import java.sql.Date;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter
    @Getter
    Long projectId;
    @Getter
    @Setter
    String projectName;
    @Getter
    @Setter
    String projectPath;
    @Getter
    @Setter
    Long userId;
    @Getter
    @Setter
    Date creationTime;
    @Getter
    @Setter
    Integer status;
    @Getter
    @Setter
    String profile;

    public Project(String projectName, String projectPath, Long userId, Integer status) {
        this.projectName = projectName;
        this.projectPath = projectPath;
        this.userId = userId;
        this.status = status;
    }

    public Project(String projectName, String projectPath, Long userId) {
        this.projectName = projectName;
        this.projectPath = projectPath;
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Project{" +
                "projectID=" + projectId +
                ", projectName='" + projectName + '\'' +
                ", projectPath='" + projectPath + '\'' +
                ", userId=" + userId +
                ", creationTime=" + creationTime +
                ", status=" + status +
                '}';
    }
}
