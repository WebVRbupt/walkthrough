/*
*
* This file contains methods for exporting scenes to configuration files in json format.
* Mon,Mar13,2023.
*
*/

export function generateProjectConfig(projectId, userId) {
    const now = new Date();
    return {

        metadata: {

            id: projectId,       //前端生成的项目id
            projectId: -1,       //项目的数据库id
            userId: userId,
            type: "",
            name:"",
            description: "",
            createDate: now.toString(),
            path: "/" + userId + "/" + projectId + "/",

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
            url: "/" + userId + "/" + id + "/" + textureId + fileType,
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
            geometryScale: {x: 1, y: 1, z: 1},
            scale: {x: 1, y: 1, z: 1},
            rotation: {x: 0, y: 0, z: 0}
        }
    )
}

export function addModel(modelId, modelName, projectConfig) {

    projectConfig.scene.model.push(
        {
            id: modelId,
            name: modelName,
            rotation: {x: 0, y: 0, z: 0},
            position: {x: 0, y: 0, z: 0},
            scale: {x: 1, y: 1, z: 1},
        }
    )
}

