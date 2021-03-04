/**
 * vendor - 序列号明细
 * @date: 2020-02-20
 * @author: sundae<haiqiang.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Button, DataSet, Table, Modal, Spin } from 'choerodon-ui/pro';
import intl from 'utils/intl';
// import { yesOrNoRender } from 'utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { Content } from 'components/Page';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import { serialDetailModalDs } from '@/stores/InventoryTransferDS';
import globalStyles from 'wmsGlobalStyle';

const key = Modal.key();

@formatterCollections({
  code: ['winv.common', 'winv.inboundOrder'],
})
export default class SerialNumberDetail extends Component {
  constructor(props) {
    super(props);
    const { tableDs } = props;
    this.tableDs = tableDs;
    this.modalDs = new DataSet({ ...serialDetailModalDs() });
    this.state = {
      addLoading: false,
      currentDeleted: [], // 当前删除的序列号
    };
  }

  @Bind()
  async handleDelete() {
    const records = this.tableDs.currentSelected;
    if (records.length === 0) {
      notification.info({
        message: intl.get('hzero.common.message.confirm.selected.atLeast').d('请至少选择一行数据'),
      });
      return;
    }
    const newCurrentDeleted = this.state.currentDeleted;
    records.forEach((item) => {
      newCurrentDeleted.push(item.toData());
    });
    this.setState({
      currentDeleted: newCurrentDeleted,
    });
    await this.tableDs.delete(records);
  }

  /**
   * 录入序列号
   */
  @Bind()
  onCreateModal() {
    const { currentRecord } = this.props;
    const records = this.modalDs.currentSelected;
    if (records.length === 0) {
      notification.info({
        message: intl.get('hzero.common.message.confirm.selected.atLeast').d('请至少选择一行数据'),
      });
      return false;
    }
    if (records.length + this.tableDs.length > currentRecord.get('validQty')) {
      notification.info({
        message: intl
          .get('hzero.common.message.confirm.selected.111')
          .d('序列号数量不允许超过可用量'),
      });
      return false;
    }
    // 把序列号列表中勾选的序列号添加到序列号明细界面上
    records.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.set('_status', 'create');
      // this.tableDs.unshift(item);
      this.tableDs.data = this.tableDs.toData().concat(item.toData());
    });
  }

  /**
   * 点击列表选择 查询序列号列表
   */
  @Bind()
  async handleSelect() {
    const { currentRecord, transferDs, formDs } = this.props;
    const { currentDeleted } = this.state;
    const originRecord = currentRecord.toData();
    const formData = formDs.get(0).toData();
    const currentSerialNumberList = [];
    this.tableDs.toData().forEach((item) => {
      currentSerialNumberList.push(item.serialNumber);
    });
    this.modalDs.setQueryParameter('orgId', formData.orgId);
    if (currentRecord.get('goodsLov').serialType === 'INV_CTRL') {
      this.modalDs.setQueryParameter(
        'locationId',
        originRecord.fromLocationId || originRecord.locationId
      );
    } else {
      this.modalDs.setQueryParameter(
        'warehouseId',
        originRecord.fromWarehouseId || originRecord.warehouseId
      );
    }
    this.modalDs.setQueryParameter('goodsId', originRecord.goodsId);
    this.modalDs.setQueryParameter('ownerId', originRecord.ownerId);
    this.modalDs.setQueryParameter('batchId', originRecord.batchId);
    this.modalDs.setQueryParameter('innerExistsSerial', currentSerialNumberList); // 筛选掉当前模态框内已选择的序列号

    // （删除后未点击确认关闭弹框，导致外层记录未更新）
    //  以下操作 把当前已经删除的序列号从最外层的记录中筛除
    if (transferDs.existedSerial && transferDs.existedSerial.length > 0) {
      currentDeleted.forEach((item) => {
        for (const index in transferDs.existedSerial) {
          if (transferDs.existedSerial[index] === item.serialNumber) {
            transferDs.existedSerial.splice(index, 1);
          }
        }
      });
    }
    this.modalDs.setQueryParameter('existedSerial', transferDs.existedSerial); // 筛选掉前面所有行已选择的序列号
    await this.modalDs.query();

    Modal.open({
      key,
      destroyOnClose: true,
      closable: true,
      maskClosable: true,
      title: intl.get('winv.common.message.data.choseSerialNum').d('选择序列号'),
      children: (
        <Table
          dataSet={this.modalDs}
          queryBar="none"
          highLightRow={false}
          columns={[{ name: 'serialNumber' }, { name: 'qualityStatusName' }]}
        />
      ),
      onOk: this.onCreateModal,
    });
  }

  get tableColumns() {
    return [
      { name: 'serialNumber', align: 'left' },
      { name: 'qualityStatusName', align: 'left' },
    ];
  }

  render() {
    const { addLoading } = this.state;
    const buttons = [
      <Button key="selectList" color="primary" funcType="flat" onClick={this.handleSelect}>
        {intl.get('hzero.common.button.selectList').d('列表选择')}
      </Button>,
      <Button key="delete" color="primary" funcType="flat" onClick={this.handleDelete}>
        {intl.get('hzero.common.button.delete').d('删除')}
      </Button>,
    ];
    return (
      <Fragment>
        <Content>
          <Spin spinning={addLoading}>
            <AutoRestHeight topSelector=".c7n-pro-table" diff={100}>
              <Table
                dataSet={this.tableDs}
                buttons={buttons}
                queryBar="none"
                highLightRow={false}
                columns={this.tableColumns}
                className={globalStyles['wms-personalized-styles']}
              />
            </AutoRestHeight>
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
