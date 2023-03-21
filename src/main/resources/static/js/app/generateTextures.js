import * as THREE from '../build/three.module.js';


const canvasProps = {width: 1280, height: 720, vww: 0.64, vhw: 0.36};
const renderProps = {isRendering: false, exposure: 4, maxExposure: 12};
const imageProps = {loaded: false, file: null, format: ''};
const saveProps = {
    url: '',
    download: '',
    processed: false,
    processing: true,
    progress: 0,
    saveDisable: false,
    resolution: 512,
    format: 'png'
};

const renderCatch = {
    blobs: [],
    names: [],
    packed: [],
    zipping: false,
    progNow: 0,
    progTotal: 0,
    canvas: document.createElement('canvas'),
}

let mainScene = new THREE.Scene();
let mainCamera = new THREE.PerspectiveCamera(60, canvasProps.width / canvasProps.height, 0.1, 5000);//60

const procRenderer = new THREE.WebGLRenderer();
const procCamera = new THREE.PerspectiveCamera(90, 1, 1, 5000);

let renderer;

const sphereMat = new THREE.MeshBasicMaterial({color: 0xffffff, map: null, side: THREE.DoubleSide});


const userTexture = new THREE.Texture();
userTexture.minFilter = THREE.NearestFilter;
userTexture.magFilter = THREE.NearestFilter;

export const generateTextures = () => {

    const input = document.getElementById("uploadPic");
    input.click();

}

const updateSphereMap = (map) => {
    sphereMat.map = map;
    sphereMat.needsUpdate = true;
}
const updateMaterial = () => {
    sphereMat.needsUpdate = true;
}

const render = () => {
    console.log('Initial Rendering')

    if (!renderProps.isRendering) {
        renderProps.isRendering = true;
        update();
        customEvents();
        requestAnimationFrame(eventTick);
    }
}

const eventTick = () => {
    renderer.render(mainScene, mainCamera);
    if (renderProps.isRendering) {
        requestAnimationFrame(eventTick);
    }
}
const update = () => {

    const canvas = document.getElementById('MainCanvas')

    renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = renderProps.exposure;
    resize();
    renderer.setPixelRatio(2);

}

const preview = () => {

    const geo = new THREE.SphereGeometry(2000, 100, 100);
    const sphereMesh = new THREE.Mesh(geo, sphereMat);
    sphereMesh.scale.set(-1, -1, -1);
    sphereMesh.rotateZ(Math.PI);
    sphereMesh.rotateY(-Math.PI / 2);
    sphereMesh.position.set(0, 0, 0);
    mainScene.add(sphereMesh);

    // const testCube = new Mesh(new BoxGeometry(50,50,50),sphereMat)
    // testCube.position.z = -300;
    // mainScene.add(testCube);
}

const customEvents = () => {
    // console.log('event',document.getElementById('MainCanvas'))

    window.addEventListener("resize", (event) => {
        resize();
    })

    // const canvas = document.getElementById('MainCanvas');
    // canvas.addEventListener('mouseover', () => {
    //     cameraControl.enabled = true;
    // })
    // canvas.addEventListener('mouseout', () => {
    //     cameraControl.enabled = false;
    //
    // })
}

const resize = () => {
    renderer.setSize(window.innerWidth * canvasProps.vww, window.innerWidth * canvasProps.vhw);
}

function initPage() {

    // create dom container for three.js scene.
    const mainCanvas = document.createElement("canvas");
    mainCanvas.setAttribute("id", "MainCanvas");
    mainCanvas.setAttribute("style", "opacity: 0");
    document.body.appendChild(mainCanvas);

    mainCamera.position.set(0, 0, 1);

    let input = document.querySelector("input");
    input.addEventListener('change', onPicUpload);

    preview();
    render();

}


const onPicUpload = (e) => {

    console.log("file upload");
    const file = e.target.files[0];
    const format = file.name.split('.').slice(-1)[0];

    imageProps.file = file;
    imageProps.loaded = true;
    imageProps.format = format;
    updateImage(() => {
        regularProcess();
    });
}

const updateImage = (callback = () => {
}) => {
    console.log("call updateImage()");
    const reader = new FileReader();
    reader.readAsDataURL(imageProps.file);

    const loader = new THREE.ImageLoader();
    reader.onload = (theFile) => {
        const dataURL = theFile.target.result;
        loader.load(
            dataURL,
            (image) => {
                userTexture.image = image;
                userTexture.flipY = true;
                userTexture.needsUpdate = true;
                hdrToneMappingProc(false);
                updateSphereMap(userTexture);
                callback();
            },
            undefined,
            (err) => {
                console.error('error - loading image', err);
            }
        );

    }


}

const hdrToneMappingProc = (hdr = true) => {
    if (hdr) {
        procRenderer.toneMapping = THREE.ReinhardToneMapping;
        procRenderer.toneMappingExposure = 4;
    } else {
        procRenderer.toneMapping = THREE.LinearToneMapping;
        procRenderer.toneMappingExposure = 1;
    }
}


const onPicUploadError = () => {

    console.log("Equirectangular Picture upload Error");

}


const regularProcess = (callback) => {

    console.log("call regularProcess()");
    procRenderUE4(saveProps.resolution, href => {
        callback(href);
    }, progress => {
        const {progNow, progTotal} = progress;
        console.log("progress:" + progNow / progTotal * 100)
    });
}

const procRenderUE4 = (size = 64, callback = href => {
}, progress = prog => {
}) => {

    renderCatch.progNow = 0;
    renderCatch.progTotal = 4;
    const {canvas} = renderCatch;
    canvas.width = size * 6;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    procRenderer.setSize(size, size);
    procCamera.rotation.set(0, 0, 0);

    const angle = calcAngle();
    procCamera.rotateY(angle);

    //+z
    updateMaterial();
    procRenderer.render(mainScene, procCamera);
    ctx.drawImage(procRenderer.domElement, 3 * size, 0);

    //+x
    procCamera.rotateY(-Math.PI / 2);
    procCamera.rotateZ(-Math.PI / 2);
    updateMaterial();
    procRenderer.render(mainScene, procCamera);
    ctx.drawImage(procRenderer.domElement, 0, 0);

    //-z
    procCamera.rotateZ(Math.PI / 2);
    procCamera.rotateY(-Math.PI / 2);
    procCamera.rotateZ(Math.PI);
    updateMaterial();
    procRenderer.render(mainScene, procCamera);
    ctx.drawImage(procRenderer.domElement, 2 * size, 0);

    //-x
    procCamera.rotateZ(-Math.PI);
    procCamera.rotateY(-Math.PI / 2);
    procCamera.rotateZ(Math.PI / 2);
    updateMaterial();
    procRenderer.render(mainScene, procCamera);
    ctx.drawImage(procRenderer.domElement, 1 * size, 0);

    //+y
    procCamera.rotateZ(-Math.PI / 2);
    procCamera.rotateY(-Math.PI / 2);
    procCamera.rotateX(Math.PI / 2);
    updateMaterial();
    procRenderer.render(mainScene, procCamera);
    ctx.drawImage(procRenderer.domElement, 4 * size, 0);

    //-y
    procCamera.rotateX(-Math.PI);
    procCamera.rotateZ(Math.PI);
    updateMaterial();
    procRenderer.render(mainScene, procCamera);
    ctx.drawImage(procRenderer.domElement, 5 * size, 0);

    renderCatch.progNow++;
    progress({progNow: renderCatch.progNow, progTotal: renderCatch.progTotal});
    canvas.toBlob(blob => {

        console.log("transfer canvas to blob");
        downFileToLocal("texture", blob);

    }, "image/png");


}

const calcAngle = () => {
    const direction = new THREE.Vector3();
    mainCamera.getWorldDirection(direction);
    const angle = direction.multiply(new THREE.Vector3(1, 0, 1)).angleTo(new THREE.Vector3(0, 0, -1));
    if (direction.x < 0) {
        return angle;
    } else {
        return -angle;
    }
}

function downFileToLocal(fileName, blob) {
    // 创建用于下载文件的a标签
    const d = document.createElement('a')
    // 设置下载内容
    d.href = window.URL.createObjectURL(blob)
    // 设置下载文件的名字
    d.download = fileName
    // 界面上隐藏该按钮
    d.style.display = 'none'
    // 放到页面上
    document.body.appendChild(d)
    // 点击下载文件
    d.click()
    // 从页面移除掉
    document.body.removeChild(d)
    // 释放 URL.createObjectURL() 创建的 URL 对象
    window.URL.revokeObjectURL(d.href)
}


initPage();