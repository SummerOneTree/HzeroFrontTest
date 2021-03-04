import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { WMS_INV, WMS_MDM } from 'wmsUtils/config';
import { commonCodeValidator } from 'wmsUtils/checkRegular';

const currentTenantID = getCurrentOrganizationId();
const SERIAL_TYPE_LIST = ['INV_CTRL', 'IN_CTRL', 'SEMI_INV_CTRL'];

const warrentHeadDs = () => ({
  primaryKey: 'billId',
  autoQuery: false,
  selection: 'multiple',
  noCache: false,
  queryFields: [
    {
      name: 'startDate',
      type: 'dateTime',
      defaultValue: moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0 }),
      label: intl.get('winv.inboundOrder.warrentHead.form.startDate').d('开始日期'),
    },
    {
      name: 'endDate',
      type: 'dateTime',
      defaultValue: moment().set({ hour: 23, minute: 59, second: 59 }),
      label: intl.get('winv.inboundOrder.warrentHead.form.endDate').d('结束日期'),
    },
    {
      name: 'billCode',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.billCode').d('单据编号'),
    },
    {
      name: 'sourceBillCode',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.sourceBillCode').d('来源单号'),
    },
    {
      name: 'syncBillCode',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.syncBillCode').d('同步单号'),
    },
    {
      name: 'billTypeId',
      label: intl.get('winv.inboundOrder.warrentHead.form.billType').d('单据类型'),
      type: 'number',
      lookupCode: 'WINV.INBOUND_BILL_TYPE',
    },
    {
      name: 'billStatus',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.billStatus').d('单据状态'),
      lookupCode: 'WINV.INBOUND_ORDER_STATUS',
    },
    {
      name: 'owner',
      type: 'object',
      lovCode: 'WMDM.OWNER',
      label: intl.get('winv.inboundOrder.warrentHead.form.ownerName').d('货主名称'),
      ignore: 'always',
      textField: 'ownerName',
      valueField: 'ownerId',
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'owner.ownerId',
    },
    {
      name: 'ownerName',
      type: 'string',
      bind: 'owner.ownerName',
    },
    {
      name: 'ownerCode',
      type: 'string',
      bind: 'owner.ownerCode',
    },
    {
      name: 'sku',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.sku').d('物料编码'),
    },
    {
      name: 'warehouse',
      type: 'object',
      lovCode: 'WMDM.WAREHOUSE',
      label: intl.get('winv.inboundOrder.warrentHead.form.warehouseName').d('仓库名称'),
      ignore: 'always',
      textField: 'warehouseName',
      valueField: 'warehouseId',
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouse.warehouseId',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouse.warehouseName',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouse.warehouseCode',
    },
    {
      name: 'customer',
      type: 'object',
      lovCode: 'WMDM.CUSTOMER',
      label: intl.get('winv.inboundOrder.warrentHead.form.customerName').d('客户名称'),
      ignore: 'always',
    },
    {
      name: 'customerId',
      type: 'string',
      bind: 'customer.customerId',
    },
    {
      name: 'customerCode',
      type: 'string',
      bind: 'customer.customerCode',
    },
    {
      name: 'goodsName',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.goodsName').d('品名'),
    },
  ],
  fields: [
    {
      name: 'syncBillCode',
      label: intl.get('winv.inboundOrder.warrentHead.form.syncBillCode').d('同步单号'),
    },
    {
      name: 'syncBillDate',
      label: intl.get('winv.inboundOrder.warrentHead.form.syncBillDate').d('同步单日期'),
    },
    {
      name: 'billStatusName',
      label: intl.get('winv.inboundOrder.warrentHead.form.billStatus').d('单据状态'),
    },
    {
      name: 'receiveStatusName',
      label: intl.get('winv.inboundOrder.warrentHead.form.receiveStatus').d('接收状态'),
    },
    {
      name: 'assignStatusName',
      label: intl.get('winv.inboundOrder.warrentHead.form.assignStatus').d('分配状态'),
    },
    {
      name: 'billCode',
      label: intl.get('winv.inboundOrder.warrentHead.form.billCode').d('单据编号'),
    },
    {
      name: 'warehouseName',
      label: intl.get('winv.inboundOrder.warrentHead.form.warehouseName').d('仓库名称'),
    },
    {
      name: 'vendorName',
      label: intl.get('winv.inboundOrder.warrentHead.form.vendorName').d('供应商名称'),
    },
    {
      name: 'customerName',
      label: intl.get('winv.inboundOrder.warrentHead.form.customerName').d('客户名称'),
    },
    {
      name: 'sourceBillCode',
      label: intl.get('winv.inboundOrder.warrentHead.form.sourceBillCode').d('来源单号'),
    },
    {
      name: 'billTypeName',
      label: intl.get('winv.inboundOrder.warrentHead.form.billType').d('单据类型'),
    },
    {
      name: 'planQty',
      label: intl.get('winv.inboundOrder.warrentHead.form.planQty').d('计划数量'),
    },
    {
      name: 'receiveQty',
      label: intl.get('winv.inboundOrder.warrentHead.form.receiveQty').d('接收数量'),
    },
    {
      name: 'assignQty',
      label: intl.get('winv.inboundOrder.warrentHead.form.assignQty').d('已分配数量'),
    },
    {
      name: 'inQty',
      label: intl.get('winv.inboundOrder.warrentHead.form.inQty').d('入库数量'),
    },
    {
      name: 'returnedQty',
      label: intl.get('winv.inboundOrder.warrentHead.form.returnedQty').d('退货数量'),
    },
    {
      name: 'orgName',
      label: intl.get('winv.inboundOrder.warrentHead.form.orgName').d('组织名称'),
    },
    {
      name: 'ownerName',
      label: intl.get('winv.inboundOrder.warrentHead.form.ownerName').d('货主名称'),
    },
    {
      name: 'uploadFlag',
      label: intl.get('winv.inboundOrder.warrentHead.form.uploadFlag').d('是否回传'),
    },
    {
      name: 'remark',
      label: intl.get('winv.inboundOrder.warrentHead.form.remark').d('备注'),
    },
    {
      name: 'createdByName',
      label: intl.get('winv.inboundOrder.warrentHead.form.createdByName').d('创建人'),
    },
    {
      name: 'creationDate',
      label: intl.get('winv.inboundOrder.warrentHead.form.creationDate').d('创建时间'),
    },
    {
      name: 'approvedByName',
      label: intl.get('winv.inboundOrder.warrentHead.form.approvedByName').d('审核人'),
    },
    {
      name: 'approvedDate',
      label: intl.get('winv.inboundOrder.warrentHead.form.approvedDate').d('审核时间'),
    },
    {
      name: 'completeByName',
      label: intl.get('winv.inboundOrder.warrentHead.form.completeByName').d('完结人'),
    },
    {
      name: 'completeDate',
      label: intl.get('winv.inboundOrder.warrentHead.form.completeDate').d('完结时间'),
    },
    {
      name: 'cancelledByName',
      label: intl.get('winv.inboundOrder.warrentHead.form.cancelledByName').d('作废人'),
    },
    {
      name: 'asnPlanDeliveryDate',
      label: intl
        .get('winv.inboundOrder.warrentHead.form.asnPlanDeliveryDate')
        .d('ASN预计送货时间'),
    },
    {
      name: 'cancelledDate',
      label: intl.get('winv.inboundOrder.warrentHead.form.cancelledDate').d('作废时间'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-orders`,
        method: 'GET',
        params,
      };
    },
    submit: ({ data, dataSet }) => {
      const flag = dataSet._flag;
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-orders/${flag}`,
        method: 'PUT',
        data,
      };
    },
  },
});

const warrentLineShowDs = () => ({
  primaryKey: 'id',
  dataKey: 'content',
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'lineNum',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.lineNum').d('行号'),
    },
    {
      name: 'billStatusName',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.billStatus').d('单据状态'),
    },
    {
      name: 'receiveStatusName',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.receiveStatus').d('接收状态'),
    },
    {
      name: 'assignStatusName',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.assignStatus').d('分配状态'),
    },
    {
      name: 'sku',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.sku').d('物料编码'),
    },
    {
      name: 'goodsName',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.goodsName').d('品名'),
    },
    {
      name: 'uomName',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.uomName').d('单位'),
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.batchCode').d('批次编码'),
    },
    {
      name: 'whareaCode',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.whareaCode').d('入库库区'),
    },
    {
      name: 'toWhareaCode',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.toWhareaCode').d('收库库区'),
    },
    {
      name: 'planQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.planQty').d('计划数量'),
    },
    {
      name: 'receiveQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.receiveQty').d('接收数量'),
    },
    {
      name: 'assignQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.assignQty').d('已分配数量'),
    },
    {
      name: 'inQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.inQty').d('入库数量'),
    },
    {
      name: 'qtyRecTolerance',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.qtyRecTolerance').d('收货允差'),
    },
    {
      name: 'sourceLineNum',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.sourceLineNum').d('来源行号'),
    },
    {
      name: 'asnPlanDeliveryDate',
      type: 'date',
      label: intl
        .get('winv.inboundOrder.warrentLineShow.tabel.asnPlanDeliveryDate')
        .d('预计送货时间'),
    },
    {
      name: 'batchProduceDate',
      type: 'date',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.batchProduceDate').d('批次生产日期'),
    },
    {
      name: 'batchExpiredDate',
      type: 'date',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.batchExpiredDate').d('批次有效日期'),
    },
    {
      name: 'venderBatch',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.venderBatch').d('供应商批号'),
    },
    {
      name: 'returnedQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLineShow.tabel.returnedQty').d('退货数量'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-order-lines`,
        method: 'GET',
        params,
      };
    },
  },
});

const warrentLineDs = () => ({
  primaryKey: 'id',
  dataKey: 'content',
  autoQuery: false,
  selection: 'multiple',
  fields: [
    {
      name: 'lineNum',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.lineNum').d('行号'),
    },
    {
      name: 'billStatusName',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.billStatus').d('单据状态'),
    },
    {
      name: 'receiveStatusName',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.receiveStatus').d('接收状态'),
    },
    {
      name: 'assignStatusName',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.assignStatus').d('分配状态'),
    },
    {
      name: 'goodsLov',
      type: 'object',
      lovCode: 'WMDM.GOODS',
      textField: 'sku',
      valueField: 'goodsId',
      required: true,
      noCache: true,
      label: intl.get('winv.inboundOrder.warrentLine.tabel.sku').d('物料编码'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => {
          const orgId = record.get('orgId');
          const ownerId = record.get('ownerId');
          return { orgId, ownerId };
        },
      },
    },
    {
      name: 'goodsId',
      type: 'string',
      bind: 'goodsLov.goodsId',
    },
    {
      name: 'isbatch',
      type: 'number',
      bind: 'goodsLov.isbatch',
    },
    {
      name: 'sku',
      type: 'string',
      bind: 'goodsLov.sku',
    },
    {
      name: 'goodsName',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.goodsName').d('品名'),
      bind: 'goodsLov.goodsName',
    },
    {
      name: 'uomName',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.uomName').d('单位'),
      bind: 'goodsLov.uomName',
    },
    {
      name: 'uomCode',
      bind: 'goodsLov.uomCode',
    },
    {
      name: 'uomId',
      bind: 'goodsLov.uomId',
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.batchCode').d('批次编码'),
    },
    {
      name: 'whareList',
      type: 'object',
      lovCode: 'WMDM.WHAREA',
      textField: 'whareaCode',
      valueField: 'whareaId',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.fromWhareaCode').d('入库库区'),
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('warehouseId')) {
            return { warehouseId: record.get('warehouseId') };
          }
        },
      },
    },
    {
      name: 'whareaId',
      type: 'string',
      bind: 'whareList.whareaId',
    },
    {
      name: 'whareaCode',
      type: 'string',
      bind: 'whareList.whareaCode',
    },
    {
      name: 'whareaName',
      type: 'string',
      bind: 'whareList.whareaName',
    },
    {
      name: 'toWhareaCode',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.toWhareaCode').d('收库库区'),
    },
    {
      name: 'planQty',
      required: true,
      type: 'number',
      min: 0,
      step: 0.001,
      label: intl.get('winv.inboundOrder.warrentLine.tabel.planQty').d('计划数量'),
      dynamicProps: {
        step: ({ record }) => {
          const precision = record.get('precision');
          if (precision) {
            return { precision };
          }
        },
      },
    },
    {
      name: 'receiveQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.receiveQty').d('接收数量'),
    },
    {
      name: 'assignQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.assignQty').d('已分配数量'),
    },
    {
      name: 'inQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.inQty').d('入库数量'),
    },
    {
      name: 'qtyRecTolerance',
      type: 'number',
      min: 0,
      step: 1,
      label: intl.get('winv.inboundOrder.warrentLine.tabel.qtyRecTolerance').d('收货允差'),
    },
    {
      name: 'sourceLineNum',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.sourceLineNum').d('来源行号'),
    },
    {
      name: 'asnPlanDeliveryDate',
      type: 'date',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.asnPlanDeliveryDate').d('预计送货时间'),
    },
    {
      name: 'batchProduceDate',
      type: 'date',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.batchProduceDate').d('批次生产日期'),
    },
    {
      name: 'batchExpiredDate',
      type: 'date',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.batchExpiredDate').d('批次有效日期'),
    },
    {
      name: 'venderBatch',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.venderBatch').d('供应商批号'),
    },
    {
      name: 'returnedQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.warrentLine.tabel.returnedQty').d('退货数量'),
    },
  ],
  events: {
    update: ({ record, name }) => {
      if (name === 'goodsLov') {
        record.set('batchCode', '');
      }
    },
  },
  transport: {
    read: ({ params, data: { billId } }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-order-lines`,
        method: 'GET',
        data: {},
        params: {
          billId,
          ...params,
        },
      };
    },
  },
});

const warrentHeadFormDs = (defaultOrg, defaultHouse, defaultOwner) => ({
  fields: [
    {
      name: 'billCode',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.billCode').d('单据编号'),
    },
    {
      name: 'billTypeId',
      label: intl.get('winv.inboundOrder.warrentHead.form.billType').d('单据类型'),
      type: 'number',
      required: true,
      lookupCode: 'WINV.INBOUND_BILL_TYPE',
    },
    {
      name: 'org',
      type: 'object',
      lovCode: 'WMDM.INV_ORG',
      textField: 'orgName',
      valueField: 'orgId',
      required: true,
      label: intl.get('winv.inboundOrder.warrentHead.form.orgName').d('组织名称'),
      ignore: 'always',
    },
    {
      name: 'orgId',
      type: 'string',
      bind: 'org.orgId',
      defaultValue: defaultOrg && defaultOrg.orgId,
    },
    {
      name: 'orgCode',
      type: 'string',
      bind: 'org.orgCode',
      defaultValue: defaultOrg && defaultOrg.orgCode,
    },
    {
      name: 'orgName',
      type: 'string',
      bind: 'org.orgName',
      defaultValue: defaultOrg && defaultOrg.orgName,
    },
    {
      name: 'warehouse',
      type: 'object',
      lovCode: 'WMDM.WAREHOUSE',
      textField: 'warehouseName',
      valueField: 'warehouseId',
      required: true,
      label: intl.get('winv.inboundOrder.warrentHead.form.warehouseName').d('仓库名称'),
      ignore: 'always',
      cascadeMap: { orgId: 'orgId' },
    },
    {
      name: 'warehouseId',
      type: 'string',
      bind: 'warehouse.warehouseId',
      defaultValue: defaultHouse && defaultHouse.warehouseId,
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouse.warehouseCode',
      defaultValue: defaultHouse && defaultHouse.warehouseCode,
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouse.warehouseName',
      defaultValue: defaultHouse && defaultHouse.warehouseName,
    },
    {
      name: 'whareList',
      type: 'object',
      lovCode: 'WMDM.WHAREA',
      textField: 'whareaCode',
      valueField: 'whareaId',
      // required: true,
      label: intl.get('winv.inboundOrder.warrentHead.form.whareaCode').d('入库库区'),
      ignore: 'always',
      cascadeMap: { warehouseId: 'warehouseId' },
    },
    {
      name: 'whareaId',
      type: 'string',
      bind: 'whareList.whareaId',
    },
    {
      name: 'whareaCode',
      type: 'string',
      bind: 'whareList.whareaCode',
    },
    {
      name: 'whareaName',
      type: 'string',
      bind: 'whareList.whareaName',
    },
    {
      name: 'creationDate',
      type: 'date',
      label: intl.get('winv.inboundOrder.warrentHead.form.billDate').d('单据日期'),
    },
    {
      name: 'owner',
      type: 'object',
      lovCode: 'WMDM.OWNER',
      textField: 'ownerName',
      valueField: 'ownerId',
      required: true,
      label: intl.get('winv.inboundOrder.warrentHead.form.ownerName').d('货主名称'),
      ignore: 'always',
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'owner.ownerId',
      defaultValue: defaultOwner && defaultOwner.ownerId,
    },
    {
      name: 'ownerCode',
      type: 'string',
      bind: 'owner.ownerCode',
      defaultValue: defaultOwner && defaultOwner.ownerCode,
    },
    {
      name: 'ownerName',
      type: 'string',
      bind: 'owner.ownerName',
      defaultValue: defaultOwner && defaultOwner.ownerName,
    },
    {
      name: 'vendor',
      type: 'object',
      lovCode: 'WMDM.VENDOR',
      textField: 'vendorName',
      valueField: 'vendorId',
      label: intl.get('winv.inboundOrder.warrentHead.form.vendorName').d('供应商名称'),
      ignore: 'always',
    },
    {
      name: 'vendorId',
      type: 'string',
      bind: 'vendor.vendorId',
    },
    {
      name: 'vendorCode',
      type: 'string',
      bind: 'vendor.vendorCode',
    },
    {
      name: 'vendorName',
      type: 'string',
      bind: 'vendor.vendorName',
    },
    {
      name: 'syncBillCode',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.syncBillCode').d('同步单号'),
    },
    {
      name: 'customer',
      type: 'object',
      lovCode: 'WMDM.CUSTOMER',
      textField: 'customerName',
      valueField: 'customerId',
      label: intl.get('winv.inboundOrder.warrentHead.form.customerName').d('客户名称'),
      ignore: 'always',
    },
    {
      name: 'customerId',
      type: 'string',
      bind: 'customer.customerId',
    },
    {
      name: 'customerCode',
      type: 'string',
      bind: 'customer.customerCode',
    },
    {
      name: 'customerName',
      type: 'string',
      bind: 'customer.customerName',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.remark').d('备注'),
    },
    // modal

    {
      name: 'fromWarehouseNameList',
      type: 'object',
      lovCode: 'WMDM.WAREHOUSE',
      textField: 'warehouseName',
      valueField: 'warehouseId',
      label: intl.get('winv.inboundOrder.warrentHead.form.fromWarehouseName').d('来源仓库名称'),
      ignore: 'always',
    },
    {
      name: 'fromWarehouseId',
      type: 'number',
      bind: 'fromWarehouseNameList.warehouseId',
    },
    {
      name: 'fromWarehouseCode',
      type: 'string',
      bind: 'fromWarehouseNameList.warehouseCode',
    },
    {
      name: 'fromWarehouseName',
      type: 'string',
      bind: 'fromWarehouseNameList.warehouseName',
    },
    {
      name: 'fromWhareaCodeList',
      type: 'object',
      lovCode: 'WMDM.WHAREA',
      textField: 'whareaCode',
      valueField: 'whareaId',
      label: intl.get('winv.inboundOrder.warrentHead.form.fromWhareaCodeList').d('来源库区名称'),
      ignore: 'always',
      cascadeMap: { warehouseId: 'fromWarehouseId' },
    },
    {
      name: 'fromWhareaId',
      type: 'number',
      bind: 'fromWhareaCodeList.whareaId',
    },
    {
      name: 'fromWhareaCode',
      type: 'string',
      bind: 'fromWhareaCodeList.whareaCode',
    },
    {
      name: 'fromWhareaName',
      type: 'string',
      bind: 'fromWhareaCodeList.whareaName',
    },
    {
      name: 'fromOwnerNameList',
      type: 'object',
      lovCode: 'WMDM.OWNER',
      textField: 'ownerName',
      valueField: 'ownerId',
      label: intl.get('winv.inboundOrder.warrentHead.form.fromOwnerNameList').d('来源货主名称'),
      ignore: 'always',
    },
    {
      name: 'fromOwnerId',
      type: 'number',
      bind: 'fromOwnerNameList.ownerId',
    },
    {
      name: 'fromOwnerCode',
      type: 'string',
      bind: 'fromOwnerNameList.ownerCode',
    },
    {
      name: 'fromOwnerName',
      type: 'string',
      bind: 'fromOwnerNameList.ownerName',
    },
    {
      name: 'contact',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.contact').d('联系人'),
    },
    {
      name: 'mobile',
      type: 'string',
      pattern: '^1[3-9]\\d{9}$',
      label: intl.get('winv.inboundOrder.warrentHead.form.mobile').d('手机号'),
    },
    {
      name: 'tel',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.tel').d('座机号'),
    },
    {
      name: 'email',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.email').d('电子邮件'),
    },
    {
      name: 'fax',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.fax').d('传真'),
    },
    {
      name: 'zipCode',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.zipCode').d('邮编'),
    },
    {
      name: 'countryLov',
      type: 'object',
      lovCode: 'HPFM.COUNTRY',
      textField: 'countryName',
      valueField: 'countryId',
      label: intl.get('winv.inboundOrder.warrentHead.form.country').d('国家'),
      ignore: 'always',
    },
    {
      name: 'countryId',
      type: 'number',
      bind: 'countryLov.countryId',
    },
    {
      name: 'country',
      type: 'string',
      bind: 'countryLov.countryName',
    },
    {
      name: 'provinceLov',
      type: 'object',
      lovCode: 'HPFM.REGION',
      textField: 'regionName',
      valueField: 'regionId',
      noCache: true,
      label: intl.get('winv.inboundOrder.warrentHead.form.province').d('省'),
      ignore: 'always',
      cascadeMap: {
        countryId: 'countryId',
      },
    },
    {
      name: 'province',
      type: 'string',
      bind: 'provinceLov.regionName',
    },
    {
      name: 'provinceId',
      type: 'number',
      bind: 'provinceLov.regionId',
    },
    {
      name: 'cityLov',
      type: 'object',
      lovCode: 'HPFM.REGION',
      textField: 'regionName',
      valueField: 'regionId',
      noCache: true,
      label: intl.get('winv.inboundOrder.warrentHead.form.city').d('城市'),
      ignore: 'always',
      cascadeMap: {
        parentRegionId: 'provinceId',
      },
    },
    {
      name: 'city',
      type: 'string',
      bind: 'cityLov.regionName',
    },
    {
      name: 'cityId',
      type: 'number',
      bind: 'cityLov.regionId',
    },
    {
      name: 'districtLov',
      type: 'object',
      lovCode: 'HPFM.REGION',
      textField: 'regionName',
      valueField: 'regionId',
      noCache: true,
      label: intl.get('winv.inboundOrder.warrentHead.form.district').d('地区（乡镇）'),
      ignore: 'always',
      cascadeMap: {
        parentRegionId: 'cityId',
      },
    },
    {
      name: 'district',
      type: 'string',
      bind: 'districtLov.regionName',
    },
    {
      name: 'districtId',
      type: 'number',
      bind: 'districtLov.regionId',
    },
    {
      name: 'address',
      type: 'string',
      label: intl.get('winv.inboundOrder.warrentHead.form.address').d('入库详细地址'),
    },
    {
      name: 'asnPlanDeliveryDate',
      type: 'date',
      label: intl
        .get('winv.inboundOrder.warrentHead.form.asnPlanDeliveryDate')
        .d('ASN预计送货时间'),
    },
  ],
  events: {
    update: ({ record, name }) => {
      if (name === 'countryLov') {
        record.set('provinceLov', null);
        record.set('cityLov', null);
        record.set('districtLov', null);
      }
      if (name === 'provinceLov') {
        record.set('cityLov', null);
        record.set('districtLov', null);
      }
      if (name === 'cityLov') {
        record.set('districtLov', null);
      }
    },
  },
  transport: {
    create: ({ config, data }) => {
      const [{ __id, _status, ...other }] = data;
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-orders`,
        method: 'POST',
        data: other,
      };
    },
    update: ({ config, data }) => {
      const [{ __id, _status, ...other }] = data;
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-orders`,
        method: 'PUT',
        data: other,
      };
    },
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-orders`,
        method: 'GET',
        params,
      };
    },
  },
});

const deliverGoodsShowDs = () => ({
  primaryKey: 'id',
  selection: false,
  fields: [
    {
      name: 'lineNum',
      label: intl.get('winv.inboundOrder.dGShow.tabel.index').d('序号'),
    },
    {
      name: 'detailLineNum',
      label: intl.get('winv.inboundOrder.dGShow.tabel.lineNum').d('行号'),
    },
    {
      name: 'statusName',
      label: intl.get('winv.inboundOrder.dGShow.tabel.status').d('状态'),
    },
    {
      name: 'sku',
      label: intl.get('winv.inboundOrder.dGShow.tabel.sku').d('物料'),
    },
    {
      name: 'goodsName',
      label: intl.get('winv.inboundOrder.dGShow.tabel.goodsName').d('品名'),
    },
    {
      name: 'uomName',
      label: intl.get('winv.inboundOrder.dGShow.tabel.uomName').d('单位'),
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inboundOrder.dGShow.tabel.batchCode').d('批次'),
    },
    {
      name: 'locationCode',
      label: intl.get('winv.inboundOrder.dGShow.tabel.location').d('收货库位'),
    },
    {
      name: 'returnedLocationCode',
      label: intl.get('winv.inboundOrder.dGShow.tabel.returnedLocationCode').d('退货库位'),
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inboundOrder.dGShow.tabel.cidCode').d('托盘编码'),
    },
    {
      name: 'packQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.dGShow.tabel.packQty').d('预打包数量'),
    },
    {
      name: 'receiveQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.dGShow.tabel.receiveQty').d('收货数量'),
    },
    {
      name: 'assignQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.dGShow.tabel.assignQty').d('分配数量'),
    },
    {
      name: 'inQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.dGShow.tabel.inQty').d('入库数量'),
    },
    {
      name: 'returnedQty',
      type: 'number',
      label: intl.get('winv.inboundOrder.dGShow.tabel.returnedQty').d('退货数量'),
    },
    {
      name: 'functionName',
      label: intl.get('winv.inboundOrder.dGShow.tabel.functionName').d('数据来源'),
    },
    {
      name: 'receivedByName',
      label: intl.get('winv.inboundOrder.dGShow.tabel.receivedByName').d('收货人'),
    },
    {
      name: 'receivedDate',
      label: intl.get('winv.inboundOrder.dGShow.tabel.receivedDate').d('收货时间'),
    },
    {
      name: 'returnedReason',
      label: intl.get('winv.inboundOrder.dGShow.tabel.returnedReason').d('退货原因'),
    },
    {
      name: 'returnedByName',
      label: intl.get('winv.inboundOrder.dGShow.tabel.returnedByName').d('退货人'),
    },
    {
      name: 'returnedDate',
      label: intl.get('winv.inboundOrder.dGShow.tabel.returnedDate').d('退货时间'),
    },
    {
      name: 'createdByName',
      label: intl.get('winv.inboundOrder.dGShow.tabel.createdByName').d('创建人'),
    },
    {
      name: 'creationDate',
      label: intl.get('winv.inboundOrder.dGShow.tabel.creationDate').d('创建时间'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records`,
        method: 'GET',
        params,
      };
    },
  },
});

const deliverGoodsDs = (billIdList, detailIds, pageCode) => {
  return {
    primaryKey: 'billId',
    fields: [
      {
        name: 'lineNum',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.index').d('序号'),
      },
      {
        name: 'detailLineNumLov',
        type: 'object',
        lovCode: 'WINV.INBOUND_LINES_REC_LINE',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.lineNum').d('行号'),
        ignore: 'always',
        noCache: true,
        valueField: 'detailId',
        dynamicProps: {
          lovPara: ({ record }) => {
            const detailId = record.get('detailId');
            const goodsId = record.get('goodsId');
            return { billIdList, detailId, goodsId, detailIds, pageCode };
          },
        },
      },
      {
        name: 'detailLineNum',
        bind: 'detailLineNumLov.lineNum',
      },
      {
        name: 'detailId',
        bind: 'detailLineNumLov.detailId',
      },
      {
        name: 'statusName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.status').d('状态'),
      },
      {
        name: 'goodsLov',
        type: 'object',
        required: true,
        lovCode: 'WINV.INBOUND_LINES_RECEIVE_SKU',
        label: intl.get('winv.inboundOrder.model.inboundNotice.sku').d('物料'),
        ignore: 'always',
        valueField: 'detailIdCopy',
        textField: 'sku',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => {
            const detailId = record.get('detailId');
            const goodsId = record.get('goodsId');
            return { billIdList, detailId, goodsId, detailIds, pageCode };
          },
        },
      },
      {
        name: 'detailIdCopy',
        type: 'number',
        bind: 'goodsLov.detailIdCopy',
      },
      {
        name: 'goodsId',
        type: 'number',
        bind: 'goodsLov.goodsId',
      },
      {
        name: 'sku',
        type: 'string',
        bind: 'goodsLov.sku',
      },
      {
        name: 'goodsName',
        bind: 'goodsLov.goodsName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.goodsName').d('品名'),
      },
      {
        name: 'uomName',
        bind: 'goodsLov.uomName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.uomName').d('单位'),
      },
      {
        name: 'uomCode',
        bind: 'goodsLov.uomCode',
      },
      {
        name: 'uomId',
        bind: 'goodsLov.uomId',
      },
      {
        name: 'serialType',
        bind: 'goodsLov.serialType',
      },
      {
        name: 'billId',
        bind: 'goodsLov.billId',
      },
      {
        name: 'billCode',
        bind: 'goodsLov.billCode',
      },
      {
        name: 'billCode',
        bind: 'goodsLov.billCode',
      },
      {
        name: 'ownerId',
        bind: 'goodsLov.ownerId',
      },
      {
        name: 'ownerCode',
        bind: 'goodsLov.ownerCode',
      },
      {
        name: 'ownerName',
        bind: 'goodsLov.ownerName',
      },
      {
        name: 'orgId',
        bind: 'goodsLov.orgId',
      },
      {
        name: 'orgName',
        bind: 'goodsLov.orgName',
      },
      {
        name: 'orgCode',
        bind: 'goodsLov.orgCode',
      },
      {
        name: 'currentBatchCode',
        bind: 'goodsLov.batchCode',
      },
      {
        name: 'inWarehouseId',
        bind: 'goodsLov.warehouseId',
      },
      {
        name: 'isBatchControl',
        bind: 'goodsLov.isBatchControl',
      },
      {
        name: 'isWhareaControl',
        bind: 'goodsLov.isWhareaControl',
      },
      {
        name: 'cidControl',
      },
      {
        name: 'lineBatchCode',
        bind: 'goodsLov.lineBatchCode',
      },
      {
        name: 'lineWhareaCode',
        bind: 'goodsLov.lineWhareaCode',
      },
      {
        name: 'lineWhareaId',
        bind: 'goodsLov.lineWhareaId',
      },
      {
        name: 'lineWhareaName',
        bind: 'goodsLov.lineWhareaName',
      },
      {
        name: 'warehouseId',
      },
      {
        name: 'batchId',
      },
      {
        name: 'batchCode',
        type: 'string',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.batchCode').d('批次'),
        validator: commonCodeValidator,
        dynamicProps: {
          required: ({ record }) => {
            return record.get('isbatch') === 1;
          },
        },
      },
      {
        name: 'toWhareaLov',
        type: 'object',
        required: true,
        noCache: true,
        lovCode: 'WMDM.WHAREA',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.toWhareaLov').d('收货库区'),
        ignore: 'always',
        textField: 'whareaCode',
        valueField: 'whareaId',
        dynamicProps: {
          lovPara: ({ record }) => {
            return {
              warehouseId: record.get('inWarehouseId')
                ? record.get('inWarehouseId')
                : record.get('warehouseId'),
            };
          },
        },
      },
      {
        name: 'whareaCode',
        type: 'string',
        bind: 'toWhareaLov.whareaCode',
      },
      {
        name: 'whareaId',
        type: 'number',
        bind: 'toWhareaLov.whareaId',
      },
      {
        name: 'locationLov',
        type: 'object',
        required: true,
        lovCode: 'WMDM.LOCATION',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.location').d('收货库位'),
        ignore: 'always',
        cascadeMap: {
          whareaId: 'whareaId',
        },
        dynamicProps: {
          lovPara: ({ record }) => {
            return {
              locationType: 'T_RCV',
              warehouseId: record.get('inWarehouseId')
                ? record.get('inWarehouseId')
                : record.get('warehouseId'),
              whareaId: record.get('whareaId'),
            };
          },
        },
        noCache: true,
        textField: 'locationCode',
        valueField: 'locationId',
      },
      {
        name: 'locationCode',
        type: 'string',
        bind: 'locationLov.locationCode',
      },
      {
        name: 'locationId',
        bind: 'locationLov.locationId',
      },
      {
        name: 'locationName',
        bind: 'locationLov.locationName',
      },
      {
        name: 'containerManageFlag',
        bind: 'locationLov.containerManageFlag',
      },
      {
        name: 'cidCode',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.cidCode').d('托盘编码'),
        dynamicProps: {
          required: ({ record }) => {
            return record.get('containerManageFlag') === 1 && record.get('cidControl') === '0';
          },
        },
      },
      {
        name: 'packQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.packQty').d('预打包数量'),
        defaultValue: 0,
      },
      {
        name: 'receiveQty',
        type: 'number',
        min: 0,
        step: 0.0001,
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.receiveQty').d('收货数量'),
        dynamicProps: {
          required: ({ record }) => {
            return !SERIAL_TYPE_LIST.includes(record.get('serialType'));
          },
        },
      },
      {
        name: 'assignQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.assignQty').d('分配数量'),
        defaultValue: 0,
      },
      {
        name: 'inQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.inQty').d('入库数量'),
        defaultValue: 0,
      },
      {
        name: 'functionName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.functionName').d('数据来源'),
      },
      {
        name: 'receivedByName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.receivedByName').d('收货人'),
      },
      {
        name: 'receivedDate',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.receivedDate').d('收货时间'),
      },
      {
        name: 'createdByName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.createdByName').d('创建人'),
      },
      {
        name: 'creationDate',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.creationDate').d('创建时间'),
      },
    ],
    transport: {
      read: ({ params }) => {
        return {
          url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/lines-query-records-data?pageCode=${pageCode}`,
          method: 'GET',
          params,
        };
      },
      submit: ({ config, data }) => {
        return {
          ...config,
          url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/lines-receive`,
          method: 'PUT',
          data,
        };
      },
    },
    events: {
      load: ({ dataSet }) => {
        dataSet.forEach((record) => {
          if (
            record.get('id') &&
            record.get('status') !== 'PREPACKAGED' &&
            record.get('status') !== 'RECEIVED'
          ) {
            // eslint-disable-next-line no-param-reassign
            record.selectable = false;
          }
        });
      },
      update: ({ record, name }) => {
        const detailLineNumLov = record.get('detailLineNumLov');
        const goodsLov = record.get('goodsLov');
        if (name === 'detailLineNumLov') {
          if (detailLineNumLov) {
            const { whareaId, whareaCode, whareaName } = detailLineNumLov;
            const toWhareaLov = { whareaId, whareaCode, whareaName };
            record.set('toWhareaLov', toWhareaLov || null);
          }
          record.set('goodsLov', detailLineNumLov || null);
          record.set('batchCode', detailLineNumLov ? detailLineNumLov.batchCode : null);
          record.set('batchId', detailLineNumLov ? detailLineNumLov.batchId : null);
          record.set('isbatch', detailLineNumLov ? detailLineNumLov.isbatch : 0);
        } else if (name === 'goodsLov') {
          if (goodsLov) {
            const { whareaId, whareaCode, whareaName } = goodsLov;
            const toWhareaLov = { whareaId, whareaCode, whareaName };
            record.set('toWhareaLov', toWhareaLov || null);
          }
          record.set('detailLineNumLov', goodsLov || null);
          record.set('batchCode', goodsLov ? goodsLov.batchCode : null);
          record.set('batchId', goodsLov ? goodsLov.batchId : null);
          record.set('isbatch', goodsLov ? goodsLov.isbatch : 0);
        }
      },
    },
  };
};

const receivedGoodsDs = (billIdList, detailIds, pageCode) => {
  return {
    primaryKey: 'id',
    fields: [
      {
        name: 'lineNum',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.index').d('序号'),
      },
      {
        name: 'detailLineNumLov',
        type: 'object',
        lovCode: 'WINV.INBOUND_LINES_REC_LINE',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.lineNum').d('行号'),
        ignore: 'always',
        noCache: true,
        valueField: 'detailId',
        dynamicProps: {
          lovPara: ({ record }) => {
            const detailId = record.get('detailId');
            const goodsId = record.get('goodsId');
            return { billIdList, detailId, goodsId, detailIds, pageCode };
          },
        },
      },
      {
        name: 'detailLineNum',
        bind: 'detailLineNumLov.lineNum',
      },
      {
        name: 'detailId',
        bind: 'detailLineNumLov.detailId',
      },
      {
        name: 'statusName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.status').d('状态'),
      },
      {
        name: 'goodsLov',
        type: 'object',
        required: true,
        lovCode: 'WINV.INBOUND_LINES_RECEIVE_SKU',
        label: intl.get('winv.inboundOrder.model.inboundNotice.sku').d('物料'),
        ignore: 'always',
        valueField: 'detailIdCopy',
        textField: 'sku',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => {
            const detailId = record.get('detailId');
            const goodsId = record.get('goodsId');
            return { billIdList, detailId, goodsId, detailIds, pageCode };
          },
        },
      },
      {
        name: 'detailIdCopy',
        type: 'number',
        bind: 'goodsLov.detailIdCopy',
      },
      {
        name: 'goodsId',
        type: 'number',
        bind: 'goodsLov.goodsId',
      },
      {
        name: 'sku',
        type: 'string',
        bind: 'goodsLov.sku',
      },
      {
        name: 'goodsName',
        bind: 'goodsLov.goodsName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.goodsName').d('品名'),
      },
      {
        name: 'uomName',
        bind: 'goodsLov.uomName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.uomName').d('单位'),
      },
      {
        name: 'uomCode',
        bind: 'goodsLov.uomCode',
      },
      {
        name: 'uomId',
        bind: 'goodsLov.uomId',
      },
      {
        name: 'serialType',
        bind: 'goodsLov.serialType',
      },
      {
        name: 'billId',
        bind: 'goodsLov.billId',
      },
      {
        name: 'billCode',
        bind: 'goodsLov.billCode',
      },
      {
        name: 'billCode',
        bind: 'goodsLov.billCode',
      },
      {
        name: 'ownerId',
        bind: 'goodsLov.ownerId',
      },
      {
        name: 'ownerCode',
        bind: 'goodsLov.ownerCode',
      },
      {
        name: 'ownerName',
        bind: 'goodsLov.ownerName',
      },
      {
        name: 'orgId',
        bind: 'goodsLov.orgId',
      },
      {
        name: 'orgName',
        bind: 'goodsLov.orgName',
      },
      {
        name: 'orgCode',
        bind: 'goodsLov.orgCode',
      },
      {
        name: 'currentBatchCode',
        bind: 'goodsLov.batchCode',
      },
      {
        name: 'inWarehouseId',
        bind: 'goodsLov.warehouseId',
      },
      {
        name: 'isBatchControl',
        bind: 'goodsLov.isBatchControl',
      },
      {
        name: 'isWhareaControl',
        bind: 'goodsLov.isWhareaControl',
      },
      {
        name: 'cidControl',
      },
      {
        name: 'lineBatchCode',
        bind: 'goodsLov.lineBatchCode',
      },
      {
        name: 'lineWhareaCode',
        bind: 'goodsLov.lineWhareaCode',
      },
      {
        name: 'lineWhareaId',
        bind: 'goodsLov.lineWhareaId',
      },
      {
        name: 'lineWhareaName',
        bind: 'goodsLov.lineWhareaName',
      },
      {
        name: 'warehouseId',
      },
      {
        name: 'batchId',
      },
      {
        name: 'batchCode',
        type: 'string',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.batchCode').d('批次'),
        validator: commonCodeValidator,
        dynamicProps: {
          required: ({ record }) => {
            return record.get('isbatch') === 1;
          },
        },
      },
      {
        name: 'toWhareaLov',
        type: 'object',
        required: true,
        noCache: true,
        lovCode: 'WMDM.WHAREA',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.toWhareaLov').d('收货库区'),
        ignore: 'always',
        textField: 'whareaCode',
        valueField: 'whareaId',
        dynamicProps: {
          lovPara: ({ record }) => {
            return {
              warehouseId: record.get('inWarehouseId')
                ? record.get('inWarehouseId')
                : record.get('warehouseId'),
            };
          },
        },
      },
      {
        name: 'whareaCode',
        type: 'string',
        bind: 'toWhareaLov.whareaCode',
      },
      {
        name: 'whareaId',
        type: 'number',
        bind: 'toWhareaLov.whareaId',
      },
      {
        name: 'locationLov',
        type: 'object',
        required: true,
        lovCode: 'WMDM.LOCATION',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.location').d('收货库位'),
        ignore: 'always',
        // cascadeMap: {
        //   whareaId: 'whareaId',
        // },
        dynamicProps: {
          lovPara: ({ record }) => {
            return {
              locationType: 'T_RCV',
              warehouseId: record.get('inWarehouseId')
                ? record.get('inWarehouseId')
                : record.get('warehouseId'),
              whareaId: record.get('whareaId'),
            };
          },
        },
        noCache: true,
        textField: 'locationCode',
        valueField: 'locationId',
      },
      {
        name: 'locationCode',
        type: 'string',
        bind: 'locationLov.locationCode',
      },
      {
        name: 'locationId',
        bind: 'locationLov.locationId',
      },
      {
        name: 'locationName',
        bind: 'locationLov.locationName',
      },
      {
        name: 'containerManageFlag',
        bind: 'locationLov.containerManageFlag',
      },
      {
        name: 'cidCode',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.cidCode').d('托盘编码'),
        dynamicProps: {
          required: ({ record }) => {
            return record.get('containerManageFlag') === 1 && record.get('cidControl') === '0';
          },
        },
      },
      {
        name: 'packQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.packQty').d('预打包数量'),
        defaultValue: 0,
      },
      {
        name: 'receiveQty',
        type: 'number',
        min: 0,
        step: 0.0001,
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.receiveQty').d('收货数量'),
        dynamicProps: {
          required: ({ record }) => {
            return !SERIAL_TYPE_LIST.includes(record.get('serialType'));
          },
        },
      },
      {
        name: 'assignQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.assignQty').d('分配数量'),
        defaultValue: 0,
      },
      {
        name: 'inQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.inQty').d('入库数量'),
        defaultValue: 0,
      },
      {
        name: 'functionName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.functionName').d('数据来源'),
      },
      {
        name: 'receivedByName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.receivedByName').d('收货人'),
      },
      {
        name: 'receivedDate',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.receivedDate').d('收货时间'),
      },
      {
        name: 'createdByName',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.createdByName').d('创建人'),
      },
      {
        name: 'creationDate',
        label: intl.get('winv.inboundOrder.deliverGoods.tabel.creationDate').d('创建时间'),
      },
    ],
    transport: {
      read: ({ params }) => {
        return {
          url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/lines-query-records-data?pageCode=${pageCode}`,
          method: 'GET',
          params,
        };
      },
      submit: ({ config, data }) => {
        return {
          ...config,
          url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/lines-receive`,
          method: 'PUT',
          data,
        };
      },
    },
    events: {
      load: ({ dataSet }) => {
        dataSet.forEach((record) => {
          if (
            record.get('id') &&
            record.get('status') !== 'PREPACKAGED' &&
            record.get('status') !== 'RECEIVED'
          ) {
            // eslint-disable-next-line no-param-reassign
            record.selectable = false;
          }
        });
      },
      update: ({ record, name }) => {
        const detailLineNumLov = record.get('detailLineNumLov');
        const goodsLov = record.get('goodsLov');
        if (name === 'detailLineNumLov') {
          if (detailLineNumLov) {
            const { whareaId, whareaCode, whareaName } = detailLineNumLov;
            const toWhareaLov = { whareaId, whareaCode, whareaName };
            record.set('toWhareaLov', toWhareaLov || null);
          }
          record.set('goodsLov', detailLineNumLov || null);
          record.set('batchCode', detailLineNumLov ? detailLineNumLov.batchCode : null);
          record.set('batchId', detailLineNumLov ? detailLineNumLov.batchId : null);
          record.set('isbatch', detailLineNumLov ? detailLineNumLov.isbatch : 0);
        } else if (name === 'goodsLov') {
          if (goodsLov) {
            const { whareaId, whareaCode, whareaName } = goodsLov;
            const toWhareaLov = { whareaId, whareaCode, whareaName };
            record.set('toWhareaLov', toWhareaLov || null);
          }
          record.set('detailLineNumLov', goodsLov || null);
          record.set('batchCode', goodsLov ? goodsLov.batchCode : null);
          record.set('batchId', goodsLov ? goodsLov.batchId : null);
          record.set('isbatch', goodsLov ? goodsLov.isbatch : 0);
        } else if (name === 'locationLov') {
          record.set('cidCode', null);
        }
      },
    },
  };
};

const returnGoodsDs = (billId, billCode, warehouseId) => ({
  primaryKey: 'id',
  fields: [
    {
      name: 'lineNum',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.orderNum').d('序号'),
    },
    {
      name: 'lineNumLov',
      type: 'object',
      lovCode: 'WINV.INBOUND_RETURN_LINE',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.lineNum').d('行号'),
      ignore: 'always',
      noCache: true,
      textField: 'lineNum',
      lovPara: { billId },
    },
    {
      name: 'detailLineNum',
      // bind: 'lineNumLov.lineNum',
      bind: 'lineNumLov.lineNum',
    },
    {
      name: 'detailId',
      bind: 'lineNumLov.detailId',
    },
    {
      name: 'statusName',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.statusName').d('状态'),
    },
    {
      name: 'goodsLov',
      type: 'object',
      required: true,
      lovCode: 'WINV.INBOUND_RETURN_SKU',
      label: intl.get('winv.inboundOrder.model.inboundNotice.sku').d('物料'),
      ignore: 'always',
      valueField: 'detailIdCopy',
      textField: 'sku',
      noCache: true,
      lovPara: { billId },
    },
    {
      name: 'detailIdCopy',
      type: 'string',
      bind: 'goodsLov.detailIdCopy',
    },
    {
      name: 'billTypeId',
      type: 'string',
      bind: 'goodsLov.billTypeId',
    },
    {
      name: 'orgId',
      type: 'string',
      bind: 'goodsLov.orgId',
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'goodsLov.ownerId',
    },
    {
      name: 'detailId',
      type: 'string',
      bind: 'goodsLov.detailId',
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
      name: 'returnAbleQty',
      type: 'number',
      bind: 'goodsLov.inQty',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.returnAbleQty').d('可退数量'),
    },
    {
      name: 'goodsName',
      bind: 'goodsLov.goodsName',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.goodsName').d('品名'),
    },
    {
      name: 'uomName',
      bind: 'goodsLov.uomName',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.uomName').d('单位'),
    },
    {
      name: 'uomCode',
      bind: 'goodsLov.uomCode',
    },
    {
      name: 'uomId',
      bind: 'goodsLov.uomId',
    },
    {
      name: 'serialType',
      bind: 'goodsLov.serialType',
    },
    {
      name: 'inWhareaId',
      bind: 'goodsLov.whareaId',
    },
    {
      name: 'batchId',
    },
    {
      name: 'batchCodeLov',
      type: 'object',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.batchCode').d('批次'),
      lovCode: 'WINV.INBOUND_RETURENS_BATCH',
      ignore: 'always',
      valueField: 'batchId',
      textField: 'batchCode',
      cascadeMap: { billTypeId: 'billTypeId', ownerId: 'ownerId', orgId: 'orgId' },
      noCache: true,
      dynamicProps: ({ record }) => {
        const detailId = record.get('detailId');
        const goodsId = record.get('goodsId');
        return {
          required: record.get('isbatch') === 1,
          readOnly: record.get('isbatch') === 0,
          lovPara: { billId, detailId, goodsId, warehouseId },
        };
      },
    },
    {
      name: 'batchCode',
      type: 'string',
      bind: 'batchCodeLov.batchCode',
    },
    {
      name: 'batchId',
      type: 'string',
      bind: 'batchCodeLov.batchId',
    },
    // WMDM.WHAREA
    {
      name: 'whareLov',
      type: 'object',
      required: true,
      lovCode: 'WMDM.WHAREA',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.whareCode').d('库区编码'),
      ignore: 'always',
      valueField: 'whareaId',
      textField: 'whareaCode',
      noCache: true,
      lovPara: { warehouseId },
    },
    {
      name: 'whareaName',
      type: 'string',
      bind: 'whareLov.whareaName',
    },
    {
      name: 'whareaCode',
      type: 'string',
      bind: 'whareLov.whareaCode',
    },
    {
      name: 'whareaId',
      type: 'string',
      bind: 'whareLov.whareaId',
    },
    {
      name: 'locationWareLov',
      type: 'object',
      required: true,
      lovCode: 'WINV.INBOUND_RETURENS_LOCATION',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.locationWareCode').d('库位编码'),
      ignore: 'always',
      valueField: 'locationId',
      textField: 'locationCode',
      noCache: true,
      cascadeMap: {
        whareaId: 'whareaId',
        goodsId: 'goodsId',
      },
      dynamicProps: {
        lovPara: ({ record }) => {
          const batchId = record.get('batchId');
          return { batchId };
        },
      },
    },
    {
      name: 'returnedLocationName',
      type: 'string',
      bind: 'locationWareLov.locationName',
    },
    {
      name: 'returnedLocationCode',
      type: 'string',
      bind: 'locationWareLov.locationCode',
    },
    {
      name: 'returnedLocationId',
      type: 'number',
      bind: 'locationWareLov.locationId',
    },
    {
      name: 'trayCodeLov',
      type: 'object',
      lovCode: 'WINV.STOCK_LIST_CONTAINER',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.cidCode').d('托盘编码'),
      ignore: 'always',
      valueField: 'cidId',
      textField: 'cidCode',
      noCache: true,
      cascadeMap: {
        goodsId: 'goodsId',
        locationId: 'returnedLocationId',
      },
      dynamicProps: {
        lovPara: ({ record }) => {
          const batchId = record.get('batchId');
          return { batchId };
        },
      },
    },
    {
      name: 'cidId',
      type: 'string',
      bind: 'trayCodeLov.cidId',
    },
    {
      name: 'cidCode',
      type: 'string',
      bind: 'trayCodeLov.cidCode',
    },
    {
      name: 'qty',
      bind: 'locationWareLov.qty',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.qty').d('库存数量'),
    },
    {
      name: 'validQty',
      bind: 'locationWareLov.validQty',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.validQty').d('可用数量'),
    },
    {
      name: 'returnedQty',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.returnedQty').d('退货数量'),
      min: 0,
      dynamicProps: ({ record }) => {
        if (record.get('detailIdCopy')) {
          if (record.get('returnAbleQty') > 0) {
            return {
              required: record.get('returnAbleQty') > 0,
              max:
                record.get('returnAbleQty') > record.get('validQty')
                  ? record.get('validQty')
                  : record.get('returnAbleQty'),
            };
          }
        }
      },
    },
    {
      name: 'returnedReason',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.returnedReason').d('退货原因'),
      required: true,
    },
    {
      name: 'returnedByName',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.returnedByName').d('退货人'),
    },
    {
      name: 'returnedDate',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.returnedBy').d('退货时间'),
    },
    {
      name: 'createdByName',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.createdByName').d('创建人'),
    },
    {
      name: 'creationDate',
      label: intl.get('winv.inboundOrder.returnGoods.tabel.creationDate').d('创建时间'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records?status=RETURNED`,
        method: 'GET',
        params,
      };
    },
    submit: ({ config, data }) => {
      const otherData = data.map((item) => {
        const { __id, ...other } = item;
        return other;
      });
      const parentData = {
        id: billId,
        billId,
        billCode,
        inboundReceiptRecordList: otherData,
      };
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-returnss`,
        method: 'POST',
        data: parentData,
      };
    },
  },
  events: {
    load: ({ dataSet }) => {
      dataSet.forEach((record) => {
        if (
          record.get('id') &&
          record.get('status') !== 'PREPACKAGED' &&
          record.get('status') !== 'RECEIVED'
        ) {
          // eslint-disable-next-line no-param-reassign
          record.selectable = false;
        }
      });
    },
  },
});

const quickInboundDs = (billIdList, detailIds) => {
  return {
    primaryKey: 'id',
    fields: [
      {
        name: 'lineNum',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.index').d('序号'),
      },
      {
        name: 'detailLineNumLov',
        type: 'object',
        lovCode: 'WINV.INBOUND_LINES_REC_LINE',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.lineNum').d('行号'),
        ignore: 'always',
        noCache: true,
        dynamicProps: ({ record }) => {
          const detailId = record.get('detailId');
          const goodsId = record.get('goodsId');
          return {
            lovPara: { detailIds, detailId, goodsId, billIdList },
          };
        },
      },
      {
        name: 'detailLineNum',
        bind: 'detailLineNumLov.lineNum',
      },
      {
        name: 'detailId',
        bind: 'detailLineNumLov.detailId',
      },
      {
        name: 'statusName',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.status').d('状态'),
      },
      {
        name: 'goodsLov',
        type: 'object',
        required: true,
        lovCode: 'WINV.INBOUND_LINES_RECEIVE_SKU',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.goodsLov').d('物料'),
        ignore: 'always',
        noCache: true,
        valueField: 'detailId',
        dynamicProps: ({ record }) => {
          const detailId = record.get('detailId');
          const goodsId = record.get('goodsId');
          return {
            lovPara: { detailIds, detailId, goodsId, billIdList },
          };
        },
      },
      {
        name: 'goodsId',
        type: 'number',
        bind: 'goodsLov.goodsId',
      },
      {
        name: 'sku',
        type: 'string',
        bind: 'goodsLov.sku',
      },
      {
        name: 'goodsName',
        bind: 'goodsLov.goodsName',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.goodsName').d('品名'),
      },
      {
        name: 'uomName',
        bind: 'goodsLov.uomName',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.uomName').d('单位'),
      },
      {
        name: 'uomCode',
        bind: 'goodsLov.uomCode',
      },
      {
        name: 'uomId',
        bind: 'goodsLov.uomId',
      },
      {
        name: 'billCode',
        bind: 'goodsLov.billCode',
      },
      {
        name: 'ownerId',
        bind: 'goodsLov.ownerId',
      },
      {
        name: 'ownerCode',
        bind: 'goodsLov.ownerCode',
      },
      {
        name: 'ownerName',
        bind: 'goodsLov.ownerName',
      },
      {
        name: 'orgId',
        bind: 'goodsLov.orgId',
      },
      {
        name: 'orgName',
        bind: 'goodsLov.orgName',
      },
      {
        name: 'orgCode',
        bind: 'goodsLov.orgCode',
      },
      {
        name: 'billId',
        bind: 'goodsLov.billId',
      },
      {
        name: 'lineWhareaCode',
        bind: 'goodsLov.lineWhareaCode',
      },
      {
        name: 'lineWhareaId',
        bind: 'goodsLov.lineWhareaId',
      },
      {
        name: 'lineWhareaName',
        bind: 'goodsLov.lineWhareaName',
      },
      {
        name: 'warehouseId',
        bind: 'goodsLov.warehouseId',
      },
      {
        name: 'serialType',
        bind: 'goodsLov.serialType',
      },
      {
        name: 'isBatchControl',
        bind: 'goodsLov.isBatchControl',
      },
      {
        name: 'isWhareaControl',
        bind: 'goodsLov.isWhareaControl',
      },
      {
        name: 'lineBatchCode',
        bind: 'goodsLov.lineBatchCode',
      },
      {
        name: 'batchId',
      },
      // {
      //   name: 'whareaId',
      // },
      {
        name: 'batchCode',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.batchCode').d('批次'),
        validator: commonCodeValidator,
        dynamicProps: ({ record }) => {
          return {
            required: record.get('isbatch') === 1,
            readOnly: !record.get('goodsId'),
          };
        },
      },
      {
        name: 'inWhareaLov',
        type: 'object',
        required: true,
        lovCode: 'WMDM.WHAREA',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.inWharea').d('入库库区'),
        ignore: 'always',
        textField: 'whareaCode',
        valueField: 'whareaId',
        noCache: true,
        dynamicProps: {
          lovPara: ({ record }) => {
            return {
              warehouseId: record.get('warehouseId'),
            };
          },
        },
      },
      {
        name: 'whareaCode',
        type: 'string',
        bind: 'inWhareaLov.whareaCode',
      },
      {
        name: 'whareaId',
        bind: 'inWhareaLov.whareaId',
      },
      {
        name: 'inLocationLov',
        type: 'object',
        required: true,
        lovCode: 'WMDM.LOCATION',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.inLocation').d('入库库位'),
        ignore: 'always',
        textField: 'locationCode',
        valueField: 'locationId',
        noCache: true,
        lovPara: {
          locationType: 'T_STOCK',
        },
        cascadeMap: {
          whareaId: 'whareaId',
        },
      },
      {
        name: 'inLocationCode',
        type: 'string',
        bind: 'inLocationLov.locationCode',
      },
      {
        name: 'inLocationId',
        bind: 'inLocationLov.locationId',
      },
      {
        name: 'cidCode',
        required: false,
        label: intl.get('winv.inboundOrder.quickInbound.tabel.cidCode').d('托盘编码'),
      },
      {
        name: 'packQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.packQty').d('预打包数量'),
        defaultValue: 0,
      },
      {
        name: 'receiveQty',
        type: 'number',
        min: 0,
        label: intl.get('winv.inboundOrder.quickInbound.tabel.receiveQty').d('收货数量'),
        dynamicProps: {
          required: ({ record }) => {
            return !SERIAL_TYPE_LIST.includes(record.get('serialType'));
          },
        },
      },
      {
        name: 'assignQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.assignQty').d('分配数量'),
        defaultValue: 0,
      },
      {
        name: 'inQty',
        type: 'number',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.inQty').d('入库数量'),
        defaultValue: 0,
        step: 0.0001,
        dynamicProps: {
          required: ({ record }) => {
            return !SERIAL_TYPE_LIST.includes(record.get('serialType'));
          },
        },
      },
      {
        name: 'functionName',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.functionName').d('数据来源'),
      },
      {
        name: 'receivedByName',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.receivedByName').d('收货人'),
      },
      {
        name: 'receivedDate',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.receivedDate').d('收货时间'),
      },
      {
        name: 'createdByName',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.createdByName').d('创建人'),
      },
      {
        name: 'creationDate',
        label: intl.get('winv.inboundOrder.quickInbound.tabel.creationDate').d('创建时间'),
      },
    ],
    transport: {
      read: ({ params }) => {
        return {
          url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/lines-query-quick-inbound-data`,
          method: 'GET',
          params,
        };
      },
      submit: ({ config, data }) => {
        return {
          ...config,
          url: `${WMS_INV}/v1/${currentTenantID}/inbound-receipt-records/lines-receive`,
          method: 'PUT',
          data,
        };
      },
    },
    events: {
      update: ({ record, name }) => {
        const detailLineNumLov = record.get('detailLineNumLov');
        const goodsLov = record.get('goodsLov');
        const inLocationLov = record.get('inLocationLov');
        if (name === 'detailLineNumLov') {
          if (detailLineNumLov) {
            const { whareaId, whareaCode, whareaName } = detailLineNumLov;
            const inWhareaLov = { whareaId, whareaCode, whareaName };
            record.set('inWhareaLov', inWhareaLov || null);
          }
          record.set('goodsLov', detailLineNumLov || null);
          record.set('batchCode', detailLineNumLov ? detailLineNumLov.batchCode : null);
          record.set('batchId', detailLineNumLov ? detailLineNumLov.batchId : null);
          record.set('isbatch', detailLineNumLov ? detailLineNumLov.isbatch : 0);
        } else if (name === 'goodsLov') {
          if (goodsLov) {
            const { whareaId, whareaCode, whareaName } = goodsLov;
            const inWhareaLov = { whareaId, whareaCode, whareaName };
            record.set('inWhareaLov', inWhareaLov || null);
          }
          record.set('receiveQty', 0);
          record.set('detailLineNumLov', goodsLov || null);
          record.set('batchCode', goodsLov ? goodsLov.batchCode : null);
          record.set('batchId', goodsLov ? goodsLov.batchId : null);
          record.set('isbatch', goodsLov ? goodsLov.isbatch : 0);
        } else if (name === 'inLocationLov') {
          record.set('locationId', inLocationLov ? inLocationLov.locationId : null);
          record.set('locationCode', inLocationLov ? inLocationLov.locationCode : null);
          record.set('inWhareaId', inLocationLov ? inLocationLov.whareaId : null);
          record.set('inWhareaCode', inLocationLov ? inLocationLov.whareaCode : null);
        } else if (name === 'batchCode') {
          record.set('batchId', null);
        }
      },
    },
  };
};

const serialNumberDs = (billId) => ({
  selection: 'multiple',
  queryFields: [
    {
      name: 'serialNumber',
      type: 'string',
      label: intl.get('winv.inboundOrder.serial.serialNumber').d('序列号'),
    },
    {
      name: 'status',
      label: intl.get('winv.inboundOrder.serial.status').d('状态'),
      type: 'string',
      lookupCode: 'WINV.IN_SERIAL_NUM_STATUS',
    },
    {
      name: 'goodsLov',
      type: 'object',
      lovCode: 'WINV.INBOUND_LINES_RECEIVE_SKU',
      label: intl.get('winv.inboundOrder.serial.goodsLov').d('物料'),
      ignore: 'always',
      noCache: true,
      dynamicProps: {
        lovPara: () => {
          return { billId, serialFlag: 'serialFlag' };
        },
      },
    },
    {
      name: 'goodsId',
      type: 'number',
      bind: 'goodsLov.goodsId',
    },
  ],
  fields: [
    {
      name: 'detailLineNumLov',
      type: 'object',
      lovCode: 'WINV.INBOUND_LINES_REC_LINE',
      label: intl.get('winv.inboundOrder.serial.detailLineNumLov').d('行号'),
      ignore: 'always',
      noCache: true,
      required: true,
      valueField: 'detailId',
      dynamicProps: {
        lovPara: ({ record }) => {
          const detailId = record.get('detailId');
          const goodsId = record.get('goodsId');
          return { billId, detailId, goodsId, serialFlag: 'serialFlag' };
        },
      },
    },
    {
      name: 'detailLineNum',
      bind: 'detailLineNumLov.lineNum',
    },
    {
      name: 'detailId',
      bind: 'detailLineNumLov.detailId',
    },
    {
      name: 'status',
      defaultValue: '0-DEFINED',
      label: intl.get('winv.inboundOrder.serial.status').d('状态'),
      lookupCode: 'WINV.IN_SERIAL_NUM_STATUS',
    },
    {
      name: 'goodsLov',
      type: 'object',
      required: true,
      lovCode: 'WINV.INBOUND_LINES_RECEIVE_SKU',
      label: intl.get('winv.inboundOrder.serial.goodsLov').d('物料'),
      ignore: 'always',
      valueField: 'detailIdCopy',
      textField: 'sku',
      dynamicProps: {
        lovPara: ({ record }) => {
          const detailId = record.get('detailId');
          const goodsId = record.get('goodsId');
          return { billId, detailId, goodsId, serialFlag: 'serialFlag' };
        },
      },
    },
    {
      name: 'goodsId',
      type: 'number',
      bind: 'goodsLov.goodsId',
    },
    {
      name: 'sku',
      type: 'string',
      bind: 'goodsLov.sku',
    },
    {
      name: 'goodsName',
      bind: 'goodsLov.goodsName',
      label: intl.get('winv.inboundOrder.serial.goodsName').d('品名'),
    },
    {
      name: 'uomName',
      bind: 'goodsLov.uomName',
      label: intl.get('winv.inboundOrder.serial.uomName').d('单位'),
    },
    {
      name: 'uomCode',
      bind: 'goodsLov.uomCode',
    },
    {
      name: 'uomId',
      bind: 'goodsLov.uomId',
    },
    {
      name: 'ownerId',
      bind: 'goodsLov.ownerId',
    },
    {
      name: 'ownerCode',
      bind: 'goodsLov.ownerCode',
    },
    {
      name: 'orgId',
      bind: 'goodsLov.orgId',
    },
    {
      name: 'orgCode',
      bind: 'goodsLov.orgCode',
    },
    {
      name: 'warehouseId',
      bind: 'goodsLov.warehouseId',
    },
    {
      name: 'warehouseCode',
      bind: 'goodsLov.warehouseCode',
    },
    {
      name: 'batchCode',
      type: 'string',
      label: intl.get('winv.inboundOrder.serial.batchCode').d('批次'),
      validator: commonCodeValidator,
      dynamicProps: {
        required: ({ record }) => {
          return record.get('isbatch') === 1;
        },
      },
    },
    {
      name: 'serialNumber',
      required: true,
      label: intl.get('winv.inboundOrder.serial.serialNumber').d('序列号'),
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inboundOrder.serial.cidCode').d('托盘编码'),
    },
    {
      name: 'qty',
      defaultValue: 1,
      label: intl.get('winv.inboundOrder.serial.tabel.qty').d('数量'),
    },
    {
      name: 'qualityStatus',
      label: intl.get('winv.inboundOrder.serial.qualityStatus').d('质量状态'),
      type: 'string',
      defaultValue: '0-ACCEPTED',
      lookupCode: 'WMDM.SERIAL_NUM_QUALITY_STATUS',
    },
    {
      name: 'personalizedFlag',
      label: intl.get('winv.inboundOrder.serial.personalizedFlag').d('个性化'),
      type: 'boolean',
      trueValue: 1,
      falseValue: 0,
    },
    {
      name: 'createdByName',
      label: intl.get('winv.inboundOrder.serial.createdByName').d('创建人'),
    },
    {
      name: 'creationDate',
      label: intl.get('winv.inboundOrder.serial.creationDate').d('创建时间'),
    },
    {
      name: 'lastUpdatedByName',
      label: intl.get('winv.inboundOrder.serial.lastUpdatedByName').d('更新人'),
    },
    {
      name: 'lastUpdateDate',
      label: intl.get('winv.inboundOrder.serial.lastUpdateDate').d('更新时间'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts`,
        method: 'GET',
        params,
      };
    },
    create: ({ config, data }) => {
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts`,
        method: 'POST',
        data,
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts`,
        method: 'DELETE',
        data,
      };
    },
  },
  events: {
    update: ({ record, name }) => {
      const detailLineNumLov = record.get('detailLineNumLov');
      const goodsLov = record.get('goodsLov');
      if (name === 'detailLineNumLov') {
        record.set('goodsLov', detailLineNumLov || null);
        record.set('batchCode', detailLineNumLov ? detailLineNumLov.batchCode : null);
        record.set('batchId', detailLineNumLov ? detailLineNumLov.batchId : null);
        record.set('isbatch', detailLineNumLov ? detailLineNumLov.isbatch : 0);
        record.set('serialNumber', null);
      } else if (name === 'goodsLov') {
        record.set('detailLineNumLov', goodsLov || null);
        record.set('batchCode', goodsLov ? goodsLov.batchCode : null);
        record.set('batchId', goodsLov ? goodsLov.batchId : null);
        record.set('isbatch', goodsLov ? goodsLov.isbatch : 0);
        record.set('serialNumber', null);
      } else if (name === 'batchCode') {
        record.set('batchId', null);
        record.set('serialNumber', null);
      }
    },
  },
});

// 新建批次
const modalDs = () => ({
  fields: [
    {
      name: 'batchCode',
      label: intl.get('winv.inboundOrder.model.createBatch.batchCode').d('批次编码'),
      type: 'string',
      maxLength: 80,
    },
    {
      name: 'orgName',
      type: 'string',
      label: intl.get('winv.inboundOrder.model.createBatch.orgName').d('组织名称'),
    },
    {
      name: 'ownerName',
      type: 'string',
      label: intl.get('winv.inboundOrder.model.createBatch.ownerName').d('货主名称'),
    },
    {
      name: 'goodsName',
      type: 'string',
      label: intl.get('winv.inboundOrder.model.createBatch.goodsCode').d('物料编码'),
    },
    {
      name: 'vendorLov',
      type: 'object',
      lovCode: 'WMDM.VENDOR',
      textField: 'vendorCode',
      valueField: 'vendorId',
      label: intl.get('winv.inboundOrder.model.createBatch.vendorCode').d('供应商编码'),
      ignore: 'always',
    },
    {
      name: 'vendorId',
      type: 'string',
      bind: 'vendorLov.vendorId',
    },
    {
      name: 'vendorCode',
      type: 'string',
      bind: 'vendorLov.vendorCode',
    },
    {
      name: 'vendorBatch',
      label: intl.get('winv.inboundOrder.model.createBatch.vendorBatch').d('供应商批号'),
      type: 'string',
      maxLength: 200,
    },
    {
      name: 'batchStatus',
      label: intl.get('winv.inboundOrder.model.createBatch.batchStatus').d('批次状态'),
      type: 'string',
      lookupCode: 'WMDM.BATCH_STATUS',
    },
    {
      name: 'produceDate',
      label: intl.get('winv.inboundOrder.model.createBatch.produceDate').d('生产日期'),
      type: 'date',
    },
    {
      name: 'expireDate',
      label: intl.get('winv.inboundOrder.model.createBatch.expireDate').d('有效日期'),
      type: 'date',
    },
    {
      name: 'nextCheckDate',
      label: intl.get('winv.inboundOrder.model.createBatch.nextCheckDate').d('下次质检日期'),
      type: 'date',
    },
    {
      name: 'remark',
      label: intl.get('winv.inboundOrder.model.createBatch.remark').d('备注'),
      type: 'string',
      maxLength: 200,
    },
  ],
  transport: {
    create: ({ config, data }) => {
      const [{ __id, _status, ...other }] = data;
      return {
        ...config,
        url: `${WMS_MDM}/v1/${currentTenantID}/batchs?organizationId=${currentTenantID}`,
        method: 'POST',
        data: other,
      };
    },
  },
});

const serialDetailTableDs = () => ({
  fields: [
    {
      name: 'serialNumber',
      label: intl.get('winv.inboundOrder.serialDetail.tabel.serialNumber').d('序列号'),
    },
    {
      name: 'qualityStatusName',
      label: intl.get('winv.inboundOrder.serialDetail.tabel.qualityStatus').d('质量状态'),
    },
    {
      name: 'personalizedFlag',
      label: intl.get('winv.inboundOrder.serialDetail.tabel.personalizedFlag').d('个性化'),
    },
    {
      name: 'qty',
      label: intl.get('winv.inboundOrder.serialDetail.tabel.qty').d('数量'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts`,
        method: 'GET',
        params,
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/delete`,
        method: 'DELETE',
        data,
      };
    },
  },
});

const serialDetailFormDs = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'serialNumber',
      required: true,
      label: intl.get('winv.inboundOrder.serialDetail.form.serialNumber').d('序列号'),
    },
    {
      name: 'qualityStatus',
      label: intl.get('winv.inboundOrder.serial.qualityStatus').d('质量状态'),
      type: 'string',
      required: true,
      defaultValue: '0-ACCEPTED',
      lookupCode: 'WMDM.SERIAL_NUM_QUALITY_STATUS',
    },
    {
      name: 'personalizedFlag',
      label: intl.get('winv.inboundOrder.serial.personalizedFlag').d('个性化'),
      type: 'boolean',
      trueValue: 1,
      falseValue: 0,
    },
    {
      name: 'serialLength',
      label: intl.get('winv.inboundOrder.serialDetail.form.serialLength').d('已录入序列号数'),
      readOnly: true,
    },
  ],
});

const serialDetailModalDs = () => ({
  fields: [
    {
      name: 'serialNumber',
      label: intl.get('winv.inboundOrder.serialDetailModal.tabel.serialNumber').d('序列号'),
    },
    {
      name: 'qualityStatusName',
      label: intl.get('winv.inboundOrder.serialDetailModal.tabel.qualityStatus').d('质量状态'),
    },
    {
      name: 'personalizedFlag',
      label: intl.get('winv.inboundOrder.serialDetailModal.tabel.personalizedFlag').d('个性化'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/list`,
        method: 'GET',
        params,
      };
    },
  },
});

const returnGoodsSerialDetailModalDs = () => ({
  fields: [
    {
      name: 'serialNumber',
      label: intl.get('winv.inboundOrder.rGSDetail.tabel.serialNumber').d('序列号'),
    },
    {
      name: 'qualityStatusName',
      label: intl.get('winv.inboundOrder.rGSDetail.tabel.qualityStatus').d('质量状态'),
    },
    {
      name: 'personalizedFlag',
      label: intl.get('winv.inboundOrder.rGSDetail.tabel.personalizedFlag').d('个性化'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/returnSerial`,
        method: 'GET',
        params,
      };
    },
  },
});

// 任务处理
const taskTableDs = () => ({
  queryFields: [
    {
      name: 'sku',
      type: 'string',
      label: intl.get('winv.inboundOrder.task.tabel.sku').d('物料'),
    },
    {
      name: 'status',
      type: 'string',
      label: intl.get('winv.inboundOrder.task.tabel.status').d('状态'),
      lookupCode: 'WINV.TASK_STATUS',
    },
    {
      name: 'cidCode',
      type: 'string',
      label: intl.get('winv.inboundOrder.task.tabel.cidCode').d('来源托盘'),
    },
  ],
  fields: [
    {
      name: 'billCode',
      label: intl.get('winv.inboundOrder.task.tabel.billCode').d('入库单号'),
    },
    {
      name: 'detailLineNum',
      label: intl.get('winv.inboundOrder.task.tabel.detailLineNum').d('行号'),
    },
    {
      name: 'statusName',
      label: intl.get('winv.inboundOrder.task.tabel.status').d('状态'),
    },
    {
      name: 'sku',
      label: intl.get('winv.inboundOrder.task.tabel.sku').d('物料'),
    },
    {
      name: 'goodsName',
      label: intl.get('winv.inboundOrder.task.tabel.goodsName').d('品名'),
    },
    {
      name: 'uomName',
      label: intl.get('winv.inboundOrder.task.tabel.uomName').d('单位'),
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inboundOrder.task.tabel.batchCode').d('批次'),
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inboundOrder.task.tabel.cidCode').d('来源托盘'),
    },
    {
      name: 'qtyPlan',
      label: intl.get('winv.inboundOrder.task.tabel.qtyPlan').d('任务数量'),
    },
    {
      name: 'toCidCode',
      label: intl.get('winv.inboundOrder.task.tabel.toCidCode').d('目标托盘'),
    },
    {
      name: 'toWhareaLov',
      type: 'object',
      required: true,
      lovCode: 'WMDM.WHAREA',
      label: intl.get('winv.inboundOrder.task.tabel.toWhareaLov').d('目标库区'),
      ignore: 'always',
      textField: 'whareaCode',
      valueField: 'whareaId',
      cascadeMap: {
        warehouseId: 'warehouseId',
      },
      noCache: true,
    },
    {
      name: 'toWhareaCode',
      type: 'string',
      bind: 'toWhareaLov.whareaCode',
    },
    {
      name: 'toWhareaId',
      type: 'number',
      bind: 'toWhareaLov.whareaId',
    },
    {
      name: 'toLocationLov',
      type: 'object',
      required: true,
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inboundOrder.task.tabel.toLocationCode').d('目标库位'),
      ignore: 'always',
      textField: 'locationCode',
      valueField: 'locationId',
      cascadeMap: {
        whareaId: 'toWhareaId',
      },
      noCache: true,
    },
    {
      name: 'toLocationCode',
      type: 'string',
      bind: 'toLocationLov.locationCode',
    },
    {
      name: 'toLocationId',
      bind: 'toLocationLov.locationId',
    },
    {
      name: 'toLocationName',
      bind: 'toLocationLov.locationName',
    },
    {
      name: 'warehouseId',
    },
    {
      name: 'qtyScan',
      required: true,
      label: intl.get('winv.inboundOrder.task.tabel.qtyScan').d('处理数量'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/tasks/putaway-serial`,
        method: 'GET',
        params,
      };
    },
  },
});

const taskModalDs = () => ({
  fields: [
    {
      name: 'serialNumber',
      label: intl.get('winv.inboundOrder.taskModal.tabel.serialNumber').d('序列号'),
    },
    {
      name: 'qualityStatusName',
      label: intl.get('winv.inboundOrder.taskModal.tabel.qualityStatus').d('质量状态'),
    },
    {
      name: 'personalizedFlag',
      label: intl.get('winv.inboundOrder.taskModal.tabel.personalizedFlag').d('个性化'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/taskList`,
        method: 'GET',
        params,
      };
    },
  },
});

const taskModalDetailDs = () => ({
  selection: false,
  fields: [
    {
      name: 'serialNumber',
      label: intl.get('winv.inboundOrder.taskModalDetail.tabel.serialNumber').d('序列号'),
    },
    {
      name: 'qualityStatusName',
      label: intl.get('winv.inboundOrder.taskModalDetail.tabel.qualityStatus').d('质量状态'),
    },
    {
      name: 'personalizedFlag',
      label: intl.get('winv.inboundOrder.taskModalDetail.tabel.personalizedFlag').d('个性化'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts`,
        method: 'GET',
        params,
      };
    },
  },
});

export {
  warrentHeadDs,
  warrentLineDs,
  warrentHeadFormDs,
  warrentLineShowDs,
  deliverGoodsDs,
  receivedGoodsDs,
  deliverGoodsShowDs,
  returnGoodsDs,
  quickInboundDs,
  modalDs,
  serialNumberDs,
  serialDetailTableDs,
  serialDetailFormDs,
  serialDetailModalDs,
  taskTableDs,
  taskModalDs,
  taskModalDetailDs,
  returnGoodsSerialDetailModalDs,
};
