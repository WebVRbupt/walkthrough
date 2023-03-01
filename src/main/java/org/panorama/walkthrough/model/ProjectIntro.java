package org.panorama.walkthrough.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.panorama.walkthrough.repositories.ProjectInfo;

import java.sql.Date;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName ProjectIntro.java
 * @Description TODO
 * @createTime 2023/03/01
 */
@Getter
@Setter
@NoArgsConstructor
public class ProjectIntro implements ProjectInfo {
    Long projectId;
    String projectName;
    Date creationTime;
    String profile;
}
