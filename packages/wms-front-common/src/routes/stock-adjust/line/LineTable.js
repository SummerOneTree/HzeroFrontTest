import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Table, Button, Lov, TextField, NumberField } from 'choerodon-ui/pro';

import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import { removeToPool } from '@/services/adjustService';
import globalStyles from 'wmsGlobalStyle';

@formatterCollections({ code: ['winv.stockAdjust', 'winv.common'] })
export default class StockAdjustLine extends Component {
  @Bind()
  adjustQtyCheck(value, record) {
    if (value !== 0 && value !== -1 && value !== 1) {
      record.set('adjustQty', null);
      notification.warning({
        message: intl
          .get('winv.stockAdjust.adjustQty.is.error')
          .d('序列号全控制或序列号出入库控制物料，数量只能为0,1,-1'),
      });
    }
  }

  @Bind()
  resetSerialNumber(record) {
    record.set('serialNumber', null);
    record.set('batchLov', null);
    record.set('batchId', null);
    record.set('batchCode', null);
  }

  @Bind()
  resetLocation(record) {
    record.set('locationLov', null);
    record.set('locationId', null);
    record.set('locationCode', null);
  }

  @Bind()
  changeSerial(record) {
    if (record.status === 'update') {
      record.set('serialId', null);
    }
  }

  get tableColumns() {
    return [
      { name: 'lineNum', align: 'left', width: 60, lock: 'left' },
      { name: 'sourceBillCode', align: 'left', width: 140 },
      { name: 'sourceLineNum', align: 'left', width: 100 },
      { name: 'warehouse', align: 'left', width: 100 },
      {
        name: 'whareaList',
        align: 'left',
        width: 100,
        editor: (record, value) => {
          if (
            (record.status === 'sync' || record.status === 'update') &&
            record.get('sourceBillCode') &&
            (record.get('serialType') === 'SEMI_INV_CTRL' ||
              record.get('serialType') === 'INV_CTRL') &&
            record.get('serialId')
          ) {
            return { value };
          } else {
            return <Lov name="whareaList" onChange={() => this.resetLocation(record)} />;
          }
        },
      },
      {
        name: 'locationLov',
        align: 'left',
        width: 100,
        editor: (record, value) => {
          if (
            (record.status === 'sync' || record.status === 'update') &&
            record.get('sourceBillCode') &&
            (record.get('serialType') === 'SEMI_INV_CTRL' ||
              record.get('serialType') === 'INV_CTRL') &&
            record.get('serialId')
          ) {
            return { value };
          } else {
            return <Lov name="locationLov" />;
          }
        },
      },
      {
        name: 'cidCodeLov',
        align: 'left',
        width: 120,
        editor: (record, value) => {
          if (
            (record.status === 'sync' || record.status === 'update') &&
            record.get('sourceBillCode') &&
            (record.get('serialType') === 'SEMI_INV_CTRL' ||
              record.get('serialType') === 'INV_CTRL') &&
            record.get('serialId')
          ) {
            return { value };
          } else {
            return <Lov name="cidCodeLov" />;
          }
        },
      },
      // { name: 'owner', align: 'left', width: 120 },
      {
        name: 'goodsLov',
        align: 'left',
        width: 120,
        editor: (record, value) => {
          if (
            (record.status === 'sync' || record.status === 'update') &&
            record.get('sourceBillCode') &&
            (record.get('serialType') === 'SEMI_INV_CTRL' ||
              record.get('serialType') === 'INV_CTRL') &&
            record.get('serialId')
          ) {
            return { value };
          } else {
            return <Lov name="goodsLov" onChange={() => this.resetSerialNumber(record)} />;
          }
        },
      },
      { name: 'goodsName', align: 'left', width: 150 },
      { name: 'uomName', align: 'left', width: 60 },
      {
        name: 'batchLov',
        width: 120,
        align: 'left',
        editor: (record, value) => {
          if (
            (record.status === 'sync' || record.status === 'update') &&
            record.get('sourceBillCode') &&
            (record.get('serialType') === 'SEMI_INV_CTRL' ||
              record.get('serialType') === 'INV_CTRL') &&
            record.get('serialId')
          ) {
            return { value };
          } else if (record.get('isbatch') === 1) {
            return <Lov name="batchLov" />;
          } else {
            return false;
          }
        },
      },
      {
        name: 'serialNumber',
        align: 'left',
        width: 160,
        editor: (record, value) => {
          if (
            !record.get('sourceBillCode') &&
            (record.get('serialType') === 'SEMI_INV_CTRL' ||
              record.get('serialType') === 'INV_CTRL')
          ) {
            return <TextField name="serialNumber" onChange={() => this.changeSerial(record)} />;
          } else {
            return { value };
          }
        },
      },
      { name: 'remark', align: 'left', width: 160, editor: true },
      { name: 'snapshotQty', align: 'left', width: 80 },
      { name: 'countQty', align: 'left', width: 80 },
      {
        name: 'adjustQty',
        align: 'left',
        width: 80,
        lock: 'right',
        editor: (record, data) => {
          if (
            (record.status === 'sync' || record.status === 'update') &&
            record.get('sourceBillCode') &&
            (record.get('serialType') === 'SEMI_INV_CTRL' ||
              record.get('serialType') === 'INV_CTRL') &&
            record.get('serialId')
          ) {
            return { data };
          } else {
            return <NumberField name="adjustQty" />;
          }
        },
      },
    ];
  }

  @Bind()
  handleChangeBatch(record) {
    if (!record.get('batchCode')) {
      record.set('batchId', null);
    }
  }

  @Bind()
  async createLine() {
    const { formDs, lineTableDs } = this.props;
    try {
      const validateValue = await formDs.validate(false, false);
      if (!validateValue) {
        return false;
      }
      const record = formDs.get(0);
      // 新建默认初始值
      lineTableDs.create(this.getDefaultData(record));
    } catch {
      return false;
    }
  }

  @Bind()
  getDefaultData(record) {
    const obj = {
      billId: 'id',
      billCode: 'billCode',
      warehouseCode: 'warehouseCode',
      whareaList: 'whareaName',
      warehouseName: 'warehouseName',
      locationCode: 'locationCode',
      cidCodeLov: 'cidCode',
      headOrgId: 'orgId',
      headOwnerId: 'ownerId',
      owner: 'ownerName',
      goodsLov: 'goodsName',
      uomName: 'uomName',
      warehouseId: 'warehouseId',
    };
    const defaultData = {};
    // eslint-disable-next-line guard-for-in
    for (const key in obj) {
      defaultData[key] = record.get(obj[key]);
    }
    return defaultData;
  }

  @Bind()
  async queryData(flag) {
    const { lineTableDs } = this.props;
    lineTableDs.setQueryParameter('_flag', flag);
    await lineTableDs.query();
  }

  @Bind()
  async removeData() {
    try {
      const { lineTableDs, formDs } = this.props;
      const recordFrom = formDs.get(0).toData();
      const records = lineTableDs.currentSelected;
      const arr = records.map((item) => item.toData());
      const removeDataSource = {
        adjustOrder: recordFrom,
        adjustOrderLines: arr,
      };
      if (records.length === 0) {
        notification.info({
          message: intl.get('winv.common.message.please.select.data.first').d('请先勾选数据'),
        });
        return;
      }
      const res = await removeToPool(removeDataSource);
      if (res && res.failed && res.message) {
        notification.warning({
          message: res.message,
        });
        throw new Error(res);
      } else if (res === undefined) {
        notification.info({
          message: intl.get('winv.common.message.data.noChange').d('当前没有修改数据，不需要保存'),
        });
        return;
      } else if (!res) {
        return false;
      }
      lineTableDs.query();
    } catch {
      return false;
    }
  }

  render() {
    const { lineTableDs } = this.props;
    const buttons = [
      <Button
        key="create"
        color="primary"
        funcType="flat"
        icon="playlist_add"
        onClick={this.createLine}
      >
        {intl.get('winv.common.button.create').d('新建')}
      </Button>,
      'delete',
      <Button key="out" color="primary" funcType="flat" onClick={() => this.queryData('/out')}>
        {intl.get('winv.common.button.out').d('盘盈行')}
      </Button>,
      <Button key="in" color="primary" funcType="flat" onClick={() => this.queryData('/in')}>
        {intl.get('winv.common.button.in').d('盘亏行')}
      </Button>,
      <Button key="all" color="primary" funcType="flat" onClick={() => this.queryData('')}>
        {intl.get('winv.common.button.all').d('所有')}
      </Button>,
      <Button key="move" color="primary" funcType="flat" onClick={() => this.removeData('')}>
        {intl.get('winv.common.button.move').d('移至差异池')}
      </Button>,
    ];
    return (
      <Fragment>
        <AutoRestHeight topSelector=".c7n-pro-table" diff={100}>
          <Table
            dataSet={lineTableDs}
            queryBar="none"
            highLightRow={false}
            buttons={buttons}
            columns={this.tableColumns}
            className={globalStyles['wms-personalized-styles']}
          />
        </AutoRestHeight>
      </Fragment>
    );
  }
}
