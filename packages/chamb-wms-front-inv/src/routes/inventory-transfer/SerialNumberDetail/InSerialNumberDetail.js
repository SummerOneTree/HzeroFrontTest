/**
 * vendor - 序列号明细
 * @date: 2020-02-20
 * @author: sundae<haiqiang.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Button, DataSet, Table, Row, Col, TextField, Select, Form, Spin } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { Content } from 'components/Page';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import { serialDetailFormDs } from '@/stores/InboundOrderDS';
import { serialIsInOtherHave } from '@/services/inventoryTransferService';
import globalStyles from 'wmsGlobalStyle';

@formatterCollections({
  code: ['winv.common', 'winv.inboundOrder'],
})
export default class InSerialNumberDetail extends Component {
  constructor(props) {
    super(props);
    const { tableDs, status } = props;
    this.status = status;
    this.tableDs = tableDs;
    this.formDs = new DataSet({ ...serialDetailFormDs() });
    this.state = {
      addLoading: false,
    };
    const serialLength = this.tableDs.toData().length;
    this.formDs.get(0).set('serialLength', serialLength);
  }

  @Bind()
  async handleAdd() {
    const data = this.formDs.toData();
    const { currentRecord } = this.props;
    const { serialNumber, qualityStatus } = data[0] || {};
    if (!serialNumber || !qualityStatus) {
      notification.info({
        message: intl.get('winv.inboundOrder.modal.fillInRequiredData').d('请补全必输数据'),
      });
      return;
    }
    const checkData = currentRecord.toData();
    checkData.serialStockProcessDtoList = data;
    this.createApi();
  }

  @Bind()
  async createApi() {
    const tableList = this.tableDs.toData();
    const tableDataIdList = [];
    const tableDataSerialList = [];
    const { transferDs } = this.props;
    tableList.forEach((element) => {
      tableDataIdList.push(element.id);
      tableDataSerialList.push(element.serialNumber);
    });
    const record = this.formDs.get(0);
    if (transferDs.allSerialNumber.includes(record.get('serialNumber'))) {
      notification.info({
        message: intl.get('winv.inboundOrder.message.selected.isHave').d('该序列号已存在'),
      });
      return;
    } else {
      transferDs.allSerialNumber.push(record.serialNumber);
    }
    record.set(
      'qualityStatusName',
      record.get('qualityStatus') === '0-ACCEPTED' ? '0-合格' : '1-冻结'
    );
    record.set('qty', 1);
    record.set('_status', 'create');
    if (!tableDataSerialList.includes(record.get('serialNumber'))) {
      const { formDs } = this.props;
      const checkSerialData = {
        serialNumber: record.get('serialNumber'),
        orgId: formDs.get(0).get('orgId'),
      };
      const res = await serialIsInOtherHave(checkSerialData);
      if (res && res.failed) {
        notification.info({
          message: res.message,
        });
        return;
      }
      if (res && res.serialId) {
        record.set('serialId', res.serialId);
      }
      this.tableDs.unshift(record);
    } else {
      notification.info({
        message: intl.get('winv.inboundOrder.message.selected.isHave').d('该序列号已存在'),
      });
      return;
    }
    this.formDs.create({});

    // 把序列号明细界面的序列号条数回写到序列号界面头上
    const serialLength = this.tableDs.toData().length;
    this.formDs.get(0).set('serialLength', serialLength);
  }

  @Bind()
  async handleDeleteAll() {
    const records = this.tableDs.currentSelected;
    const { transferDs } = this.props;
    if (records.length === 0) {
      notification.info({
        message: intl.get('hzero.common.message.confirm.selected.atLeast').d('请至少选择一行数据'),
      });
      return;
    }
    const deleteDataList = [];
    const deleteSerialListNumber = [];
    const _allSerialNumber = [];

    records.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.set('_status', 'delete');
      deleteSerialListNumber.push(element.toData().serialNumber);
    });

    // 把序列号明细界面删除的序列号从所有已添加的序列号中释放
    transferDs.allSerialNumber.forEach((element) => {
      if (!deleteSerialListNumber.includes(element)) {
        _allSerialNumber.push(element);
      }
    });
    transferDs.allSerialNumber = _allSerialNumber;

    // 删除掉选中的序列号
    const { _deleteDataList } = this.tableDs;
    if (_deleteDataList && _deleteDataList.length > 0) {
      _deleteDataList.forEach((item) => {
        deleteDataList.push(item);
      });
    }
    this.tableDs._deleteDataList = deleteDataList;
    this.tableDs._deleteRecords = records;
    await this.tableDs.delete(records);

    // 把当前页面的序列号数量回写到序列号头上
    const serialLength = this.tableDs.toData().length;
    this.formDs.get(0).set('serialLength', serialLength);
  }

  get tableColumns() {
    return [
      { name: 'serialNumber', align: 'left' },
      { name: 'qualityStatusName', align: 'left', width: 180 },
      { name: 'qty', align: 'left', width: 180 },
    ];
  }

  render() {
    const { addLoading } = this.state;
    const buttons = [
      <Button key="delete" color="primary" funcType="flat" onClick={this.handleDeleteAll}>
        {intl.get('hzero.common.button.delete').d('删除')}
      </Button>,
    ];
    return (
      <Fragment>
        <Content>
          <Spin spinning={addLoading}>
            <Row type="flex" align="middle">
              <Col span={20}>
                <Form
                  dataSet={this.formDs}
                  columns={3}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      this.handleAdd();
                    }
                  }}
                >
                  <TextField name="serialNumber" />
                  <Select name="qualityStatus" />
                  <TextField name="serialLength" newLine />
                </Form>
              </Col>
              <Col span={3}>
                <Button color="primary" onClick={this.handleAdd} loading={addLoading}>
                  {intl.get('winv.inboundOrder.button.addCreate').d('添加')}
                </Button>
              </Col>
            </Row>
            <AutoRestHeight topSelector=".c7n-pro-table" diff={100}>
              <Table
                dataSet={this.tableDs}
                buttons={buttons}
                queryBar="none"
                highLightRow={false}
                columns={[...this.tableColumns]}
                className={globalStyles['wms-personalized-styles']}
              />
            </AutoRestHeight>
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
