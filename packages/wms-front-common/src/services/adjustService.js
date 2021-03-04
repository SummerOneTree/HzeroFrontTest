import request from 'utils/request';
import { WMS_INV } from 'wmsUtils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const currentTenantID = getCurrentOrganizationId();

export function getAdjustLock(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/adjust-orders/getLock`, {
    method: 'PUT',
    body: data,
  });
}

export function getAdjustBatchLock(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/adjust-orders/batchLock`, {
    method: 'PUT',
    body: data,
  });
}

export function releaseAdjustLock(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/adjust-orders/releaseLock`, {
    method: 'PUT',
    body: data,
  });
}

export function releaseAdjustBatchLock(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/adjust-orders/batchReleaseLock`, {
    method: 'PUT',
    body: data,
  });
}

export function removeToPool(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/adjust-order-lines`, {
    method: 'PUT',
    body: data,
  });
}
