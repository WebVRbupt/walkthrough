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