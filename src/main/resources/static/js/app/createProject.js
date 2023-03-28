// import * as React from "/js/build/react.development.js";
// import * as ReactDOM from "/js/build/react-dom.development.js"
// import { useState } from 'react';

import { genCubeMap } from '/js/app/generateTextures.js'

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


const ProjectInfoContent = () => {

    const onFinish = () => {

    }

    const onFinishFailed = () => {

    }
    return (
        <antd.Form
            name="projectInfo"
            labelCol={{
                span: 5,
            }}
            wrapperCol={{
                span: 19,
            }}
            // style={{
            //     maxWidth: 600,
            // }}

            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <antd.Form.Item
                label="项目名称"
                name="projectname"
                rules={[
                    {
                        required: true,
                        message: 'Please input your projectname!',
                    },
                ]}
            >
                <antd.Input/>
            </antd.Form.Item>

            <antd.Form.Item
                label="项目描述"
                name="password"
                rules={[
                    {
                        required: false,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <antd.Input.TextArea rows={5} placeholder="描述项目的相关信息..."/>
            </antd.Form.Item>

            <antd.Form.Item
                name="projectType"
                label="项目类型"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <antd.Select
                    placeholder="Select a option and change input text above"

                    allowClear
                >
                    <antd.Select.Option value="room">房间</antd.Select.Option>
                    <antd.Select.Option value="exhibition">展厅</antd.Select.Option>
                    <antd.Select.Option value="Factory">工厂</antd.Select.Option>
                </antd.Select>
            </antd.Form.Item>


        </antd.Form>

    )
}

const UploadSceneContent = () => {

    let sceneName = null;
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [isSceneInfoModalOpen, setIsSceneInfoModalOpen] = React.useState(false);
    const [form] = antd.Form.useForm();

    const showSceneInfoModal = () => {
        setIsSceneInfoModalOpen(true);
    };
    const handleSceneInfoModalOk = () => {

        setIsSceneInfoModalOpen(false);
        form.validateFields().then((values) => {
            form.resetFields();
            console.log(values);
            sceneName=values.sceneName;
            currentFile.name=sceneName;
        })
            .catch((info) => {
                console.log('validate Failed:', info);
            })

    };
    const handleSceneInfoModalCancel = () => {
        setIsSceneInfoModalOpen(false);

    };

    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState('');
    const [previewTitle, setPreviewTitle] = React.useState('');
    const [currentFile,setCurrentFile] = React.useState(null);
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
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
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
        console.log(file);
        return new Promise(resolve=>{


            genCubeMap(file,resolve);

        })

    }
    const handleAddSceneClick = () => {

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
                action="/uploadPic"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={handleBeforeUpload}
                id={"sceneUpload"}
                accept={"image/png, image/jpeg"}

            >
                {fileList.length >= 8 ? null : UploadButton}
            </antd.Upload>
            <antd.Modal title="场景信息" open={isSceneInfoModalOpen} onOk={handleSceneInfoModalOk}
                        onCancel={handleSceneInfoModalCancel}>
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

const UploadModelContent = () => {


    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },

    };

    return (
        <antd.Upload {...props} >
            <antd.Button>上传模型</antd.Button>
        </antd.Upload>
    );

}

const CreateProjectStep = (props) => {
    if (props.current === 0) {
        return (<ProjectInfoContent/>)
    } else if (props.current === 1) {
        return (<UploadSceneContent/>)
    } else if (props.current === 2) {
        return (<UploadModelContent/>)
    } else
        return ("完成创建")
}
const App = () => {
    const {token} = antd.theme.useToken();
    const [current, setCurrent] = React.useState(0);
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
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
                {<CreateProjectStep current={current}/>}
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
                    <antd.Button type="primary" onClick={() => antd.message.success('Processing complete!')}>
                        创建项目
                    </antd.Button>
                )}
                {current > 0 && (
                    <antd.Button
                        style={{
                            margin: '0 8px',
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
