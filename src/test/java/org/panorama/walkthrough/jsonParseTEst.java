package org.panorama.walkthrough;

import com.alibaba.fastjson2.JSON;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.panorama.walkthrough.model.Scene;
import org.panorama.walkthrough.util.ReadUtil;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.Stream;

/**
 * @author yang
 * @version 1.0.0
 * @ClassName jsonParseTEst.java
 * @Description TODO
 * @createTime 2023/02/16
 */
@Log4j2
public class jsonParseTEst {
    @Test
    void json2Scene() {
        String path = getClass().getResource("/").getPath() + "scene.json";
        String jsonString = ReadUtil.readLocalFile2String(path);
        log.info(jsonString);
        Scene scene = JSON.parseObject(jsonString, Scene.class);
    }

    @Test
    public void consumerTest() {
        Consumer<String> consumer = new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println(s);
            }
        };
        Stream<String> stream = Stream.of("aaa", "bbb", "ccc");
        stream.forEach(consumer);
    }

    @Test
    public void supplierTest() {
        Supplier<Double> supplier = Math::random;
        System.out.println(supplier.get());
    }

    @Test
    void predicateTest() {
        Predicate<Integer> predicate = new Predicate<Integer>() {
            @Override
            public boolean test(Integer integer) {
                if (integer > 3) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5, 6);
        Optional<Integer> optional = stream.filter(predicate).findFirst();
        System.out.println(optional.orElseGet(() -> new Random().nextInt()));
    }

    @Test
    void functionTest() {
        Function<Integer, String> function = new Function<Integer, String>() {
            Map<Integer, String> map = Map.of(1, "a", 2, "b", 3, "c");

            @Override
            public String apply(Integer integer) {
                return map.getOrDefault(integer, "error");
            }
        };
        Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5, 6);
        stream.map(function).forEach(System.out::println);
    }
}
