import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';

const currentTenantID = getCurrentOrganizationId();
const WMS_INV = '/winv';

export async function handleHeavyPush(params) {
  console.log(params);
  return request(`${WMS_INV}/v1/${currentTenantID}/GetStockLogInf/processToEbs`, {
    method: 'GET',
    query: params,
  });
}
