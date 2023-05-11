import * as THREE from '/js/build/three.module.js';

import {OrbitControls} from '/js/lib/controls/OrbitControls.js';
import {FirstPersonCameraControl} from '/js/lib/controls/firstPersonCameraControl.js';

import {getSkyboxArr, getNaviCircleArr, getModelArr, genObjectMap} from "/js/app/util.js"

import {sceneConstructor} from "/js/app/sceneConstructor.js"
import {GUI} from '/js/lib/dat.gui.module.js';

const configurationFileId = sessionStorage.getItem("configurationFileId");
const userId = sessionStorage.getItem("userId");
const projectConfigurationUrl = "/project/getEditSources/" + userId + "/" + configurationFileId + "/" + "projectConfig.json";

let container = document.getElementById("sceneContainer");

let camera, scene, scene2, renderer;

let orbitControls, firstPerson;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let insetWidth;
let insetHeight;

let entityGroup = null;
let currentPano = null;
let nextPano = null;
let skyboxMap = null;

init();
animate();

function init() {

    scene = new THREE.Scene();
    scene2 = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;

    container.appendChild(renderer.domElement);

    scene.add(camera);
    entityGroup = new THREE.Group();
    entityGroup.name = "sceneEntity";
    entityGroup.isTourMode = true;

    sceneConstructor(scene, entityGroup, projectConfigurationUrl);

    initControls();
    initLightAndHelper();
    initDebugGui(camera);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onNaviClick);

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

    TWEEN.update();

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
    orbitControls.enabled = false;

    firstPerson = new FirstPersonCameraControl(camera, renderer.domElement);
    firstPerson.enabled = true;
    firstPerson.applyGravity = false;
    firstPerson.applyCollision = false;
    camera.position.set(0, 0, -4.5);

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

}

/**
 * @brief 初始化THREE.js调试GUI
 */
function initDebugGui(camera) {
    let gui = new GUI();
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'x', 0, 10);
    cameraFolder.add(camera.position, 'y', 0, 10);
    cameraFolder.add(camera.position, 'z', 0, 10)
    cameraFolder.open()
    let settings = {
        showCameraPos: false,
    };
    // gui.add(settings,"firstPerson",false).onChange(onControlChange);
    gui.add(settings, "showCameraPos", false).onChange(onShowCameraPos);
}

function onShowCameraPos() {
    console.log(camera);
}

/**
 * @brief 场景导航热点切换过渡效果方法
 * @param event
 * @returns {*}
 */
function onNaviClick(event) {

    if (skyboxMap === null) {
        const skyboxArr = getSkyboxArr(scene);
        skyboxMap = genObjectMap(skyboxArr);
        if (currentPano === null) {
            currentPano = skyboxArr[0];
            console.log(currentPano, "currentPano");
        }
    }

    var subV = new THREE.Vector3;
    event.preventDefault();

    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    let circles;
    for (const objGroup of entityGroup.children) {
        if (objGroup.name === 'naviGroup') {
            circles = objGroup;
        }
    }

    const intersects = raycaster.intersectObject(circles, true);

    if (intersects.length < 1) return void 0;

    let selected = intersects[0];//取第一个物体
    console.log(selected.object, "selected obj");
    nextPano = skyboxMap.get(selected.object.map);
    console.log(nextPano, 'nextpano');
    var panoFlag;
    let startPosition = camera.position.clone();
    startPosition.y = nextPano.y;
    let endPosition = new THREE.Vector3(nextPano.position.x, nextPano.position.y, nextPano.position.z);
    let cameraPos = camera.position.clone();
    camera.lookAt(endPosition.x, endPosition.y, endPosition.z);
    nextPano.visible = true;
    //navi_circles.visible=false;
    const tweenA = new TWEEN.Tween(cameraPos).to(endPosition, 1200).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
        let vector = new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z);
        camera.position.copy(vector);
        let tempPositon = new THREE.Vector3(vector.x, nextPano.position.y ,vector.z);
        let totalLength = subV.subVectors(startPosition, endPosition).length();
        let progressLength = subV.subVectors(tempPositon, endPosition).length();
        let v = progressLength / totalLength
    }).onComplete(function () {
        //console.log(navi_circles[0]);
        currentPano.visible = false;
        currentPano = nextPano;
        nextPano = null;
        //	navi_circles.visible=true;
    });
    let scale_begin = {x: 3.3, y: 4.9, z: 3.3};
    let scale_end = {x: 2.2, y: 2.2, z: 2.2};
    const tweenB = new TWEEN.Tween(scale_begin).to(scale_end, 800).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
        if (panoFlag === 0) {
            //panorama_1.scale.set(scale_begin.x,scale_begin.y,scale_begin.z);
            panorama_1.scale.set(3.3, 4.9, 3.3);
        } else {
            panorama_2.scale.set(3.3, 4.9, 3.3);
            //panorama_2.scale.set(scale_begin.x,scale_begin.y,scale_begin.z);
        }
    }).onComplete(function () {
        panorama_1.scale.set(2.2, 2.2, 2.2);
        panorama_2.scale.set(2.2, 2.2, 2.2)
    });
    const tween = new TWEEN.Tween();
    tween.chain(tweenA, tweenB);
    tweenA.start();

}
