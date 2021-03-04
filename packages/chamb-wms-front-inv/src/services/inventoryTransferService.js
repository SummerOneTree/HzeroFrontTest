import request from 'utils/request';
import { WMS_INV, WMS_MDM } from 'wmsUtils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const currentTenantID = getCurrentOrganizationId();

export function getQtyData(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/stocks/qty-query-for-transfer`, {
    method: 'GET',
    query: { ...data },
  });
}

export function isCidController(data) {
  return request(`${WMS_MDM}/v1/${currentTenantID}/locations`, {
    method: 'GET',
    query: { id: data },
  });
}

export function queryParam(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/stock-trans/query-param`, {
    method: 'GET',
    query: { pageCode: data },
  });
}

export function vendorIsDisabled(data) {
  return request(`${WMS_MDM}/v1/${currentTenantID}/batchs`, {
    method: 'GET',
    query: { ...data },
  });
}

export function unstacking(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/app-inv/unstacking`, {
    method: 'POST',
    body: { fromCidCode: data },
  });
}

export function cidIsInOther(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/stocks/query-cid-except-location`, {
    method: 'GET',
    query: { ...data },
  });
}

export function serialIsInOtherHave(data) {
  return request(`${WMS_MDM}/v1/${currentTenantID}/serial-numbers-info/check`, {
    method: 'GET',
    query: { ...data },
  });
}
