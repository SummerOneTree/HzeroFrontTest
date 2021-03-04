import React, { Component, Fragment } from 'react';
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
} from 'choerodon-ui/pro';
import { Button } from 'components/Permission';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { connect } from 'dva';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';

import { Header, Content } from 'components/Page';
import { orgFormDs, transferTableDs, transferDrawerDs } from '@/stores/InventoryTransferDS';
import formatterCollections from 'utils/intl/formatterCollections';
import globalStyles from 'wmsGlobalStyle';
import Drawer from './transferDrawer';

@connect(({ global, transfer, loading }) => ({
  global,
  transfer,
  transferLoading: loading.effects['transfer/getStocks'] || false,
}))
@formatterCollections({ code: ['winv.inventoryTransfer', 'winv.common'] })
export default class OrgTransfer extends Component {
  constructor(props) {
    super(props);
    const {
      global: { warehousePermission: { orgList = [] } = {} },
    } = this.props;

    this.state = {
      modalVisible: false, // 控制模态框
      currentRecord: '', // 点击时的该行数据
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
    this.formDs = new DataSet({ ...orgFormDs(this.state.orgIds, defaultOrgValue) });
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
          meaning: '组织间转移-新建',
        },
      ]}
    >
      {intl.get('hzero.common.button.create').d('新增')}
    </Button>
  );

  componentDidMount() {
    window.intl = intl;
    this.tableDs.addEventListener('update', this.queryNum);
    this.formDs.get(0).set('processTime', new Date());
  }

  componentWillUnmount() {
    this.tableDs.removeEventListener('update', this.queryNum);
  }

  @Bind()
  queryNum({ record, name }) {
    const { dispatch } = this.props;
    const locationId = record.get('fromLocationId');
    const whareaId = record.get('fromWhareaId');
    const warehouseId = record.get('fromWarehouseId');
    const orgId = record.get('fromOrgId');
    const ownerId = record.get('ownerId');
    const cidId = record.get('cidId');
    const goodsId = record.get('goodsId');
    const batchId = record.get('batchId');
    if (name === 'cidCodeLov' && cidId) {
      this.modalDs.setQueryParameter('locationId', locationId);
      this.modalDs.setQueryParameter('whareaId', whareaId);
      this.modalDs.setQueryParameter('warehouseId', warehouseId);
      this.modalDs.setQueryParameter('orgId', orgId);
      this.modalDs.setQueryParameter('cidId', cidId);
      this.modalDs.query();
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
        fromOrgId: formRecord.get('fromOrgId'),
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
            const vCopy = Object.assign({}, v);
            for (let i = 0; i < modalRecord.length; i++) {
              vData.push(vCopy);
            }
            modalRecord.forEach((v1, index) => {
              vData[index].sku = v1.sku || null;
              vData[index].goodsId = v1.goodsId || null;
              vData[index].ownerId = v1.ownerId || null;
              vData[index].ownerCode = v1.ownerCode || null;
              vData[index].batchCode = v1.batchCode || null;
              vData[index].batchId = v1.batchId || null;
              vData[index].qty = v1.qty || 0;
              vData[index].validQty = v1.validQty || 0;
              vData[index].uomId = v1.uomId || null;
              vData[index].uomCode = v1.uomCode || null;
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

  /**
   * 打开模态框
   * @param {object} record - 当前选择的数据
   * @memberof ModelType
   */
  @Bind()
  openModal(record) {
    this.setState({
      modalVisible: true,
      currentRecord: record.data,
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
      { name: 'cidCodeLov', align: 'left', width: 120, editor: true },
      { name: 'goodsLov', align: 'left', width: 120, editor: true },
      { name: 'ownerCode', align: 'left', width: 100 },
      { name: 'batchCodeLov', align: 'left', width: 120, editor: true },
      { name: 'uomName', align: 'left', width: 60 },
      {
        name: 'transferQty',
        align: 'left',
        width: 80,
        editor: (record) => {
          if (record.status === 'add') {
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
              this.openModal(record);
            }}
          >
            {intl.get('winv.inventoryTransfer.message.title.cidDetail').d('托盘明细')}
          </a>
        </Fragment>
      );
    } else {
      return <></>;
    }
  }

  render() {
    const buttons = [this.addButton, 'remove'];
    const { modalVisible, currentRecord } = this.state;
    const { transferLoading } = this.props;
    const drawerProps = {
      status,
      onCloseModal: this.closeModal,
      currentRecord,
    };
    return (
      <>
        <Header title={intl.get('winv.inventoryTransfer.title.orgTransfer.list').d('组织间转移')}>
          <Button
            type="c7n-pro"
            color="primary"
            onClick={this.handleSave}
            permissionList={[
              {
                code: `${this.props.match.path}/save`,
                type: 'button',
                meaning: '组织间转移-保存',
              },
            ]}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button
            type="c7n-pro"
            onClick={this.handleReset}
            permissionList={[
              {
                code: `${this.props.match.path}/reset`,
                type: 'button',
                meaning: '组织间转移-重置',
              },
            ]}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={transferLoading}>
            <Form dataSet={this.formDs} columns={3}>
              <Lov name="fromOrgLov" />
              <Lov name="toOrgLov" />
              <Lov name="fromLocationLov" />
              <Lov name="toLocationLov" />
              <DateTimePicker name="processTime" />
              <TextField name="remark" />
            </Form>
            <AutoRestHeight topSelector=".c7n-pro-table" diff={30}>
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
          {modalVisible && <Drawer {...drawerProps} />}
        </Content>
      </>
    );
  }
}
