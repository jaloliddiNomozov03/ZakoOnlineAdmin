import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, message, Row, Col, Checkbox } from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import {host, port} from "../../../server/host";

import "../../pages.scss";
import {createUsers, updateUsers} from "../../../server/config/admin/Users";
import CKEditor from "ckeditor4-react";
import {createTeacher, updateTeacher} from "../../../server/config/admin/Teacher";

const initialParams = {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    accountNonLocked:null,
    hashCode: null,
    username: null,
    password: null,
    telegram: null,
    instagram: null,
    facebook: null,
    aboutUz: null,
    aboutRu: null,
};

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            isSubmitting: false,
            params: {...initialParams}
        };
        this.currentForm = React.createRef();
    }
    onFinish = () => {
        const {params} = this.state;
        const objToSend = {
            ...params,
        };
        const {userType} = this.props;
        this.setState({isSubmitting: true}, () => {
            if (this.props.edit) {
                const userId = objToSend.id;
                delete objToSend.id;
                console.log(objToSend);
                userType==='student'?(updateUsers(userId, objToSend).then((res) => {
                    if (res) {
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    console.log(initialParams);
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                })):(updateTeacher(userId, objToSend).then((res) => {
                    if (res) {
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                }))
            } else {
                console.log(objToSend);
                userType==='student'?(createUsers(objToSend).then((res) => {
                    if (res) {
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                })):(createTeacher(objToSend).then((res) => {
                    if (res) {
                        res.data.success? message.success(res.data.message):message.error(res.data.message);
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    this.currentForm.current.setFieldsValue(initialParams);
                }).catch(e=>{
                    message.success('Request failed!');
                }))
            }
        });
    };
    handleInputChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            params: {
                ...this.state.params,
                [name]: value,
            }
        })
    };
    handleSelectChange = (name, value) => {
        if (name) {
            this.setState({
                params: {
                    ...this.state.params,
                    [name]: value,
                }
            })
        }
    };

    showModal = () => {
        const {edit} = this.props;
        if (edit) {
            const editingObj = this.props.getObj();
            let hashCode=editingObj.attachment?editingObj.attachment.hashCode:'';
            delete editingObj.attachment;
            this.setState({
                visible: true,
                params: {
                    ...editingObj,
                    hashCode,
                },
            });
        } else {
            this.setState({
                visible: true,
            });
        }
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };
    componentDidMount() {
        const {edit} = this.props;
        if (edit) {

        }
    }
    handleCKUChangeRu = (event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                aboutRu: data,
            }
        })
    };
    handleCKUChangeUz = (event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                aboutUz: data,
            }
        })
    };
    handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        this.setState({
            params: {
                ...this.state.params,
                accountNonLocked: checked,
            }
        })
    };
    render() {
        const {
            isSubmitting,
        } = this.state;

        const {
            firstName,
            lastName,
            phoneNumber,
            hashCode,
            username,
            password,
            telegram,
            instagram,
            facebook,
            aboutUz,
            aboutRu,
            accountNonLocked
        } = this.state.params;

        const {edit, courses, userType} = this.props;
        return (
            <React.Fragment>
                {
                    edit ? (
                        <Button onClick={this.showModal} title={"????????????????"}>
                            <EditOutlined/>
                        </Button>
                    ) : (
                        <Button type="primary" onClick={this.showModal} title={"???????????????? ??????????"}>
                            <PlusOutlined/>
                        </Button>
                    )
                }
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={edit ? "????????????????" : "???????????????? ??????????"}
                    visible={this.state.visible}
                    footer={null}
                    width={1200}
                    className="lms-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={this.onFinish}
                        ref={this.currentForm}
                        initialValues={{
                            firstName,
                            lastName,
                            phoneNumber,
                            hashCode,
                            username,
                            password,
                            telegram,
                            instagram,
                            facebook,
                            aboutUz,
                            aboutRu,
                            accountNonLocked
                        }}
                    >
                        <h3>{userType==='teacher'?"???????????????????? ?? ??????????????":"???????????????????? ?? ??????????????"}</h3>
                        <Row gutter={[16]}>
                            <Col span={12}>
                                <Form.Item
                                    label={edit ? (<a target='_blank'
                                                      href={`${host}:${port}` + '/api/client/file/preview/' + hashCode}>
                                        ?????????????????????? ??????????????</a>) : '??????-???????? ????????????'}
                                    name="hashCode"
                                    rules={[
                                        {
                                            message: '??????-??????!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'Hash Code'}
                                        name="hashCode"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"??????"}
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                            message: `??????!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"??????"}
                                        name="firstName"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"??????????????"}
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                            message: `??????????????!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"??????????????"}
                                        name="lastName"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={"???????????????????? ??????????"}
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: `???????????????????? ??????????!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"???????????????????? ??????????"}
                                        name="phoneNumber"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"????. ??????????"}
                                    name="username"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        },
                                        {
                                            required: true,
                                            message: `????. ??????????!`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"????. ??????????"}
                                        name="username"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"??????????"}
                                    name="password"
                                    rules={[
                                        {
                                            message: `??????????!`,
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder={"??????????"}
                                        name="password"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Checkbox
                                    onChange={this.handleCheckboxChange}
                                    defaultChecked={accountNonLocked}>
                                    ??????????
                                </Checkbox>
                            </Col>
                        </Row>
                        <Row gutter={[16]}>
                            <Col span={24}>
                                {userType==='teacher'?
                                    (<div>
                                        <Form.Item
                                            label={" Facebook"}
                                            name="facebook"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Facebook!`,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder={" Facebook"}
                                                name="facebook"
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={" Telegram"}
                                            name="telegram"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `telegram!`,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder={" Telegram"}
                                                name="telegram"
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={" Instagram"}
                                            name="instagram"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Instagram!`,
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder={" Instagram"}
                                                name="instagram"
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Item>
                                    </div>):''}
                            </Col>
                        </Row>
                        {userType==='teacher'?
                            (<Row gutter={[16]}>
                            <Col span={24}>
                                <Form.Item
                                    label={"?? ?????????????? (??????????????)"}
                                    name="aboutRu"
                                    rules={[
                                        {
                                            required: true,
                                            message: `?? ?????????????? (??????????????)!`,
                                        },
                                    ]}
                                >
                                    <CKEditor
                                        style={{minHeight: "400px"}}
                                        config={{
                                            allowedContent :true,
                                            extraPlugins : 'autogrow,sourcedialog',
                                            removePlugins : 'sourcearea'
                                        }}
                                        data={`${aboutRu}`}
                                        onChange={this.handleCKUChangeRu}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={"?? ?????????????? (??????????)"}
                                    name="aboutUz"
                                    rules={[
                                        {
                                            required: true,
                                            message: `?? ?????????????? (??????????)!`,
                                        },
                                    ]}
                                >
                                    <CKEditor
                                        style={{minHeight: "400px"}}
                                        config={{
                                            allowedContent :true,
                                            extraPlugins : 'autogrow,sourcedialog',
                                            removePlugins : 'sourcearea'
                                        }}
                                        data={`${aboutUz}`}
                                        onChange={this.handleCKUChangeUz}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>):''}
                        <Row className="form-footer" justify="end" gutter={[8]}>
                            <Col>
                                <Form.Item>
                                    <Button onClick={this.handleCancel} disabled={isSubmitting}>
                                        ????????????
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                        Ok
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps)(ModalForm);