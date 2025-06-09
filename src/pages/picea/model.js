import { message } from 'antd';
import { history } from 'umi';

import { 
  queryAssetList,
  queryCertusColumns
} from './service';
const Model = {
  namespace: 'piceaForm',
  state: {
    transactionsList : [],
    columnDefinitions: [],
    assetTotalCount: 0
  },
  effects: {
    *fetchAssets({ payload }, { call, put }) {
      const response = yield call(queryAssetList, payload);
      yield put({
        type: 'reducerAssetList',
        payload: response,
      });
    },
    *fetchCertusColumns({ payload }, { call, put }) {
      const response = yield call(queryCertusColumns, payload);
      yield put({
        type: 'reducerColumnList',
        payload: response,
      });
    },
    
  },
  reducers: {
    reducerAssetList(state, action) {
      return { ...state, transactionsList: action.payload.transactions, assetTotalCount:  action.payload.totalCount.count};
    },
    reducerColumnList(state, action) {
      return { ...state, columnDefinitions: action.payload.columnDefinitions};
    },
		resetFormData(state, { payload }) {
      return { ...state, 
        customersById: payload, 
        id: '', 
        validationerror: '', 
        addCustomerStatus: undefined, 
        currentStatus: undefined, 
        reportUpdateStatus: undefined,
        addSalesRepStatus: undefined,
        salesRepLists: []
      };
    },

  },
};
export default Model;
