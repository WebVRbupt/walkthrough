/*
*
* This file contains methods for exporting scenes to configuration files in json format.
* Mon,Mar13,2023.
*
*/

import {getSkyboxArr, getNaviCircleArr, getModelArr, genObjectMap} from "/js/app/util.js"

const configurationFileId = sessionStorage.getItem("configurationFileId");
const userId = sessionStorage.getItem("userId");
const PREFIX = "/project/getEditSources/"

/**
 * 生成创建新项目的初始默认配置文件json字符串
 * @param projectId
 * @param userId
 * @returns {{metadata: {path: string, initView: null, lastUpdate: string, name: string, description: string, id, type: string, projectId: number, userId: number, createDate: string}, textures: *[], scene: {skybox: *[], navi: *[], model: *[]}}}
 */
export function generateProjectConfig(projectId, userId) {
    const now = new Date();
    return {

        metadata: {

            id: projectId,       //配置文件id
            projectId: -1,       //项目的数据库id
            userId: parseInt(userId),
            type: "",
            name: "",
            description: "",
            createDate: now.toString(),
            lastUpdate: now.toString(),
            path: PREFIX + userId + "/" + projectId + "/",
            initView: null


        },
        scene: {
            skybox: [],
            navi: [],
            model: []
        },
        textures: []

    };
}

/**
 * 创建新项目时为项目配置文件 'projectConfig' 的 'texture' 项 添加一个新的贴图项.
 * @param textureId
 * @param textureName
 * @param fileType
 * @param projectConfig
 */
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

/**
 * 创建新项目时为项目配置文件 'projectConfig' 的 'scene.skybox' 项添加一个新的天空盒项.
 * @param skyboxId
 * @param textureId
 * @param sceneName
 * @param projectConfig
 */
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

/**
 * 创建新项目时为项目配置文件 'projectConfig' 的 'scene.skybox' 项添加一个新的模型项.
 * @param modelId
 * @param modelName
 * @param projectConfig
 */
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

/**
 * 全景漫游可视化编辑页面 '保存场景信息' 的入口方法，读取配置文件更新后写回.
 * @param scene
 * @param sceneConfigUrl
 */
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

/**
 * 全景漫游可视化编辑页面 '保存场景信息' 功能调用后更新配置文件的 'metadata.lastUpdate’ 属性,记录最后更新配置文件的时间.
 * @param sceneConfig
 */
function updateMetaInfo(sceneConfig) {
    const now = new Date();
    sceneConfig["metadata"].lastUpdate = now.toString();
}

/**
 * 遍历配置文件 'sceneConfig' 的 'scene.skybox' 每一项,查找 three.js场景 'scene' 中 customId 一致的object更新skybox的几何属性.
 * @param scene
 * @param sceneConfig
 */
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


/**
 * 遍历配置文件 'sceneConfig' 的 'scene.navi' 每一项,查找 three.js场景 'scene' 中 customId 一致的object更新导航热点的几何属性.
 * @param scene
 * @param sceneConfig
 */
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

/**
 * 遍历配置文件 'sceneConfig' 的 'scene.model' 每一项,查找 three.js场景 'scene' 中 customId 一致的object更新导航模型的几何属性.
 * @param scene
 * @param sceneConfig
 */
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



