package org.panorama.walkthrough.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName Vector3.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@NoArgsConstructor
@AllArgsConstructor
public class Vector3 {
    @Setter
    @Getter
    double x;
    @Setter
    @Getter
    double y;
    @Setter
    @Getter
    double z;

    public void copy(Vector3 pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.z = pos.z;
    }

    public Vector3(List<Double> vects) {
        this.x = vects.get(0);
        this.y = vects.get(1);
        this.z = vects.get(2);
    }
}
