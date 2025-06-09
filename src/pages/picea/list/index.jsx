import React, { useRef, useState, useEffect } from 'react';

import {
  EyeFilled,
  PlusOutlined,
  DeleteFilled,
  EditOutlined,
  DownloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Modal,
  message,
  Space,
  Pagination,
  Table, Input
} from 'antd';
import ProTable, { ProColumns, IntlProvider, enUSIntl } from '@ant-design/pro-table';
import { connect, Link, FormattedMessage, formatMessage } from 'umi';
import styles from '../style.less';
import ViewDetails from '../components/ViewDetails';
// import CustomerModal from '../components/CustomerModal';
import ProDescriptions from '@ant-design/pro-descriptions';
import ExportExcel from '@/utils/exportExcel';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

const List = (props) => {
  const { loading, dispatch, piceaForm: { transactionsList, assetTotalCount, columnDefinitions }, currentUser, localeLanguage } = props;
  // console.log("columnDefinitions****", columnDefinitions)
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [showModalDialog, setShowModalDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [customerData, setCustomerData] = useState({});
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const [tableColumns, setTableColumns] = useState([]);
  const [pageSize, setPageSize] = useState(100);
  const [offset, setOffset] = useState(0);
  const [assetDataList, setAssetDataList] = useState([]);

  const refInput = useRef();

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={refInput}
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchedColumn(dataIndex)
              setSearchText(selectedKeys[0])
              // this.setState({
              //   searchText: selectedKeys[0],
              //   searchedColumn: dataIndex,
              // });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#ffffff' : '#ffffff' }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      // if (visible) {
      //   setTimeout(() => refInput.select(), 100);
      // }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex)
    setSearchText(selectedKeys[0])

    // this.setState({
    //   searchText: selectedKeys[0],
    //   searchedColumn: dataIndex,
    // });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')

    // this.setState({ searchText: '' });
  };

  const columns = [
    {
      title: `Product ID`,
      dataIndex: 'product_id',
      key: 'product_id',
      render: (dom, entity) => {
        return <Link onClick={() => { setRow(entity); setShowModalDialog(true); }}>{dom}</Link>;
      },
    },
    {
      title: `Client Name`,
      dataIndex: 'client_name',
      key: 'client_name',
      // render: (item) => {
      //   return <div>{Asset_id}</div>;
      // },
    },
    {
      title: `IMEI`,
      dataIndex: 'imei',
      key: 'imei',
    },
    {
      title: `Manufacturer`,
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      render: (item) => {
        return <div className={styles.tableCell}>{item}</div>;
      },
    },
    {
      title: `Model Name`,
      dataIndex: 'model_name',
      key: 'model_name',

    },
    {
      title: `Serial Number`,
      dataIndex: 'serial_number',
      key: 'serial_number',
    },
    {
      title: `Device UID`,
      dataIndex: 'device_uid',
      key: 'device_uid',
    },
    {
      title: `Action`,
      dataIndex: '',
      key: '',
      render: (_, record) => {
        return <div>
          <Link onClick={() => {
            setRow(record);
            setShowModalDialog(true);
          }
          } className={styles.addlead} ><EyeFilled /></Link>
        </div>;
      },
    }
  ];
  useEffect(() => {
    // componentWillMount events
    // console.log("columnDefinitions", columnDefinitions);
    let columnsDef = [];
    columnDefinitions.map((item, i) => {
      if (!item.hideinform) {
        columnsDef.push({
          title: item.header_name,
          dataIndex: item.field,
          key: item.order_by_id,
          width: item.header_name.length > 14 ? 200 : 150,
          sorter: true,
          ellipsis: true,
          // ellipsis: {
          //   showTitle: false,
          // },
          // render: item => (
          //   <Tooltip placement="topLeft" title={item}>
          //     {item} jkjk
          //   </Tooltip>
          // ),
          ...getColumnSearchProps(item.field, item.header_name),
        })
      } else if (item.field === 'actions') {
        columnsDef.push(
          {
            title: `Action`,
            dataIndex: '',
            key: '',
            fixed: 'left',
            width: 100,
            render: (_, record) => {
              return <div>
                <Link onClick={() => {
                  setRow(record);
                  setShowModalDialog(true);
                }
                } className={styles.addlead} ><EyeFilled /></Link>
              </div>;
            },
          }
        )
      }
    })
    // console.log("columnsDef", columnsDef)
    setTableColumns(columnsDef)
    // }    
  }, [columnDefinitions]);

  const handleCancel = async () => {
    setShowModalDialog(value => !value);
  };
  const handleViewCancel = async () => {
    setShowDialog(value => !value);
  };

  useEffect(() => {
    // componentWillMount events
    // console.log("currentUser", currentUser)
    // if (dispatch && currentUser && currentUser.id) {
    dispatch({
      type: 'piceaForm/fetchAssets',
      payload: {
        limit: 100,
        offset: 0
      }
    });
    dispatch({
      type: 'piceaForm/fetchCertusColumns',
      payload: {
        limit: 100,
        offset: 0
      }
    });
    dispatch({
      type: 'piceaForm/resetFormData',
      payload: {}
    });
    // }    
  }, [currentUser]);

  const handlePagination1 = (pagination, filters, sorter) => {
    //console.log("pageNumber", pageNumber);
    dispatch({
      type: 'piceaForm/fetchAssets',
      payload: {
        limit: pagination.pageSize,
        offset: ((pagination.current * pagination.pageSize) - pagination.pageSize)
      }
    });
  }
  const handlePagination = (pageNumber, pageSize) => {
    dispatch({
      type: 'assetForm/fetchAssets',
      payload: {
        limit: pageSize,
        offset: ((pageNumber * pageSize) - pageSize)
      }
    });
  }

  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        // editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    // componentWillMount events
    // console.log("currentUser", currentUser)
    if (transactionsList && transactionsList.length > 0) {
      transactionsList.map((item, i) => {
        item.key = item.index;
      })
      setAssetDataList(transactionsList)
    }
  }, [transactionsList]);
  
  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") setAssetDataList(transactionsList);
    else {
      const filteredData = assetDataList.filter(item => {
        return Object.keys(item).some(key =>
          item[key] ? item[key].toString().toLowerCase().includes(lowercasedValue) : ''
        );
      });
      setAssetDataList(filteredData);
    }
  }
  return (
    // const { advancedOperation1, advancedOperation2, advancedOperation3 } = profileAndadvanced;
    // <PageContainer
    //   // className={styles.pageHeader}
    // >
    <IntlProvider value={enUSIntl}>
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
          Picea Devices
        </div>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Input.Search
            placeholder="Search Assets"
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
        <div style={{textAlign:'right'}}>
        <ExportExcel csvData={assetDataList} fileName={'picea_devices'} />
      </div>
      </div>


      <Table
        // components={{
        //   body: {
        //     cell: EditableCell,
        //   },
        // }}
        bordered
        // dataSource={data}
        dataSource={assetDataList}
        columns={mergedColumns}
        rowClassName="editable-row"
        scroll={{ x: 1500, y: 1000 }}
        loading={loading}
        // toolBarRender={() => [
        //   <div>
        //     <ExportExcel csvData={transactionsList} fileName={'Assets'}/>,
        //     <Button onClick={() => handleModalVisible(true)} type="primary">
        //     <PlusOutlined /> {<FormattedMessage id="asset-form.form.title" />}</Button>
        //   </div>
        // ,
        // ]}
        pagination={{
          pageSizeOptions: ['50', '100', '500'],
          showSizeChanger: true,
          onChange: handlePagination1,
          pageSize: pageSize,
          total: assetTotalCount
        }}
      // pagination={{
      //   onChange: cancel,
      // }}
      />
      {/* <ProTable
            headerTitle="Picea Devices"
            actionRef={actionRef}
            rowKey="key"
            search={false}
            options={false}
            loading={loading}
            pagination={{
              onChange: handlePagination,
              pageSize: pageSize,
              total: assetTotalCount
            }}
            scroll={{ x: 1500, y: 1000 }} 
            dataSource={transactionsList}
            toolBarRender={() => [
              <ExportExcel csvData={transactionsList} fileName={'picea_devices'}/>
              ,
              ]}
            columns={tableColumns}
          /> */}
      {row?.device_uid && (
        <ViewDetails
          showModalDialog={showModalDialog}
          handleCancel={handleCancel}
          columnDefinitions={columnDefinitions}
          data={row}
        />
      )}
    </IntlProvider>

    // </PageContainer>
  );
}
export default connect(({ loading, piceaForm, user, language }) => ({
  piceaForm,
  user,
  currentUser: user.currentUser,
  loading: loading.effects['piceaForm/fetchAssets'],
  localeLanguage: language.localeLanguage
}))(List);
