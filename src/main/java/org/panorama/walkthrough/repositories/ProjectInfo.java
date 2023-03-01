package org.panorama.walkthrough.repositories;

import java.sql.Date;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName projectInfo.java
 * @Description TODO
 * @createTime 2023/03/01
 */
public interface ProjectInfo {
    Long getProjectId();
    String getProjectName();
    String getProfile();
    Date getCreationTime();
}
