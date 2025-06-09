import React, { useRef, useState, useEffect, useContext } from 'react';

import {
  EyeFilled,
  PlusOutlined,
  DeleteFilled,
  EditFilled,
  ColumnWidthOutlined
} from '@ant-design/icons';
import {
  Button,
  Modal,
  message,
  Table, Input, Popconfirm, Form, Typography,
  InputNumber
} from 'antd';
import ProTable, { ProColumns, IntlProvider, enUSIntl } from '@ant-design/pro-table';
import { connect, Link, history } from 'umi';
import styles from '../style.less';
import ViewDetails from '../components/ViewDetails';
import AssetColumnDialog from '../components/AssetColumnDialog';

const List = (props) => {
  const { loading, dispatch, assetsTypesForm: {
    assetsTypesDeleteReponse,
    assetsTypesCreateStatus,
    assetsTypeList,
    assetsTypesUpdateReponse
  },
    assetForm: {
      columnDefinitions,
    },
    currentUser, localeLanguage } = props;
  // console.log("assetTotalCount****", assetTotalCount)
  const [form] = Form.useForm();
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [createModalVisible, handleModalVisible] = useState(false);
  const [showAssetColumnDialog, setShowAssetColumnDialog] = useState(false);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [dataSource, setDataSource] = useState();
  const [count, setCount] = useState();
  const [editingKey, setEditingKey] = useState('');
  const [selectionType,] = useState('checkbox');
  const [allColumns, setAllColumns] = useState([]);

  useEffect(() => {
    if (location && currentUser) {
      let currentpage = location.pathname.split("/")
      if (currentUser.userType !== 'ADMIN' && currentpage[1] === 'assetstype') {
        history.push({
          pathname: '/projects'
        });
      }
      // setPage(currentpage[1])
    }
  }, [location, currentUser]);

  const handleCancel = async () => {
    setShowModalDialog(value => !value);
  };

  const handleAssetColumnCancel = async () => {
    setRow('')
    setShowAssetColumnDialog(value => !value);
  };
  const editAndDelete = (key, id) => {
    if (key === 'delete') {
      Modal.confirm({
        title: 'Delete',
        content: 'are you sure you want to delete this Asset Type ?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => deleteItem(id),
      });
    }
  };

  const deleteItem = (id) => {
    dispatch({
      type: 'assetsTypesForm/deleteAssetsTypesId',
      payload: [id],
      errorHandler: (e) => {
        message.error(e.data.error.message);
        // dispatch({
        //   type: 'formAndstepFormEdit/setValidationerror',
        //   payload: 'Something Went wrong'
        // });
      }
    });
  };


  useEffect(() => {
    if (assetsTypeList && assetsTypeList.length > 0) {
      assetsTypeList.map((item, i) => {
        item.key = i;
      })
      setDataSource(assetsTypeList)
      setCount(assetsTypeList.length)
    }
  }, [assetsTypeList]);

  useEffect(() => {
    if (columnDefinitions && columnDefinitions.length > 0) {
      setAllColumns(
        columnDefinitions.filter(
          (col) => !(col.field === 'actions' || col.field === 'asset_id')
        )
      );
    }
  }, [columnDefinitions]);


  const handleAssetColumnSubmit = (values) => {
    setShowAssetColumnDialog(false);
    setRow('')
    dispatch({
      type: 'assetsTypesForm/updateAssetType',
      payload: {
        ...values
      },
    });
  };

  const handleSubmit = async (record) => {
    const values = await form.validateFields();
    // console.log(values, "record.Asset_Id", record)
    if (values.Asset_Name) {
      if (record.Asset_Id) {
        dispatch({
          type: 'assetsTypesForm/updateAssetType',
          payload: {
            ...values, Asset_Id: record.Asset_Id
          },
        });
      } else {
        dispatch({
          type: 'assetsTypesForm/submitAssetTypeForm',
          payload: {
            ...values
          },
        });
      }
    }
  };

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'assetsTypesForm/fetchAssetsType',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'assetsTypesForm/resetFormData',
        payload: {}
      });
    }
  }, [dispatch]);

  useEffect(() => {
    // console.log("assetsTypesDeleteReponse", assetsTypesDeleteReponse)
    if (assetsTypesCreateStatus || assetsTypesDeleteReponse || assetsTypesUpdateReponse) {
      handleModalVisible(false);
      setEditingKey('');
      if (assetsTypesCreateStatus && assetsTypesCreateStatus.status === 'success') {
        message.success("Asset Type created successfully.");
      } else if (assetsTypesCreateStatus && assetsTypesCreateStatus.status === 'error') {
        message.error("Failed to create Asset Type.");
      }
      if (assetsTypesDeleteReponse && assetsTypesDeleteReponse === 'success') {
        message.success("Asset Type deleted successfully.");
      } else if (assetsTypesDeleteReponse && assetsTypesDeleteReponse === 'error') {
        message.error("Failed to delete Asset Type.");
      }
      if (assetsTypesUpdateReponse && assetsTypesUpdateReponse.status === 'success') {
        message.success("Asset Type Update successfully.");
      } else if (assetsTypesUpdateReponse && assetsTypesUpdateReponse.status === 'error') {
        message.error("Failed to Update Asset Type.");
      }
      dispatch({
        type: 'assetsTypesForm/fetchAssetsType',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'assetForm/fetchAssetsColumns',
        payload: {
          limit: 100,
          offset: 0
        }
      });
      dispatch({
        type: 'assetsTypesForm/resetFormData',
        payload: {}
      });
    }

  }, [assetsTypesCreateStatus, assetsTypesDeleteReponse, assetsTypesUpdateReponse]);

  const columns1 = [
    {
      title: 'operation',
      dataIndex: 'operation',
      fixed: 'left',
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Link
              onClick={() => handleSubmit(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Link
              disabled={editingKey !== ''}
              onClick={() => {
                setRow(record);
                setShowModalDialog(true);
              }} className={styles.addlead} ><EyeFilled /></Link>
            <Link className={[styles.addlead, styles.editBtn].join(' ')} disabled={editingKey !== ''} onClick={() => edit(record)}>
              <EditFilled />
            </Link>
            <Link to="#" disabled={editingKey !== ''} onClick={() => editAndDelete('delete', record.Asset_Id)} className={[styles.addlead, styles.deleteBtn].join(' ')} ><DeleteFilled /></Link>
          </>
        );
      }
    },
    {
      title: 'Asset Type',
      dataIndex: 'Asset_Name',
      width: '30%',
      editable: true,
      hideinform: false,
    },
    {
      title: 'Form Factor',
      dataIndex: 'formfactor',
      width: '20%',
      editable: true,
      hideinform: false,
    },
    {
      title: 'Sample CO2',
      dataIndex: 'sampleco2',
      editable: true,
    },
    {
      title: 'Sample Weight',
      dataIndex: 'sample_weight',
      editable: true,
    },
    {
      title: 'Columns',
      dataIndex: 'fields',
      editable: false,
      render: (_, record) =>
        <Link onClick={() => {
          setRow(record);
          setShowAssetColumnDialog(true);
        }} className={[styles.addlead, styles.editBtn].join(' ')}>
          <ColumnWidthOutlined />
        </Link>
    }
  ];

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    // console.log(record, "editing celll", editing)
    const handleSubmit1 = async (record) => {
      // setShowAddStatusDialog(value => !value);
      console.log(values, "record.Asset_Id", record)
      const values = await form.validateFields();

      if (record.Asset_Id) {
        dispatch({
          type: 'assetsTypesForm/updateAssetType',
          payload: {
            ...values, Asset_Id: record.Asset_Id
          },
        });
      } else {

        dispatch({
          type: 'assetsTypesForm/submitAssetTypeForm',
          payload: {
            ...values
          },
        });
      }
    };
    // console.log(record ? record.key : '', "=== 11111", editingKey)

    const inputNode = <Input ref={actionRef} onPressEnter={() => handleSubmit1(record)} />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          // rules={[
          //   {
          //     required: true,
          //     message: `Please Input ${title}!`,
          //   },
          // ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      Asset_Id: '',
      Asset_Name: "",
      sampleco2: "",
      sample_weight: ""
    }
    dataSource.splice(-1, 1);
    setDataSource([newData, ...dataSource])
    edit(newData)
    setCount(count + 1);
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const components = {
    body: {
      // row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns11 = columns1.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        // handleSave: handleSubmit(record),
      }),
    };
  });

  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") setDataSource(assetsTypeList);
    else {
      const filteredData = dataSource.filter(item => {
        return Object.keys(item).some(key =>
          item[key] ? item[key].toString().toLowerCase().includes(lowercasedValue) : ''
        );
      });
      setDataSource(filteredData);
    }
  }
  // console.log("assetsTypeList", assetsTypeList)

  return (
    // const { advancedOperation1, advancedOperation2, advancedOperation3 } = profileAndadvanced;
    // <PageContainer
    //   // className={styles.pageHeader}
    // >
    <IntlProvider value={enUSIntl}>
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '98%',
          margin: '0 auto',
          fontSize: '1rem',
          fontWeight: 'bold',
          // background:'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
        }}>
          <div>
            Asset Type and Formfactors
        </div>
          <div
            style={{
              textAlign: 'center',
              width: '400px',
            }}
          >
            <Input.Search
              placeholder="Search Assets Type"
              enterButton="Search"
              size="large"
              onSearch={e => filterData(e)}
              // suffix={suffix}
              allowClear
              style={{
                maxWidth: 522,
                width: '100%',
              }}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button className={styles.btns} onClick={() => handleAdd()} >
              <PlusOutlined />
            </Button>
          </div>
        </div>

        <Form form={form} component={false}>
          <Table
            // headerTitle="Asset Type"
            actionRef={actionRef}
            components={components}
            rowKey="key"
            search={false}
            options={false}
            loading={loading}
            dataSource={dataSource}
            pagination={{
              pageSizeOptions: ['50', '100', '500'],
              pageSize: 100

            }}
            // rowSelection={{
            //   type: selectionType,
            //   ...rowSelection,
            // }}
            // toolBarRender={() => [
            //   <div>
            //     <ExportExcel csvData={assetsTypeList} fileName={'AssetsType'} />,
            //     <Button onClick={() => handleModalVisible(true)} type="primary">
            //       <PlusOutlined /> {<FormattedMessage id="assetTypes-form.form.title" />}</Button>
            //   </div>
            //   ,
            // ]}
            // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
            columns={columns11}
          // rowSelection={{
          //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          // }}
          />
        </Form>
      </div>

      {/* {
        columns.length > 0 && <CreateForm onCancel={() => handleModalVisible(false)} onSubmit={handleSubmit} modalVisible={createModalVisible}>
          <ProTable
            onSubmit={async (value) => {
              // console.log("value", value)
              // const success = await handleAdd(value);

              // if (success) {
              //   handleModalVisible(false);

              //   if (actionRef.current) {
              //     actionRef.current.reload();
              //   }
              // }
            }}
            rowKey="key"
            type="form"
            columns={columns}
          />
        </CreateForm>
      } */}
      {row?.Asset_Id && (
        <ViewDetails
          showModalDialog={showModalDialog}
          handleCancel={handleCancel}
          columnDefinitions={columns1}
          data={row}
        />
      )}
      {row?.Asset_Id && (
        <AssetColumnDialog
          showModalDialog={showAssetColumnDialog}
          handleCancel={handleAssetColumnCancel}
          data={row}
          columnDefinitions={allColumns}
          onSubmit={handleAssetColumnSubmit}
        />
      )}

    </IntlProvider>

    // </PageContainer>
  );
}
export default connect(({ loading, assetsTypesForm, assetForm, user, language }) => ({
  assetsTypesForm,
  user,
  assetForm,
  currentUser: user.currentUser,
  loading: loading.effects['assetsTypesForm/fetchAssetsType'],
  localeLanguage: language.localeLanguage
}))(List);
