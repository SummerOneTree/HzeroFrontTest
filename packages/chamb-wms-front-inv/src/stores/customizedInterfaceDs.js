import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';

const currentTenantID = getCurrentOrganizationId();
const WMS_MDM = '/winv';
// EBS回传监控
export const backToMonitor = () => ({
  autoQuery: true,
  paging: true,
  pageSize: 10,
  queryFields: [
    {
      name: 'startDate',
      label: intl.get('winv.inventoryTransfer.sundry.form.startDate').d('事务处理日期起'),
      type: 'dateTime',
      max: 'endDate',
      required: false,
      defaultValue: moment(new Date()).subtract(1, 'days').set({ hour: 0, minute: 0, second: 0 }),
    },
    {
      name: 'endDate',
      label: intl.get('winv.inventoryTransfer.sundry.form.endDate').d('事务处理日期至'),
      type: 'dateTime',
      min: 'startDate',
      required: false,
      defaultValue: moment(new Date()).set({ hour: 23, minute: 59, second: 59 }),
    },
    {
      name: 'billCode',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.billCode').d('单据编号'),
      type: 'string',
    },
    {
      name: 'sourceBillCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.sourceBillCode').d('EBS单号'),
    },
    {
      name: 'orgCode',
      type: 'object',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.orgCode').d('库存组织'),
      lovCode: 'WMDM.INV_ORG',
      ignore: 'always',
    },
    {
      name: 'ebsStatus',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.ebsStatus').d('回传状态'),
      lookupCode: 'EBS_STATUS',
    },
    {
      name: 'sku',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.sku').d('物料'),
      type: 'string',
    },
    {
      name: 'createdUser',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.createdUser').d('操作人'),
      type: 'string',
    },
    {
      name: 'billType',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.billType').d('单据类型'),
      lookupCode: 'WINV.BILL_TYPE',
    },
  ],
  fields: [
    {
      name: 'billCode',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.billCode').d('单据编号'),
      type: 'string',
    },
    {
      name: 'billType',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.billType').d('单据类型'),
      lookupCode: 'WINV.BILL_TYPE',
    },
    {
      name: 'sourceBillCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.sourceBillCode').d('EBS单号'),
    },
    {
      name: 'orgCode',
      type: 'object',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.orgCode').d('库存组织'),
    },
    {
      name: 'lineNum',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.lineNum').d('行号'),
    },
    {
      name: 'whareaCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.whareaCode').d('出库子库存'),
    },
    {
      name: 'transWhareaCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.transWhareaCode').d('入库子库存'),
    },
    {
      name: 'sku',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.sku').d('物料'),
      type: 'string',
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.batchCode').d('批次'),
      type: 'string',
      // lookupCode: 'WMDM.BATCH_STATUS',
    },
    {
      name: 'uomCode',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.uomCode').d('单位'),
      type: 'string',
    },
    {
      name: 'qty',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.qty').d('数量'),
      type: 'string',
    },
    {
      name: 'logDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.logDate').d('事务处理时间'),
      type: 'date',
    },
    {
      name: 'reasonName',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.reasonName').d('原因'),
      type: 'string',
      maxLength: 200,
    },
    {
      name: 'remark',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.remark').d('备注'),
      type: 'string',
      maxLength: 200,
    },
    {
      name: 'createdUser',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.createdUser').d('操作人'),
      type: 'string',
    },
    {
      name: 'inspectResult',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.inspectResult').d('检验结果'),
      type: 'string',
    },
    {
      name: 'inspectQuantity',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.inspectQuantity').d('检验数量'),
      type: 'string',
    },
    {
      name: 'attribute5',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.attribute5').d('件数'),
      type: 'string',
    },
    {
      name: 'inspectDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.inspectDate').d('检验日期'),
      type: 'string',
    },
    {
      name: 'purposeDesc',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.purposeDesc').d('是否有运费'),
      type: 'string',
    },
    {
      name: 'feeRate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.feeRate').d('毛重'),
      type: 'string',
    },
    {
      name: 'wmsStatus',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.wmsStatus').d('WMS状态'),
      type: 'string',
    },
    {
      name: 'wmsMessage',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.wmsMessage').d('WMS反馈信息'),
      type: 'string',
    },
    {
      name: 'ebsStatus',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.ebsStatus').d('EBS状态'),
      type: 'string',
    },
    {
      name: 'ebsMessage',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.ebsMessage').d('EBS反馈信息'),
      type: 'string',
    },
    {
      name: 'creationDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.creationDate').d('创建时间'),
      type: 'string',
    },
    {
      name: 'lastUpdateDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.lastUpdateDate').d('更新时间'),
      type: 'string',
    },
    {
      name: 'lastUpdatedBy',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.lastUpdatedBy').d('更新人'),
      type: 'string',
    },
  ],
  transport: {
    // 查询请求的 axios 配置或 url 字符串
    read: ({ params }) => {
      const par = params;
      return {
        url: `${WMS_MDM}/v1/${currentTenantID}/GetStockLogInf/queryStockData`,
        method: 'GET',
        params: par,
      };
    },
  },
});

// EBS单据监控
export const synchronousDocumentMonitoring = () => ({
  autoQuery: true,
  paging: true,
  pageSize: 10,
  queryFields: [
    {
      name: 'startDate',
      label: intl.get('winv.inventoryTransfer.sundry.form.startDate').d('单据日期起'),
      type: 'dateTime',
      max: 'endDate',
      required: false,
      defaultValue: moment(new Date()).subtract(1, 'days').set({ hour: 0, minute: 0, second: 0 }),
    },
    {
      name: 'endDate',
      label: intl.get('winv.inventoryTransfer.sundry.form.endDate').d('单据日期至'),
      type: 'dateTime',
      min: 'startDate',
      required: false,
      defaultValue: moment(new Date()).set({ hour: 23, minute: 59, second: 59 }),
    },
    {
      name: 'orderCode',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.orderCode').d('单据编号'),
      type: 'string',
    },
    {
      name: 'userRealName',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.userRealName').d('创建人'),
    },
    {
      name: 'orgCode',
      type: 'object',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.orgCode').d('库存组织'),
      lovCode: 'WMDM.INV_ORG',
      ignore: 'always',
    },
    {
      name: 'ebsStatus',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.ebsStatus').d('回传状态'),
      lookupCode: 'ORDER_STATUS',
    },
  ],
  fields: [
    {
      name: 'orderCode',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.orderCode').d('单据编号'),
      type: 'string',
    },
    {
      name: 'billType',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.billType').d('单据类型'),
      lookupCode: 'WINV.BILL_TYPE',
    },
    {
      name: 'sourceOrderCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.sourceOrderCode').d('来源单号'),
    },
    {
      name: 'orgCode',
      type: 'object',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.orgCode').d('库存组织'),
    },
    {
      name: 'userRealName',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.userRealName').d('创建人'),
    },
    {
      name: 'vendorCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.vendorCode').d('供应商'),
    },
    {
      name: 'customerCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.customerCode').d('客户'),
    },
    {
      name: 'remark',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.remark').d('备注'),
      type: 'string',
    },
    {
      name: 'processStatus',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.processStatus').d('WMS同步状态'),
      type: 'string',
    },
    {
      name: 'processMessage',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.processMessage').d('WMS同步信息'),
      type: 'string',
    },
    {
      name: 'processDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.processDate').d('单据同步日期'),
      type: 'string',
    },
    {
      name: 'validateStatus',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.validateStatus').d('EBS同步状态'),
      type: 'string',
    },
    {
      name: 'validateMessage',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.validateMessage').d('EBS同步信息'),
      type: 'string',
    },
    {
      name: 'createdDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.createdDate').d('创建日期'),
      type: 'string',
    },
  ],
  transport: {
    // 查询请求的 axios 配置或 url 字符串
    read: ({ params }) => {
      const par = params;
      return {
        url: `${WMS_MDM}/v1/${currentTenantID}/GetEbsOrderInf/queryEbsOrderData`,
        method: 'GET',
        params: par,
      };
    },
  },
});

