package org.panorama.walkthrough.model;

import com.alibaba.fastjson2.annotation.JSONField;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName scene.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@NoArgsConstructor
@AllArgsConstructor
public class Scene {
    @Setter @Getter
    String name;
    @Setter @Getter
    String url;

    @Setter @Getter
    Vector3 position;

    @Override
    public String toString() {
        return "Scene{" +
                "name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", position=" + position +
                '}';
    }
}
