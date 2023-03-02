package org.panorama.walkthrough.model;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName StitchConfig.java
 * @Description TODO
 * @createTime 2023/03/01
 */
@Slf4j
public class StitchConfig {
    List<Row> configs = new ArrayList<>();

    public void addConfig(Row row) {
        configs.add(row);
        log.info(row.photoName+row.focal_length);
    }
    public Integer size(){
        return configs.size();
    }
    public static class Row {
        String photoName;
        String focal_length;

        public Row(String photoName, String focal_length) {
            this.photoName = photoName;
            this.focal_length = focal_length;
        }
    }

    @Override
    public String toString() {
        StringBuffer sb = new StringBuffer();
        for (Row row : configs) {
            sb.append(row.photoName).append(" ")
                    .append(row.photoName).append("\r");
        }
        return sb.toString();
    }
}
