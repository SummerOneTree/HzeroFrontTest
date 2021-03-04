import { getResponse } from 'utils/utils';
import { handleHeavyPush } from '@/services/monitoringManagementService';

export default {
  namespace: 'monitoringManagement',

  state: {},
  effects: {
    // 查询初始允差值
    *handleHeavyPush({ payload }, { call, put }) {
      const result = yield call(handleHeavyPush, payload);
      if (getResponse(result)) {
        yield put({
          type: 'updateState',
          payload: {},
        });
        return result;
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
