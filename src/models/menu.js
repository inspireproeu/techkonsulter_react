import { message } from 'antd';

import { queryCurrent, query as queryUsers, fakeUpdateUser } from '@/services/user';
import { setAuthority, getAccessToken, setAccessToken, removeAuthority, removeAccessToken } from '@/utils/authority';

const MenuModel = {
  namespace: 'menu',
  state: {
    menuData: [{
      "path": "/overview",
      "name": "new",
      'redirect': '/forms/byggnadskreditiv',
      "children": [{
        "path": "/overview/daily",
        "name": "analysis12",
        "children": null,
        "component": './forms/byggnadskreditiv',
        "authority": null,
        icon: 'plus',
      }],
      "authority": ["admin", "user"]
    }],
  },
  effects: {
    *fetchMenu(_, { call, put }) {
      /* const response = yield call(getMenuData);
      yield put({
        type: 'saveMenuData',
        payload: response.data,
      }); */
    },
  },
  reducers: {
    saveMenuData(state, action) {
      return {
        ...state,
        menuData: action.payload || [],
      };
    },
  },
};
export default MenuModel;
