import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, message, Modal, Button } from 'antd';
import { deviceList, deviceUpdate, deviceAdd, deviceDel } from '@/services/equipment';

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

const originData: any = [];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = (props: any) => {
  console.log('props');
  console.log(props.data);
  const [form] = Form.useForm();
  const [data, setData] = useState(props.data);
  const [editingKey, setEditingKey] = useState('');
  console.log('data');
  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Item) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const updateDevice = async (param) => {
    try {
      console.log('------------更新设备----------');
      console.log(param);
      await deviceUpdate(param);
      message.success('设备更新成功');
    } catch (error) {
      return false;
    }
  };

  const addDevice = async (param) => {
    try {
      console.log('------------增加设备----------');
      console.log(param);
      const newData = [...data];
      console.log(newData);
      await deviceAdd(param);
      message.success('设备增加成功');
    } catch (error) {
      return false;
    }
  };

  const delDevice = async (param) => {
    try {
      console.log('------------删除设备----------');
      console.log(param);
      await deviceDel(param);
      message.success('设备删除成功');
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    setData(props.data)
  }, [props.data]);

  const save = async (key: React.Key) => {
    try {
      console.log('----------------------');
      console.log(key);

      const row = (await form.validateFields()) as Item;
      console.log(row);

      const newData = [...data];
      console.log(newData);
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        await updateDevice(row);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'ip',
      dataIndex: 'age',
      width: '25%',
      editable: true,
    },
    {
      title: 'port',
      dataIndex: 'address',
      width: '25%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              保存
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ''} onClick={() => edit(record)}>
            管理
          </a>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

class App extends React.Component {
  state: any = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
    ipValue: '',
    portValue: '',
    nameValue: '',
    dataList: [],
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  getDeviceList = async (fields?: any) => {
    const hide = message.loading('设备列表获取中');
    try {
      const deviceListInfo = await deviceList({});
      const list = [];
      for (let i = 0; i < 2; i++) {
        list.push({
          key: i.toString(),
          name: `Edrward ${i}`,
          age: 32,
          address: `London Park no. ${i}`,
        });
      }
      this.setState({
        dataList: list,
      });
      hide();
      // message.success('设备列表获取成功');
      return true;
    } catch (error) {
      hide();
      // message.error('设备列表获取失败！');
      return false;
    }
  };

  componentDidMount() {
    this.getDeviceList();
  }

  handleOk = async () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    console.log(this.state);
    const aa = await deviceAdd({});
    console.log(aa);
    const { dataList } = this.state;
    dataList.push({
      key: '2',
      name: `ceshi`,
      age: 32,
      address: `ceshi`,
    });
    this.setState({
      visible: false,
      confirmLoading: false,
      dataList,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onDeviceName = (value: string) => {
    this.setState({
      nameValue: value,
    });
  };

  onDeviceIp = (value: string) => {
    this.setState({
      ipValue: value,
    });
  };

  onDevicePort = (value: string) => {
    this.setState({
      portValue: value,
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.addData}>
          <div onClick={this.showModal} className={styles.addDeviceInfo}>
            新增
          </div>
        </div>
        <div id="components-table-demo-edit-row">
          <EditableTable data={this.state.dataList} />
        </div>
        <Modal
          title="新增设备"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Input
            value={this.state.nameValue}
            placeholder="设备名称"
            className={styles.deviceInfoCss}
            onChange={(e: any) => this.onDeviceName(e.target.value)}
          />
          <Input
            value={this.state.ipValue}
            placeholder="设备IP"
            className={styles.deviceInfoCss}
            onChange={(e: any) => this.onDeviceIp(e.target.value)}
          />
          <Input
            value={this.state.portValue}
            placeholder="设备端口"
            className={styles.deviceInfoCss}
            onChange={(e: any) => this.onDevicePort(e.target.value)}
          />
        </Modal>
      </div>
    );
  }
}

export default App;
