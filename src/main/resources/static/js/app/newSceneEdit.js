import * as THREE from '../build/three.module.js';

import {DDSLoader} from '../lib/loaders/DDSLoader.js';
import {MTLLoader} from '../lib/loaders/MTLLoader.js';
import {OBJLoader} from '../lib/loaders/OBJLoader.js';
import {OrbitControls} from '../lib/controls/OrbitControls.js';
import {FirstPersonCameraControl} from '../lib/controls/firstPersonCameraControl.js';
import {DragControls} from "../lib/controls/DragControls.js"
import {TransformControls} from "../lib/controls/TransformControls.js"
import {Line2} from '../lib/lines/Line2.js';
import {LineMaterial} from '../lib/lines/LineMaterial.js';
// import { LineGeometry } from './js/lib/lines/LineGeometry.js';
// import { LineSegments2 } from './js/lib/lines/LineSegments2.js';
import {LineSegmentsGeometry} from '../lib/lines/LineSegmentsGeometry.js';
import {GLTFLoader} from '../lib/loaders/GLTFLoader.js';
import {GLTFExporter} from "../lib/exporters/GLTFExporter.js"
import {getAllChildren, rad2deg} from "../app/util.js"


import {sceneConstructor} from "./sceneConstructor.js"

let container = document.getElementById("sceneContainer");

let camera, scene, renderer;
let scene2;


let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// 将模型的中心点设置到canvas坐标系的中心点，保证模型显示是居中的，object就是操作的目标模型
let box;// 获取模型的包围盒
let orbitControls, firstPerson;
let pano_group = new THREE.Group();
let navi_circles = new THREE.Group();
let circles;
let shaderMaterial = [];
let panorama_1;
let panorama_2;
let panorama_3;
let panorama_4;
let panorama_5;
let navi_pos1;
let navi_pos2;
let navi_pos3;
let navi_pos4;
let navi_pos5;
let map;
let currentPano;
let nextPano;
let transitionFlag = false;
//映射比例
let scale = 2.0;
const rangings = new Array();
const materials_1 = [];
const materials_2 = [];
const materials_3 = [];
const materials_4 = [];
const materials_5 = [];
const M_PI = 3.1415926;
let front = null;
let end = null;
let geometryLine;
let materialLine = null;
let insetWidth;
let insetHeight;
let tilesWidth;
let eqrWidth;
let eqrHeight;
let pos1;
let pos2;
const enableSelection = true;

let group = new THREE.Group();
let dragControl;
let dragObjects;
let transformControl;
let objectAttachArr;
let entityGroup;
let entityArr = null;
let boxhelperGroup = new THREE.Group();
let currentSelected = null;
let currentSelectedIndex = null;
let currentBoxhelper = null;
let lockedObjectSet = new Set();
let enableSelect = false;
let scaleSlider = null;


document.time = 0;

const params = {
    trs: false,
    onlyVisible: false,
    binary: false,
    maxTextureSize: 4096,
    embedImages: false
}

initScene();
animate();

function initScene() {

    scene = new THREE.Scene();
    scene2 = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;

    container.appendChild(renderer.domElement);

    initLightAndHelper();

    scene.add(camera);

    entityGroup = new THREE.Group();
    pano_group.name = "pano_group";
    navi_circles.name = "navi_circles";
    entityGroup.name = "sceneEntity";
    entityGroup.add(navi_circles);
    entityGroup.add(pano_group);
    scene.add(entityGroup);

    loadModel(entityGroup);
    loadSkyboxGroup();
    loadNaviGroup();

    map = {
        pos1: panorama_1,
        pos2: panorama_2,
        pos3: panorama_3,
        pos4: panorama_4,
        pos5: panorama_5
    };

    initControls();

    // 这个事件绑定到 renderer.domElement 而不能绑定到全局的window上，否则在点击右侧菜单操作时也会误触发事件，导致场景中选中物体发生变化.
    renderer.domElement.addEventListener('pointerdown', onObjectSelection);

    window.addEventListener('resize', onWindowResize);
    // window.addEventListener("pointerdown", onPointerSelect);
    console.log(scene, "after initscene");

    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    prevButton.addEventListener('click', onPrevButtonClick);
    nextButton.addEventListener('click', onNextButtonClick);


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

    boxhelperGroup.name = "boxHelperContainer";
    scene.add(boxhelperGroup);

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

function loadSkyboxGroup() {

    let position_1 = new THREE.Vector3();
    let position_2 = new THREE.Vector3();
    let position_3 = new THREE.Vector3();
    let position_4 = new THREE.Vector3();
    let position_5 = new THREE.Vector3();
    position_1.set(0.7, -1.2, -4.5);
    position_2.set(0.7, -1.2, -7);
    position_3.set(-1.8, -1.2, -7);
    position_4.set(0.7, -1.2, -2);
    position_5.set(0.7, -1.2, 0.5);

    let textures_1 = getTexturesFromAtlasFile("/user_source/newTest/3.png", 6);
    let textures_2 = getTexturesFromAtlasFile("/user_source/newTest/4.png", 6);
    // let textures_1 = getTexturesFromAtlasFile("/user_source/newTest/1_compress.png", 6);
    // let textures_2 = getTexturesFromAtlasFile("/user_source/newTest/2_compress.png", 6);
    let textures_3 = getTexturesFromAtlasFile("/user_source/newTest/5.png", 6);
    let textures_4 = getTexturesFromAtlasFile("/user_source/newTest/2.png", 6);
    let textures_5 = getTexturesFromAtlasFile("/user_source/newTest/1.png", 6);
    panorama_1 = getPanorama(materials_1, textures_1, textures_2, position_1);
    panorama_2 = getPanorama(materials_2, textures_2, textures_1, position_2);
    panorama_3 = getPanorama(materials_3, textures_3, textures_2, position_3);
    panorama_4 = getPanorama(materials_4, textures_4, textures_2, position_4);
    panorama_5 = getPanorama(materials_5, textures_5, textures_2, position_5);
    panorama_1.name = 'pos1';
    panorama_2.name = 'pos2';
    panorama_3.name = 'pos3';
    panorama_4.name = 'pos4';
    panorama_5.name = 'pos5';
    pano_group.add(panorama_1);
    pano_group.add(panorama_2);
    pano_group.add(panorama_3);
    // pano_group.add(panorama_4);
    // pano_group.add(panorama_5);
    pano_group.visible = true;
    //scene.add(pano_group);
    // mesh.translateY(250);

}

function loadNaviGroup() {

    //场景切换
    navi_pos1 = new THREE.Vector3();
    navi_pos1.set(0.7, -1.2, -4.5);
    const navi_circle1 = getNaviCircle(navi_pos1);
    navi_pos2 = new THREE.Vector3();
    navi_pos2.set(0.7, -1.2, -7);
    const navi_circle2 = getNaviCircle(navi_pos2);
    navi_pos3 = new THREE.Vector3();
    navi_pos3.set(-1.8, -1.2, -7);
    const navi_circle3 = getNaviCircle(navi_pos3);
    navi_pos4 = new THREE.Vector3();
    navi_pos4.set(0.7, -1.2, -2);
    const navi_circle4 = getNaviCircle(navi_pos4);
    navi_pos5 = new THREE.Vector3();
    navi_pos5.set(0.7, -1.2, 0.5);
    const navi_circle5 = getNaviCircle(navi_pos5);
    navi_circle1.name = 'pos1';
    navi_circle2.name = 'pos2';
    navi_circle3.name = 'pos3';
    navi_circle4.name = 'pos4';
    navi_circle5.name = 'pos5';
    navi_circles.add(navi_circle1);
    navi_circles.add(navi_circle2);
    navi_circles.add(navi_circle3);
    navi_circles.add(navi_circle4);
    navi_circles.add(navi_circle5);
    //scene.add(navi_circles);
    navi_circles.visible = true;
    circles = [navi_circle1, navi_circle2, navi_circle3, navi_circle4, navi_circle5];

}

function getPanorama(materials, textures_1, textures_2, vet3) {
    for (let i = 0; i < 6; i++) {
        materials.push(new THREE.ShaderMaterial({
            uniforms: {
                texture1: {
                    value: textures_1[i]
                },
                //用于渐变的纹理
                texture2: {
                    value: textures_2[i]
                },
                Uprogress: {
                    value: 0
                },
                alpha: {
                    value: 1
                },
            },
            // 顶点着色器
            vertexShader: document.getElementById('vertexShader').textContent,
            // 片元着色器
            fragmentShader: document.getElementById('fragmentShader').textContent,
            transparent: true,
            depthTest: false
        }))
    }
    // for (let i = 0; i < 6; i++) {

    // 	materials.push(new THREE.MeshBasicMaterial({ map: textures_1[i] }));
    // 	// console.log(textures[i].id)
    // 	// console.log(textures[i].mapping);
    // 	// console.log(textures[i].matrix);

    // }

    const skyBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
    skyBox.geometry.scale(1, 1, -1);
    // skyBox.scale.set(2.43, 2.43, 2.43);
    // skyBox.rotateX(90 / 180 * Math.PI);
    // skyBox.rotateY(180 * Math.PI);


    skyBox.scale.x = 2.43;
    skyBox.scale.y = 2.43;
    skyBox.scale.z = 2.43;

    skyBox.rotation.x = 0.5 * Math.PI;
    skyBox.rotation.y = 180 * Math.PI;

    skyBox.position.copy(new THREE.Vector3(vet3.x, vet3.y + 1.2, vet3.z));
    skyBox.visible = true;
    // skyBox.renderOrder = 10;
    return skyBox;
}

function getNaviCircle(vector3) {
    const geometry_circle = new THREE.CircleBufferGeometry(0.3, 20, 0, 2 * Math.PI);


    geometry_circle.scale(-4, 4, 4);


    //定义白点的材质
    const mesh_circle = new THREE.Mesh(geometry_circle,
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/images/circle.png'),
            transparent: true,
            depthTest: false
        }));


    mesh_circle.rotation.x = Math.PI / 2;
    mesh_circle.position.copy(vector3);
    //mesh_circle.renderOrder = 11;

    return mesh_circle;
}

function loadModel(parentObject) {

    const manager = new THREE.LoadingManager();
    manager.addHandler(/\.dds$/i, new DDSLoader());
    let model, panoram, obj;

    new MTLLoader(manager)
        .setPath('./user_source/newTest/')
        .load('1.mtl', function (materials) {

            materials.preload();

            new OBJLoader(manager)
                .setMaterials(materials)
                .setPath('./user_source/newTest/')
                .load('1.obj', function (object) {
                    model = object;
                    obj = model;
                    obj.name = "mtlModel";
                    model.rotateY(90 / 180 * Math.PI);

                    //obj.rotateX(3/180*Math.PI);
                    obj.rotateY(180 / 180 * Math.PI)
                    console.log(object.position);
                    parentObject.add(object);
                }, onProgress, onError);

        });

    const onProgress = (xhr) => {


    };

    const onError = () => {

    }

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

// 测距功能实现.
function onPointerSelect(event) {
    // pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    // pointer.y = (event.clientY / window.innerHeight) * (-2) + 1;
    // console.log("clientX: " + event.clientX + ' clientY: ' + event.clientY);
    console.log("----------uv mapping---------------");
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    //console.log(mouse, "mouse");

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(pano_group, true);


    if (intersects.length <= 0) return void 0;
    const selected = intersects[0].object;

    console.log(intersects[0]);
    console.log(intersects[0].point, "===");
    console.log("uv  x: " + intersects[0].uv.x + " y:" + intersects[0].uv.y);
    //console.log(intersects[0].face,"face");
    console.log(front, "front")
    if (front === null) {
        console.log("draw front");
        front = intersects[0].point;
        const geometry = new THREE.SphereGeometry(0.01);
        const material = new THREE.MeshBasicMaterial({
            //map: new THREE.TextureLoader().load('static/images/circle.png'),
            color: 0xFFFFFF,
            transparent: true,
            depthTest: false,
            opacity: 0.5,
        });
        const sphereFront = new THREE.Mesh(geometry, material);
        sphereFront.position.set(front.x, front.y, front.z);
        sphereFront.scale.set(1, 1, 1);

        // sphereFront.position.set(0, 0, 0);
        scene2.add(sphereFront);
    } else {
        console.log("draw end");
        //let lineX = new THREE.Object3D();
        end = intersects[0].point;
        const geometry = new THREE.SphereGeometry(0.01);
        const material = new THREE.MeshBasicMaterial({
            //map: new THREE.TextureLoader().load('static/images/circle.png'),
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.5,
            depthTest: false
        });
        const sphereEnd = new THREE.Mesh(geometry, material);
        sphereEnd.scale.set(1, 1, 1);
        sphereEnd.position.set(end.x, end.y, end.z);

        scene2.add(sphereEnd);

        // const pointsX = [];
        // pointsX.push(new THREE.Vector3(front.x, front.y, front.z));
        // pointsX.push(new THREE.Vector3(end.x, end.y, end.z));

        // const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
        // const materialX = new THREE.LineDashedMaterial({
        // 	color: 0x3399FF,
        // 	linewidth: 3,
        // 	scale: 3,
        // 	dashSize: 3,
        // 	gapSize: 1,
        // });
        // lineX = new THREE.Line(geometryX, materialX);
        // // lineX.scale.x = lineX.scale.y = lineX.scale.z = 5;
        // scene.add(lineX);

        geometryLine = new LineSegmentsGeometry();

        let positionArr = [front.x, front.y, front.z, end.x, end.y, end.z];

        geometryLine.setPositions(positionArr);
        materialLine = new LineMaterial({
            color: 0xFFFFFF,
            linewidth: 1,
            transparent: true,
            opacity: 0.5,
            dashed: true

        })

        insetWidth = window.innerWidth / 4;
        insetHeight = window.innerHeight / 4;

        materialLine.resolution.set(insetWidth, insetHeight);

        let line = new Line2(geometryLine, materialLine);

        line.computeLineDistances();

        scene2.add(line);

        // var spriteTag = makeTextSprite("123cm",
        // 	{
        // 		fontsize: 15,
        // 		borderColor: { r: 255, g: 255, b: 255, a: 0.4 },/* 边框黑色 */
        // 		backgroundColor: { r: 255, g: 255, b: 255, a: 0.9 }/* 背景颜色 */
        // 	});
        // spriteTag.center = new THREE.Vector2(0, 0);

        // //spriteTag.position.set((front.x+end.x)/2, (front.y+end.y)/2, (front.z+end.z)/2);
        // spriteTag.position.set(0, 0, 0);

        var spritey = makeTextSprite(" 0.7 ",
            {
                fontsize: 17,
                borderColor: {r: 255, g: 255, b: 255, a: 0.5},
                backgroundColor: {r: 255, g: 255, b: 255, a: 0.5}
            });

        spritey.scale.set(0.8, 0.4, 1);
        //spritey.position.set((front.x+end.x)/2, (front.y+end.y)/2, (front.z+end.z)/2);

        spritey.center = new THREE.Vector2(0, 0);
        //scene.add(spritey);
        //spritey.position.set(0,-1,0);
        const spriteyRot = new THREE.Euler();
        spriteyRot.setFromVector3(new THREE.Vector3((end.x - front.x), (end.y - front.y), (end.z - front.z)));
        spritey.setRotationFromEuler(spriteyRot);
        scene2.add(spritey);
        spritey.position.set((front.x + end.x) / 2, (front.y + end.y) / 2 - 0.4, (front.z + end.z) / 2);
        console.log(front, 'front');
        console.log(end, 'end');
        console.log(spritey, "spriety");
        console.log(line, 'line');

        front = null;
        end = null;

    }

    // const x1 = (event.clientX / window.innerWidth) * 2 - 1;
    // const y1 = -(event.clientY / window.innerHeight) * 2 + 1;
    // const stdVector = new THREE.Vector3(x1, y1, 0.5);
    // const worldVector = stdVector.unproject(camera);


    /**
     *  获取点击的点所在面的贴图索引,由于天空盒进行了旋转，这个索引与实际的空间几何上的面索引并不相同.
     *    0:pos-x
     *  1:neg-x
     *  2:pos-y
     *  3:neg-y
     *  4:pos-z
     *  5:neg-z
     */
    let direction = intersects[0].face.materialIndex;


    let face = ["pos-x", "neg-x", "pos-y", "neg-y", "pos-z", "neg-z"];
    console.log(face[direction]);


}

function onSelection(event) {

    event.preventDefault();
    orbitControls.enabled = false;

    if (enableSelection === true) {

        const draggableObjects = objectAttachArr;
        draggableObjects.length = 0;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersections = raycaster.intersectObjects(draggableObjects, true);

        if (intersections.length > 0) {

            const object = intersections[0].object;

            if (group.children.includes(object) === true) {

                object.material.emissive.set(0x000000);
                scene.attach(object);

            } else {

                object.material.emissive.set(0xaaaaaa);
                group.attach(object);

            }

            dragControl.transformGroup = true;
            draggableObjects.push(group);

        }

        if (group.children.length === 0) {

            dragControl.transformGroup = false;
            draggableObjects.push(...dragObjects);

        }

    }

    renderer.render(scene, camera);
    // orbitControls.enabled = true;

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
    // if (currentSelected === null) {
    //     currentSelected = selected;
    //     const boxHelper = new THREE.BoxHelper(selected, 0xffff00);
    //
    //     boxhelperGroup.add(boxHelper);
    //     //scene.add(boxHelper);
    //     selected.add(boxhelperGroup);
    //     transformControl.attach(selected);
    // } else if (currentSelected !== selected) {
    //     currentSelected.remove(boxhelperGroup);
    //     boxhelperGroup.clear();
    //     currentSelected = selected;
    //     const boxHelper = new THREE.BoxHelper(selected, 0xffff00);
    //
    //     boxhelperGroup.add(boxHelper);
    //     //scene.add(boxHelper);
    //     selected.add(boxhelperGroup);
    //     transformControl.attach(selected);
    // }
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


function makeTextSprite(message, parameters) {

    if (parameters === undefined) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ?
        parameters["fontface"] : "Arial";

    /* 字体大小 */
    var fontsize = parameters.hasOwnProperty("fontsize") ?
        parameters["fontsize"] : 18;

    /* 边框厚度 */
    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
        parameters["borderThickness"] : 4;

    /* 边框颜色 */
    var borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : {r: 0, g: 0, b: 0, a: 1.0};

    /* 背景颜色 */
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : {r: 255, g: 255, b: 255, a: 1.0};

    /* 创建画布 */
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    /* 字体加粗 */
    context.font = "Bold " + fontsize + "px " + fontface;

    /* 获取文字的大小数据，高度取决于文字的大小 */
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    /* 背景颜色 */
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
        + backgroundColor.b + "," + backgroundColor.a + ")";

    /* 边框的颜色 */
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
        + borderColor.b + "," + borderColor.a + ")";
    context.lineWidth = borderThickness;

    /* 绘制圆角矩形 */
    roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);

    /* 字体颜色 */
    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    /* 画布内容用于纹理贴图 */
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({map: texture});
    var sprite = new THREE.Sprite(spriteMaterial);

    // console.log(sprite.spriteMaterial);

    /* 缩放比例 */
    sprite.scale.set(10, 5, 1);

    return sprite;

}

/* 绘制圆角矩形 */
function roundRect(ctx, x, y, w, h, r) {

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

}

function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {

    const textures = [];

    for (let i = 0; i < tilesNum; i++) {

        textures[i] = new THREE.Texture();

    }

    new THREE.ImageLoader()
        .load(atlasImgUrl, (image) => {

            let canvas, context;
            const tileWidth = image.height;
            tilesWidth = tileWidth;
            eqrHeight = 2 * tileWidth;
            eqrWidth = 2 * eqrHeight;

            for (let i = 0; i < textures.length; i++) {

                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
                canvas.height = tileWidth;
                canvas.width = tileWidth;
                context.drawImage(image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
                textures[i].image = canvas;
                textures[i].needsUpdate = true;

            }

        });

    return textures;

}

function animate() {

    requestAnimationFrame(animate);
    if (orbitControls.enabled) orbitControls.update();
    // if(firstperson.enabled) firstperson.update();
    if (materialLine !== null) {
        materialLine.resolution.set(insetWidth, insetHeight);
    }

    // if (currentSelected !== null && currentBoxhelper !== null) {
    //     currentBoxhelper.setFromObject(currentSelected);
    // }

    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(scene2, camera);
    //TWEEN.update();

}

// 在保存场景为json文件时，移除全景天空盒与热点以外的元素.
function removeOtherObject(sceneCopy) {

    const object3dRemoveArr = [];

    for (const object3d of sceneCopy.children) {

        if (object3d.name === "mtlModel") {
            object3dRemoveArr.push(object3d);
        }
    }

    for (const object3d of object3dRemoveArr) {
        sceneCopy.remove(object3d);
    }

}

function removeMeshTexture(mesh) {
    mesh.material = new THREE.MeshBasicMaterial();
}

// 保存场景为json文件时，Three.js默认会将图片纹理以base64编码二进制形式存入json文件中，导致json文件体积过大，加载读取速度过慢，不便于传输存储
// 为了减小json文件体积，在保存场景为json时，先移除天空盒纹理，在导入场景时重新恢复纹理.
function removeSkyboxTexture(skybox) {

    // let sceneConfig = JSON.stringify(skybox.toJSON());
    // const a = document.createElement("a");
    // a.href = window.URL.createObjectURL(new Blob([sceneConfig], {type: "application/json"}));
    // a.download = "skybox.json";
    // a.click();
    removeMeshTexture(skybox);


}

function removeMTLModelTexture(model) {


    // let sceneConfig = JSON.stringify(skybox.toJSON());
    // const a = document.createElement("a");
    // a.href = window.URL.createObjectURL(new Blob([sceneConfig], {type: "application/json"}));
    // a.download = "skybox.json";
    // a.click();
    removeMeshTexture(model);

}

function removeNaviCircleTexture(navi) {

    removeMeshTexture(navi);

}

function removeTexture(scene) {

    for (const object3d of scene.children) {
        if (object3d.name === "pano_group") {

            for (const skybox of object3d.children) {
                removeSkyboxTexture(skybox);
            }
        } else if (object3d.name === "navi_circles") {
            // for (const navi of object3d.children) {
            //     removeNaviCircleTexture(navi);
            // }
        }
    }

}

// 从json文件导入场景时恢复根据skybox的 'name' 属性恢复skybox图片纹理.
function recoverSkyboxTexture(skybox) {

    const materials = [];

    const prefix = "/user_source/newTest/texture/";
    const fileName = skybox.name;
    const filePath = prefix + fileName + ".png";
    const textures_1 = getTexturesFromAtlasFile(filePath, 6);


    for (let i = 0; i < 6; i++) {
        materials.push(new THREE.ShaderMaterial({
            uniforms: {
                texture1: {
                    value: textures_1[i]
                },
                //用于渐变的纹理
                texture2: {
                    value: textures_1[i]
                },
                Uprogress: {
                    value: 0
                },
                alpha: {
                    value: 1
                }
            },
            // 顶点着色器
            vertexShader: document.getElementById('vertexShader').textContent,
            // 片元着色器
            fragmentShader: document.getElementById('fragmentShader').textContent,
            transparent: true,
            depthTest: false
        }))
    }

    skybox.material = materials;
    skybox.geometry.scale(1, 1, -1);


}

function recoverNaviCircleTexture(navi) {


    navi.material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/images/circle.png'),
        transparent: true,
        depthTest: false
    });

}

function recoverTexture(scene) {

    for (const object3d of scene.children) {
        if (object3d.name === "pano_group") {
            for (const skybox of object3d.children) {
                recoverSkyboxTexture(skybox);
            }
        } else if (object3d.name === "navi_circles") {

            // for (const navi of object3d.children) {
            //     recoverNaviCircleTexture(navi);
            // }

        }

    }
}

function exportJson(scene) {

    for (const object3d of scene.children) {
        const fileName = object3d.name !== "" ? object3d.name : object3d.type;
        let object2Json = JSON.stringify(object3d);
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([object2Json], {type: "application/json"}));
        a.download = fileName + ".json";
        a.click();
    }
}

function showInfo(object, parentName = "") {
    const name = object.name !== "" ? object.name : object.type;
    const fullName = (parentName === "" ? "" : (parentName + "-")) + name;
    if (object.children.length > 0) {
        for (let i = 0; i < object.children.length; ++i) {
            showInfo(object.children[i], fullName);
        }
    }
    console.log(object, fullName);
}

function exportJsonTree(object, parentName = "") {

    const name = object.name !== "" ? object.name : object.type;
    const fullName = (parentName === "" ? "" : (parentName + "-")) + name;
    if (object.children.length > 0) {
        for (let i = 0; i < object.children.length; ++i) {
            exportJsonTree(object.children[i], fullName);
        }
    } else {

        let object2Json = object;
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([object2Json], {type: "application/json"}));
        a.download = fullName + ".json";
        a.click();

    }

}

function exportGLTF(input) {

    const gltfExporter = new GLTFExporter();

    const options = {
        trs: params.trs,
        onlyVisible: params.onlyVisible,
        binary: params.binary,
        maxTextureSize: params.maxTextureSize,
        embedImages: params.embedImages
    };
    gltfExporter.parse(
        input,
        function (result) {

            if (result instanceof ArrayBuffer) {

                saveArrayBuffer(result, 'scene.glb');

            } else {

                const output = JSON.stringify(result, null, 2);
                console.log(output);
                saveString(output, 'scene.gltf');

            }

        },
        function (error) {

            console.log('An error happened during parsing', error);

        },
        options
    );
    // gltfExporter.parse(scene, (gltf) => {
    //     const gltfBlob = new Blob([JSON.stringify(gltf), {type: 'application/object-stream'}]);
    //     save(gltfBlob, "gltf");
    //
    //     gltfExporter.parse(scene, (glb) => {
    //         const glbBlob = new Blob([glb], {
    //             type: 'application/octet-stream'
    //         });
    //         save(glbBlob, "glb");
    //     }, {...options, binary: true});
    //
    // })

}

function saveString(text, filename) {

    save(new Blob([text], {type: 'text/plain'}), filename);

}

function saveArrayBuffer(buffer, filename) {

    save(new Blob([buffer], {type: 'application/octet-stream'}), filename);

}

function save(blob, filename) {

    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...

}

function saveGeometricTransformation2Json(transformationType, parameter, jsonFile) {

    const data = {"type": transformationType, "parameter": toString(parameter)};
    fetch("./user_source/newTest/sceneInfo.json")
        .then((response) => response.json())
        .then((json) => {
            json.push(data);
            json.close();
        })


}

function recoverSceneFromJson(scene) {

    // const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    // scene.add(ambientLight);
    //
    // const pointLight = new THREE.PointLight(0xffffff, 0.8);
    // camera.add(pointLight);

    scene.add(camera);
    //renderer.needsUpdate = true;
}

// 更新调试面板信息.
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
    if (currentSelected.parent.name === "navi_circles") {
        return "导航热点-" + currentSelected.name;
    } else if (currentSelected.parent.name === "pano_group") {
        return "场景-" + currentSelected.name;
    } else if (currentSelected.parent.name === "mtlModel") {
        return "模型" + currentSelected.name;
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
            layer.open({
                title: '保存全景行走漫游',
                type: 1,
                btn: ['确认', '取消'],
                content: $('#saveSuccess'),
                icon: 1

            });
        } else if (options.id === 10) {
            // 清除场景
            scene.clear();
            console.log(scene, "after clear");
        } else if (options.id === 11) {
            // 从json文件中恢复场景

            loadModel();

            fetch('./user_source/newTest/sceneWithLight.json')
                .then(data => data.json())
                .then((data) => {
                        const loader = new THREE.ObjectLoader();
                        scene = loader.parse(data);
                        recoverTexture(scene);
                        recoverSceneFromJson(scene);
                        console.log(scene);
                    }
                )


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
            sceneConstructor(scene, './user_source/newTest/sceneConfig.json', renderer, camera);
        } else if (options.id === 15) {
            // 锁定物体

            lockObject();

        }
    })
})