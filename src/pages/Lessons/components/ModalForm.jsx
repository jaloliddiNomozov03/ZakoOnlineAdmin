import React from 'react';
import {connect} from "react-redux";
import {Modal, Button, Form, Input, message, Row, Col} from 'antd';
import {EditOutlined, PlusOutlined} from '@ant-design/icons';

import "../../pages.scss";
import CKEditor from "ckeditor4-react";
import {host, port} from "../../../server/host";
import {createLesson, updateLesson} from "../../../server/config/admin/Lessons";

const initialParams = {
    descriptionRu: null,
    descriptionUz: null,
    hashCode: null,
    titleRu: null,
    titleUz: null,
    partId: localStorage.getItem("partId")
};
class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            isSubmitting: false,
            params: {...initialParams}
        };
        // this.currentForm = React.createRef();
    }

    onFinish = () => {
        const {params} = this.state;
        const objToSend = {
            ...params,
        };
        this.setState({isSubmitting: true}, () => {

            if (this.props.edit) {
                const objId = objToSend.id;
                delete objToSend.id;
                updateLesson(objId, objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }

                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                })
            } else {
                createLesson(objToSend).then((res) => {
                    if (res) {
                        message.success('Success');
                    }
                    this.setState({isSubmitting: false, visible: false});
                    this.props.getList();
                    // this.currentForm.current.setFieldsValue(initialParams);
                }).catch(
                    function (error) {
                        // return Promise.reject(error)
                    })
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

    showModal = () => {
        const {edit} = this.props;
        if (edit) {
            const editingObj = this.props.getObj();
            delete editingObj.createAt;
            const hashCode=editingObj.attachment?editingObj.attachment.hashCode:'';
            delete editingObj.attachment;
            this.setState({
                visible: true,
                params: {
                    ...editingObj,
                    hashCode,
                    partId:localStorage.getItem("partId")
                },
            });
        } else {
            this.setState({
                visible: true,
                params: {
                    ...initialParams,
                    partId:localStorage.getItem("partId")
                }
            });
        }
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };
    handleCKUChangeRu = (event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                descriptionRu: data,
            }
        })
    };
    handleCKUChangeUz = (event) => {
        const data = event.editor.getData();
        this.setState({
            params: {
                ...this.state.params,
                descriptionUz: data,
            }
        })
    };

    render() {
        const {
            isSubmitting,
        } = this.state;

        const {
            descriptionRu,
            descriptionUz,
            hashCode,
            titleRu,
            titleUz,
        } = this.state.params;
        const {edit} = this.props;
        return (
            <React.Fragment>
                {
                    edit ? (
                        <Button onClick={this.showModal} title={"Изменить"}>
                            <EditOutlined/>
                        </Button>
                    ) : (
                        <Button type="primary" onClick={this.showModal} title={"Добавить новое"}>
                            <PlusOutlined/>
                        </Button>
                    )
                }
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    title={edit ? "Изменить" : "Добавить новое"}
                    visible={this.state.visible}
                    footer={null}
                    width={800}
                    className="lms-form"
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        onFinish={this.onFinish}
                        ref={this.currentForm}
                        initialValues={{
                            descriptionRu,
                            descriptionUz,
                            hashCode,
                            titleRu,
                            titleUz,
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col span={12}>
                                <Form.Item
                                    label={edit ? (<a target='_blank'
                                                      href={`${host}:${port}` + '/api/client/file/preview/' + hashCode}>
                                        Изображение учителя</a>) : 'Хэш-коды файлов'}
                                    name="hashCode"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Хэш-код!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'Hash Code'}
                                        name="hashCode"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={"Русское Название"}
                                    name="titleRu"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Русское Название!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'NameRu'}
                                        name="titleRu"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"Узбекский Название"}
                                    name="titleUz"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Узбекский Название!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={'NameUz'}
                                        name="titleUz"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[16]}>
                            <Col span={24}>
                                <Form.Item
                                    label={"О Урок (русский)"}
                                    name="descriptionRu"
                                    rules={[
                                        {
                                            required: true,
                                            message: `О учителе (русский)!`,
                                        },
                                    ]}
                                >
                                    <CKEditor
                                        style={{minHeight: "400px"}}
                                        config={{
                                            allowedContent: true,
                                            extraPlugins: 'autogrow,sourcedialog',
                                            removePlugins: 'sourcearea'
                                        }}
                                        data={`${descriptionRu ? descriptionRu : ''}`}
                                        onChange={this.handleCKUChangeRu}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={"О Урок (узбек)"}
                                    name="descriptionUz"
                                    rules={[
                                        {
                                            required: true,
                                            message: `О учителе (узбек)!`,
                                        },
                                    ]}
                                >
                                    <CKEditor
                                        style={{minHeight: "400px"}}
                                        config={{
                                            allowedContent: true,
                                            extraPlugins: 'autogrow,sourcedialog',
                                            removePlugins: 'sourcearea'
                                        }}
                                        data={`${descriptionUz ? descriptionUz : ''}`}
                                        onChange={this.handleCKUChangeUz}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="form-footer" justify="end" gutter={[8]}>
                            <Col>
                                <Form.Item>
                                    <Button onClick={this.handleCancel} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                        ОК
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
};

export default connect(mapStateToProps)(ModalForm);