import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { WMS_INV } from 'wmsUtils/config';
import moment from 'moment';

const currentTenantID = getCurrentOrganizationId();

const HeadDs = (orgIds, ownerIds, warehouseIds, defaultOrg, defaultOwner, defaultHouse) => ({
  autoCreate: true,
  fields: [
    {
      name: 'countOrderList',
      type: 'object',
      lovCode: 'WINV.INV_COUNT',
      noCache: true,
      multiple: true,
      label: intl.get('winv.stockAdjust.head.form.sourceBillCode').d('来源单号'),
      lovPara: {
        isAdjust: 0,
        countStatus: 'COMPLETED',
        countPrecision: 'STOCK',
      },
    },
    {
      name: 'billCode',
      type: 'string',
      label: intl.get('winv.stockAdjust.head.form.billCode').d('调整单号'),
    },
    {
      name: 'adjustType',
      label: intl.get('winv.stockAdjust.head.form.adjustType').d('调整类型'),
      type: 'string',
    },
    {
      name: 'org',
      type: 'object',
      lovCode: 'WMDM.INV_ORG',
      textField: 'orgName',
      valueField: 'orgId',
      required: true,
      label: intl.get('winv.stockAdjust.head.form.orgName').d('组织名称'),
      ignore: 'always',
      lovPara: {
        idStr: orgIds,
      },
      defaultValue: defaultOrg,
    },
    {
      name: 'orgId',
      type: 'string',
      bind: 'org.orgId',
    },
    {
      name: 'orgCode',
      type: 'string',
      bind: 'org.orgCode',
    },
    {
      name: 'orgName',
      type: 'string',
      bind: 'org.orgName',
    },
    {
      name: 'warehouse',
      type: 'object',
      lovCode: 'WMDM.WAREHOUSE',
      textField: 'warehouseName',
      valueField: 'warehouseId',
      required: true,
      label: intl.get('winv.stockAdjust.head.form.warehouseName').d('仓库名称'),
      ignore: 'always',
      cascadeMap: { orgId: 'orgId' },
      lovPara: {
        idStr: warehouseIds,
      },
      defaultValue: defaultHouse,
    },
    {
      name: 'warehouseId',
      type: 'number',
      bind: 'warehouse.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouse.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouse.warehouseName',
    },
    {
      name: 'billStatusName',
      label: intl.get('winv.stockAdjust.head.form.billStatusName').d('调整单状态'),
    },
    {
      name: 'billCode',
      label: intl.get('winv.stockAdjust.head.form.billCode').d('调整单号'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get('winv.stockAdjust.head.form.remark').d('备注'),
    },
    {
      name: 'adjustReason',
      type: 'string',
      required: true,
      label: intl.get('winv.stockAdjust.head.form.reason').d('调整原因'),
    },
    {
      name: 'owner',
      type: 'object',
      lovCode: 'WMDM.OWNER',
      required: true,
      textField: 'ownerName',
      valueField: 'ownerId',
      label: intl.get('winv.stockAdjust.head.form.owner').d('货主名称'),
      ignore: 'always',
      lovPara: {
        idStr: ownerIds,
      },
      defaultValue: defaultOwner,
    },
    {
      name: 'ownerId',
      type: 'string',
      bind: 'owner.ownerId',
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
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders`,
        method: 'GET',
        params,
      };
    },
    create: ({ config, data }) => {
      const isDrawedData = data[0].countOrderList.length !== 0;
      // eslint-disable-next-line no-param-reassign
      data[0].isDrawed = isDrawedData;
      const [{ __id, _status, ...other }] = data;
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders`,
        method: 'POST',
        data: other,
      };
    },
    update: ({ config, data }) => {
      const [{ __id, _status, ...other }] = data;
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders`,
        method: 'PUT',
        data: other,
      };
    },
  },
});

const LineDs = {
  autoCreate: true,
  fields: [
    {
      name: 'billId',
      type: 'string',
    },
    {
      name: 'adjustType',
      label: intl.get('winv.stockAdjust.line.table.adjustType').d('调整类型'),
      type: 'string',
    },
    {
      name: 'orgId',
      type: 'string',
    },
    {
      name: 'orgCode',
      type: 'string',
    },
    {
      name: 'warehouseId',
      type: 'number',
    },
    {
      name: 'warehouseCode',
      type: 'string',
    },
    {
      name: 'billCode',
      type: 'string',
    },
    {
      name: 'ownerId',
      type: 'string',
    },
    {
      name: 'ownerCode',
      type: 'string',
    },

    {
      name: 'goodsLov',
      type: 'object',
      lovCode: 'WMDM.GOODS',
      textField: 'sku',
      valueField: 'goodsId',
      noCache: true,
      label: intl.get('winv.stockAdjust.line.table.goodsLov').d('物料编码'),
      ignore: 'always',
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
      label: intl.get('winv.stockAdjust.line.table.goodsName').d('品名'),
      bind: 'goodsLov.goodsName',
    },
    {
      name: 'uomName',
      label: intl.get('winv.stockAdjust.line.table.uomName').d('单位'),
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
      name: 'whareList',
      type: 'object',
      lovCode: 'WMDM.WHAREA',
      textField: 'whareaCode',
      valueField: 'whareaId',
      label: intl.get('winv.stockAdjust.line.table.whareList').d('库区名称'),
      ignore: 'always',
      noCache: true,
      dynamicProps: ({ record }) => {
        if (record.get('warehouseId')) {
          return {
            lovPara: { warehouseId: record.get('warehouseId') },
          };
        }
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
      label: intl.get('winv.stockAdjust.line.table.whareList').d('库区名称'),
    },
    {
      name: 'locationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.stockAdjust.line.table.locationLov').d('库位名称'),
      ignore: 'always',
      noCache: true,
      textField: 'locationCode',
      valueField: 'locationId',
      dynamicProps: ({ record }) => {
        if (record.get('whareaId')) {
          return {
            lovPara: { whareaId: record.get('whareaId') },
          };
        }
      },
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
      name: 'batchLov',
      type: 'object',
      lovCode: 'WMDM.BATCH',
      label: intl.get('winv.stockAdjust.line.table.batchLov').d('批次'),
      ignore: 'always',
      noCache: true,
      dynamicProps: ({ record }) => {
        if (record.get('goodsId')) {
          return {
            required: record.get('isbatch') === 1,
            lovPara: { goodsId: record.get('goodsId') },
          };
        }
      },
    },
    {
      name: 'batchId',
      bind: 'batchLov.batchId',
    },
    {
      name: 'batchCode',
      bind: 'batchLov.batchCode',
    },
    {
      name: 'cidCodeLov',
      type: 'object',
      lovCode: 'WMDM.CONTAINER',
      label: intl.get('winv.stockAdjust.line.table.cidCodeLov').d('托盘编码'),
      ignore: 'always',
      noCache: true,
      dynamicProps: ({ record }) => {
        if (record.get('locationId')) {
          return {
            lovPara: { locationId: record.get('locationId') },
          };
        }
      },
    },
    {
      name: 'cidCode',
      type: 'string',
      bind: 'cidCodeLov.cidCode',
    },
    {
      name: 'cidId',
      bind: 'cidCodeLov.cidId',
    },
  ],
  transport: {
    submit: ({ config, data }) => {
      const [{ __id, _status, ...other }] = data;
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-order-lines/generate`,
        method: 'POST',
        data: other,
      };
    },
    update: ({ config, data }) => {
      const [{ __id, _status, ...other }] = data;
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-order-lines/generate`,
        method: 'POST',
        data: other,
      };
    },
  },
};

const stockAdjustHeadDs = () => {
  return {
    primaryKey: 'id',
    autoQuery: false,
    selection: 'multiple',
    queryFields: [
      {
        name: 'startDate',
        type: 'dateTime',
        defaultValue: moment().subtract(7, 'days').set({ hour: 0, minute: 0, second: 0 }),
        label: intl.get('winv.stockAdjust.head.table.startDate').d('开始日期'),
      },
      {
        name: 'endDate',
        type: 'dateTime',
        defaultValue: moment().set({ hour: 23, minute: 59, second: 59 }),
        label: intl.get('winv.stockAdjust.head.table.endDate').d('结束日期'),
      },
      {
        name: 'billCode',
        type: 'string',
        label: intl.get('winv.stockAdjust.head.table.billCode').d('调整单号'),
      },
      {
        name: 'sourceBillCode',
        type: 'string',
        label: intl.get('winv.stockAdjust.head.table.sourceBillCode').d('来源单号'),
      },
      {
        name: 'org',
        type: 'object',
        lovCode: 'WMDM.INV_ORG',
        textField: 'orgName',
        valueField: 'orgId',
        label: intl.get('winv.stockAdjust.head.table.orgName').d('组织名称'),
        ignore: 'always',
      },
      {
        name: 'orgId',
        type: 'string',
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
        valueField: 'warehouseId',
        label: intl.get('winv.stockAdjust.head.table.warehouse').d('仓库名称'),
        ignore: 'always',
      },
      {
        name: 'warehouseId',
        type: 'number',
        bind: 'warehouse.warehouseId',
      },
      {
        name: 'warehouseCode',
        type: 'string',
        bind: 'warehouse.warehouseCode',
      },
      {
        name: 'owner',
        type: 'object',
        lovCode: 'WMDM.OWNER',
        textField: 'ownerName',
        valueField: 'ownerId',
        label: intl.get('winv.stockAdjust.head.table.owner').d('货主名称'),
        ignore: 'always',
      },
      {
        name: 'ownerId',
        type: 'string',
        bind: 'owner.ownerId',
      },
    ],
    fields: [
      {
        name: 'lineNum',
        label: intl.get('winv.stockAdjust.head.table.lineNum').d('行号'),
      },
      {
        name: 'billStatus',
        label: intl.get('winv.stockAdjust.head.table.billStatus').d('调整单状态'),
      },
      {
        name: 'billStatusMeaning',
        label: intl.get('winv.stockAdjust.head.table.billStatusMeaning').d('调整单状态'),
      },
      {
        name: 'sourceBillCode',
        label: intl.get('winv.stockAdjust.head.table.sourceBillCode').d('来源单号'),
      },
      {
        name: 'billCode',
        label: intl.get('winv.stockAdjust.head.table.billCode').d('调整单号'),
      },
      {
        name: 'dataSourceMeaning',
        label: intl.get('winv.stockAdjust.head.table.dataSourceMeaning').d('数据来源'),
      },
      {
        name: 'orgCode',
        label: intl.get('winv.stockAdjust.head.table.org').d('组织'),
      },
      {
        name: 'orgName',
        label: intl.get('winv.stockAdjust.head.table.orgName').d('组织名称'),
      },
      {
        name: 'warehouseCode',
        label: intl.get('winv.stockAdjust.head.table.warehouse').d('仓库'),
      },
      {
        name: 'warehouseName',
        label: intl.get('winv.stockAdjust.head.table.warehouseName').d('仓库名称'),
      },
      {
        name: 'ownerCode',
        label: intl.get('winv.stockAdjust.head.table.owner').d('货主'),
      },
      {
        name: 'ownerName',
        label: intl.get('winv.stockAdjust.head.table.ownerName').d('货主名称'),
      },
      {
        name: 'createdByName',
        label: intl.get('winv.stockAdjust.head.table.createdByName').d('创建人'),
      },
      {
        name: 'creationDate',
        label: intl.get('winv.stockAdjust.head.table.creationDate').d('创建时间'),
      },
      {
        name: 'lastUpdatedByName',
        label: intl.get('winv.stockAdjust.head.table.remark.person').d('修改人'),
      },
      {
        name: 'lastUpdateDate',
        label: intl.get('winv.stockAdjust.head.table.lastUpdateDate').d('修改时间'),
      },
      {
        name: 'approvedBy',
        label: intl.get('winv.stockAdjust.head.table.approvedBy').d('审核人'),
      },
      {
        name: 'approvedByName',
        label: intl.get('winv.stockAdjust.head.table.approvedByName').d('审核人'),
      },
      {
        name: 'approvedDate',
        label: intl.get('winv.stockAdjust.head.table.approvedDate').d('审核时间'),
      },
      {
        name: 'completeByName',
        label: intl.get('winv.stockAdjust.head.table.completeByName').d('完结人'),
      },
      {
        name: 'completeDate',
        label: intl.get('winv.stockAdjust.head.table.completeDate').d('完结时间'),
      },
      {
        name: 'cancelledBy',
        label: intl.get('winv.stockAdjust.head.table.cancelledBy').d('作废人'),
      },
      {
        name: 'cancelledByName',
        label: intl.get('winv.stockAdjust.head.table.cancelledByName').d('作废人'),
      },
      {
        name: 'cancelledDate',
        label: intl.get('winv.stockAdjust.head.table.cancelledDate').d('作废时间'),
      },
      {
        name: 'remark',
        label: intl.get('winv.stockAdjust.head.table.remark').d('备注'),
      },
      {
        name: 'adjustReason',
        label: intl.get('winv.stockAdjust.head.table.adjustReason').d('调整原因'),
      },
    ],
    transport: {
      read: ({ params }) => {
        return {
          url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders`,
          method: 'GET',
          params,
        };
      },
      submit: ({ data, dataSet }) => {
        const flag = dataSet._flag;
        return {
          url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders/${flag}`,
          method: 'PUT',
          data,
        };
      },
    },
  };
};

const stockAdjustLineShowDs = () => ({
  primaryKey: 'id',
  dataKey: 'content',
  autoQuery: false,
  selection: 'multiple',
  fields: [
    {
      name: 'lineNum',
      label: intl.get('winv.stockAdjust.line.show.lineNum').d('行号'),
    },
    {
      name: 'sourceBillCode',
      label: intl.get('winv.stockAdjust.line.sourceBillCode').d('盘点单号'),
    },
    {
      name: 'sourceLineNum',
      label: intl.get('winv.stockAdjust.line.sourceLineNum').d('盘点单行号'),
    },
    {
      name: 'warehouseName',
      label: intl.get('winv.stockAdjust.line.show.warehouseName').d('仓库名称'),
    },
    {
      name: 'whareaCode',
      label: intl.get('winv.stockAdjust.line.show.whareaCode').d('库区名称'),
    },
    // {
    //   name: 'ownerCode',
    //   label: intl.get('winv.stockAdjust.line.show.ownerCode').d('货主'),
    // },
    // {
    //   name: 'ownerName',
    //   label: intl.get('winv.stockAdjust.line.show.ownerName').d('货主名称'),
    // },
    {
      name: 'locationName',
      label: intl.get('winv.stockAdjust.line.show.locationName').d('库位名称'),
    },
    {
      name: 'locationCode',
      label: intl.get('winv.stockAdjust.line.show.locationCode').d('库位编码'),
    },
    {
      name: 'sku',
      label: intl.get('winv.stockAdjust.line.show.sku').d('物料编码'),
    },
    {
      name: 'goodsName',
      label: intl.get('winv.stockAdjust.line.show.goodsName').d('品名'),
    },
    {
      name: 'uomName',
      label: intl.get('winv.stockAdjust.line.uomName').d('单位'),
    },
    {
      name: 'batchCode',
      label: intl.get('winv.stockAdjust.line.show.batchCode').d('批次'),
    },
    {
      name: 'serialNumber',
      type: 'string',
      label: intl.get('winv.stockAdjust.line.serialNumber').d('序列号'),
    },
    {
      name: 'cidCode',
      label: intl.get('winv.stockAdjust.line.show.cidCode').d('托盘编码'),
    },
    {
      name: 'snapshotQty',
      type: 'number',
      label: intl.get('winv.stockAdjust.line.snapshotQty').d('快照数量'),
    },
    {
      name: 'countQty',
      type: 'number',
      label: intl.get('winv.stockAdjust.line.countQty').d('盘点数量'),
    },
    {
      name: 'remark',
      type: 'string',
      maxLength: 3000,
      label: intl.get('winv.stockAdjust.line.adjustReason').d('调整原因'),
    },
    {
      name: 'adjustQty',
      label: intl.get('winv.stockAdjust.line.show.adjustQty').d('调整数量'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-order-lines`,
        method: 'GET',
        params,
      };
    },
  },
});

const stockAdjustLineDs = () => ({
  primaryKey: 'id',
  dataKey: 'content',
  autoQuery: false,
  fields: [
    {
      name: 'billId',
    },
    {
      name: 'billCode',
      label: intl.get('winv.stockAdjust.line.billCode').d('调整单号'),
    },
    {
      name: 'sourceBillCode',
      label: intl.get('winv.stockAdjust.line.sourceBillCode').d('盘点单号'),
    },
    {
      name: 'sourceLineNum',
      label: intl.get('winv.stockAdjust.line.sourceLineNum').d('盘点单行号'),
    },
    {
      name: 'lineNum',
      label: intl.get('winv.stockAdjust.line.lineNum').d('行号'),
    },
    {
      name: 'goodsLov',
      type: 'object',
      lovCode: 'WMDM.GOODS',
      textField: 'sku',
      valueField: 'goodsId',
      required: true,
      noCache: true,
      label: intl.get('winv.stockAdjust.line.goodsCode').d('物料编码'),
      ignore: 'always',
      dynamicProps: {
        lovPara: ({ record }) => {
          const orgId = record.get('headOrgId');
          const ownerId = record.get('headOwnerId');
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
      name: 'serialType',
      type: 'string',
      bind: 'goodsLov.serialType',
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
      label: intl.get('winv.stockAdjust.line.goodsName').d('品名'),
      bind: 'goodsLov.goodsName',
    },
    {
      name: 'uomName',
      label: intl.get('winv.stockAdjust.line.uomName').d('单位'),
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
      name: 'whareaList',
      type: 'object',
      lovCode: 'WMDM.WHAREA',
      textField: 'whareaName',
      valueField: 'whareaId',
      label: intl.get('winv.stockAdjust.line.whareaList').d('库区名称'),
      ignore: 'always',
      required: true,
      noCache: true,
      dynamicProps: ({ record }) => {
        if (record.get('warehouseId')) {
          return {
            lovPara: { warehouseId: record.get('warehouseId') },
          };
        }
      },
    },
    {
      name: 'whareaId',
      type: 'string',
      bind: 'whareaList.whareaId',
    },
    {
      name: 'whareaCode',
      type: 'string',
      bind: 'whareaList.whareaCode',
    },
    {
      name: 'whareaName',
      type: 'string',
      bind: 'whareaList.whareaName',
    },
    {
      name: 'warehouse',
      type: 'object',
      lovCode: 'WMDM.WAREHOUSE',
      required: true,
      textField: 'warehouseName',
      valueField: 'warehouseId',
      label: intl.get('winv.stockAdjust.line.warehouseName').d('仓库名称'),
      ignore: 'always',
    },
    {
      name: 'warehouseId',
      type: 'number',
      bind: 'warehouse.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'warehouse.warehouseCode',
    },
    {
      name: 'warehouseName',
      type: 'string',
      bind: 'warehouse.warehouseName',
    },
    {
      name: 'locationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.stockAdjust.line.locationLov').d('库位代码'),
      ignore: 'always',
      textField: 'locationCode',
      valueField: 'locationId',
      required: true,
      noCache: true,
      dynamicProps: ({ record }) => {
        if (record.get('whareaId')) {
          return {
            lovPara: { whareaId: record.get('whareaId') },
          };
        }
      },
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
    // {
    //   name: 'owner',
    //   type: 'object',
    //   lovCode: 'WMDM.OWNER',
    //   textField: 'ownerName',
    //   valueField: 'ownerId',
    //   label: intl.get('winv.stockAdjust.line.owner').d('货主名称'),
    //   ignore: 'always',
    // },
    // {
    //   name: 'ownerId',
    //   type: 'string',
    //   bind: 'owner.ownerId',
    // },
    // {
    //   name: 'ownerCode',
    //   type: 'string',
    //   bind: 'owner.ownerCode',
    // },
    // {
    //   name: 'ownerName',
    //   type: 'string',
    //   bind: 'owner.ownerName',
    // },
    {
      name: 'batchLov',
      type: 'object',
      lovCode: 'WMDM.BATCH',
      label: intl.get('winv.stockAdjust.line.batchLov').d('批次'),
      ignore: 'always',
      textField: 'batchCode',
      valueField: 'batchId',
      noCache: true,
      dynamicProps: ({ record }) => {
        if (record.get('goodsId')) {
          return {
            required: record.get('isbatch') === 1,
            lovPara: { goodsId: record.get('goodsId') },
          };
        }
      },
    },
    {
      name: 'batchId',
      bind: 'batchLov.batchId',
    },
    {
      name: 'batchCode',
      bind: 'batchLov.batchCode',
    },
    {
      name: 'serialNumber',
      type: 'string',
      label: intl.get('winv.stockAdjust.line.serialNumber').d('序列号'),
      dynamicProps: {
        required: ({ record }) => {
          return (
            (record.status === 'add' || record.status === 'update') &&
            (record.get('serialType') === 'SEMI_INV_CTRL' ||
              record.get('serialType') === 'INV_CTRL')
          );
        },
      },
    },
    {
      name: 'cidCodeLov',
      type: 'object',
      lovCode: 'WMDM.CONTAINER',
      label: intl.get('winv.stockAdjust.model.warrant.cidCodeLov').d('托盘编码'),
      ignore: 'always',
      noCache: true,
      dynamicProps: ({ record }) => {
        if (record.get('locationId')) {
          return {
            lovPara: { locationId: record.get('locationId') },
          };
        }
      },
    },
    {
      name: 'cidCode',
      label: intl.get('winv.stockAdjust.line.cidCode').d('托盘编码'),
      type: 'string',
      bind: 'cidCodeLov.cidCode',
    },
    {
      name: 'cidId',
      bind: 'cidCodeLov.cidId',
    },
    {
      name: 'adjustQty',
      type: 'number',
      required: true,
      label: intl.get('winv.stockAdjust.line.adjustQty').d('调整数量'),
      validator: (value, _, record) => {
        if (
          (record.status === 'add' || record.status === 'update') &&
          (record.get('serialType') === 'SEMI_INV_CTRL' || record.get('serialType') === 'INV_CTRL')
        ) {
          if (value && value !== 0 && value !== 1 && value !== -1) {
            return intl
              .get('winv.stockAdjust.adjustQty.is.error')
              .d('序列号全控制或序列号出入库控制物料，数量只能为0,1,-1');
          }
        }
        return true;
      },
    },
    {
      name: 'snapshotQty',
      type: 'number',
      label: intl.get('winv.stockAdjust.line.snapshotQty').d('快照数量'),
    },
    {
      name: 'countQty',
      type: 'number',
      label: intl.get('winv.stockAdjust.line.countQty').d('盘点数量'),
    },
    {
      name: 'remark',
      type: 'string',
      maxLength: 3000,
      label: intl.get('winv.stockAdjust.line.adjustReason').d('调整原因'),
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
    read: ({ params, data: { billId }, dataSet }) => {
      const flag = dataSet.queryParameter._flag ? dataSet.queryParameter._flag : '';
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-order-lines${flag}`,
        method: 'GET',
        data: {},
        params: {
          billId,
          ...params,
        },
      };
    },
    destroy: ({ data }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-order-lines/batch-delete`,
        method: 'DELETE',
        data,
      };
    },
    submit: ({ config, data }) => {
      const otherData = data.map((item) => {
        const { __id, ...other } = item;
        return other;
      });
      return {
        ...config,
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-order-lines`,
        method: 'PUT',
        data: otherData,
      };
    },
  },
});

const stockAdjustHeadFormDs = () => {
  return {
    fields: [
      {
        name: 'id',
        type: 'string',
      },
      {
        name: 'billCode',
        type: 'string',
        label: intl.get('winv.stockAdjust.head.formShow.billCode').d('调整单号'),
      },
      {
        name: 'sourceBillCode',
        type: 'string',
        label: intl.get('winv.stockAdjust.head.formShow.sourceBillCode').d('来源单号'),
      },
      {
        name: 'dataSourceMeaning',
        label: intl.get('winv.stockAdjust.head.formShow.dataSourceMeaning').d('数据来源'),
        type: 'string',
      },
      {
        name: 'billStatusMeaning',
        label: intl.get('winv.stockAdjust.head.formShow.billStatusMeaning').d('调整单状态'),
        type: 'string',
      },
      {
        name: 'adjustReason',
        label: intl.get('winv.stockAdjust.head.formShow.adjustReason').d('调整原因'),
        type: 'string',
      },
      {
        name: 'org',
        type: 'object',
        lovCode: 'WMDM.INV_ORG',
        textField: 'orgName',
        valueField: 'orgId',
        required: true,
        label: intl.get('winv.stockAdjust.head.formShow.orgName').d('组织名称'),
        ignore: 'always',
      },
      {
        name: 'orgId',
        type: 'string',
        bind: 'org.orgId',
      },
      {
        name: 'orgCode',
        type: 'string',
        bind: 'org.orgCode',
      },
      {
        name: 'orgName',
        type: 'string',
        bind: 'org.orgName',
      },
      {
        name: 'warehouse',
        type: 'object',
        lovCode: 'WMDM.WAREHOUSE',
        textField: 'warehouseName',
        valueField: 'warehouseId',
        required: true,
        label: intl.get('winv.stockAdjust.head.formShow.warehouseName').d('仓库名称'),
        ignore: 'always',
        cascadeMap: { orgId: 'orgId' },
      },
      {
        name: 'warehouseId',
        type: 'number',
        bind: 'warehouse.warehouseId',
      },
      {
        name: 'warehouseCode',
        type: 'string',
        bind: 'warehouse.warehouseCode',
      },
      {
        name: 'warehouseName',
        type: 'string',
        bind: 'warehouse.warehouseName',
      },
      {
        name: 'billStatusMeaning',
        label: intl.get('winv.stockAdjust.head.formShow.billStatusMeaning').d('调整单状态'),
      },
      {
        name: 'billCode',
        label: intl.get('winv.stockAdjust.head.formShow.billCode').d('调整单号'),
      },
      {
        name: 'owner',
        type: 'object',
        lovCode: 'WMDM.OWNER',
        required: true,
        textField: 'ownerName',
        valueField: 'ownerId',
        label: intl.get('winv.stockAdjust.head.formShow.owner').d('货主名称'),
        ignore: 'always',
      },
      {
        name: 'ownerId',
        type: 'string',
        bind: 'owner.ownerId',
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
    ],
    transport: {
      create: ({ config, data }) => {
        const [{ __id, _status, ...other }] = data;
        return {
          ...config,
          url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders`,
          method: 'POST',
          data: other,
        };
      },
      update: ({ config, data }) => {
        const [{ __id, _status, ...other }] = data;
        return {
          ...config,
          url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders`,
          method: 'PUT',
          data: other,
        };
      },
      read: ({ params }) => {
        return {
          url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders`,
          method: 'GET',
          params,
        };
      },
    },
  };
};

export {
  HeadDs,
  LineDs,
  stockAdjustHeadDs,
  stockAdjustLineDs,
  stockAdjustHeadFormDs,
  stockAdjustLineShowDs,
};
