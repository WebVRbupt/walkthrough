// import * as React from "/js/build/react.development.js";
// import * as ReactDOM from "/js/build/react-dom.development.js"
// import { useState } from 'react';

import {genCubeMap} from '/js/app/generateTextures.js'
import {nanoid} from "/js/build/nanoid.js";
import {generateProjectConfig, addSkyboxTexture, addSkybox, addModel} from "/js/app/sceneExporter.js";


const genIdLength = 17;
let fileMap = new Map();
const userId = sessionStorage.getItem("userId");
const projectId = nanoid(genIdLength);
const projectConfig = generateProjectConfig(projectId, userId);
const modelId = nanoid(genIdLength);
let isModelConfigCreate = false;

const steps = [
    {
        title: '项目信息',
        content: 'First-content'
    },
    {
        title: '上传场景',
        content: 'Second-content',
    },
    {
        title: '上传模型',
        content: 'Last-content',
    },
    {
        title: '完成',
        content: 'Last-content',
    },
];

// Step1.填写项目信息组件.
const ProjectInfoContent = (props) => {

    const [form] = antd.Form.useForm();

    const onFinish = (values) => {

        console.log(values);
        projectConfig.metadata.name = values.projectName;
        projectConfig.metadata.description = values.projectDescription === undefined ? '' : values.projectDescription;
        projectConfig.metadata.type = values.projectType;
    }

    const onFinishFailed = () => {

        antd.message.error("请完善必要的项目信息!")

    }

    return (
        <antd.Form

            ref={props.formRef}
            form={form}
            name="projectInfo"
            labelCol={{
                span: 7,
            }}
            wrapperCol={{
                span: 17,
            }}
            // style={{
            //     maxWidth: 600,
            // }}

            size='large'


            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <antd.Form.Item
                label="项目名称"
                name="projectName"
                rules={[
                    {
                        required: true,
                        message: 'Please input your project name!',
                    },
                ]}
            >
                <antd.Input/>
            </antd.Form.Item>

            <antd.Form.Item
                label="项目描述"
                name="projectDescription"
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <antd.Input.TextArea rows={5} placeholder="描述项目的相关信息..." value={""}/>
            </antd.Form.Item>

            <antd.Form.Item
                name="projectType"
                label="项目类型"
                rules={[
                    {
                        required: true,
                        message: 'Please chooses your project type!',
                    },
                ]}
            >
                <antd.Select
                    placeholder="选择项目类型"
                >
                    <antd.Select.Option value="room">房间</antd.Select.Option>
                    <antd.Select.Option value="exhibition">展厅</antd.Select.Option>
                    <antd.Select.Option value="Factory">工厂</antd.Select.Option>
                </antd.Select>
            </antd.Form.Item>


        </antd.Form>

    )
}

// Step2. 上传场景全景图像组件.
const UploadSceneContent = () => {

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [form] = antd.Form.useForm();
    const [isSceneInfoModalOpen, setIsSceneInfoModalOpen] = React.useState(false);
    const [picKey, setPicKey] = React.useState(null);
    const [uploadResolve, setUploadResolve] = React.useState(null);
    const [uploadReject, setUploadReject] = React.useState(null);
    const [sceneInfoResolve, setSceneInfoResolve] = React.useState(null);
    const [sceneInfoReject, setSceneInfoReject] = React.useState(null);
    const [isConfirm, setIsConfirm] = React.useState(false);

    const showSceneInfoModal = (picKey) => {
        setIsSceneInfoModalOpen(true);
        setPicKey(picKey);
    };
    const handleSceneInfoModalOk = () => {

        setIsConfirm(true);
        setIsSceneInfoModalOpen(false);
        form.validateFields().then((values) => {
            form.resetFields();
            fileMap.get(picKey).sceneName = values.sceneName;
            console.log(fileMap.get(picKey));
            const {id, sceneName, fileType} = fileMap.get(picKey);
            addSkyboxTexture(id, sceneName, fileType, projectConfig);
            addSkybox(nanoid(genIdLength), id, sceneName, projectConfig);
        })
            .catch((info) => {
                console.log('validate Failed:', info);
            })

    };

    const handleSceneInfoModalCancel = () => {
        setIsConfirm(false);
        setIsSceneInfoModalOpen(false);
    };

    const [actionUrl, setActionUrl] = React.useState('');
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState('');
    const [previewTitle, setPreviewTitle] = React.useState('');
    const [fileList, setFileList] = React.useState([
        // {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-2',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-3',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-4',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-xxx',
        //     percent: 50,
        //     name: 'image.png',
        //     status: 'uploading',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        // {
        //     uid: '-5',
        //     name: 'image.png',
        //     status: 'error',
        // },
    ]);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        console.log(file.uid, "hdPreview");
        console.log(fileMap.get(file.uid), "hdPreview");
        console.log(fileMap.size);
        setPreviewTitle(fileMap.get(file.uid).sceneName || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({fileList: newFileList}) => setFileList(newFileList);

    const handleBeforeUpload = (file, fileList) => {

        // setCurrentFile(file);
        // console.log(currentfile,"before change name");
        // console.log(currentfileList);
        // console.log(fileList);
        // fileList[0].name = "测试场景123";


        // return new Promise((resolve)=>{
        //
        //     console.log(file, "file?");
        //     showSceneInfoModal(file, fileList);
        //     console.log(sceneName,'sceneName');
        //
        //     file.name=sceneName;
        //
        // })

        console.log(file, "fileInfo");
        const fileCopy = new File([file], file.name, {type: [file.type]});
        const picId = nanoid(genIdLength);
        setActionUrl("/uploadPic/" + userId + "/" + projectId + "/" + picId);
        fileMap.set(file.uid, {
            id: picId,
            userId: userId,
            projectId: projectId,
            sceneName: '',
            originalFile: fileCopy,
            fileType: file.name.substring(file.name.lastIndexOf('.'), file.name.length)
        })
        console.log(fileMap.get(file.uid), "beforeUpload");

        return new Promise((resolve, reject) => {
            showSceneInfoModal(file.uid);
            genCubeMap(file, resolve);

        })
    }

    const reHandleBeforeUpload = (file) => {

        let checkImage = new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = reader.result;
                image.onload = () => {
                    if (image.width !== 2 * image.height) {

                        antd.message.error("上传的场景全景图形必须为宽是高二倍的等距柱状投影全景图！");
                        reject();
                        return antd.Upload.LIST_IGNORE;
                    } else {
                        resolve(file);
                    }

                }
            }
            reader.readAsDataURL(file);
        });

        return checkImage.then(() => {

            const fileCopy = new File([file], file.name, {type: [file.type]});
            const picId = nanoid(genIdLength);
            setActionUrl("/uploadPic/" + userId + "/" + projectId + "/" + picId);
            fileMap.set(file.uid, {
                id: picId,
                userId: userId,
                projectId: projectId,
                sceneName: '',
                originalFile: fileCopy,
                fileType: file.name.substring(file.name.lastIndexOf('.'), file.name.length)
            })
            console.log(fileMap.get(file.uid), "beforeUpload");

            showSceneInfoModal(file.uid);

        }, () => {
            console.log("reject 执行惹！！！")
        }).then((resolve) => {
            genCubeMap(file, resolve)
        })
    }
    const handleAddSceneClick = () => {

    }

    const getOriginalFile = (file) => {
        return new Promise((resolve, reject) => {

            const reader = new FileReader();
            reader.readAsDataURL(fileMap.get(file.uid).originalFile);
            reader.onload = (e) => {
                {
                    resolve(e.target.result);
                }
            }

        })
    }

    const UploadButton = (
        <div onClick={handleAddSceneClick}>
            {/*<antd.PlusOutlined/>*/}
            <i className="layui-icon layui-icon-addition"/>
            <div
                style={{
                    marginTop: 8,
                }}
            >
                添加场景
            </div>
        </div>
    );
    return (
        <div>
            <antd.Upload
                action={actionUrl}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={handleBeforeUpload}
                id={"sceneUpload"}
                accept={"image/png, image/jpeg"}
                data={nanoid(17)}
                previewFile={getOriginalFile}

            >
                {fileList.length >= 8 ? null : UploadButton}
            </antd.Upload>
            <antd.Modal title="场景信息" open={isSceneInfoModalOpen} onOk={handleSceneInfoModalOk}
                        onCancel={handleSceneInfoModalCancel} isConfirm={isConfirm}>
                <antd.Form
                    form={form}
                    name="sceneInfo"
                    layout="vertical"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={() => {
                    }}
                    onFinishFailed={() => {
                    }}
                    autoComplete="off"
                >
                    <antd.Form.Item
                        label="场景名称"
                        name="sceneName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your scenename!',
                            },
                        ]}
                    >
                        <antd.Input/>
                    </antd.Form.Item>
                    <antd.Form.Item
                        label="场景描述"
                        name="sceneDescription"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                        <antd.Input/>
                    </antd.Form.Item>
                </antd.Form>
            </antd.Modal>
            <antd.Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </antd.Modal>
        </div>
    );


}

// Step3. 上传空间模型组件.
const UploadModelContent = () => {

    function handleModelUpload(file) {

        const fileType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
        if (!isModelConfigCreate) {
            addModel(modelId, "SpaceModel", projectConfig);
            isModelConfigCreate = true;
        }
        return true;

    }


    const props = {
        name: 'file',
        action: "/uploadModel/" + userId + "/" + projectId + "/" + modelId,
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                antd.message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                antd.message.error(`${info.file.name} file upload failed.`);
            }
        },

    };

    return (
        <antd.Upload {...props} beforeUpload={handleModelUpload}>
            <antd.Button>上传模型</antd.Button>
        </antd.Upload>
    );

}

// Contents of Step Component.
const CreateProjectStep = (props) => {
    if (props.current === 0) {
        return (<ProjectInfoContent formRef={props.formRef}/>)
    } else if (props.current === 1) {
        return (<UploadSceneContent/>)
    } else if (props.current === 2) {
        return (<UploadModelContent/>)
    } else
        return ("完成创建")
}


const App = () => {

    const formRef = React.useRef(null);

    const form = antd.Form.useFormInstance();
    const {token} = antd.theme.useToken();
    const [current, setCurrent] = React.useState(0);
    const next = () => {

        if (current === 0) {
            formRef.current.validateFields().then(sceneInfoResolve, sceneInfoReject);
        } else {
            setCurrent(current + 1);
        }
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    const sceneInfoResolve = () => {

        formRef.current.submit();
        setCurrent(current + 1);
    }

    const sceneInfoReject = () => {
        antd.message.error("请完善必要的场景信息！");
    }

    const finishCreateProject = () => {

        const configFile = JSON.stringify(projectConfig);
        console.log(configFile);

        axios.post("/" + "uploadConfigFile" + "/" + userId + "/" + projectId, projectConfig).then(
            res => {
                console.log(res);
                antd.message.success('项目创建完成');
            }
        )

    }
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    const contentStyle = {

        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    return (
        <div>
            <antd.Steps current={current} items={items}/>
            <div style={contentStyle} id='mainContainer'>
                {<CreateProjectStep current={current} formRef={formRef}/>}
            </div>
            <div
                style={{
                    marginTop: 24,
                }}
            >
                {current < steps.length - 1 && (
                    <antd.Button type="primary" onClick={() => next()}>
                        下一步
                    </antd.Button>
                )}
                {current === steps.length - 1 && (
                    <antd.Button type="primary" onClick={finishCreateProject}>
                        创建项目
                    </antd.Button>
                )}
                {current > 0 && (
                    <antd.Button
                        style={{
                            margin: '0 8px',
                            display: 'none'
                        }}
                        onClick={() => prev()}
                    >
                        后退
                    </antd.Button>
                )}
            </div>
        </div>
    );
};


const app = document.getElementById("app");
const root = ReactDOM.createRoot(app);
root.render(
    <App></App>
);
