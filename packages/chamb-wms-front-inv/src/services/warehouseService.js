import request from 'utils/request';
import { WMS_INV, WMS_MDM } from 'wmsUtils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const currentTenantID = getCurrentOrganizationId();

export function getWarrantLock(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-orders/getLock`, {
    method: 'PUT',
    body: data,
  });
}

export function releaseWarrantLock(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-orders/releaseLock`, {
    method: 'PUT',
    body: data,
  });
}

export function checkBatchCode(data) {
  return request(`${WMS_MDM}/v1/${currentTenantID}/batchs/check`, {
    method: 'GET',
    query: data,
  });
}
/**
 * 标准打包接口
 * @param data
 * @date: 2020-01-13
 * @author: david<yikang.dai@hand-china.com>
 */
export function packageBase(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-order-lines/packaged`, {
    method: 'POST',
    body: data,
  });
}

/**
 * 自定义打包接口
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function cusPackage(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-order-lines/custom-packaged`, {
    method: 'POST',
    body: data,
  });
}
/**
 * 标准获取行打包数量信息接口
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function getPackageNum(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-order-lines/calculation-package-data`, {
    method: 'GET',
    query: data,
  });
}
/**
 * 自定义获取行打包数量信息接口
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function getCusPackageNum(data) {
  return request(
    `${WMS_INV}/v1/${currentTenantID}/inbound-order-lines/calculation-custom-package-data`,
    {
      method: 'GET',
      query: data,
    }
  );
}
/**
 * 自定义预览
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function getCusPackagePreView(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-order-lines/generate-line-data`, {
    method: 'GET',
    query: data,
  });
}
/**
 * 入库单行收货
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function lineDeliverGoods(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/lines-receive`, {
    method: 'PUT',
    body: data,
  });
}
/**
 * 入库单行快速收货
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function lineQuickDeliverGoods(data) {
  const submitData = data;
  submitData[0].inWhareaCode = data[0].whareaCode;
  submitData[0].inWhareaId = data[0].whareaId;
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/lines-quick-inbound`, {
    method: 'PUT',
    body: submitData,
  });
}
/**
 * 入库通知单锁
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function getNoticeLock(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-notice-orders/getLock`, {
    method: 'PUT',
    body: data,
  });
}
/**
 * 入库通知单释放锁
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function releaseNoticeLock(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-notice-orders/releaseLock`, {
    method: 'PUT',
    body: data,
  });
}
/**
 * 入库通知单执行
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function createInboundOrder(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-notice-order-lines/execute`, {
    method: 'PUT',
    body: data,
  });
}
/**
 * 获取允差数据
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function getBillParamsValue(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-notice-orders/query-excess-tolerance`, {
    method: 'GET',
    query: data,
  });
}
/**
 * 获取页面功能参数
 * @param data
 * @date: 2020-01-14
 * @author: david<yikang.dai@hand-china.com>
 */
export function queryParamsValue(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/page-function-paramss/info`, {
    method: 'GET',
    query: data,
  });
}

/**
 * 序列号收货 校验序列号
 * @param data
 */
export function checkSerialNumber(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/serialCheck`, {
    method: 'POST',
    body: data,
  });
}

/**
 * 序列号收货 校验托盘
 * @param data
 */
export function checkCidCode(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/check-cid`, {
    method: 'POST',
    body: data,
  });
}

/**
 * 序列号收货 新增/更新
 * @param data
 */
export function createSerialNumber(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/receipt`, {
    method: 'POST',
    body: data,
  });
}

/**
 * 序列号快速收货 新增/更新
 * @param data
 */
export function createQuickSerialNumber(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/quickInbound`, {
    method: 'POST',
    body: data,
  });
}

/**
 * 出库序列号收货 新增/更新
 * @param data
 */
export function createOutboundSerialNumber(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/winv-outbound-orders/check-serial`, {
    method: 'POST',
    body: data,
  });
}

/**
 * 上架任务处理
 * @param data
 */
export function processTask(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/tasks/inbound-task-process`, {
    method: 'PUT',
    body: data,
  });
}

/**
 * 上架任务取消
 * @param data
 */
export function cancelTask(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/tasks/inbound-task-cancel`, {
    method: 'PUT',
    body: data,
  });
}

/**
 * 序列号校验是否能添加
 * @param data
 */
export function checkSerialIsExistence(data) {
  return request(`${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/receipt`, {
    method: 'POST',
    body: data,
  });
}
export function getParameter() {
  return request(`${WMS_INV}/v1/${currentTenantID}/report/get-report-info`, {
    method: 'get',
    query: { reportCode: 'HWMS_INBOUND_ORDER_REPORT' },
  });
}

export function getReportHtml(data) {
  const uuid = data.reportUuid;
  // eslint-disable-next-line no-param-reassign
  delete data.reportUuid;
  return request(`/hrpt/v1/${currentTenantID}/reports/${uuid}/data`, {
    method: 'POST',
    query: data,
  });
}

export function getExport(flag, data) {
  const uuid = data.reportUuid;
  // eslint-disable-next-line no-param-reassign
  delete data.reportUuid;
  return request(`/hrpt/v1/${currentTenantID}/reports/export/${uuid}/${flag}`, {
    method: 'get',
    query: data,
    responseType: 'blob',
  });
}

export function getLabelHtml(data) {
  return request(`/hrpt/v1/${currentTenantID}/label-prints/view/html`, {
    method: 'get',
    query: data,
  });
}

export async function getLabelPDF(data) {
  return request(`/hrpt/v1/${currentTenantID}/label-prints/view/pdf/HWMS_RECEIVE_CONTAINER`, {
    method: 'get',
    query: data,
    responseType: 'blob',
  });
}
