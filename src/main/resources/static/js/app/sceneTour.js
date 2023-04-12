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

const configurationFileId = sessionStorage.getItem("configurationFileId");
const userId = sessionStorage.getItem("userId");
const projectConfigurationUrl = "/"+userId+"/"+configurationFileId+"/"+"projectConfig.json";

let container = document.getElementById("sceneContainer");

let camera, scene, scene2, renderer;

let orbitControls, firstPerson;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let insetWidth;
let insetHeight;

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

    sceneConstructor(scene, projectConfigurationUrl, renderer, camera);

    initControls();
    initLightAndHelper();

    window.addEventListener('resize', onWindowResize);

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