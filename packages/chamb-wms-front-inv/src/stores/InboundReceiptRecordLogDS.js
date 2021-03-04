import intl from 'utils/intl';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';
import { WMS_INV } from 'wmsUtils/config';

const currentTenantID = getCurrentOrganizationId();

const inboundReceiptRecordLogDs = (
  orgIds,
  warehouseIds,
  ownerIds,
  defaultOrgValue,
  defaultHouseValue,
  defaultOwner
) => ({
  primaryKey: 'id',
  autoQuery: true,
  selection: false,
  queryFields: [
    {
      name: 'startDate',
      type: 'dateTime',
      defaultValue: moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0 }),
      label: intl.get('winv.inboundReceiptRecordLog.table.startDate').d('开始日期'),
    },
    {
      name: 'endDate',
      type: 'dateTime',
      defaultValue: moment().set({ hour: 23, minute: 59, second: 59 }),
      label: intl.get('winv.inboundReceiptRecordLog.table.endDate').d('结束日期'),
    },
    {
      name: 'billCode',
      type: 'string',
      label: intl.get('winv.inboundReceiptRecordLog.table.billCode').d('单据编号'),
    },
    {
      name: 'logType',
      type: 'string',
      lookupCode: 'WINV.INBOUND_RCV_LOG_OPERATION_TYPE',
      label: intl.get('winv.inboundReceiptRecordLog.table.logType').d('操作动作'),
    },
    {
      name: 'org',
      type: 'object',
      lovCode: 'WMDM.INV_ORG',
      textField: 'orgName',
      valueField: 'orgId',
      noCache: true,
      label: intl.get('winv.inboundReceiptRecordLog.table.orgName').d('组织名称'),
      ignore: 'always',
      lovPara: {
        idStr: orgIds,
      },
      defaultValue: defaultOrgValue,
    },
    {
      name: 'orgId',
      type: 'number',
      bind: 'org.orgId',
    },
    {
      name: 'orgCode',
      type: 'string',
      bind: 'org.orgCode',
    },
    {
      name: 'warehouse',
      type: 'object',
      lovCode: 'WMDM.WAREHOUSE',
      textField: 'warehouseName',
      valueField: 'warehouseCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.warehouse').d('仓库名称'),
      ignore: 'always',
      lovPara: {
        idStr: warehouseIds,
      },
      defaultValue: defaultHouseValue,
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouse.warehouseCode',
    },
    {
      name: 'warehouseId',
      type: 'number',
      bind: 'warehouse.warehouseId',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouse.warehouseName',
    },
    {
      name: 'owner',
      type: 'object',
      lovCode: 'WMDM.OWNER',
      textField: 'ownerName',
      valueField: 'ownerCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.owner').d('货主名称'),
      ignore: 'always',
      lovPara: {
        idStr: ownerIds,
      },
      defaultValue: defaultOwner,
    },
    {
      name: 'ownerCode',
      type: 'string',
      bind: 'owner.ownerCode',
    },
    {
      name: 'ownerName',
      type: 'string',
      bind: 'owner.ownerName',
    },
    {
      name: 'ownerId',
      type: 'number',
      bind: 'owner.ownerId',
    },
    {
      name: 'goodsLov',
      type: 'object',
      lovCode: 'WMDM.GOODS',
      textField: 'sku',
      valueField: 'goodsId',
      label: intl.get('winv.inboundReceiptRecordLog.table.goodsLov').d('物料编码'),
      ignore: 'always',
    },
    {
      name: 'goodsId',
      type: 'string',
      bind: 'goodsLov.goodsId',
    },
    {
      name: 'sku',
      type: 'string',
      bind: 'goodsLov.sku',
    },
    {
      name: 'receiptNumber',
      type: 'string',
      label: intl.get('winv.inboundReceiptRecordLog.table.receiptNumber').d('接收号'),
    },
  ],
  fields: [
    {
      name: 'receiptNumber',
      label: intl.get('winv.inboundReceiptRecordLog.table.receiptNumber').d('接收号'),
    },
    {
      name: 'lineNum',
      label: intl.get('winv.inboundReceiptRecordLog.table.lineNum').d('接收行'),
    },
    {
      name: 'warehouseCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.warehouseCode').d('仓库编码'),
    },
    {
      name: 'ownerCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.ownerCode').d('货主编码'),
    },
    {
      name: 'sku',
      label: intl.get('winv.inboundReceiptRecordLog.table.sku').d('物料编码'),
    },
    {
      name: 'goodsName',
      label: intl.get('winv.inboundReceiptRecordLog.table.goodsName').d('品名'),
    },
    {
      name: 'uomName',
      label: intl.get('winv.inboundReceiptRecordLog.table.uomName').d('单位'),
    },
    {
      name: 'whareaCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.whareaCode').d('库区编码'),
    },
    {
      name: 'locationCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.locationCode').d('库位编码'),
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.cidCode').d('托盘编码'),
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.batchCode').d('批次编码'),
    },
    {
      name: 'qty',
      label: intl.get('winv.inboundReceiptRecordLog.table.qty').d('数量'),
    },
    {
      name: 'reason',
      label: intl.get('winv.inboundReceiptRecordLog.table.reason').d('退货原因'),
    },
    {
      name: 'billCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.billCode').d('单据编号'),
    },
    {
      name: 'billTypeName',
      label: intl.get('winv.inboundReceiptRecordLog.table.billTypeName').d('单据类型'),
    },
    {
      name: 'detailLineNum',
      label: intl.get('winv.inboundReceiptRecordLog.table.detailLineNum').d('入库单行号'),
    },
    {
      name: 'vendorName',
      label: intl.get('winv.inboundReceiptRecordLog.table.vendorName').d('供应商'),
    },
    {
      name: 'customerName',
      label: intl.get('winv.inboundReceiptRecordLog.table.customerName').d('客户'),
    },
    {
      name: 'sourceBillCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.sourceBillCode').d('来源单号'),
    },
    {
      name: 'sourceLineNum',
      label: intl.get('winv.inboundReceiptRecordLog.table.sourceLineNum').d('来源行号'),
    },
    {
      name: 'orgCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.orgCode').d('组织编码'),
    },
    {
      name: 'functionName',
      label: intl.get('winv.inboundReceiptRecordLog.table.functionName').d('来源功能'),
    },
    {
      name: 'deviceCode',
      label: intl.get('winv.inboundReceiptRecordLog.table.deviceCode').d('来源设备'),
    },
    {
      name: 'createdByName',
      label: intl.get('winv.inboundReceiptRecordLog.table.createdByName').d('操作人'),
    },
    {
      name: 'creationDate',
      label: intl.get('winv.inboundReceiptRecordLog.table.creationDate').d('操作时间'),
    },
    {
      name: 'logTypeName',
      label: intl.get('winv.inboundReceiptRecordLog.table.logTypeName').d('操作动作'),
    },

    {
      name: 'attribute1',
      label: intl.get('winv.inboundReceiptRecordLog.table.attribute1').d('检验结果'),
    },
    {
      name: 'attribute2',
      label: intl.get('winv.inboundReceiptRecordLog.table.attribute2').d('检验数量'),
    },
    {
      name: 'attribute3',
      label: intl.get('winv.inboundReceiptRecordLog.table.attribute3').d('检验时间'),
    },
    {
      name: 'attribute4',
      label: intl.get('winv.inboundReceiptRecordLog.table.attribute4').d('检验人'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-record-logs`,
        method: 'GET',
        params,
      };
    },
  },
});

export { inboundReceiptRecordLogDs };
