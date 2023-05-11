import * as THREE from '../build/three.module.js';


export function generateObjectArrayForControls(scene) {

    const objectArr = [];

    for (const object3D of scene.children) {

        if (object3D.name === "panoGroup" || object3D.name === "pano_group") {

            for (const skybox of object3D.children) {
                objectArr.push(skybox);
            }

        } else if (object3D.name === "naviGroup" || object3D.name === "navi_circles") {
            for (const navi of object3D.children) {
                objectArr.push(navi);
            }
        }

    }
    console.log(objectArr, "objectArr");
    return objectArr;

}

// function testFunc(obj) {
//     for (const elements of obj.children) {
//         if(elements.name === 'mtlModel')
//         {
//             console.log(elements,"testFunc");
//         }
//         else if(elements.name === 'navi_circles'){
//             console.log(elements,"testFunc");
//         }
//     }
// }

export function getAllChildren(obj) {

    let childrenArr = [];
    getAllChildrenHelper(obj, childrenArr);
    return childrenArr;

}

function getAllChildrenHelper(obj, arr) {

    for (const elements of obj.children) {
        if (elements.children.length !== 0) {
            getAllChildrenHelper(elements, arr);
        } else {
            arr.push(elements);
        }
    }
}

export function attachObjectsForControls(objectArr, transformControl) {
    for (const object3D of objectArr) {
        transformControl.attach(object3D);
    }
}

export function rad2deg(rad) {
    return rad * 180 / Math.PI;
}

/**
 * 获取three.js场景 'scene' 下场景天空盒对象数组.
 * @param scene
 * @returns {Array:Object3D}
 */
export function getSkyboxArr(scene) {

    return getObjectArr(scene, "panoGroup");

}

/**
 * 获取three.js场景 'scene' 下导航热点对象数组.
 * @param scene
 * @returns {Array:Object3D}
 */
export function getNaviCircleArr(scene) {

    return getObjectArr(scene, "naviGroup");

}

/**
 * 获取three.js场景 'scene' 下空间模型对象数组.
 * @param scene
 * @returns {Array:Object3D}
 */
export function getModelArr(scene) {

    return getObjectArr(scene, "mtlModel");

}

/**
 * 根据three.js场景 'scene' 中 'Object3D' 对象所属父Group元素的name属性返回 'Object3D' 对象数组.
 * @param scene
 * @param groupName "panoGroup" | "naviGroup" | "mtlModel"
 * @returns {Array:Object3D}
 */
function getObjectArr(scene, groupName) {

    for (let obj3d of scene.children) {
        if (obj3d.name === "sceneEntity") {
            for (let childGroup of obj3d.children) {
                if (childGroup.name === groupName)
                    return childGroup.children;
            }
        }
    }
}

/**
 * 传入一个 three.js 'Object3D' 对象数组,返回以 'customId' 为 key,该 'Object3D'对象为 value 的 Map.
 * @param objectArr
 * @returns {Map<string, Object3D>}
 */
export function genObjectMap(objectArr) {

    let objectMap = new Map;
    console.log(objectArr);
    if (objectArr !== null && objectArr !== undefined) {
        for (const obj of objectArr) {
            objectMap.set(obj.customId, obj);
        }
    }

    return objectMap;

}