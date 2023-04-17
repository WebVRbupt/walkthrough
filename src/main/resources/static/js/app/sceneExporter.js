/*
*
* This file contains methods for exporting scenes to configuration files in json format.
* Mon,Mar13,2023.
*
*/

const configurationFileId = sessionStorage.getItem("configurationFileId");
const userId = sessionStorage.getItem("userId");
const PREFIX = "/project/getEditSources/"

export function generateProjectConfig(projectId, userId) {
    const now = new Date();
    return {

        metadata: {

            id: projectId,       //前端生成的项目id
            projectId: -1,       //项目的数据库id
            userId: parseInt(userId),
            type: "",
            name: "",
            description: "",
            createDate: now.toString(),
            lastUpdate: now.toString(),
            path: PREFIX + userId + "/" + projectId + "/",
            initView:null


        },
        scene: {
            skybox: [],
            navi: [],
            model: []
        },
        textures: []

    };
}

export function addSkyboxTexture(textureId, textureName, fileType, projectConfig) {

    console.log("addskyboxTexture");

    const {userId, id} = projectConfig.metadata;

    projectConfig.textures.push(
        {
            id: textureId,
            name: textureName,
            type: "skybox",
            url: PREFIX + userId + "/" + id + "/" + textureId + fileType,
        }
    );

}

export function addSkybox(skyboxId, textureId, sceneName, projectConfig) {

    console.log("addskybox");

    const offset = projectConfig.scene.skybox.length;

    projectConfig.scene.skybox.push(
        {
            name: sceneName,
            id: skyboxId,
            texture: [textureId],
            position: {x: 0, y: 0, z: offset},
            geometryScale: {x: 1, y: 1, z: -1},
            scale: {x: 1, y: 1, z: 1},
            rotation: {x: 0, y: 0, z: 0}
        }
    )
}

export function addModel(modelId, modelName, projectConfig) {

    const {userId, id} = projectConfig.metadata;

    projectConfig.scene.model.push(
        {
            id: modelId,
            name: modelName,
            url: PREFIX + userId + "/" + id + "/",
            rotation: {x: 0, y: 0, z: 0},
            position: {x: 0, y: 0, z: 0},
            scale: {x: 1, y: 1, z: 1},
        }
    )
}

// 全景漫游可视化编辑页面保存场景信息的入口方法，读取配置文件更新后写回.
export function updateSceneConfig(scene, sceneConfigUrl) {
    let sceneConfig;
    // let scene = new THREE.Scene();
    fetch(sceneConfigUrl)
        .then((response) => response.json())
        .then((json) => {
            sceneConfig = json;
            updateSkyboxInfo(scene, sceneConfig);
            updateNaviCircleInfo(scene, sceneConfig);
            updateModelInfo(scene, sceneConfig);
            updateMetaInfo(sceneConfig);
            axios.post("/" + "updateConfigFile" + "/" + userId + "/" + configurationFileId, sceneConfig).then(
                res => {
                    console.log(res);
                    console.log("configuration file update");
                }
            )

        });
}

function updateMetaInfo(sceneConfig) {
    const now = new Date();
    sceneConfig["metadata"].lastUpdate = now.toString();
}

// 更新项目配置文件中场景天空盒相关的信息.
function updateSkyboxInfo(scene, sceneConfig) {

    const skyboxConfigArr = sceneConfig["scene"]["skybox"];
    const skyboxArr = getSkyboxArr(scene);
    console.log(skyboxArr, "skyboxArr");
    const skyboxMap = genObjectMap(skyboxArr);
    for (const skyboxConfig of skyboxConfigArr) {
        let skybox = skyboxMap.get(skyboxConfig["id"]);
        skyboxConfig["rotation"].x = skybox.rotation.x;
        skyboxConfig["rotation"].y = skybox.rotation.y;
        skyboxConfig["rotation"].z = skybox.rotation.z;

        skyboxConfig["position"].x = skybox.position.x;
        skyboxConfig["position"].y = skybox.position.y;
        skyboxConfig["position"].z = skybox.position.z;

        skyboxConfig["scale"].x = skybox.scale.x;
        skyboxConfig["scale"].y = skybox.scale.y;
        skyboxConfig["scale"].z = skybox.scale.z;
    }
}

// 更新项目配置文件中导航热点相关的信息.
function updateNaviCircleInfo(scene, sceneConfig) {
    const naviConfigArr = sceneConfig["scene"]["navi"];
    const naviCircleArr = getNaviCircleArr(scene);
    console.log(naviCircleArr, "naviCircleArr");
    const naviCircleMap = genObjectMap(naviCircleArr);
    for (const naviConfig of naviConfigArr) {
        const navi = naviCircleMap.get(naviConfig["id"]);
        naviConfig["rotation"].x = navi.rotation.x;
        naviConfig["rotation"].y = navi.rotation.y;
        naviConfig["rotation"].z = navi.rotation.z;

        naviConfig["position"].x = navi.position.x;
        naviConfig["position"].y = navi.position.y;
        naviConfig["position"].z = navi.position.z;

        naviConfig["scale"].x = navi.scale.x;
        naviConfig["scale"].y = navi.scale.y;
        naviConfig["scale"].z = navi.scale.z;

    }
}

// 更新项目配置文件中空间模型相关的信息.
function updateModelInfo(scene, sceneConfig) {

    const modelConfigArr = sceneConfig["scene"]["model"];
    const spaceModelArr = getModelArr(scene);
    console.log(spaceModelArr, "spaceModelArr");
    const spaceModelMap = genObjectMap(spaceModelArr);
    for (let modelConfig of modelConfigArr) {
        const spaceModel = spaceModelMap.get(modelConfig["id"]);

        modelConfig["position"].x = spaceModel.position.x;
        modelConfig["position"].y = spaceModel.position.y;
        modelConfig["position"].z = spaceModel.position.z;

        modelConfig["rotation"].x = spaceModel.rotation.x;
        modelConfig["rotation"].y = spaceModel.rotation.y;
        modelConfig["rotation"].z = spaceModel.rotation.z;

        modelConfig["scale"].x = spaceModel.scale.x;
        modelConfig["scale"].y = spaceModel.scale.z;
        modelConfig["scale"].z = spaceModel.scale.z;

    }


}

// 获取场景下 Skybox 对象数组.
function getSkyboxArr(scene) {

    return getObjectArr(scene, "panoGroup");

}

// 获取场景下 naviCircle 对象数组.
function getNaviCircleArr(scene) {

    return getObjectArr(scene, "naviGroup");

}

// 获取场景下 spaceModel 对象数组.
function getModelArr(scene) {

    return getObjectArr(scene, "mtlModel");

}

// 根据场景中对象所属父Group元素的name属性返回对象数组.
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

// 根据参数传入的 three.js 对象数组生成 `customId` 为 key ,场景3d对象为 value的Map.
function genObjectMap(objectArr) {

    let objectMap = new Map;
    console.log(objectArr);
    if (objectArr !== null && objectArr !== undefined) {
        for (const obj of objectArr) {
            objectMap.set(obj.customId, obj);
        }
    }

    return objectMap;

}

