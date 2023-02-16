package org.panorama.walkthrough.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName Model.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@NoArgsConstructor
@AllArgsConstructor
public class Model {
    @Setter
    @Getter
    String name;
    @Setter @Getter
    String url;
    @Setter @Getter
    Vector3 position;
    @Setter @Getter
    Vector3 scale;
}
