import * as THREE from '/js/build/three.module.js';

import {OrbitControls} from '/js/lib/controls/OrbitControls.js';
import {FirstPersonCameraControl} from '/js/lib/controls/firstPersonCameraControl.js';
import {Line2} from '/js/lib/lines/Line2.js';
import {LineMaterial} from '/js/lib/lines/LineMaterial.js';
import {LineSegmentsGeometry} from '/js/lib/lines/LineSegmentsGeometry.js';

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
let pos1;
let pos2;
let tilesWidth = 512;
let eqrHeight = 2 * tilesWidth;
let eqrWidth = 2 * eqrHeight;

let enableDistanceMeasurementFlag = false;
let front = null;
let end = null;
let geometryLine;
let materialLine = null;
const lineGroup = new THREE.Group();

/**
 * Definition of Rotation Matrix for adjusting uv mapping.
 */
let rotation = [new THREE.Matrix3(), new THREE.Matrix3(), new THREE.Matrix3(), new THREE.Matrix3(), new THREE.Matrix3(), new THREE.Matrix3()];

// COUNTERCLOCKWISE  PI / 2.
rotation[0].set(
    0, -1, 1,
    1, 0, 0,
    0, 0, 1
);

// CLOCKWISE PI / 2.
rotation[1].set(
    0, 1, 0,
    -1, 0, 1,
    0, 0, 1
);

// PI
rotation[2].set(
    -1, 0, 1,
    0, -1, 1,
    0, 0, 1
);

rotation[3].set(
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
);

rotation[4].set(
    0, 1, 0,
    -1, 0, 1,
    0, 0, 1
)
// CLOCKWISE PI / 2.
rotation[5].set(
    0, 1, 0,
    -1, 0, 1,
    0, 0, 1
)

// rotation array for adjusting projection.
let Euler = [
    eul2rotm(0, 0, Math.PI),
    eul2rotm(0, 0, 0),
    eul2rotm(0, 0, Math.PI / 2),
    eul2rotm(0, 0, -Math.PI / 2),
    eul2rotm(Math.PI / 2, 0, 0),
    eul2rotm(-Math.PI / 2, 0, 0)
];

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
    //initDebugGui(camera);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onNaviClick);

    scene.add(lineGroup);
    document.getElementById("measureDistanceButton").addEventListener('click', onMeasureDistance);

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
 * 开启或关闭测距功能
 */
function onMeasureDistance() {
    // 开启测距功能，初始化
    if (!enableDistanceMeasurementFlag) {
        front = null;
        end = null;
        window.removeEventListener('click', onNaviClick);
        window.addEventListener('dblclick', onPointerSelect);
        // 关闭测距功能
    } else {
        scene2.clear();
        lineGroup.clear();
        window.removeEventListener('dblclick', onPointerSelect);
        window.addEventListener('click', onNaviClick);
    }

    enableDistanceMeasurementFlag = !enableDistanceMeasurementFlag;
}

/**
 * 给定所选点在CubeMap投影上的坐标和面索引，计算所选点在原始Equirectangular投影全景图上的坐标
 * @param x
 * @param y
 * @param face
 * @returns {number[]}
 */
function reProjection(x, y, face) {

    console.log("----------------rePrrojection-------------------");

    let position = new THREE.Vector2(x, y);

    position.applyMatrix3(rotation[face]);
    console.log("recover uv mapping");
    console.log(position.x, position.y);
    position.multiplyScalar(tilesWidth);
    console.log(position.x, position.y);
    console.log("face: " + face);
    position.x = tilesWidth - 1 - position.x;


    let worldPos = new THREE.Vector3(
        2 * position.x / tilesWidth - 1,
        1,
        2 * position.y / tilesWidth - 1
    );
    console.log("worldPos");
    console.log(worldPos.x);
    console.log(worldPos.y);
    console.log(worldPos.z);


    console.log("Euler");
    console.log(Euler[face]);
    worldPos.applyMatrix3(Euler[face]);
    console.log("worldPos after Euler");
    console.log(worldPos.x);
    console.log(worldPos.y);
    console.log(worldPos.z);


    const longitude = Math.atan2(worldPos.y, worldPos.x);
    const latitude = Math.atan2(worldPos.z, Math.sqrt(worldPos.x * worldPos.x + worldPos.y * worldPos.y));
    console.log("Lontitude & Latitude");
    console.log(longitude);
    console.log(latitude);


    const equireRectX = (eqrWidth * (longitude + Math.PI)) / (2 * Math.PI);
    const equireRectY = (eqrHeight * (latitude + Math.PI / 2)) / Math.PI;

    console.log("position");

    console.log("eqrX: " + equireRectX + " eqrY: " + equireRectY);
    return [equireRectX, equireRectY];

}

/**
 * 开启测距功能后在场景中选取点，计算该点在原始全景图上的位置
 */
function onPointerSelect(event) {

    console.log("----------uv mapping---------------");
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    let panoGroup;
    for (const objGroup of entityGroup.children) {
        if (objGroup.name === 'panoGroup') {
            panoGroup = objGroup;
        }
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(panoGroup, true);

    if (intersects.length < 1) {
        return void 0;
    }
    const selected = intersects[0].object;

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
    let pos = reProjection(intersects[0].uv.x, intersects[0].uv.y, direction);

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
        sphereFront.scale.set(0.7, 0.7, 0.7);
        sphereFront.renderOrder = 11;

        // sphereFront.position.set(0, 0, 0);
        lineGroup.add(sphereFront);
        pos1 = pos;
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
        sphereEnd.scale.set(0.7, 0.7, 0.7);
        sphereEnd.renderOrder = 11;
        sphereEnd.position.set(end.x, end.y, end.z);
        lineGroup.add(sphereEnd);

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
        //line.renderOrder = 11;
        line.renderOrder = 999;
        line.material.depthTest = false;
        line.material.depthWrite = false;
        line.material.transparent = true;

        line.computeLineDistances();

        lineGroup.add(line);

        pos2 = pos;

        let data = {
            "pos1": pos1,
            "pos2": pos2
        };

        axios.post('/dm', data).then(res => {
            if (res.status === 200) {
                let spritey = makeTextSprite((res.data).toString().substring(0,4),
                    {
                        fontsize: 17,
                        borderColor: {r: 255, g: 255, b: 255, a: 0.5},
                        backgroundColor: {r: 255, g: 255, b: 255, a: 0.5}
                    });

                spritey.scale.set(0.4, 0.2, 1);
                //spritey.position.set((front.x+end.x)/2, (front.y+end.y)/2, (front.z+end.z)/2);

                spritey.center = new THREE.Vector2(0, 0);
                //scene.add(spritey);
                //spritey.position.set(0,-1,0);
                const spriteyRot = new THREE.Euler();
                spriteyRot.setFromVector3(new THREE.Vector3((end.x - front.x), (end.y - front.y), (end.z - front.z)));
                spritey.setRotationFromEuler(spriteyRot);

                spritey.renderOrder = 999;
                spritey.material.depthTest = false;
                spritey.material.depthWrite = false;
                spritey.material.transparent = true;

                lineGroup.add(spritey);

                spritey.position.set((front.x + end.x) / 2, (front.y + end.y) / 2 - 0.2, (front.z + end.z) / 2);
                console.log(front, 'front');
                console.log(end, 'end');
                console.log(spritey, "spriety");
                console.log(line, 'line');

                front = null;
                end = null;
            } else {
                console.log("测距错误");
            }
        })

    }
}

/**
 * 绘制测距线段标签
 * @param message
 * @param parameters
 * @returns {*}
 */
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

/**
 * 绘制测距线段标签所需的矩形元素
 * @param ctx
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 */
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

    let subV = new THREE.Vector3;
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

    nextPano = skyboxMap.get(selected.object.map);

    if (nextPano === currentPano) return;

    let panoFlag;
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
        let tempPosition = new THREE.Vector3(vector.x, nextPano.position.y, vector.z);
        let totalLength = subV.subVectors(startPosition, endPosition).length();
        let progressLength = subV.subVectors(tempPosition, endPosition).length();
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


/**
 * 将输入的欧拉角转换为旋转矩阵
 * @param title
 * @param roll
 * @param pan
 * @returns {Matrix3|Matrix3|Matrix3}
 */
function eul2rotm(title, roll, pan) {

    const R_x = new THREE.Matrix3();
    const R_y = new THREE.Matrix3();
    const R_z = new THREE.Matrix3();

    R_x.set(
        1, 0, 0,
        0, Math.cos(title), -1 * Math.sin(title),
        0, Math.sin(title), Math.cos(title)
    );

    R_y.set(
        Math.cos(roll), 0, Math.sin(roll),
        0, 1, 0,
        -1 * Math.sin(roll), 0, Math.cos(roll)
    );

    R_z.set(
        Math.cos(pan), -1 * Math.sin(pan), 0,
        Math.sin(pan), Math.cos(pan), 0,
        0, 0, 1
    );

    let Rot = new THREE.Matrix3();
    Rot = R_z.multiply(R_y);
    Rot.multiply(R_x);
    console.log(Rot.elements)
    return Rot;

}
