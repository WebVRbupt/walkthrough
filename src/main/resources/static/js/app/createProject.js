// import * as React from "/js/build/react.development.js";
// import * as ReactDOM from "/js/build/react-dom.development.js"
// import { useState } from 'react';

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
    // return (
    //     <div className={"layui-timeline-content"}>
    //         <h3 className={"layui-timeline-title"}>项目信息</h3>
    //         <div className={"layui-form-item"}>
    //             <div className={"layui-inline"}>
    //                 <label className={"layui-form-label"}>项目名称</label>
    //                 <div className={"layui-input-inline"}>
    //                     <input type={"tel"} name={"phone"} lay-verify={"required|phone"} autoComplete={"off"}
    //                            className={"layui-input"}/>
    //                 </div>
    //             </div>
    //             <div className={"layui-inline"}>
    //                 <div className={"layui-input-inline"}>
    //                     <select name={"quiz"}>
    //                         <optgroup label={"项目分类"}>
    //                             <option value={"房间"}>房间</option>
    //                             <option value={"展厅"}>展厅</option>
    //                             <option value={"工厂"}>工厂</option>
    //                         </optgroup>
    //                     </select>
    //                 </div>
    //             </div>
    //             <div className={"layui-inline"}>
    //                 <label className={"layui-form-label"}>项目描述</label>
    //                 <div className={"layui-input-inline"}>
    //                     <input type={"tel"} name={"phone"} lay-verify={"required|phone"} autoComplete={"off"}
    //                            className={"layui-input"}/>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
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

    // return (
    //     <div className={"layui-upload"}>
    //         <button type={"button"} className={"layui-btn"} id={"test2"}>添加场景</button>
    //         <blockquote className={"layui-elem-quote layui-quote-nm"} style={{marginTop: "10px"}}>
    //             预览图：
    //             <div className={"layui-upload-list"} id={"demo2"}></div>
    //         </blockquote>
    //     </div>
    // )
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
        console.log(file,"before change name");
        console.log(fileList);
        file.name = "测试场景123";
        console.log(file,"after change name");

        // return new Promise((resolve)=>{
        //
        //     console.log(file, "file?");
        //     showSceneInfoModal(file, fileList);
        //     console.log(sceneName,'sceneName');
        //
        //     file.name=sceneName;
        //
        // })



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
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
    // return (
    //     <div>
    //         <h3 className={"layui-timeline-title"}>上传空间模型</h3>
    //         <div className={"layui-upload"}>
    //             <button type={"button"} className={"layui-btn layui-btn-normal"} id={"testList"}>选择模型</button>
    //             <div className={"layui-upload-list"} style={{maxWidth: "1000px"}}>
    //                 <table className={"layui-table"}>
    //                     <colgroup>
    //                         <col/>
    //                         <col width={"150"}/>
    //                         <col width={"260"}/>
    //                         <col width={"150"}/>
    //                     </colgroup>
    //                     <thead>
    //                     <tr>
    //                         <th>文件名</th>
    //                         <th>大小</th>
    //                         <th>上传进度</th>
    //                         <th>操作</th>
    //                     </tr>
    //                     </thead>
    //                     <tbody id={"demoList"}></tbody>
    //                 </table>
    //             </div>
    //             <button type={"button"} className={"layui-btn"} id={"testListAction"}>开始上传</button>
    //         </div>
    //     </div>
    // )

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

layui.use(['upload', 'element', 'layer'], function () {
    var $ = layui.jquery
        , upload = layui.upload
        , element = layui.element
        , layer = layui.layer;
    //演示多文件列表
    var uploadListIns = upload.render({
        elem: '#testList'
        , elemList: $('#demoList') //列表元素对象
        , url: '/uploadPic' //此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
        , accept: 'file'
        , multiple: true
        , number: 3
        , auto: false
        , bindAction: '#testListAction'
        , choose: function (obj) {
            var that = this;
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {
                var tr = $(['<tr id="upload-' + index + '">'
                    , '<td>' + file.name + '</td>'
                    , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                    , '<td><div class="layui-progress" lay-filter="progress-demo-' + index + '"><div class="layui-progress-bar" lay-percent=""></div></div></td>'
                    , '<td>'
                    , '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                    , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                    , '</td>'
                    , '</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                that.elemList.append(tr);
                element.render('progress'); //渲染新加的进度条组件
            });
        }
        , done: function (res, index, upload) { //成功的回调
            var that = this;
            //if(res.code == 0){ //上传成功
            var tr = that.elemList.find('tr#upload-' + index)
                , tds = tr.children();
            tds.eq(3).html(''); //清空操作
            delete this.files[index]; //删除文件队列已经上传成功的文件
            return;
            //}
            this.error(index, upload);
        }
        , allDone: function (obj) { //多文件上传完毕后的状态回调
            console.log(obj)
        }
        , error: function (index, upload) { //错误回调
            var that = this;
            var tr = that.elemList.find('tr#upload-' + index)
                , tds = tr.children();
            tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
        }
        , progress: function (n, elem, e, index) { //注意：index 参数为 layui 2.6.6 新增
            element.progress('progress-demo-' + index, n + '%'); //执行进度条。n 即为返回的进度百分比
        }
    });

    //多图片上传
    upload.render({
        elem: '#test2'
        , url: '/uploadPic' //此处配置你自己的上传接口即可
        , multiple: true
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo2').append('<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img" width="200px">')
            });
        }
        , done: function (res) {
            //上传完毕
        }
    });

});

const app = document.getElementById("app");
const root = ReactDOM.createRoot(app);
root.render(
    <App></App>
);
