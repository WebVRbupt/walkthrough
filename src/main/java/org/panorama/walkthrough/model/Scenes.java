package org.panorama.walkthrough.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName Scenes.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@NoArgsConstructor
public class Scenes {
    @Setter
    @Getter
    List<Scene> scenes;
}
