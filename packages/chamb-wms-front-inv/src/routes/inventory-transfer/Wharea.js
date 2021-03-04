import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Bind } from 'lodash-decorators';
import { Spin } from 'choerodon-ui';
import {
  DataSet,
  Table,
  Form,
  Lov,
  TextField,
  DateTimePicker,
  NumberField,
  Modal,
} from 'choerodon-ui/pro';
import { Button } from 'components/Permission';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';

import { Header, Content } from 'components/Page';
import { whareaFormDs, transferTableDs, transferDrawerDs } from '@/stores/InventoryTransferDS';
import { connect } from 'dva';
import globalStyles from 'wmsGlobalStyle';

// import WithCustomize from 'hzero-front-hcuz/lib/components/c7n/withCustomize';
// import CustButton from 'hzero-front-hcuz/lib/components/c7n/custBox/CustButton';

import Drawer from './transferDrawer/index';
import SerialNumberDetail from './SerialNumberDetail';

// @WithCustomize({
//   unitCode: ['WINV_INVENTORY_TRANSFER.TABLE'],
// })
@formatterCollections({ code: ['winv.inventoryTransfer', 'winv.common'] })
@withRouter
@connect(({ global, transfer, loading }) => ({
  global,
  transfer,
  transferLoading: loading.effects['transfer/getStocks'] || false,
}))
export default class WhareaTransfer extends Component {
  constructor(props) {
    super(props);
    const {
      global: { warehousePermission: { orgList = [] } = {} },
    } = this.props;

    this.state = {
      orgIds: (orgList && orgList.map((org) => org.orgId).join(',')) || [],
    };

    const defaultOrgValue =
      orgList.length === 1
        ? {
            orgId: orgList[0].orgId,
            orgName: orgList[0].orgName,
            orgCode: orgList[0].orgCode,
          }
        : null;
    this.formDs = new DataSet({ ...whareaFormDs(this.state.orgIds, defaultOrgValue) });
  }

  tableDs = new DataSet({
    paging: false,
    ...transferTableDs(),
  });

  modalDs = new DataSet({ ...transferDrawerDs() });

  addButton = (
    <Button
      type="c7n-pro"
      icon="add"
      onClick={this.handleAdd}
      key="add"
      permissionList={[
        {
          code: `${this.props.match.path}/createOne`,
          type: 'button',
          meaning: '库区间转移-新建',
        },
      ]}
    >
      {intl.get('hzero.common.button.create').d('新增')}
    </Button>
  );

  componentDidMount() {
    this.tableDs.addEventListener('update', this.queryNum);
    this.formDs.get(0).set('processTime', new Date());
  }

  componentWillUnmount() {
    this.tableDs.removeEventListener('update', this.queryNum);
  }

  @Bind()
  async queryNum({ record, name }) {
    const { dispatch } = this.props;
    const locationId = record.get('fromLocationId');
    const whareaId = record.get('fromWhareaId');
    const warehouseId = record.get('fromWarehouseId'); // 来源仓库
    const toWarehouseId = record.get('toWarehouseId'); // 目标仓库
    const orgId = record.get('fromOrgId');
    const ownerId = record.get('ownerId');
    const cidId = record.get('cidId');
    const goodsId = record.get('goodsId');
    const goodsLov = record.get('goodsLov');
    const batchId = record.get('batchId');
    if (name === 'cidCodeLov' && cidId) {
      this.modalDs.setQueryParameter('locationId', locationId);
      this.modalDs.setQueryParameter('whareaId', whareaId);
      this.modalDs.setQueryParameter('warehouseId', warehouseId);
      this.modalDs.setQueryParameter('orgId', orgId);
      this.modalDs.setQueryParameter('cidId', cidId);
      await this.modalDs.query();
      dispatch({
        type: 'transfer/getTransferQty',
        payload: { locationId, whareaId, warehouseId, orgId, cidId },
      }).then((res) => {
        if (res) {
          record.set('qty', res.qty);
          record.set('validQty', res.validQty);
          record.set('transferQty', res.validQty);
        }
      });
    } else if (name === 'cidCodeLov' && !cidId) {
      record.set('qty', null);
      record.set('validQty', null);
      record.set('transferQty', null);
    } else if (name === 'goodsLov' && !cidId && goodsId) {
      if (
        goodsLov.serialType === 'INV_CTRL' ||
        (goodsLov.serialType === 'SEMI_INV_CTRL' && warehouseId !== toWarehouseId)
      ) {
        record.set('transferQty', 0);
      }
      dispatch({
        type: 'transfer/getTransferQty',
        payload: { locationId, whareaId, warehouseId, orgId, goodsId, ownerId },
      }).then((res) => {
        if (res) {
          record.set('qty', res.qty);
          record.set('validQty', res.validQty);
        }
      });
    } else if (name === 'goodsLov' && !cidId && !goodsId) {
      record.set('qty', null);
      record.set('validQty', null);
    } else if (name === 'batchCodeLov' && batchId && !cidId) {
      dispatch({
        type: 'transfer/getTransferQty',
        payload: { locationId, whareaId, warehouseId, orgId, goodsId, ownerId, batchId },
      }).then((res) => {
        if (res) {
          record.set('qty', res.qty);
          record.set('validQty', res.validQty);
        }
      });
    } else if (name === 'batchCodeLov' && !batchId && !cidId && goodsId) {
      dispatch({
        type: 'transfer/getTransferQty',
        payload: { locationId, whareaId, warehouseId, orgId, goodsId, ownerId },
      }).then((res) => {
        if (res) {
          record.set('qty', res.qty);
          record.set('validQty', res.validQty);
        }
      });
    }
  }

  @Bind()
  async handleAdd() {
    try {
      const validateValue = await this.formDs.validate(false, false);
      if (!validateValue) {
        return false;
      }
      const validateLineValue = await this.tableDs.validate(false, false);
      if (!validateLineValue) {
        return false;
      }
      const formRecord = this.formDs.get(0);
      // 新建默认初始值
      const record = this.tableDs.create({
        fromOrgId: formRecord.get('orgId'),
        toOrgId: formRecord.get('toOrgId'),
        fromLocationLineLov: formRecord.get('fromLocationLov'),
        toLocationLineLov: formRecord.get('toLocationLov'),
        remark: formRecord.get('remark'),
      });
      this.tableDs.unshift(record);
    } catch {
      return false;
    }
  }

  @Bind()
  async handleSave() {
    try {
      const vData = [];
      const vData2 = [];
      const modalRecord = this.modalDs.toData();
      let isCidId = false;
      const validateLineValue = await this.tableDs.validate(false, false);
      if (!validateLineValue) {
        return false;
      }
      if (this.tableDs.toData().length === 0 && !this.tableDs.dirty) {
        notification.error({
          message: intl.get('winv.common.message.confirm.create').d('请至少新增一条数据'),
        });
        return;
      }
      const record = this.formDs.get(0);
      const lineData = this.tableDs.toData();
      lineData.forEach((v) => {
        if (v.fromLocationLineLov) {
          /* eslint-disable */
          delete v.fromLocationLineLov;
        }
        if (v.toLocationLineLov) {
          delete v.toLocationLineLov;
        }
        if (v.cidCodeLov) {
          delete v.cidCodeLov;
        }
        if (v.goodsLov) {
          v.serialType = v.goodsLov.serialType;
          delete v.goodsLov;
        }
        if (v.owner) {
          delete v.owner;
        }
        if (v.batchCodeLov) {
          delete v.batchCodeLov;
          /* eslint-disable */
        }
        if (v.cidId) {
          isCidId = true;
          if (modalRecord && modalRecord.length > 0) {
            // for (let i = 0; i < modalRecord.length; i++) {
            //   vData.push({ ...v });
            // }
            modalRecord.forEach((v1) => {
              vData.push({
                ...v,
                ...v1,
                serialStockProcessDtoList: v1.selectedSerial || v1.serialStockProcessDtoList,
                transferQty: v1.selectedSerial
                  ? v1.selectedSerial.length
                  : v1.serialStockProcessDtoList
                  ? v1.serialStockProcessDtoList.length
                  : v1.validQty,
              });
            });
          }
        } else {
          vData2.push(v);
        }
      });
      if (isCidId) {
        const lastObj = vData.concat(vData2);
        record.set({
          transferLinesDtoList: lastObj,
        });
      } else {
        record.set({
          transferLinesDtoList: vData2,
        });
      }
      const res = await this.formDs.submit(false, false);
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
      }
      this.handleReset();
      return res;
    } catch {
      return false;
    }
  }

  @Bind()
  handleReset() {
    this.formDs.reset();
    this.formDs.get(0).set('processTime', new Date());
    this.tableDs.reset();
  }

  /**
   * 关闭模态框
   */
  @Bind()
  closeModal() {
    this.setState({
      modalVisible: false,
    });
  }

  @Bind()
  checkTransferQty(record) {
    if (record.get('transferQty') === 0) {
      record.set('transferQty', null);
    }
  }

  get tableColumns() {
    return [
      { name: 'fromLocationLineLov', align: 'left', width: 100, editor: true },
      { name: 'fromWhareaName', align: 'left', width: 100 },
      { name: 'fromWarehouseName', align: 'left', width: 100 },
      { name: 'toLocationLineLov', align: 'left', width: 100, editor: true },
      { name: 'toWhareaName', align: 'left', width: 100 },
      { name: 'toWarehouseName', align: 'left', width: 100 },
      {
        name: 'cidCodeLov',
        align: 'left',
        width: 100,
        editor: true,
      },
      { name: 'goodsLov', align: 'left', width: 120, editor: true },
      { name: 'ownerCode', align: 'left', width: 120 },
      {
        name: 'batchCodeLov',
        align: 'left',
        width: 120,
        editor: (record) => {
          if (record.get('isbatch') !== 1 || record.get('cidCodeLov')) {
            return false;
          } else {
            return true;
          }
        },
      },
      { name: 'uomName', align: 'left', width: 60 },
      {
        name: 'transferQty',
        align: 'left',
        width: 80,
        editor: (record) => {
          const isDisabled =
            record.get('goodsId') &&
            (record.get('goodsLov').serialType === 'INV_CTRL' ||
              (record.get('goodsLov').serialType === 'SEMI_INV_CTRL' &&
                record.get('fromWarehouseId') !== record.get('toWarehouseId')));
          if (record.status === 'add' && !isDisabled && !record.get('cidCodeLov')) {
            return <NumberField name="transferQty" onBlur={() => this.checkTransferQty(record)} />;
          } else {
            return false;
          }
        },
      },
      { name: 'qty', align: 'left', width: 80 },
      { name: 'validQty', align: 'left', width: 80 },
      { name: 'remark', align: 'left', editor: true },
      {
        header: intl.get('hzero.common.table.column.option').d('操作'),
        name: 'action',
        width: 140,
        align: 'left',
        lock: 'right',
        renderer: ({ record }) => {
          return this.operationRender(record);
        },
      },
    ];
  }

  @Bind()
  operationRender(record) {
    if (record.get('cidCodeLov')) {
      return (
        <Fragment>
          <a
            onClick={() => {
              this.openTrayModal(record);
            }}
          >
            {intl.get('winv.inventoryTransfer.message.title.cidDetail').d('托盘明细')}
          </a>
        </Fragment>
      );
    } else if (
      record.get('goodsId') &&
      (record.get('goodsLov').serialType === 'INV_CTRL' ||
        (record.get('goodsLov').serialType === 'SEMI_INV_CTRL' &&
          record.get('fromWarehouseId') !== record.get('toWarehouseId')))
    ) {
      return (
        <a
          onClick={() => {
            this.handleSerialDetail(record);
          }}
        >
          {intl.get('winv.inventoryTransfer.message.title.serialDetail').d('序列号明细')}
        </a>
      );
    } else {
      return <></>;
    }
  }

  /**
   * 打开托盘明细模态框
   * @param {object} record - 当前选择的数据
   * @memberof ModelType
   */
  @Bind()
  openTrayModal(record) {
    Modal.open({
      drawer: true,
      key: 'cidDetailList',
      maskClosable: true,
      destroyOnClose: true,
      closable: true,
      style: {
        width: '80%',
      },
      title: intl.get('winv.inventoryTransfer.title.cidDetail').d('托盘明细'),
      children: (
        <React.Fragment>
          <Drawer modalDs={this.modalDs} />
        </React.Fragment>
      ),
      footer: null,
    });
  }

  @Bind()
  async handleSerialDetail(record) {
    const validValue = await record.validate(true, true);
    const status = record.get('status');
    const id = record.get('id');
    if (!validValue) {
      notification.error({
        message: intl.get('winv.common.message.data.validate').d('数据校验不通过!'),
      });
      return;
    }
    this.openSerialModal(id, status, record);
  }

  /**
   * 打开序列号明细模态框
   * @param {object} record - 当前选择的数据
   * @memberof ModelType
   */
  @Bind()
  openSerialModal(id, status, record) {
    // 初始化序列号明细界面的ds
    this.serialTableDs = new DataSet({
      fields: [
        {
          name: 'serialNumber',
          label: intl.get('winv.inboundOrder.model.detail.serialNumber').d('序列号'),
        },
        {
          name: 'qualityStatusName',
          label: intl.get('winv.inboundOrder.model.detail.qualityStatus').d('质量状态'),
        },
      ],
    });

    // 给序列号明细界面赋值 （缓存值）
    this.serialTableDs.data = record.get('serialStockProcessDtoList');

    const key = Modal.key();
    Modal.open({
      drawer: true,
      maskClosable: true,
      key,
      destroyOnClose: true,
      closable: true,
      style: {
        width: '80%',
      },
      title: intl.get('winv.inboundOrder.model.title.serailDetail').d('序列号明细'),
      children: (
        <SerialNumberDetail
          status={status}
          currentRecord={record}
          formDs={this.formDs}
          transferDs={this.tableDs}
          tableDs={this.serialTableDs}
        />
      ),
      afterClose: () => this.setSerialDataToTable(record, this.serialTableDs),
      footer: (cancelBtn) => <div>{cancelBtn}</div>,
      okText: intl.get('hzero.common.button.ok').d('确定'),
    });
  }

  /**
   * 关闭序列号明细 将序列号数据回写到外层table中
   * @param {Object} record
   * @param {Object} serialTableDs
   */
  @Bind()
  setSerialDataToTable(record, serialTableDs) {
    const tableList = serialTableDs.toData();
    record.set('transferQty', tableList.length);
    record.set('serialStockProcessDtoList', tableList);
    const serialNumberList = [];
    this.tableDs.toData().forEach((item) => {
      if (item.serialStockProcessDtoList) {
        for (const i of item.serialStockProcessDtoList) {
          serialNumberList.push(i.serialNumber);
        }
      }
    });
    this.tableDs.existedSerial = serialNumberList;
  }

  render() {
    const buttons = [this.addButton, 'remove'];
    const { transferLoading, customizeForm, customizeTable } = this.props;
    return (
      <>
        <Header
          title={intl.get('winv.inventoryTransfer.title.whareaTransfer.list').d('库区间转移')}
        >
          {/* <CustButton
            unit={[
              {
                code: 'WINV_INVENTORY_TRANSFER.TABLE',
              },
            ]}
          /> */}
          <Button
            type="c7n-pro"
            color="primary"
            onClick={this.handleReset}
            permissionList={[
              {
                code: `${this.props.match.path}/reset`,
                type: 'button',
                meaning: '库区间转移-重置',
              },
            ]}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
          <Button
            type="c7n-pro"
            color="primary"
            onClick={this.handleSave}
            permissionList={[
              {
                code: `${this.props.match.path}/save`,
                type: 'button',
                meaning: '库区间转移-保存',
              },
            ]}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={transferLoading}>
            <Form dataSet={this.formDs} columns={3}>
              <Lov name="orgLov" />
              <Lov name="fromLocationLov" />
              <Lov name="toLocationLov" />
              <DateTimePicker name="processTime" />
              <TextField name="remark" />
            </Form>
            <AutoRestHeight topSelector=".c7n-pro-table" diff={30}>
              {/* {customizeTable(
                {
                  code: 'WINV_INVENTORY_TRANSFER.TABLE',
                },
                <Table
                  buttons={buttons}
                  dataSet={this.tableDs}
                  highLightRow={false}
                  queryBar="none"
                  columns={this.tableColumns}
                  className={globalStyles['wms-personalized-styles']}
                />
              )} */}
              <Table
                buttons={buttons}
                dataSet={this.tableDs}
                highLightRow={false}
                queryBar="none"
                columns={this.tableColumns}
                className={globalStyles['wms-personalized-styles']}
              />
            </AutoRestHeight>
          </Spin>
          {/* {modalVisible && <Drawer {...drawerProps} />} */}
        </Content>
      </>
    );
  }
}
