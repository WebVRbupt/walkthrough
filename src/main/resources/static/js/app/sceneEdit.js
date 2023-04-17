import * as THREE from "../build/three.module.js";

import {OrbitControls} from "../lib/controls/OrbitControls.js";
import {FirstPersonCameraControl} from "../lib/controls/firstPersonCameraControl.js";
import {TransformControls} from "../lib/controls/TransformControls.js"
import {GLTFLoader} from "../lib/loaders/GLTFLoader.js";

import {getAllChildren, rad2deg} from "../app/util.js"
import {sceneConstructor} from "./sceneConstructor.js";
import {updateSceneConfig} from "./sceneExporter.js";

const configurationFileId = sessionStorage.getItem("configurationFileId");
const userId = sessionStorage.getItem("userId");
const projectConfigurationUrl = "/project/getEditSources/" + userId + "/" + configurationFileId + "/" + "projectConfig.json";


let container = document.getElementById("sceneContainer");

let camera, scene, scene2, renderer;

let orbitControls, firstPerson, transformControl;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let insetWidth;
let insetHeight;

let entityGroup;
let entityArr = null;
let boxhelperGroup = new THREE.Group();
let currentBoxhelper = null;

let currentSelected = null;
let currentSelectedIndex = null;
const enableSelection = true;
let lockedObjectSet = new Set();
let enableSelect = false;
let scaleSlider = null;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene2 = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;

    container.appendChild(renderer.domElement);

    scene.add(camera);

    entityGroup = new THREE.Group();
    entityGroup.name = "sceneEntity";

    sceneConstructor(scene, entityGroup, projectConfigurationUrl);
    console.log(scene, "scene");
    console.log(entityGroup, "entity")

    initControls();
    initLightAndHelper();

    // 这个事件绑定到 renderer.domElement 而不能绑定到全局的window上，否则在点击右侧菜单操作时也会误触发事件，导致场景中选中物体发生变化.
    renderer.domElement.addEventListener('pointerdown', onObjectSelection);
    window.addEventListener('resize', onWindowResize);

    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    prevButton.addEventListener('click', onPrevButtonClick);
    nextButton.addEventListener('click', onNextButtonClick);
}

function animate() {

    requestAnimationFrame(animate);
    if (orbitControls.enabled) orbitControls.update();
    // if(firstperson.enabled) firstperson.update();
    // if (materialLine !== null) {
    //     materialLine.resolution.set(insetWidth, insetHeight);
    // }

    // if (currentSelected !== null && currentBoxhelper !== null) {
    //     currentBoxhelper.setFromObject(currentSelected);
    // }

    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(scene2, camera);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    insetWidth = window.innerWidth / 4;
    insetHeight = window.innerHeight / 4;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function initControls() {

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = true;
    camera.position.set(0, 0, 2);

    firstPerson = new FirstPersonCameraControl(camera, renderer.domElement);
    firstPerson.enabled = false;
    firstPerson.applyGravity = false;
    firstPerson.applyCollision = false;

    transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.rotationSnap = 0.5 * Math.PI;
    transformControl.addEventListener('change', () => {
        if (currentSelected !== null) {
            currentBoxhelper.setFromObject(currentSelected);
            updateInfoPanel();
        }
        //renderer.render(scene, camera);
    });
    transformControl.addEventListener('dragging-changed', (event) => {
        orbitControls.enabled = !event.value;
    });

    scene.add(transformControl);

}

function initLightAndHelper() {

    const axes = new THREE.AxesHelper(500);
    scene.add(axes);
    scene.add(new THREE.GridHelper(20, 20));
    scene.background = new THREE.Color(0xeeeeee);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);

    // boxhelperGroup.name = "boxHelperContainer";
    // scene.add(boxhelperGroup);

}

function onObjectSelection(event) {

    event.preventDefault();

    if (!enableSelect || transformControl.dragging)
        return;


    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(entityGroup, true);
    if (intersects.length < 1) return void 0;


    const selected = intersects[0].object;

    if (currentSelected !== selected) {
        currentSelected !== null ? currentSelected.remove(boxhelperGroup) : void 0;
        boxhelperGroup.clear();
        currentSelected = selected;
        const boxHelper = new THREE.BoxHelper(selected, 0xFF0000);

        boxhelperGroup.add(boxHelper);
        currentBoxhelper = boxHelper;
        //scene.add(boxHelper);
        scene.add(boxhelperGroup);
        if (!lockedObjectSet.has(selected)) {
            transformControl.attach(selected);
        }

        updateInfoPanel();
        scaleSlider.setValue(currentSelected.scale.x * 10);

    }

    renderer.render(scene, camera);

}

// 锁定选中物体，被锁定的物体在选中时不会显示transsformControl组件.
function lockObject() {

    if (currentSelected !== null && !lockedObjectSet.has(currentSelected)) {
        lockedObjectSet.add(currentSelected);
        transformControl.detach();
    }
}

// 解锁选中的物体
function unlockObject() {

    if (currentSelected === null)
        return;

    if (lockedObjectSet.has(currentSelected))
        lockedObjectSet.delete(currentSelected);
}

// 更改transformControl的控制模式，mode可以是”translate"、”Rotate"、“Scale".
function changeTransformControlMode(transformControl, mode) {
    transformControl.setMode(mode);
}

function updateInfoPanel() {

    const infoPanel = document.getElementById("objectInfo");
    const positionInfo = document.getElementById("objectPosition");
    const rotationInfo = document.getElementById("objectRotate");
    const scaleInfo = document.getElementById("objectScale");

    infoPanel.textContent = "当前选中:" + getCurrentSelectedObjectName();
    positionInfo.textContent = "位置:" + getCurrentSelectedObjectPosition();
    rotationInfo.textContent = "旋转:" + getCurrentSelectedObjectRotation();
    scaleInfo.textContent = "缩放:" + getCurrentSelectedObjectScale();
}

function getCurrentSelectedObjectName() {
    if (currentSelected.parent.name === "naviGroup") {
        return "导航热点-" + currentSelected.name;
    } else if (currentSelected.parent.name === "panoGroup") {
        return "场景-" + currentSelected.name;
    } else if (currentSelected.parent.name === "mtlModel") {
        return "模型-" + currentSelected.name;
    }
}

function getCurrentSelectedObjectPosition() {
    let strX = (currentSelected.position.x).toString();
    let strY = (currentSelected.position.y).toString();
    let strZ = (currentSelected.position.z).toString();
    strX = strX.substring(0, strX.indexOf('.') + 3);
    strY = strY.substring(0, strY.indexOf('.') + 3);
    strZ = strZ.substring(0, strZ.indexOf('.') + 3);
    return "(" + strX + "," + strY + "," + strZ + ")";

}

function getCurrentSelectedObjectRotation() {
    let rotationX = rad2deg(currentSelected.rotation.x).toString();
    let rotationY = rad2deg(currentSelected.rotation.y).toString();
    let rotationZ = rad2deg(currentSelected.rotation.z).toString();
    rotationX = rotationX.substring(0, rotationX.indexOf('.') + 3) + "°";
    rotationY = rotationY.substring(0, rotationY.indexOf('.') + 3) + "°";
    rotationZ = rotationZ.substring(0, rotationZ.indexOf('.') + 3) + "°";

    return "(" + rotationX + "," + rotationY + "," + rotationZ + ")";
}

function getCurrentSelectedObjectScale() {

    let scaleX = currentSelected.scale.x.toString();
    let scaleY = currentSelected.scale.y.toString();
    let scaleZ = currentSelected.scale.z.toString();
    scaleX = scaleX.substring(0, scaleX.indexOf('.') + 3);
    scaleY = scaleY.substring(0, scaleY.indexOf('.') + 3);
    scaleZ = scaleZ.substring(0, scaleZ.indexOf('.') + 3);

    return "(" + scaleX + "," + scaleY + "," + scaleZ + ")";
}

function changeObjectScale(value) {

    if (currentSelected !== null) {
        currentSelected.scale.x = value / 10;
        currentSelected.scale.y = value / 10;
        currentSelected.scale.z = value / 10;
        updateInfoPanel();
    }

}

function onPrevButtonClick() {
    if (currentSelected === null)
        return;
    if (currentSelectedIndex === null) {

        initSelectedIndex();
        console.log(currentSelectedIndex);

    }
    selectPrevObject();
}

function onNextButtonClick() {
    if (currentSelected === null)
        return;
    if (currentSelectedIndex === null) {

        initSelectedIndex();
        console.log(currentSelectedIndex);
    }
    selectNextObject();
}

function initSelectedIndex() {

    if (currentSelected === null)
        return;

    for (let i = 0; i < entityArr.length; ++i) {

        if (entityArr[i] === currentSelected)
            currentSelectedIndex = i;
    }

}

function updateObjectByIndex(index) {

    currentSelected.remove(boxhelperGroup);
    boxhelperGroup.clear();
    currentSelected = entityArr[index];
    const boxHelper = new THREE.BoxHelper(currentSelected, 0xFF0000);

    boxhelperGroup.add(boxHelper);
    currentBoxhelper = boxHelper;
    //scene.add(boxHelper);
    scene.add(boxhelperGroup);
    if (!lockedObjectSet.has(currentSelected)) {
        transformControl.attach(currentSelected);
    }

    updateInfoPanel();
    scaleSlider.setValue(currentSelected.scale.x * 10);

}

function selectPrevObject() {

    if (currentSelectedIndex === 0)
        currentSelectedIndex = entityArr.length - 1;
    else
        currentSelectedIndex -= 1;

    updateObjectByIndex(currentSelectedIndex);
}

function selectNextObject() {

    if (currentSelectedIndex === entityArr.length - 1)
        currentSelectedIndex = 0;
    else
        currentSelectedIndex += 1;

    updateObjectByIndex(currentSelectedIndex);
}

layui.use('slider', function () {
    var slider = layui.slider;

    //渲染
    slider.render({
        elem: '#slideTest1'  //绑定元素
    });
    slider.render({
        elem: '#slideTest2'  //绑定元素
    });
    slider.render({
        elem: '#slideTest3' //绑定元素
    });
    slider.render({
        elem: '#slideTest4'
    })
    slider.render({
        elem: '#slideTest5'
    })
    slider.render({
        elem: '#slideTest6'
    })
    slider.render({
        elem: '#slideTest7'
    })
    slider.render({
        elem: '#slideTest8'
    })
    scaleSlider = slider.render({
        elem: "#slideScale",
        theme: '#1E9FFF',
        setTips: (value) => {
            return value / 10;
        },
        // min: 0.1,
        // max: 5.1,
        change: (value) => {
            changeObjectScale(value);
        }
    })
});

layui.use(['dropdown', 'jquery', 'layer'], () => {
    const dropdown = layui.dropdown;
    const $ = layui.$;
    const layer = layui.layer;

    dropdown.on('click(sceneEditMenu)', (options) => {
        let othis = $(this);
        if (options.id === 1) {
            // 添加模型

            // let sceneConfig = JSON.stringify(scene.toJSON());
            // const a = document.createElement("a");
            // a.href = window.URL.createObjectURL(new Blob([sceneConfig], {type: "application/json"}));
            // a.download = "project.json";
            // a.click();
            // console.log(sceneConfig);

            // updateObjectMatrix(scene);

            scene.updateMatrixWorld();
            scene.traverse((object) => {
                if (object.isMesh) {
                    object.updateMatrixWorld();
                    object.updateWorldMatrix();
                }
            });


            let sceneCopy = scene.clone();

            removeOtherObject(sceneCopy);

            removeTexture(sceneCopy);

            let sceneConfig = JSON.stringify(sceneCopy.toJSON());
            const a = document.createElement("a");
            a.href = window.URL.createObjectURL(new Blob([sceneConfig], {type: "application/json"}));
            a.download = "sceneCopy.json";
            a.click();
        } else if (options.id === 2) {
            // 添加场景

        } else if (options.id === 3) {
            // 添加热点

        } else if (options.id === 4) {
            // 开启选择模式

            transformControl.enabled = true;
            enableSelect = true;
            if (entityArr === null) {
                entityArr = getAllChildren(entityGroup);
            }

        } else if (options.id === 5) {
            // 开启移动物体模式
            //enableSelect = false;
            // transformControl.enabled = true;
            changeTransformControlMode(transformControl, "translate");

        } else if (options.id === 6) {
            // 开启旋转物体模式
            //enableSelect = false;
            // transformControl.enabled = true;
            changeTransformControlMode(transformControl, "rotate");

        } else if (options.id === 7) {
            // 开启缩放物体模式
            //enableSelect = false;
            // transformControl.enabled = true;
            changeTransformControlMode(transformControl, "scale");

        } else if (options.id === 8) {
            // 比例标定
            layer.open({
                title: '全景行走漫游比例标定',
                type: 1,
                btn: ['确认', '取消'],
                content: $('#scaleCalibrationInput'),
                icon: 1
            })
        } else if (options.id === 9) {
            // 保存全景漫游
            // layer.open({
            //     title: '保存全景行走漫游',
            //     type: 1,
            //     btn: ['确认', '取消'],
            //     content: $('#saveSuccess'),
            //     icon: 1
            //
            // });
            updateSceneConfig(scene, projectConfigurationUrl);
        } else if (options.id === 10) {
            // 清除场景
            scene.clear();
            console.log(scene, "after clear");
        } else if (options.id === 11) {
            // 打印选中物体信息(DEBUG)
            console.log(currentSelected);


        } else if (options.id === 12) {
            // 导出为gltf模型

            //renderer.outputEncoding = THREE.sRGBEncoding;

            exportGLTF(scene);
            // let sceneConfig = JSON.stringify(scene);
            // const a = document.createElement("a");
            // a.href = window.URL.createObjectURL(new Blob([sceneConfig], {type: "application/json"}));
            // a.download = "sceneCopy.json";
            // a.click();
            // showInfo(scene);
            // exportJsonTree(scene);

        } else if (options.id === 13) {
            // 从gltf导入场景
            recoverSceneFromJson(scene);
            const loader = new GLTFLoader().setPath('./user_source/newTest/');
            loader.load('scene.gltf', (gltf) => {

                scene.add(gltf.scene);
                renderer.outputEncoding = THREE.sRGBEncoding;
                console.log(scene);
                scene.traverse((object) => {
                    if (object.isMesh) {

                        const material = object.material;
                        if (material.map) material.map.encoding = THREE.sRGBEncoding;
                        if (material.emissiveMap) material.emissiveMap.encoding = THREE.sRGBEncoding;
                        if (material.sheenColorMap) material.sheenColorMap.encoding = THREE.sRGBEncoding;
                        if (material.specularColorMap) material.specularColorMap.encoding = THREE.sRGBEncoding;
                    }
                });

            })
        } else if (options.id === 14) {
            // step2json
            // saveGeometricTransformation2Json("scale",[-4,4,4]);
            // showInfo(scene);
            recoverSceneFromJson(scene);
            sceneConstructor(scene, '/user_source/newTest/sceneConfig.json', renderer, camera);
        } else if (options.id === 15) {
            // 锁定物体
            lockObject();

        }
    })
})


