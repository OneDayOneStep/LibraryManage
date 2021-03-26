import React, { Component } from "react";
import {
    Table,
    Space,
    Button,
    Popconfirm,
    message,
    Spin,
    Image,
    Modal,
    Row,
    Col,
    Input,
    Select,
    Tooltip
} from 'antd';

import {
    PlusCircleOutlined,
    BoldOutlined,
    AimOutlined,
    FileImageOutlined,
    InboxOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.account = React.createRef();
        this.state = {
            columns: [
                {
                    title: '书名',
                    dataIndex: 'bookname',
                    ellipsis: {
                        showTitle: false
                    },
                    render: bookname => (
                        <Tooltip placement="topLeft" title={bookname}>
                            {bookname}
                        </Tooltip>
                    )
                },
                {
                    title: 'ISBN',
                    dataIndex: 'isbn'
                },
                {
                    title: '书籍图片',
                    render: (t, r) => (
                        <Image
                            width={100}
                            alt="书籍图片"
                            src={this.server + "/" + r.image}
                        />
                    )
                },
                {
                    title: '在馆数量',
                    dataIndex: 'booknum'
                },
                {
                    title: '借阅数量',
                    dataIndex: 'borrownum'
                },
                {
                    title: '在馆位置',
                    dataIndex: 'place'
                },
                {
                    title: '操作',
                    fixed: "right",
                    width: 250,
                    render: (t, r) => (
                        <Space size="middle">
                            <Button type="primary" onClick={this.openBorrowModal.bind(this, r)}>借阅</Button>
                            <Button type="primary" onClick={() => {
                                this.setState(Object.assign({}, r, {
                                    isModalVisible: true,
                                    file: null,
                                    image: "",
                                    isEdit: true
                                }))
                            }}>修改</Button>
                            <Popconfirm
                                title="确定删除该图书？"
                                onConfirm={this.deleteBook.bind(this, r)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type="primary" danger>删除</Button>
                            </Popconfirm>
                        </Space>
                    )
                },
            ],
            bookList: [],
            loading: false,
            // modal
            isbn: "",
            bookname: "",
            image: "",
            file: null,
            booknum: "",
            place: "",
            // borrowModal
            borrowModal: false,
            borrowerName: "",
            borrowerId: "",
            loadingUser: false,
            userList: []
        };
    }
    getBook() {
        if (this.props.userInfo.token) {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                this.Axios.get("/api/showBook", {
                    params: {
                        token: this.props.userInfo.token
                    }
                })
                    .then((res) => {
                        let d = Array.isArray(res.data.message) ? res.data.message : [];
                        this.setState({
                            bookList: d,
                            loading: false
                        })
                    })
                    .catch(() => {});
            }, 1000)
        }
    }
    componentDidMount() {
        this.getBook();
    }
    deleteBook(r) {
        this.Axios.post("/api/deleteBook", {
            token: this.props.userInfo.token,
            isbn: r.isbn
        })
            .then(r => {
                if (r.data.success) {
                    message.success(r.data.message);
                } else {
                    message.error(r.data.message);
                }
                this.getBook();
            })
            .catch(() => {
                message.error("操作失败");
            });
    }
    editBook() {
        let formData = new FormData();
        formData.append("image", this.state.file);
        //
        formData.append("token", this.props.userInfo.token);
        formData.append("isbn", this.state.isbn);
        formData.append("bookname", this.state.bookname);
        formData.append("booknum", this.state.booknum);
        formData.append("place", this.state.place);
        this.Axios.post(this.state.isEdit ? "/api/updateBook" : "/api/addBook",
            formData,
            {
                headers: {'Content-Type': 'multipart/form-data'}
            }
        )
            .then(() => {
                message.success("操作成功");
                this.setState({
                    isModalVisible: false
                });
                this.getBook();
            })
            .catch(err => {
                console.log(err);
                message.error("操作失败");
            });
    }
    changeValue(which, e) {
        if (which === "image") {
            this.setState({
                file: e.target.files[0]
            });
        }
        let updateValue = {};
        updateValue[which] = e.target.value || "";
        this.setState(updateValue);
    }
    openBorrowModal(r) {
        this.setState({
            borrowModal: true,
            isEdit: true,
            isbn: r.isbn,
            bookname: r.bookname,
            borrowName: "",
            borrowId: "",
            loadingUser: true
        });
        this.Axios.get("/api/showUser", {
            params: {
                token: this.props.userInfo.token
            }
        })
            .then((res) => {
                let d = Array.isArray(res.data.message) ? res.data.message : [];
                this.setState({
                    userList: d,
                    loadingUser: false
                })
            })
            .catch(() => {});
    }
    borrow() {
        this.Axios.post("/api/bookBorrow",{
                token: this.props.userInfo.token,
                uid: this.state.borrowId,
                isbn: this.state.isbn
            }
        )
            .then(r => {
                if (r.data.success) {
                    message.success(r.data.message);
                } else {
                    message.error(r.data.message);
                }
                this.setState({
                    borrowModal: false
                });
                this.getBook();
            })
            .catch(err => {
                console.log(err);
                message.error("操作失败");
            });
    }
    render() {
        return (
            <div className="pages">
                <div style={{
                    paddingBottom: "10px",
                    textAlign: "right"
                }}>
                    <Button type="primary" icon={<PlusCircleOutlined />} size="large" onClick={() => {
                        this.setState({
                            isModalVisible: true,
                            isbn: "",
                            bookname: "",
                            image: "",
                            file: null,
                            booknum: "",
                            place: "",
                            isEdit: false
                        })
                    }}>
                        新增图书
                    </Button>
                </div>
                <Spin spinning={this.state.loading}>
                    <Table columns={this.state.columns}
                           dataSource={this.state.bookList}
                           rowKey={record => record.isbn}
                           scroll={{ x: 1000, y: this.props.height - 300 }}
                    />
                </Spin>


                <Modal title={(this.state.isEdit ? "修改" : "增加") + "图书"}
                       visible={this.state.isModalVisible}
                       onOk={this.editBook.bind(this)}
                       onCancel={() => {
                           this.setState({
                               isModalVisible: false
                           })
                       }}
                       okText={this.state.isEdit ? "修改" : "增加"}
                       cancelText="取消"
                >
                    <div className="RowSpace">
                        <Row>
                            <Col span={24}>
                                <Input placeholder="书名" size="large" value={this.state.bookname}
                                       prefix={<BoldOutlined/>}
                                       onChange={this.changeValue.bind(this, "bookname")} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input placeholder="ISBN" size="large" value={this.state.isbn}
                                       prefix={<AimOutlined />}
                                       onChange={this.changeValue.bind(this, "isbn")}  disabled={this.state.isEdit} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input placeholder="书籍图片" size="large" value={this.state.image}
                                       prefix={<FileImageOutlined />}
                                       type="file"
                                       onChange={this.changeValue.bind(this, "image")}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input placeholder="藏书数量" size="large" value={this.state.booknum}
                                       prefix={<InboxOutlined />}
                                       onChange={this.changeValue.bind(this, "booknum")}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input placeholder="在馆位置" size="large" value={this.state.place}
                                       prefix={<EnvironmentOutlined />}
                                       onChange={this.changeValue.bind(this, "place")}
                                />
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal title="借阅"
                       visible={this.state.borrowModal}
                       onOk={this.borrow.bind(this)}
                       onCancel={() => {
                           this.setState({
                               borrowModal: false
                           })
                       }}
                       okText="确定"
                       cancelText="取消"
                >
                    <div className="RowSpace">
                        <Row>
                            <Col span={24}>
                                <Input placeholder="书名" size="large" value={this.state.bookname}
                                       prefix={<BoldOutlined/>}
                                       disabled={this.state.isEdit} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input placeholder="ISBN" size="large" value={this.state.isbn}
                                       prefix={<AimOutlined />}
                                       disabled={this.state.isEdit} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Select
                                    style={{
                                        width: "100%"
                                    }}
                                    size="large"
                                    showSearch
                                    placeholder="读者"
                                    optionFilterProp="children"
                                    onChange={(v, r) => {
                                        this.setState({
                                            borrowName: r.label,
                                            borrowId: r.value
                                        })
                                    }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    loading={this.state.loadingUser}
                                    value={this.state.borrowName}
                                >
                                    {
                                        this.state.userList.map(e =>
                                            <Select.Option key={e.id.toString()} value={e.id} label={e.name}>
                                                {e.name}
                                            </Select.Option>)
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        )
    }
}