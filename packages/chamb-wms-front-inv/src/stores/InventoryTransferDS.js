import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { WMS_INV, WMS_MDM } from 'wmsUtils/config';

const currentTenantID = getCurrentOrganizationId();

// 新建批次
export const batchModalDs = () => ({
  fields: [
    {
      name: 'batchCode',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.batchCode').d('批次编码'),
      type: 'string',
      maxLength: 80,
    },
    {
      name: 'orgName',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.orgId').d('组织名称'),
    },
    {
      name: 'ownerName',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.ownerId').d('货主名称'),
    },
    {
      name: 'goodsName',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.goodsId').d('物料编码'),
    },
    {
      name: 'vendorLov',
      type: 'object',
      lovCode: 'WMDM.VENDOR',
      textField: 'vendorCode',
      valueField: 'vendorId',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.vendorId').d('供应商编码'),
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
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.vendorBatch').d('供应商批号'),
      type: 'string',
      maxLength: 200,
    },
    {
      name: 'batchStatus',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.batchStatus').d('批次状态'),
      type: 'string',
      lookupCode: 'WMDM.BATCH_STATUS',
    },
    {
      name: 'produceDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.produceDate').d('生产日期'),
      type: 'date',
    },
    {
      name: 'expireDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.expireDate').d('有效日期'),
      type: 'date',
    },
    {
      name: 'nextCheckDate',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.nextCheckDate').d('下次质检日期'),
      type: 'date',
    },
    {
      name: 'remark',
      label: intl.get('winv.inventoryTransfer.batchModal.tabel.remark').d('备注'),
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

// 组织转移头
export const orgFormDs = (orgIds, defaultOrgValue) => ({
  autoCreate: true,
  fields: [
    {
      name: 'fromOrgLov',
      type: 'object',
      lovCode: 'WMDM.INV_ORG',
      label: intl.get('winv.inventoryTransfer.orgTransfer.form.fromOrg').d('来源组织'),
      ignore: 'always',
      textField: 'orgName',
      valueField: 'orgId',
      noCache: true,
      required: true,
      lovPara: {
        idStr: orgIds,
      },
      defaultValue: defaultOrgValue,
    },
    {
      name: 'fromOrgId',
      bind: 'fromOrgLov.orgId',
    },
    {
      name: 'fromOrgCode',
      bind: 'fromOrgLov.orgCode',
    },
    {
      name: 'fromOrgName',
      bind: 'fromOrgLov.orgName',
    },
    {
      name: 'toOrgLov',
      type: 'object',
      lovCode: 'WMDM.INV_ORG',
      label: intl.get('winv.inventoryTransfer.orgTransfer.form.toOrg').d('目标组织'),
      ignore: 'always',
      noCache: true,
      required: true,
      lovPara: {
        idStr: orgIds,
      },
      defaultValue: defaultOrgValue,
    },
    {
      name: 'toOrgId',
      bind: 'toOrgLov.orgId',
    },
    {
      name: 'toOrgCode',
      bind: 'toOrgLov.orgCode',
    },
    {
      name: 'toOrgName',
      bind: 'toOrgLov.orgName',
    },
    {
      name: 'fromLocationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.orgTransfer.form.fromLocation').d('来源库位'),
      ignore: 'always',
      textField: 'locationCode',
      valueField: 'locationId',
      noCache: true,
      cascadeMap: { orgId: 'fromOrgId' },
    },
    {
      name: 'fromLocationId',
      bind: 'fromLocationLov.locationId',
    },
    {
      name: 'fromLocationCode',
      bind: 'fromLocationLov.locationCode',
    },
    {
      name: 'fromLocationName',
      bind: 'fromLocationLov.locationName',
    },
    {
      name: 'toLocationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.orgTransfer.form.toLocation').d('目标库位'),
      ignore: 'always',
      noCache: true,
      textField: 'locationCode',
      valueField: 'locationId',
      cascadeMap: { orgId: 'toOrgId' },
    },
    {
      name: 'toLocationId',
      bind: 'toLocationLov.locationId',
    },
    {
      name: 'toLocationCode',
      bind: 'toLocationLov.locationCode',
    },
    {
      name: 'toLocationName',
      bind: 'toLocationLov.locationName',
    },
    {
      name: 'processTime',
      type: 'dateTime',
      defaultValue: new Date(),
      required: true,
      label: intl.get('winv.inventoryTransfer.orgTransfer.form.processTime').d('事务处理时间'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.orgTransfer.form.remark').d('备注'),
    },
  ],
  transport: {
    create: ({ data }) => {
      const formData = data[0];
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/stock-trans/transfer-between-org`,
        method: 'POST',
        data: formData,
      };
    },
  },
});

// 库区转移头
export const whareaFormDs = (orgIds, defaultOrgValue) => ({
  autoCreate: true,
  fields: [
    {
      name: 'orgLov',
      type: 'object',
      lovCode: 'WMDM.INV_ORG',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.form.Org').d('组织名称'),
      ignore: 'always',
      noCache: true,
      required: true,
      lovPara: {
        idStr: orgIds,
      },
      defaultValue: defaultOrgValue,
    },
    {
      name: 'orgId',
      bind: 'orgLov.orgId',
    },
    {
      name: 'orgCode',
      bind: 'orgLov.orgCode',
    },
    {
      name: 'orgName',
      bind: 'orgLov.orgName',
    },
    {
      name: 'fromLocationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.form.fromLocation').d('来源库位'),
      ignore: 'always',
      textField: 'locationCode',
      valueField: 'locationId',
      noCache: true,
      cascadeMap: { orgId: 'orgId' },
    },
    {
      name: 'fromLocationId',
      bind: 'fromLocationLov.locationId',
    },
    {
      name: 'fromLocationCode',
      bind: 'fromLocationLov.locationCode',
    },
    {
      name: 'fromLocationName',
      bind: 'fromLocationLov.locationName',
    },
    {
      name: 'toLocationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.form.toLocation').d('目标库位'),
      ignore: 'always',
      noCache: true,
      textField: 'locationCode',
      valueField: 'locationId',
      cascadeMap: { orgId: 'orgId' },
    },
    {
      name: 'toLocationId',
      bind: 'toLocationLov.locationId',
    },
    {
      name: 'toLocationCode',
      bind: 'toLocationLov.locationCode',
    },
    {
      name: 'toLocationName',
      bind: 'toLocationLov.locationName',
    },
    {
      name: 'processTime',
      type: 'dateTime',
      defaultValue: new Date(),
      required: true,
      label: intl.get('winv.inventoryTransfer.whareaTransfer.form.processTime').d('事务处理时间'),
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.form.remark').d('备注'),
    },
  ],
  transport: {
    create: ({ data }) => {
      const formData = data[0];
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/stock-trans/transfer-between-wharea`,
        method: 'POST',
        data: formData,
      };
    },
  },
});

// 组织 库区转移行
export const transferTableDs = () => ({
  fields: [
    {
      name: 'fromLocationLineLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.fromLocation').d('来源库位'),
      ignore: 'always',
      noCache: true,
      required: true,
      textField: 'locationCode',
      valueField: 'locationId',
      cascadeMap: { orgId: 'fromOrgId' },
    },
    {
      name: 'fromLocationId',
      bind: 'fromLocationLineLov.locationId',
    },
    {
      name: 'fromLocationCode',
      bind: 'fromLocationLineLov.locationCode',
    },
    {
      name: 'fromLocationName',
      bind: 'fromLocationLineLov.locationName',
    },
    {
      name: 'fromWhareaName',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.fromWhareaName').d('来源库区'),
      type: 'string',
      bind: 'fromLocationLineLov.whareaName',
    },
    {
      name: 'fromWhareaId',
      type: 'string',
      bind: 'fromLocationLineLov.whareaId',
    },
    {
      name: 'fromWhareaCode',
      type: 'string',
      bind: 'fromLocationLineLov.whareaCode',
    },
    {
      name: 'fromWarehouseName',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.fWName').d('来源仓库'),
      type: 'string',
      bind: 'fromLocationLineLov.warehouseName',
    },
    {
      name: 'fromWarehouseId',
      type: 'string',
      bind: 'fromLocationLineLov.warehouseId',
    },
    {
      name: 'fromWarehouseCode',
      type: 'string',
      bind: 'fromLocationLineLov.warehouseCode',
    },
    {
      name: 'toLocationLineLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.toLocation').d('目标库位'),
      ignore: 'always',
      noCache: true,
      textField: 'locationCode',
      valueField: 'locationId',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => {
          if (record.get('toOrgId')) {
            return { orgId: record.get('toOrgId') };
          } else {
            return { orgId: record.get('fromOrgId') };
          }
        },
      },
    },
    {
      name: 'toLocationId',
      bind: 'toLocationLineLov.locationId',
    },
    {
      name: 'toLocationCode',
      bind: 'toLocationLineLov.locationCode',
    },
    {
      name: 'toLocationName',
      bind: 'toLocationLineLov.locationName',
    },
    {
      name: 'toWhareaName',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.toWhareaName').d('目标库区'),
      type: 'string',
      bind: 'toLocationLineLov.whareaName',
    },
    {
      name: 'toWhareaId',
      type: 'string',
      bind: 'toLocationLineLov.whareaId',
    },
    {
      name: 'toWhareaCode',
      type: 'string',
      bind: 'toLocationLineLov.whareaCode',
    },
    {
      name: 'toWarehouseId',
      type: 'string',
      bind: 'toLocationLineLov.warehouseId',
    },
    {
      name: 'toWarehouseCode',
      type: 'string',
      bind: 'toLocationLineLov.warehouseCode',
    },
    {
      name: 'toWarehouseName',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.toWarehouseName').d('目标仓库'),
      type: 'string',
      bind: 'toLocationLineLov.warehouseName',
    },
    {
      name: 'cidCodeLov',
      type: 'object',
      lovCode: 'WINV.INV_STOCK_TRANSFER_CONT',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.cidCode').d('托盘编码'),
      ignore: 'always',
      noCache: true,
      cascadeMap: { locationId: 'fromLocationId' },
      dynamicProps: ({ record }) => {
        const cidStatus = record.get('cidStatus');
        const goodsId = record.get('goodsId');
        return { readOnly: cidStatus && goodsId };
      },
    },
    {
      name: 'cidId',
      bind: 'cidCodeLov.cidId',
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.cidCode').d('托盘编码'),
      bind: 'cidCodeLov.cidCode',
    },
    {
      name: 'goodsLov',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.sku').d('物料编码'),
      type: 'object',
      ignore: 'always',
      lovCode: 'WINV.INV_STOCK_TRANSFER_SKU',
      noCache: true,
      cascadeMap: { locationId: 'fromLocationId' },
      dynamicProps: ({ record }) => {
        return {
          required: !record.get('cidCodeLov'),
          readOnly: record.get('cidCodeLov') || record.get('batchCodeLov'),
        };
      },
    },
    {
      name: 'goodsId',
      bind: 'goodsLov.goodsId',
    },
    {
      name: 'isbatch',
      bind: 'goodsLov.isbatch',
    },
    {
      name: 'sku',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.sku').d('物料编码'),
      bind: 'goodsLov.sku',
    },
    {
      name: 'ownerId',
      bind: 'goodsLov.ownerId',
    },
    {
      name: 'ownerCode',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.ownerName').d('货主名称'),
      type: 'string',
      // bind: 'goodsLov.ownerCode',
    },
    {
      name: 'batchCodeLov',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.batchCode').d('批次编码'),
      type: 'object',
      ignore: 'always',
      noCache: true,
      lovCode: 'WINV.INV_STOCK_TRANSFER_BATCH',
      cascadeMap: { goodsId: 'goodsId', locationId: 'fromLocationId' },
      dynamicProps: ({ record }) => {
        return {
          required: record.get('isbatch') === 1 && !record.get('cidCodeLov'),
          // readOnly: record.get('isbatch') !== 1 || record.get('cidCodeLov'),
        };
      },
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.batchCode').d('批次编码'),
      bind: 'batchCodeLov.batchCode',
    },
    {
      name: 'batchId',
      bind: 'batchCodeLov.batchId',
    },
    {
      name: 'uomName',
      label: intl.get('winv.inventoryTransfer.whareaTransfer.table.uomName').d('单位'),
      type: 'string',
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
      name: 'transferQty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.transferQty').d('数量'),
      type: 'number',
      defaultValue: 0,
      min: 0,
      // dynamicProps: ({ record }) => {
      //   return {
      //     readOnly: record.get('cidCodeLov'),
      //     required: !record.get('cidCodeLov'),
      //     max: record.get('validQty'),
      //     type: record.get('cidCodeLov') ? 'string' : 'number',
      //     disabled: record.get('goodsId') && (record.get('goodsLov').serialType === 'INV_CTRL' || (record.get('goodsLov').serialType === 'SEMI_INV_CTRL' && record.get('fromWarehouseId') === record.get('toWarehouseId'))),
      //   };
      // },
      dynamicProps: {
        // readOnly: ({ record }) => {
        //   return record.get('cidCodeLov');
        // },
        required: ({ record }) => {
          return !record.get('cidCodeLov');
        },
        max: ({ record }) => {
          return record.get('validQty');
        },
        type: ({ record }) => {
          return record.get('cidCodeLov') ? 'string' : 'number';
        },
        // disabled: ({ record }) => {
        //   return (
        //     record.get('goodsId') &&
        //     (record.get('goodsLov').serialType === 'INV_CTRL' ||
        //       (record.get('goodsLov').serialType === 'SEMI_INV_CTRL' &&
        //         record.get('fromWarehouseId') !== record.get('toWarehouseId')))
        //   );
        // },
      },
    },
    {
      name: 'qty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.qty').d('现有量'),
      dynamicProps: ({ record }) => {
        return {
          type: record.get('cidCodeLov') ? 'string' : 'number',
        };
      },
      // bind: 'goodsLov.qty',
    },
    {
      name: 'validQty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.validQty').d('可用量'),
      // type: 'number',
      dynamicProps: ({ record }) => {
        return {
          type: record.get('cidCodeLov') ? 'string' : 'number',
        };
      },
      // bind: 'goodsLov.validQty',
    },
    {
      name: 'remark',
      label: intl.get('winv.inventoryTransfer.inSundry.table.remark').d('备注'),
      type: 'string',
    },
  ],
  events: {
    update: ({ record, name }) => {
      const cidId = record.get('cidId');
      const goodsId = record.get('goodsId');
      const goodsLov = record.get('goodsLov');
      if (name === 'cidCodeLov') {
        if (cidId) {
          record.set('goodsLov', 'xxx');
          record.set('batchCodeLov', 'xxx');
          record.set('ownerCode', 'xxx');
          record.set('cidStatus', false);
          record.set('uomName', 'xxx');
        } else {
          record.set('goodsLov', null);
          record.set('ownerCode', null);
          record.set('batchCodeLov', null);
          record.set('cidStatus', false);
          record.set('uomName', null);
        }
      } else if (name === 'goodsLov' && goodsId) {
        record.set('cidStatus', true);
        record.set('uomName', goodsLov.uomCode);
        record.set('ownerCode', goodsLov.ownerCode);
      } else if (name === 'goodsLov' && !goodsId) {
        record.set('cidStatus', false);
        record.set('uomName', null);
        record.set('ownerCode', null);
        record.set('transferQty', null);
      }
    },
  },
});

// 序列号明细选择模态框
export const serialDetailModalDs = () => ({
  paging: true,
  fields: [
    {
      name: 'serialNumber',
      label: intl.get('winv.inboundOrder.serialDetailModal.tabel.serialNumber').d('序列号'),
    },
    {
      name: 'qualityStatusName',
      label: intl.get('winv.inboundOrder.serialDetailModal.tabel.qualityStatus').d('质量状态'),
    },
  ],
  transport: {
    read: ({ data }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/stock-trans/query-serial`,
        method: 'POST',
        data,
      };
    },
  },
});

// 组织库区弹出框
export const transferDrawerDs = () => ({
  selection: false,
  fields: [
    {
      name: 'locationName',
      label: intl.get('winv.inventoryTransfer.modalOrg.drawer.table.location').d('库位'),
      type: 'string',
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inventoryTransfer.modalOrg.drawer.table.cidCode').d('托盘编码'),
      type: 'string',
    },
    {
      name: 'sku',
      label: intl.get('winv.inventoryTransfer.modalOrg.drawer.table.sku').d('物料编码'),
      type: 'string',
    },
    {
      name: 'ownerName',
      label: intl.get('winv.inventoryTransfer.modalOrg.drawer.table.ownerName').d('货主名称'),
      type: 'string',
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inventoryTransfer.modalOrg.drawer.table.batchCode').d('批次编码'),
      type: 'string',
    },
    {
      name: 'qty',
      label: intl.get('winv.inventoryTransfer.modalOrg.drawer.table.qty').d('现有量'),
      type: 'number',
    },
    {
      name: 'validQty',
      label: intl.get('winv.inventoryTransfer.modalOrg.drawer.table.validQty').d('可用量'),
      type: 'number',
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/stock-trans/query-stock`,
        method: 'GET',
        params,
      };
    },
  },
});
// 杂项头
export const sundryFormDs = (orgIds, defaultOrgValue) => ({
  autoCreate: true,
  fields: [
    {
      name: 'sundryType',
      label: intl.get('winv.inventoryTransfer.sundry.form.sundryType').d('杂项类型'),
      type: 'string',
      required: true,
      lookupCode: 'WINV.INV_MOVE_MISC_TYPE',
    },
    {
      name: 'orgLov',
      type: 'object',
      lovCode: 'WMDM.INV_ORG',
      label: intl.get('winv.inventoryTransfer.sundry.form.Org').d('组织名称'),
      ignore: 'always',
      noCache: true,
      required: true,
      lovPara: {
        idStr: orgIds,
      },
      defaultValue: defaultOrgValue,
    },
    {
      name: 'orgId',
      bind: 'orgLov.orgId',
    },
    {
      name: 'orgCode',
      bind: 'orgLov.orgCode',
    },
    {
      name: 'orgName',
      bind: 'orgLov.orgName',
    },
    {
      name: 'locationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.sundry.form.Location').d('库位'),
      ignore: 'always',
      noCache: true,
      textField: 'locationCode',
      valueField: 'locationCode',
      cascadeMap: { orgId: 'orgId' },
      lovPara: { enabledFlag: 1 },
    },
    {
      name: 'locationCode',
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
      name: 'processTime',
      type: 'dateTime',
      defaultValue: new Date(),
      required: true,
      label: intl.get('winv.inventoryTransfer.sundry.form.processTime').d('事务处理时间'),
    },
    {
      name: 'locationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.sundry.form.Location').d('库位'),
      ignore: 'always',
      noCache: true,
      textField: 'locationCode',
      valueField: 'locationCode',
      cascadeMap: { orgId: 'orgId' },
      lovPara: { enabledFlag: 1 },
    },
    {
      name: 'reasonLov',
      type: 'object',
      lovCode: 'WINV.INV_MOVE_MISC_REASON_VIEW',
      required: true,
      noCache: true,
      textField: 'meaning',
      valueField: 'value',
      ignore: 'always',
      label: intl.get('winv.inventoryTransfer.sundry.form.reason').d('原因'),
    },
    {
      name: 'reason',
      bind: 'reasonLov.value',
    },
    {
      name: 'remark',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.sundry.form.remark').d('备注'),
    },
  ],
  transport: {
    create: ({ data }) => {
      const formData = data[0];
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/stock-trans/transfer-in-or-out`,
        method: 'POST',
        data: formData,
      };
    },
  },
});

// 杂出行
export const outSundryTableDs = () => ({
  fields: [
    {
      name: 'locationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.outSundry.table.fromLocation').d('库位'),
      ignore: 'always',
      textField: 'locationCode',
      valueField: 'locationCode',
      required: true,
      noCache: true,
      cascadeMap: { orgId: 'orgId' },
      lovPara: { enabledFlag: 1 },
    },
    {
      name: 'locationCode',
      bind: 'locationLov.locationCode',
    },
    {
      name: 'locationName',
      bind: 'locationLov.locationName',
    },
    {
      name: 'locationId',
      bind: 'locationLov.locationId',
    },
    {
      name: 'whareaName',
      label: intl.get('winv.inventoryTransfer.outSundry.table.whareaName').d('库区'),
      type: 'string',
      bind: 'locationLov.whareaName',
    },
    {
      name: 'whareaId',
      type: 'number',
      bind: 'locationLov.whareaId',
    },
    {
      name: 'whareaCode',
      type: 'string',
      bind: 'locationLov.whareaCode',
    },
    {
      name: 'warehouseName',
      label: intl.get('winv.inventoryTransfer.outSundry.table.warehouseName').d('仓库'),
      type: 'string',
      bind: 'locationLov.warehouseName',
    },
    {
      name: 'warehouseId',
      type: 'number',
      bind: 'locationLov.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'locationLov.warehouseCode',
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inventoryTransfer.outSundry.table.cidCode').d('托盘编码'),
      type: 'object',
      ignore: 'always',
      lovCode: 'WINV.INV_STOCK_OUT_CONTAIONER',
      noCache: true,
      cascadeMap: { locationId: 'locationId' },
    },
    {
      name: 'cidId',
      type: 'string',
      bind: 'cidCode.cidId',
    },
    {
      name: 'goodsLov',
      label: intl.get('winv.inventoryTransfer.outSundry.table.sku').d('物料编码'),
      type: 'object',
      ignore: 'always',
      lovCode: 'WINV.INV_STOCK_TRANSFER_SKU',
      noCache: true,
      textField: 'sku',
      valueField: 'goodsId',
      cascadeMap: { locationId: 'locationId' },
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('cidId')) {
            return false;
          } else {
            return true;
          }
        },
      },
    },
    {
      name: 'sku',
      bind: 'goodsLov.sku',
    },
    {
      name: 'goodsId',
      bind: 'goodsLov.goodsId',
    },
    {
      name: 'isbatch',
      bind: 'goodsLov.isbatch',
    },
    {
      name: 'ownerId',
      type: 'number',
      bind: 'goodsLov.ownerId',
    },
    {
      name: 'ownerCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.outSundry.table.ownerId').d('货主'),
      bind: 'goodsLov.ownerCode',
    },
    {
      name: 'ownerName',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.outSundry.table.ownerId').d('货主'),
      bind: 'goodsLov.ownerName',
    },
    {
      name: 'serialType',
      bind: 'goodsLov.serialType',
    },
    {
      name: 'batchLov',
      label: intl.get('winv.inventoryTransfer.outSundry.table.batchCode').d('批次编码'),
      type: 'object',
      lovCode: 'WINV.INV_STOCK_TRANSFER_BATCH',
      textField: 'batchCode',
      valueField: 'batchId',
      ignore: 'always',
      noCache: true,
      cascadeMap: { goodsId: 'goodsId', ownerId: 'ownerId', locationId: 'locationId' },
      dynamicProps: {
        required: ({ record }) => {
          return record.get('isbatch') === 1;
        },
      },
    },
    {
      name: 'batchId',
      type: 'number',
      bind: 'batchLov.batchId',
    },
    {
      name: 'batchCode',
      type: 'string',
      bind: 'batchLov.batchCode',
    },
    {
      name: 'uomCode',
      type: 'string',
      bind: 'goodsLov.uomCode',
    },
    {
      name: 'uomId',
      type: 'number',
      bind: 'goodsLov.uomId',
    },
    {
      name: 'uomName',
      label: intl.get('winv.inventoryTransfer.outSundry.table.uomName').d('单位'),
      type: 'string',
      bind: 'goodsLov.uomCode',
    },
    {
      name: 'transferQty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.transferQty').d('数量'),
      type: 'number',
      min: 0,
      dynamicProps: {
        required: ({ record }) => {
          if (record.get('cidId')) {
            return false;
          } else {
            return true;
          }
        },
        max: ({ record }) => {
          return record.get('validQty');
        },
      },
    },
    {
      name: 'qty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.qty').d('现有量'),
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'validQty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.validQty').d('可用量'),
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'reasonLov',
      type: 'object',
      lovCode: 'WINV.INV_MOVE_MISC_REASON_VIEW',
      required: true,
      noCache: true,
      textField: 'meaning',
      valueField: 'value',
      ignore: 'always',
      label: intl.get('winv.inventoryTransfer.sundry.form.reason').d('原因'),
    },
    {
      name: 'reason',
      bind: 'reasonLov.value',
    },
    {
      name: 'remark',
      label: intl.get('winv.inventoryTransfer.inSundry.table.remark').d('备注'),
      type: 'string',
    },
  ],
});

// 杂入行
export const inSundryTableDs = () => ({
  fields: [
    {
      name: 'locationLov',
      type: 'object',
      lovCode: 'WMDM.LOCATION',
      label: intl.get('winv.inventoryTransfer.inSundry.table.fromLocation').d('库位'),
      ignore: 'always',
      textField: 'locationCode',
      valueField: 'locationCode',
      required: true,
      noCache: true,
      cascadeMap: { orgId: 'orgId' },
      lovPara: { enabledFlag: 1 },
    },
    {
      name: 'locationCode',
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
      name: 'whareaName',
      label: intl.get('winv.inventoryTransfer.inSundry.table.whareaName').d('库区'),
      type: 'string',
      bind: 'locationLov.whareaName',
    },
    {
      name: 'whareaId',
      type: 'number',
      bind: 'locationLov.whareaId',
    },
    {
      name: 'whareaCode',
      type: 'string',
      bind: 'locationLov.whareaCode',
    },
    {
      name: 'warehouseName',
      label: intl.get('winv.inventoryTransfer.inSundry.table.warehouseName').d('仓库'),
      type: 'string',
      bind: 'locationLov.warehouseName',
    },
    {
      name: 'warehouseId',
      type: 'number',
      bind: 'locationLov.warehouseId',
    },
    {
      name: 'warehouseCode',
      type: 'string',
      bind: 'locationLov.warehouseCode',
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inventoryTransfer.inSundry.table.cidCode').d('托盘编码'),
      type: 'string',
    },
    {
      name: 'goodsLov',
      label: intl.get('winv.inventoryTransfer.inSundry.table.sku').d('物料编码'),
      type: 'object',
      ignore: 'always',
      lovCode: 'WMDM.SUNDRY_GOODS',
      textField: 'sku',
      valueField: 'goodsId',
      noCache: true,
      required: true,
      cascadeMap: { orgId: 'orgId' },
    },
    {
      name: 'goodsId',
      bind: 'goodsLov.goodsId',
    },
    {
      name: 'sku',
      bind: 'goodsLov.sku',
    },
    {
      name: 'goodsName',
      bind: 'goodsLov.goodsName',
    },
    {
      name: 'isbatch',
      bind: 'goodsLov.isbatch',
    },
    {
      name: 'serialType',
      bind: 'goodsLov.serialType',
    },
    {
      name: 'ownerId',
      type: 'number',
      bind: 'goodsLov.ownerId',
    },
    {
      name: 'ownerCode',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.inSundry.table.ownerId').d('货主'),
      bind: 'goodsLov.ownerCode',
    },
    {
      name: 'ownerName',
      label: intl.get('winv.inventoryTransfer.inSundry.table.ownerId').d('货主'),
      type: 'string',
      bind: 'goodsLov.ownerName',
    },
    {
      name: 'batchLov',
      label: intl.get('winv.inventoryTransfer.inSundry.table.batchCode').d('批次编码'),
      type: 'string',
      dynamicProps: {
        required: ({ record }) => {
          return record.get('isbatch') === 1;
        },
      },
    },
    {
      name: 'uomId',
      type: 'number',
      bind: 'goodsLov.uomId',
    },
    {
      name: 'uomCode',
      type: 'string',
      bind: 'goodsLov.uomCode',
    },
    {
      name: 'uomName',
      label: intl.get('winv.inventoryTransfer.inSundry.table.uomName').d('单位'),
      type: 'string',
      bind: 'goodsLov.uomCode',
    },
    {
      name: 'transferQty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.transferQty').d('数量'),
      type: 'number',
      defaultValue: 0,
      min: 0,
      required: true,
    },
    {
      name: 'qty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.qty').d('现有量'),
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'validQty',
      label: intl.get('winv.inventoryTransfer.inSundry.table.validQty').d('可用量'),
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'reasonLov',
      type: 'object',
      lovCode: 'WINV.INV_MOVE_MISC_REASON_VIEW',
      required: true,
      noCache: true,
      ignore: 'always',
      textField: 'meaning',
      valueField: 'value',
      label: intl.get('winv.inventoryTransfer.sundry.form.reason').d('原因'),
    },
    {
      name: 'reason',
      bind: 'reasonLov.value',
    },
    {
      name: 'remark',
      label: intl.get('winv.inventoryTransfer.inSundry.table.remark').d('备注'),
      type: 'string',
    },
    {
      name: 'vendorEdit',
      type: 'boolean',
      defaultValue: false,
    },
  ],
});

export const modalDs = () => ({
  autoQuery: false,
  queryFields: [
    {
      name: 'warehouseId',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.model.tabel.warehouse').d('仓库名称'),
    },
    {
      name: 'whareaId',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.model.tabel.whareaId').d('库区名称'),
    },
    {
      name: 'locationId',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.model.tabel.locationId').d('库位'),
    },
    {
      name: 'cidId',
      type: 'string',
      label: intl.get('winv.inventoryTransfer.model.tabel.cidId').d('托盘'),
    },
  ],
  fields: [
    {
      name: 'locationCode',
      label: intl.get('winv.inventoryTransfer.model.tabel.fromLocation').d('库位'),
    },
    {
      name: 'cidCode',
      label: intl.get('winv.inventoryTransfer.model.tabel.cidCode').d('托盘编码'),
    },
    {
      name: 'sku',
      label: intl.get('winv.inventoryTransfer.model.tabel.sku').d('物料编码'),
    },
    {
      name: 'ownerName',
      label: intl.get('winv.inventoryTransfer.model.tabel.ownerName').d('货主名称'),
    },
    {
      name: 'batchCode',
      label: intl.get('winv.inventoryTransfer.model.tabel.batchCode').d('批次编码'),
    },
    {
      name: 'uomName',
      label: intl.get('winv.inventoryTransfer.model.tabel.uomName').d('单位'),
    },
    {
      name: 'qty',
      label: intl.get('winv.inventoryTransfer.model.tabel.qty').d('现有量'),
    },
    {
      name: 'validQty',
      label: intl.get('winv.inventoryTransfer.model.tabel.validQty').d('可用量'),
    },
  ],
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/stock-trans/query-stock`,
        method: 'GET',
        params,
      };
    },
  },
});
