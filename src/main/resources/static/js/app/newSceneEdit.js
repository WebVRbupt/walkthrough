import * as THREE from '../build/three.module.js';

import {DDSLoader} from '../lib/loaders/DDSLoader.js';
import {MTLLoader} from '../lib/loaders/MTLLoader.js';
import {OBJLoader} from '../lib/loaders/OBJLoader.js';
import {OrbitControls} from '../lib/controls/OrbitControls.js';
import {FirstPersonCameraControl} from '../lib/controls/firstPersonCameraControl.js';
import {GUI} from '../lib/dat.gui.module.js';
import {Line2} from '../lib/lines/Line2.js';
import {LineMaterial} from '../lib/lines/LineMaterial.js';
// import { LineGeometry } from './js/lib/lines/LineGeometry.js';
// import { LineSegments2 } from './js/lib/lines/LineSegments2.js';
import {LineSegmentsGeometry} from '../lib/lines/LineSegmentsGeometry.js';

let container = document.getElementById("sceneContainer");

let camera, scene, renderer;
let scene2;

let model, panorama, obj;
let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// 将模型的中心点设置到canvas坐标系的中心点，保证模型显示是居中的，object就是操作的目标模型
let box;// 获取模型的包围盒
let orbitControls, firstperson;
let circle_group = new THREE.Group();
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
document.time = 0;

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

    const axes = new THREE.AxesHelper(500);
    scene.add(axes);
    scene.add(new THREE.GridHelper(20, 20));
    scene.background = new THREE.Color(0xeeeeee);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);

    scene.add(camera);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = true;
    camera.position.set(0, 0, 2);

    firstperson = new FirstPersonCameraControl(camera, renderer.domElement);
    firstperson.enabled = false;
    firstperson.applyGravity = false;
    firstperson.applyCollision = false;
    //camera.position.set(0.7, 0, -4.5);

    const manager = new THREE.LoadingManager();
    manager.addHandler(/\.dds$/i, new DDSLoader());

    //model
    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

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
                    model.rotateY(90 / 180 * Math.PI);

                    //obj.rotateX(3/180*Math.PI);
                    obj.rotateY(180 / 180 * Math.PI)
                    console.log(object.position);
                    scene.add(object);
                }, onProgress, onError);

        });

    const onProgress = function (xhr) {

        if (xhr.lengthComputable) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');

        }

    };

    const onError = () => {

    }

    pano_group = new THREE.Group();
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
    scene.add(pano_group);
    // mesh.translateY(250);
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
    scene.add(navi_circles);
    navi_circles.visible = true;
    circles = [navi_circle1, navi_circle2, navi_circle3, navi_circle4, navi_circle5];
    map = {
        pos1: panorama_1,
        pos2: panorama_2,
        pos3: panorama_3,
        pos4: panorama_4,
        pos5: panorama_5
    };

    window.addEventListener('resize', onWindowResize);
    window.addEventListener("pointerdown", onPointerSelect);

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
    // for (let i = 0; i < 6; i++) {

    // 	materials.push(new THREE.MeshBasicMaterial({ map: textures_1[i] }));
    // 	// console.log(textures[i].id)
    // 	// console.log(textures[i].mapping);
    // 	// console.log(textures[i].matrix);

    // }
    var skyBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
    skyBox.geometry.scale(1, 1, -1);
    skyBox.scale.set(2.43, 2.43, 2.43);
    skyBox.rotateX(90 / 180 * Math.PI);
    skyBox.rotateY(180 * Math.PI);
    skyBox.position.copy(new THREE.Vector3(vet3.x, vet3.y + 1.2, vet3.z));
    skyBox.visible = true;
    // skyBox.renderOrder = 10;
    return skyBox;
}

function getNaviCircle(vector3) {
    var geometry_circle = new THREE.CircleGeometry(0.3, 20, 0, 2 * Math.PI);
    geometry_circle.scale(-4, 4, 4);
    //定义白点的材质
    var mesh_circle = new THREE.Mesh(geometry_circle,
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/images/circle.png'),
            transparent: true,
            depthTest: false
        }));
    mesh_circle.rotation.x = Math.PI / 2;
    mesh_circle.position.copy(vector3);
    mesh_circle.renderOrder = 11;
    return mesh_circle;
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

    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(scene2, camera);
    //TWEEN.update();

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
});

layui.use(['dropdown', 'jquery', 'layer'], () => {
    const dropdown = layui.dropdown;
    const $ = layui.$;
    const layer = layui.layer;

    dropdown.on('click(sceneEditMenu)', (options) => {
        let othis = $(this);
        if (options.id === 106) {
            layer.open({
                title: '全景行走漫游比例标定',
                type: 1,
                btn: ['确认', '取消'],
                content: $('#scaleCalibrationInput'),
                icon: 1
            })
        }
        else if (options.id === 107) {
            layer.open({
                title: '保存全景行走漫游',
                type: 1,
                btn: ['确认', '取消'],
                content: $('#saveSuccess'),
                icon: 1

            });
        }
    })
})