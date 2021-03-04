import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { WMS_INV } from 'wmsUtils/config';
import moment from 'moment';

const currentTenantID = getCurrentOrganizationId();

const taskTableDs = () => ({
  primaryKey: 'id',
  selection: 'multiple',
  fields: [
    {
      name: 'attribute15',
      type: 'string',
      label: intl.get('winv.task.table.query.attribute15').d('来源编号'),
    },
    {
      name: 'sourceTypeName',
      label: intl.get('winv.task.table.sourceTypeName').d('任务来源类型'),
    },
    {
      name: 'taskTypeName',
      label: intl.get('winv.task.table.taskTypeName').d('任务类型'),
    },
    {
      name: 'taskCode',
      label: intl.get('winv.task.table.taskCode').d('任务编号'),
    },
    {
      name: 'groupCode',
      label: intl.get('winv.task.table.groupCode').d('批标识'),
    },
    {
      name: 'statusName',
      label: intl.get('winv.task.table.statusName').d('状态'),
    },
    {
      name: 'ownerName',
      label: intl.get('winv.task.table.ownerName').d('货主名称'),
    },
    {
      name: 'orgName',
      label: intl.get('winv.task.table.orgName').d('组织名称'),
      type: 'string',
    },
    {
      name: 'customerName',
      label: intl.get('winv.task.table.customerName').d('客户名称'),
    },
    {
      name: 'modeOfCarriage',
      label: intl.get('winv.task.table.modeOfCarriage').d('运输形式'),
    },
    {
      name: 'vendorName',
      label: intl.get('winv.task.table.vendorName').d('供应商名称'),
    },
    {
      name: 'warehouseName',
      label: intl.get('winv.task.table.warehouseName').d('仓库名称'),
    },
    {
      name: 'whareaCode',
      label: intl.get('winv.task.table.whareaCode').d('库区名称'),
    },
    {
      name: 'locationCode',
      label: intl.get('winv.task.table.locationCode').d('库位名称'),
    },
    {
      name: 'cidCode',
      label: intl.get('winv.task.table.cidCode').d('托盘编码'),
    },
    {
      name: 'loadCidCode',
      label: intl.get('winv.task.table.loadCidCode').d('装入托盘'),
    },
    {
      name: 'toOwnerName',
      label: intl.get('winv.task.table.toOwnerName').d('目标货主'),
    },
    {
      name: 'toWarehouseName',
      label: intl.get('winv.task.table.toWarehouseName').d('目标仓库'),
    },
    {
      name: 'toWhareaCode',
      label: intl.get('winv.task.table.toWhareaCode').d('目标库区'),
    },
    {
      name: 'toLocationCode',
      label: intl.get('winv.task.table.toLocationCode').d('目标库位'),
    },
    {
      name: 'toCidCode',
      label: intl.get('winv.task.table.toCidCode').d('目标托盘'),
    },
    {
      name: 'sku',
      label: intl.get('winv.task.table.sku').d('物料编码'),
    },
    {
      name: 'uomName',
      label: intl.get('winv.task.table.uomName').d('单位'),
    },
    {
      name: 'batchCode',
      label: intl.get('winv.task.table.batchCode').d('批次编码'),
    },
    {
      name: 'serialNumber',
      label: intl.get('winv.delivery.warrant.serialNumber').d('序列号'),
    },
    {
      name: 'qtyPlan',
      label: intl.get('winv.task.table.qtyPlan').d('计划数量'),
    },
    {
      name: 'qtyScan',
      type: 'number',
      label: intl.get('winv.task.table.qtyScan').d('扫描数量'),
    },
    {
      name: 'operateDate',
      label: intl.get('winv.task.table.operateDate').d('操作时间'),
    },
    {
      name: 'unloadBy',
      label: intl.get('winv.task.table.unloadBy').d('卸货人'),
    },
    {
      name: 'unloadDate',
      label: intl.get('winv.task.table.unloadDate').d('卸货时间'),
    },
    {
      name: 'billCode',
      label: intl.get('winv.task.table.billCode').d('单据编码'),
    },
    {
      name: 'billType',
      label: intl.get('winv.task.table.billType').d('单据类型'),
    },
    {
      name: 'detailLineNum',
      label: intl.get('winv.task.table.detailLineNum').d('行号'),
    },
    {
      name: 'functionCodeName',
      label: intl.get('winv.task.table.functionCodeName').d('来源功能'),
    },
    {
      name: 'deviceCode',
      label: intl.get('winv.task.table.deviceCode').d('来源设备'),
    },
    {
      name: 'remark',
      label: intl.get('winv.task.table.remark').d('备注'),
    },
    {
      name: 'creationDate',
      label: intl.get('winv.task.table.creationDate').d('创建时间'),
    },
    {
      name: 'taskPriorityName',
      label: intl.get('winv.task.table.taskPriorityName').d('优先级'),
    },
    {
      name: 'attribute4',
      type: 'object',
      ignore: true,
      noCace: true,
      textField: 'locationName',
      valueField: 'locationCode',
      lovCode: 'WMDM.LOCATION',
      dynamicProps: {
        lovPara: ({ record }) => {
          return { orgId: record.get('orgId'), warehouseId: record.get('warehouseId') }
        },
      },
      label: intl.get('winv.task.table.query.attribute4').d('目标子库位'),
    },
    {
      name: 'attribute3',
      type: 'string',
      label: intl.get('winv.task.table.query.attribute3').d('目标子库存'),
    },
    {
      name: 'attribute6',
      type: 'string',
      label: intl.get('winv.task.table.query.attribute6').d('到货数量'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/tasks/queryProcessList`,
        method: 'GET',
        params,
      };
    },
    submit: ({ data, dataSet }) => {
      const flag = dataSet._flag;
      if (flag === 'process') {
        data.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.qtyScan = item.qtyPlan;
        });
      }
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/tasks/${flag}`,
        method: 'PUT',
        data,
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/tasks`,
        method: 'DELETE',
        data: data[0],
      };
    },
  },
});

const taskTableShowDs = () => ({
  primaryKey: 'id',
  selection: 'multiple',
  fields: [
    {
      name: 'attribute15',
      type: 'string',
      label: intl.get('winv.task.table.query.attribute15').d('来源编号'),
    },
    {
      name: 'sourceTypeName',
      label: intl.get('winv.task.tableShow.sourceTypeName').d('任务来源类型'),
    },
    {
      name: 'taskTypeName',
      label: intl.get('winv.task.tableShow.taskTypeName').d('任务类型'),
    },
    {
      name: 'taskCode',
      label: intl.get('winv.task.tableShow.taskCode').d('任务编号'),
    },
    {
      name: 'groupCode',
      label: intl.get('winv.task.tableShow.groupCode').d('批标识'),
    },
    {
      name: 'modeOfCarriage',
      label: intl.get('winv.task.tableShow.modeOfCarriage').d('运输形式'),
    },
    {
      name: 'statusName',
      label: intl.get('winv.task.tableShow.statusName').d('状态'),
    },
    {
      name: 'ownerName',
      label: intl.get('winv.task.tableShow.ownerName').d('货主名称'),
    },
    {
      name: 'orgName',
      label: intl.get('winv.task.tableShow.orgName').d('组织名称'),
      type: 'string',
    },
    {
      name: 'customerName',
      label: intl.get('winv.task.tableShow.customerName').d('客户名称'),
    },
    {
      name: 'vendorName',
      label: intl.get('winv.task.tableShow.vendorName').d('供应商名称'),
    },
    {
      name: 'warehouseName',
      label: intl.get('winv.task.tableShow.warehouseName').d('仓库名称'),
    },
    {
      name: 'whareaCode',
      label: intl.get('winv.task.tableShow.whareaCode').d('库区名称'),
    },
    {
      name: 'locationCode',
      label: intl.get('winv.task.tableShow.locationCode').d('库位名称'),
    },
    {
      name: 'cidCode',
      label: intl.get('winv.task.tableShow.cidCode').d('托盘编码'),
    },
    {
      name: 'loadCidCode',
      label: intl.get('winv.task.tableShow.loadCidCode').d('装入托盘'),
    },
    {
      name: 'toOwnerName',
      label: intl.get('winv.task.tableShow.toOwnerName').d('目标货主'),
    },
    {
      name: 'toWarehouseName',
      label: intl.get('winv.task.tableShow.toWarehouseName').d('目标仓库'),
    },
    {
      name: 'toWhareaCode',
      label: intl.get('winv.task.tableShow.toWhareaCode').d('目标库区'),
    },
    {
      name: 'toLocationCode',
      label: intl.get('winv.task.tableShow.toLocationCode').d('目标库位'),
    },
    {
      name: 'toCidCode',
      label: intl.get('winv.task.tableShow.toCidCode').d('目标托盘'),
    },
    {
      name: 'sku',
      label: intl.get('winv.task.tableShow.sku').d('物料编码'),
    },
    {
      name: 'uomName',
      label: intl.get('winv.task.tableShow.uomName').d('单位'),
    },
    {
      name: 'batchCode',
      label: intl.get('winv.task.tableShow.batchCode').d('批次编码'),
    },
    {
      name: 'serialNumber',
      label: intl.get('winv.delivery.warrant.serialNumber').d('序列号'),
    },
    {
      name: 'qtyPlan',
      label: intl.get('winv.task.tableShow.qtyPlan').d('计划数量'),
    },
    {
      name: 'qtyScan',
      type: 'number',
      label: intl.get('winv.task.tableShow.qtyScan').d('扫描数量'),
    },
    {
      name: 'operateDate',
      label: intl.get('winv.task.tableShow.operateDate').d('操作时间'),
    },
    {
      name: 'unloadBy',
      label: intl.get('winv.task.tableShow.unloadBy').d('卸货人'),
    },
    {
      name: 'unloadDate',
      label: intl.get('winv.task.tableShow.unloadDate').d('卸货时间'),
    },
    {
      name: 'billCode',
      label: intl.get('winv.task.tableShow.billCode').d('单据编码'),
    },
    {
      name: 'billType',
      label: intl.get('winv.task.tableShow.billType').d('单据类型'),
    },
    {
      name: 'detailLineNum',
      label: intl.get('winv.task.tableShow.detailLineNum').d('行号'),
    },
    {
      name: 'functionCodeName',
      label: intl.get('winv.task.tableShow.functionCodeName').d('来源功能'),
    },
    {
      name: 'deviceCode',
      label: intl.get('winv.task.tableShow.deviceCode').d('来源设备'),
    },
    {
      name: 'remark',
      label: intl.get('winv.task.tableShow.remark').d('备注'),
    },
    {
      name: 'creationDate',
      label: intl.get('winv.task.tableShow.creationDate').d('创建时间'),
    },
    {
      name: 'taskPriorityName',
      label: intl.get('winv.task.tableShow.taskPriorityName').d('优先级'),
    },
    {
      name: 'attribute3',
      type: 'string',
      label: intl.get('winv.task.table.query.attribute3').d('目标子库存'),
    },
    {
      name: 'attribute4',
      type: 'object',
      ignore: true,
      noCace: true,
      textField: 'locationName',
      valueField: 'locationCode',
      lovCode: 'WMDM.LOCATION',
      dynamicProps: {
        lovPara: ({ record }) => {
          return { orgId: record.get('orgId'), warehouseId: record.get('warehouseId') }
        },
      },
      label: intl.get('winv.task.table.query.attribute4').d('目标子库位'),
    },
    {
      name: 'attribute6',
      type: 'string',
      label: intl.get('winv.task.table.query.attribute6').d('到货数量'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/tasks/queryAll`,
        method: 'GET',
        params,
      };
    },
    submit: ({ data, dataSet }) => {
      const flag = dataSet._flag;
      if (flag === 'process') {
        data.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.qtyScan = item.qtyPlan;
          item.fromLocationCode = item.toLocationCode
          item.fromLocationId = item.toLocationId
          item.fromWhareaId = item.toWhareaId
          item.fromWhareaCode = item.toWhareaCode
          item.fromWarehouseId = item.toWarehouseId
          item.fromWarehouseCode = item.toWarehouseCode
          item.toLocationCode = item.to.toLocationCode
          item.toLocationId = item.to.toLocationId
          item.toWhareaId = item.to.toWhareaId
          item.toWhareaCode = item.to.toWhareaCode
          item.toWarehouseId = item.to.toWarehouseId
          item.toWarehouseCode = item.to.toWarehouseCode
          item.fromOrgId = item.orgId
          item.to = null
          item.attribute10 = item.attribute15
          item.attribute11 = item.detailId
          item.attribute12 = item.billType
          item.attribute13 = item.billTypeId
          item.attribute14 = item.billCode
          item.attribute15 = item.billId
          item.attribute6 = Number(item.attribute6)
          item.transferQty = Number(item.attribute6)
          item.qty = Number(item.attribute6)
          item.cidStatus = true
          item.validQty = Number(item.attribute6)
        });
      }
      const params = {
        processTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        orgId: data[0].orgId,
        orgCode: data[0].orgCode,
        orgName: data[0].orgName,
        __id: data[0].__id,
        _status: 'create',
        transferLinesDtoList: data
      }
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/stockTrans/transferBetweenWharea`,
        method: 'PUT',
        data: params,
      };
    },
  },
});

const formQueryDs = () => ({
  data: [
    {
      startDate: moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0 }),
      endDate: moment().subtract(0, 'days').set({ hour: 23, minute: 59, second: 59 }),
    },
  ],
  fields: [
    {
      name: 'startDate',
      type: 'dateTime',
      label: intl.get('winv.task.table.query.startDate').d('开始时间'),
    },
    {
      name: 'endDate',
      type: 'dateTime',
      label: intl.get('winv.task.table.query.endDate').d('结束时间'),
    },
    {
      name: 'billCode',
      label: intl.get('winv.task.table.query.billCode').d('单据编号'),
    },
    {
      name: 'detailLineNum',
      type: 'string',
      label: intl.get('winv.task.table.query.detailLineNum').d('行号'),
    },
    {
      name: 'modeOfCarriage',
      type: 'string',
      label: intl.get('winv.task.table.query.modeOfCarriage').d('运输形式'),
    },
    {
      name: 'orgNameLov',
      type: 'object',
      ignore: 'always',
      lovCode: 'WMDM.INV_ORG',
      label: intl.get('winv.task.table.query.orgName').d('组织名称'),
    },
    {
      name: 'orgId',
      type: 'number',
      bind: 'orgNameLov.orgId',
    },
    {
      name: 'customerNameLov',
      type: 'object',
      ignore: 'always',
      lovCode: 'WMDM.CUSTOMER',
      label: intl.get('winv.task.table.query.customerName').d('客户名称'),
    },
    {
      name: 'customerId',
      type: 'number',
      bind: 'customerNameLov.customerId',
    },
    {
      name: 'vendorNameLov',
      type: 'object',
      ignore: 'always',
      lovCode: 'WMDM.VENDOR',
      label: intl.get('winv.task.table.query.vendorName').d('供应商名称'),
    },
    {
      name: 'vendorId',
      type: 'number',
      bind: 'vendorNameLov.vendorId',
    },
    {
      name: 'skuLov',
      type: 'object',
      lovCode: 'WMDM.GOODS',
      ignore: 'always',
      label: intl.get('winv.task.table.query.sku').d('物料编码'),
    },
    {
      name: 'sku',
      type: 'string',
      bind: 'skuLov.sku',
    },
    {
      name: 'batchCode',
      type: 'string',
      label: intl.get('winv.task.table.query.batchCode').d('批次编码'),
    },
    {
      name: 'cidCode',
      type: 'string',
      label: intl.get('winv.task.table.query.cidCode').d('托盘编码'),
    },
    {
      name: 'billCodeFromLov',
      ignore: 'always',
      lovCode: 'WINV.INV_TASK_BILL_CODE',
      type: 'object',
      label: intl.get('winv.task.table.query.billCodeFrom').d('单据编码自'),
      lovPara: { queryParam: '1' },
    },
    {
      name: 'billCodeFrom',
      type: 'string',
      bind: 'billCodeFromLov.billCode',
    },
    {
      name: 'billCodeToLov',
      ignore: 'always',
      lovCode: 'WINV.INV_TASK_BILL_CODE',
      type: 'object',
      lovPara: { queryParam: '1' },
      label: intl.get('winv.task.table.query.billCodeFromTo').d('单据编码至'),
    },
    {
      name: 'billCodeTo',
      type: 'string',
      bind: 'billCodeToLov.billCode',
    },
    {
      name: 'groupCodeFromLov',
      ignore: 'always',
      lovCode: 'WINV.INV_TASK_GROUP_CODE',
      type: 'object',
      lovPara: { queryParam: '2' },
      label: intl.get('winv.task.table.query.groupCodeFrom').d('批标识从'),
    },
    {
      name: 'groupCodeFrom',
      type: 'string',
      bind: 'groupCodeFromLov.groupCode',
    },
    {
      name: 'groupCodeToLov',
      ignore: 'always',
      lovCode: 'WINV.INV_TASK_GROUP_CODE',
      type: 'object',
      lovPara: { queryParam: '2' },
      label: intl.get('winv.task.table.query.groupCodeTo').d('批标识至'),
    },
    {
      name: 'groupCodeTo',
      type: 'string',
      bind: 'groupCodeToLov.groupCode',
    },
    {
      name: 'taskCodeFromLov',
      ignore: 'always',
      lovCode: 'WINV.INV_TASK_CODE',
      type: 'object',
      lovPara: { queryParam: '3' },
      label: intl.get('winv.task.table.query.taskCodeFrom').d('任务编号从'),
    },
    {
      name: 'taskCodeFrom',
      type: 'string',
      bind: 'taskCodeFromLov.taskCode',
    },
    {
      name: 'taskCodeToLov',
      ignore: 'always',
      lovCode: 'WINV.INV_TASK_CODE',
      type: 'object',
      lovPara: { queryParam: '3' },
      label: intl.get('winv.task.table.query.taskCodeTo').d('任务编号至'),
    },
    {
      name: 'taskCodeTo',
      type: 'string',
      bind: 'taskCodeToLov.taskCode',
    },
    {
      name: 'warehouseCodeFromLov',
      ignore: 'always',
      lovCode: 'WMDM.WAREHOUSE',
      type: 'object',
      textField: 'warehouseCode',
      label: intl.get('winv.task.table.query.warehouseCodeFrom').d('仓库自'),
    },
    {
      name: 'warehouseCodeFrom',
      type: 'string',
      bind: 'warehouseCodeFromLov.warehouseCode',
    },
    {
      name: 'warehouseCodeToLov',
      ignore: 'always',
      lovCode: 'WMDM.WAREHOUSE',
      textField: 'warehouseCode',
      type: 'object',
      label: intl.get('winv.task.table.query.warehouseCodeTo').d('仓库至'),
    },
    {
      name: 'warehouseCodeTo',
      type: 'string',
      bind: 'warehouseCodeToLov.warehouseCode',
    },
    {
      name: 'whareaCodeFromLov',
      ignore: 'always',
      lovCode: 'WMDM.WHAREA',
      textField: 'whareaCode',
      type: 'object',
      label: intl.get('winv.task.table.query.whareaCodeFrom').d('来源库区自'),
    },
    {
      name: 'whareaCodeFrom',
      type: 'string',
      bind: 'whareaCodeFromLov.whareaCode',
    },
    {
      name: 'whareaCodeToLov',
      ignore: 'always',
      lovCode: 'WMDM.WHAREA',
      type: 'object',
      textField: 'whareaCode',
      label: intl.get('winv.task.table.query.whareaCodeTo').d('来源库区至'),
    },
    {
      name: 'whareaCodeTo',
      type: 'string',
      bind: 'whareaCodeToLov.whareaCode',
    },
    {
      name: 'locationCodeFromLov',
      ignore: 'always',
      lovCode: 'WMDM.LOCATION',
      type: 'object',
      textField: 'locationCode',
      label: intl.get('winv.task.table.query.locationCodeFrom').d('来源库位自'),
    },
    {
      name: 'locationCodeFrom',
      type: 'string',
      bind: 'locationCodeFromLov.locationCode',
    },
    {
      name: 'locationCodeToLov',
      ignore: 'always',
      lovCode: 'WMDM.LOCATION',
      type: 'object',
      textField: 'locationCode',
      label: intl.get('winv.task.table.query.locationCodeTo').d('来源库位至'),
    },
    {
      name: 'locationCodeTo',
      type: 'string',
      bind: 'locationCodeToLov.locationCode',
    },
    {
      name: 'unloadDateFrom',
      type: 'dateTime',
      label: intl.get('winv.task.table.query.unloadDateFrom').d('处理时间从'),
    },
    {
      name: 'unloadDateTo',
      type: 'dateTime',
      label: intl.get('winv.task.table.query.unloadDateTo').d('处理时间至'),
    },
    {
      name: 'syncBillCode',
      type: 'string',
      label: intl.get('winv.task.table.query.syncBillCode').d('同步单号'),
    },
    {
      name: 'billType',
      type: 'object',
      ignore: 'always',
      lovCode: 'WINV.BILL_TYPE',
      label: intl.get('winv.task.table.query.billType').d('单据类型'),
    },
    {
      name: 'billTypeId',
      type: 'string',
      bind: 'billType.id',
    },
    {
      name: 'taskType',
      type: 'string',
      lookupCode: 'WINV.TASK_TYPE',
      label: intl.get('winv.task.table.query.taskType').d('任务类型'),
    },
    {
      name: 'sourceType',
      type: 'string',
      lookupCode: 'WINV.TASK_SOURCE_TYPE',
      label: intl.get('winv.task.table.query.sourceType').d('来源类型'),
    },
    {
      name: 'status',
      type: 'string',
      lookupCode: 'WINV.TASK_STATUS',
      label: intl.get('winv.task.table.query.status').d('状态'),
    },
    {
      name: 'attribute15',
      type: 'string',
      label: intl.get('winv.task.table.query.attribute15').d('来源编号'),
    },
  ],
});

const serialDetailModalDs = {
  primaryKey: 'id',
  selection: false,
  cacheSelection: true,
  fields: [
    {
      name: 'serialNumber',
      label: intl.get('winv.warehouse.model.warrant.serialNumber').d('序列号'),
    },
    {
      name: 'qualityStatusName',
      label: intl.get('winv.warehouse.model.warrant.qualityStatus').d('质量状态'),
    },
    {
      name: 'personalizedFlag',
      label: intl.get('winv.warehouse.model.warrant.personalizedFlag').d('个性化'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/outbound-serial-records/task`,
        method: 'GET',
        params,
      };
    },
  },
};

export { taskTableDs, taskTableShowDs, formQueryDs, serialDetailModalDs };
