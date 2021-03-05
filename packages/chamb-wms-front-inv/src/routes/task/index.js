/**
 * vendor - 任务管理列表页
 * @date: 2019-12/04
 * @author: zhilong.zhu <zhilong.zhu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import globalStyles from 'wmsGlobalStyle';

import { Header, Content } from 'components/Page';
import { DataSet, Select, Tabs, Modal, TextField, NumberField, Lov } from 'choerodon-ui/pro';
import { yesOrNoRender } from 'utils/renderer';
import { Button } from 'components/Permission';
// 简单table 优点：提高页面切换流畅性，缺点：没有强大的ds功能
import Table from 'components/Table';
import QueryForm from 'comComponents/QueryForm';
import intl from 'utils/intl';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import {
  taskTableDs,
  taskTableShowDs,
  formQueryDs,
  serialDetailModalDs,
} from '@/stores/TaskListDS';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
// import WithCustomize from 'hzero-front-hcuz/lib/components/c7n/withCustomize';
// import CustButton from 'hzero-front-hcuz/lib/components/c7n/custBox/CustButton';

import { WMS_INV } from 'wmsUtils/config';
import ShowTable from './ShowTable';

const ModalKey = Modal.key();

const currentTenantID = getCurrentOrganizationId();
const { Option } = Select;
const { TabPane } = Tabs;

const tabObj = {
  '1': 'tableDs',
  '2': 'taskTableShowDs',
};

const opentionList = [
  { key: 'HIGH', value: intl.get('hzero.common.message.high').d('高') },
  { key: 'MEDIUM', value: intl.get('hzero.common.message.middle').d('中') },
  { key: 'LOW', value: intl.get('hzero.common.message.low').d('低') },
];

@formatterCollections({
  code: ['winv.task', 'winv.common'],
})
// @WithCustomize({
//   unitCode: ['HWMS_INV_TASK.SEARCH_FORM', 'HWMS_INV_TASK.FILTER', 'HWMS_INV_TASK.HEAD_TABLE'],
// })
@connect(({ global }) => ({
  warehousePermission: global.warehousePermission,
}))
export default class BatchList extends Component {
  constructor(props) {
    super(props);
    const { warehousePermission: { orgList = [], warehouseList = [] } = {} } = this.props;
    this.state = {
      activeKey: '1', // 默认第一个
      selectValue: '',
      orgIds: (orgList && orgList.map((org) => org.orgId).join(',')) || [],
      warehouseIds:
        (warehouseList && warehouseList.map((warehouse) => warehouse.warehouseId).join(',')) || [],
    };
    const { orgIds, warehouseIds } = this.state;
    const defaultOrg =
      orgList.length === 1
        ? {
            orgId: orgList[0].orgId,
            orgName: orgList[0].orgName,
            orgCode: orgList[0].orgCode,
          }
        : null;
    const defaultHouse =
      warehouseList.length === 1
        ? {
            warehouseId: warehouseList[0].warehouseId,
            warehouseName: warehouseList[0].warehouseName,
            warehouseCode: warehouseList[0].warehouseCode,
          }
        : null;
    this.formQueryDs = new DataSet({
      ...formQueryDs(orgIds, warehouseIds, defaultOrg, defaultHouse),
    });
    this.tableDs = new DataSet({ ...taskTableDs() });
    this.taskTableShowDs = new DataSet({ ...taskTableShowDs() });
    this.tableDs.queryDataSet = this.formQueryDs;
    this.taskTableShowDs.queryDataSet = this.formQueryDs;
    // this.defaultValue = {defaultOrg, defaultOwner, defaultHouse};
    this.tableDs.queryDataSet.getField('orgNameLov').set('lovPara', { idStr: orgIds });
    this.tableDs.queryDataSet.getField('orgNameLov').set('defaultValue', defaultOrg);
    this.tableDs.queryDataSet
      .getField('warehouseCodeToLov')
      .set('lovPara', { idStr: warehouseIds });
    this.tableDs.queryDataSet.getField('warehouseCodeToLov').set('defaultValue', defaultHouse);
    this.tableDs.queryDataSet
      .getField('warehouseCodeFromLov')
      .set('lovPara', { idStr: warehouseIds });
    this.tableDs.queryDataSet.getField('warehouseCodeFromLov').set('defaultValue', defaultHouse);
    this.tableDs.create();
  }

  componentDidMount() {
    this.initRefreshPage();
    this.formQueryDs.addEventListener('update', this.handleKeyEvent);
  }

  componentWillUnmount() {
    this.formQueryDs.removeEventListener('update', this.handleKeyEvent);
  }

  @Bind()
  handleKeyEvent() {
    if (event.keyCode === 13) {
      this.initRefreshPage();
    }
  }

  @Bind()
  initRefreshPage() {
    this.tableDs.query();
    this.taskTableShowDs.query();
  }

  /**
   * 刷新页面
   */
  @Bind()
  refreshPage() {
    this.tableDs.query();
  }

  // 导出
  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const { activeKey } = this.state;
    const queryData = this[tabObj[activeKey]].queryDataSet.toData()[0];
    for (const item in queryData) {
      if (!queryData[item]) {
        delete queryData[item];
      }
    }
    const billIdList =
      activeKey === '1'
        ? this[tabObj[activeKey]].currentSelected.map((item) => item.get('id'))
        : '';
    return {
      billIdList,
      ...queryData,
    };
  }

  @Bind()
  handleChange(value) {
    this.setState({
      selectValue: value,
    });
  }

  @Bind()
  async handleSave(flag) {
    const { selectValue } = this.state;
    try {
      if (this.tableDs.selected.length === 0) {
        notification.warning({
          message: intl.get('winv.task.check.data.chose.priority').d('请先勾选数据,然后选择优先级'),
        });
        return;
      }
      const currentRecorodList = this.tableDs.currentSelected;
      currentRecorodList.forEach((record) => {
        record.set('taskPriority', selectValue);
        record.set('taskPriorityName', opentionList.find((item) => item.key === selectValue).value);
      });
      this.tableDs._flag = flag;
      const validateValue = await this.tableDs.submit(true, false);
      if (!validateValue) {
        return false;
      }
    } catch {
      return false;
    }
    this.refreshPage();
  }

  @Bind()
  async handleSend(flag) {
    try {
      if (this.tableDs.selected.length === 0) {
        notification.warning({
          message: intl.get('winv.common.message.please.select.data.first').d('请先勾选数据'),
        });
        return;
      }
      this.tableDs._flag = flag;
      const validateValue = await this.tableDs.submit(true, false);
      if (!validateValue) {
        return false;
      }
    } catch {
      return false;
    }
    this.refreshPage();
  }

  async handleSendTotal(flag) {
    try {
      if (this.taskTableShowDs.selected.length === 0) {
        notification.warning({
          message: intl.get('winv.common.message.please.select.data.first').d('请先勾选数据'),
        });
        return;
      }
      this.taskTableShowDs._flag = flag;
      const validateValue = await this.taskTableShowDs.submit(true, false);
      if (!validateValue) {
        return false;
      }
    } catch {
      return false;
    }
    this.refreshPage();
  }

  @Bind()
  handleCallBack(key) {
    this.setState({
      activeKey: key,
    });
  }

  get tableColumns() {
    return [
      { name: 'attribute15', align: 'left', lock: 'left', width: 120 },
      { name: 'taskCode', width: 160, lock: 'left', align: 'left' },
      { name: 'detailLineNum', width: 160, align: 'left' },
      { name: 'sourceTypeName', width: 120, align: 'left' },
      { name: 'taskTypeName', width: 120, align: 'left' },
      { name: 'billCode', width: 160, align: 'left' },
      { name: 'groupCode', width: 100, align: 'left' },
      { name: 'statusName', width: 100, align: 'left' },
      { name: 'taskPriorityName', width: 100, align: 'left' },
      { name: 'ownerName', width: 100, align: 'left' },
      { name: 'orgName', width: 160, align: 'left' },
      { name: 'customerName', width: 100, align: 'left' },
      { name: 'vendorName', width: 100, align: 'left' },
      { name: 'modeOfCarriage', width: 100, align: 'left' },
      { name: 'warehouseName', width: 100, align: 'left' },
      { name: 'whareaCode', width: 100, align: 'left' },
      { name: 'locationCode', width: 120, align: 'left' },
      { name: 'cidCode', width: 100, align: 'left' },
      { name: 'loadCidCode', width: 100, align: 'left' },
      { name: 'toOwnerName', width: 100, align: 'left' },
      { name: 'toWhareaCode', width: 100, align: 'left' },
      { name: 'toLocationCode', width: 100, align: 'left' },
      { name: 'toCidCode', width: 100, align: 'left' },
      { name: 'sku', width: 100, align: 'left' },
      { name: 'goodsName', width: 150, align: 'left' },
      { name: 'uomName', width: 100, align: 'left' },
      { name: 'batchCode', width: 140, align: 'left' },
      {
        name: 'serialNumber',
        align: 'left',
        width: 160,
        renderer: ({ record }) => {
          const serialType = record.get('serialType');
          if (
            serialType === 'INV_CTRL' ||
            serialType === 'OUT_CTRL' ||
            serialType === 'SEMI_INV_CTRL'
          ) {
            return (
              <a
                onClick={() => {
                  this.handleGoSerialDetail(record);
                }}
              >
                {intl.get('hzero.warehouse.button.serialDetail').d('序列号明细')}
              </a>
            );
          }
        },
      },
      { name: 'operateDate', width: 120, align: 'left' },
      { name: 'unloadBy', width: 140, align: 'left' },
      { name: 'unloadDate', width: 140, align: 'left' },
      { name: 'billType', width: 120, align: 'left' },
      { name: 'creationDate', width: 160, align: 'left' },
      { name: 'functionCodeName', width: 120, align: 'left' },
      { name: 'deviceCode', width: 100, align: 'left' },
      { name: 'remark', align: 'left' },
      {
        name: 'attribute4',
        align: 'left',
        width: 120,
        editor: (record) => {
          return (
            <Lov
              name="attribute4"
              disabled={record.get('remark') === '1'}
              onChange={(res) => {
                if (res && res.id) {
                  record.set('attribute4', res.locationCode);
                  record.set('attribute3', res.whareaCode);
                  record.set('to', {
                    toLocationCode: res.locationCode,
                    toLocationId: res.locationId,
                    toWhareaId: res.whareaId,
                    toWhareaCode: res.whareaCode,
                    toWarehouseId: res.warehouseId,
                    toWarehouseCode: res.warehouseCode,
                  });
                } else {
                  record.set('attribute4', null);
                  record.set('attribute3', null);
                }
              }}
            />
          );
        },
      },
      { name: 'attribute3', align: 'left', width: 120 },
      {
        name: 'attribute6',
        align: 'left',
        width: 120,
        editor: (record) => {
          return (
            <NumberField
              name="attribute6"
              disabled={record.get('remark') === '1'}
              onBlur={() => this.check(record)}
            />
          );
        },
      },
      { name: 'qtyPlan', width: 80, lock: 'right', align: 'left' },
      { name: 'qtyScan', width: 100, lock: 'right', align: 'left' },
    ];
  }

  @Bind()
  check(record) {
    if (record.get('attribute6') > record.get('qtyScan')) {
      record.set('attribute6', null);
      notification.error({ message: '到货数量不可大于扫描数量' });
    }
  }

  @Bind()
  async handleGoSerialDetail(record) {
    this.modelDs = new DataSet(serialDetailModalDs);
    if (record.get('id')) {
      this.modelDs.setQueryParameter('taskId', record.get('id'));
      this.modelDs.setQueryParameter('billId', record.get('billId'));
      this.modelDs.setQueryParameter('detailId', record.get('detailId'));
      this.modelDs.setQueryParameter('sourceType', record.get('sourceType'));
      this.modelDs.setQueryParameter('status', record.get('status'));
    }
    await this.modelDs.query();
    Modal.open({
      ModalKey,
      destroyOnClose: true,
      closable: true,
      maskClosable: true,
      title: intl.get('winv.common.title.serialDetail').d('序列号明细'),
      children: (
        <Table
          dataSet={this.modelDs}
          queryBar="none"
          highLightRow={false}
          className={globalStyles['wms-personalized-styles']}
          columns={[
            { name: 'serialNumber' },
            { name: 'qualityStatusName', width: 120 },
            {
              name: 'personalizedFlag',
              width: 100,
              renderer: ({ value }) => {
                return yesOrNoRender(value);
              },
            },
          ]}
        />
      ),
      footer: null,
    });
  }

  render() {
    const { activeKey } = this.state;
    const { customizeForm, customizeTable } = this.props;
    const requestUrl =
      activeKey === '1'
        ? `${WMS_INV}/v1/${currentTenantID}/tasks/processListExport`
        : `${WMS_INV}/v1/${currentTenantID}/tasks/export`;
    return (
      <Fragment>
        <Header title={intl.get('winv.task.title.task.list').d('任务管理')}>
          {/* <CustButton
            unit={[
              { code: 'HWMS_INV_TASK.SEARCH_FORM' },
              { code: 'HWMS_INV_TASK.FILTER' },
              { code: 'HWMS_INV_TASK.HEAD_TABLE' },
            ]}
          /> */}
          <ExcelExport
            requestUrl={requestUrl}
            queryParams={this.getExportQueryParams}
            otherButtonProps={{ className: 'label-btn' }}
          />
          {activeKey === '1' ? (
            <>
              {/* <Button
                type="c7n-pro"
                color="primary"
                onClick={() => this.handleSend('process')}
                permissionList={[
                  {
                    code: `${this.props.match.path}/process`,
                    type: 'button',
                    meaning: '任务管理-处理',
                  },
                ]}
              >
                {intl.get('winv.task.button.process').d('处理')}
              </Button> */}
              <Button
                type="c7n-pro"
                color="primary"
                onClick={() => this.handleSend('send')}
                permissionList={[
                  {
                    code: `${this.props.match.path}/send`,
                    type: 'button',
                    meaning: '任务管理-发送',
                  },
                ]}
              >
                {intl.get('winv.task.button.send').d('发送')}
              </Button>
              <Button
                type="c7n-pro"
                color="primary"
                onClick={() => this.handleSave('priority')}
                permissionList={[
                  {
                    code: `${this.props.match.path}/priority`,
                    type: 'button',
                    meaning: '任务管理-修改优先级',
                  },
                ]}
              >
                {intl.get('winv.task.button.priority').d('修改优先级')}
              </Button>
              <Select
                placeholder={intl.get('winv.task.modify.priority').d('请选择优先级')}
                onChange={this.handleChange}
              >
                {opentionList.map((item) => (
                  <Option value={item.key} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </>
          ) : (
            <Button
              type="c7n-pro"
              color="primary"
              onClick={() => this.handleSendTotal('process')}
              permissionList={[
                {
                  code: `${this.props.match.path}/process`,
                  type: 'button',
                  meaning: '任务管理-处理',
                },
              ]}
            >
              {intl.get('winv.task.button.process').d('处理')}
            </Button>
          )}
        </Header>
        <Content>
          <QueryForm
            queryDs={this.formQueryDs}
            queryFieldsLimit={3}
            handleQuery={this.initRefreshPage}
            formCode="HWMS_INV_TASK.SEARCH_FORM"
            filterCode="HWMS_INV_TASK.FILTER"
            customizeForm={customizeForm}
          />
          <Tabs activeKey={activeKey} onChange={this.handleCallBack}>
            <TabPane tab={intl.get('winv.task.title.tab.disposal').d('待处理')} key="1">
              <AutoRestHeight topSelector=".c7n-pro-table" diff={100}>
                {/* {customizeTable(
                  {
                    code: 'HWMS_INV_TASK.HEAD_TABLE',
                  },
                  <Table
                    dataSet={this.tableDs}
                    queryBar="none"
                    highLightRow={false}
                    columns={this.tableColumns}
                    className={globalStyles['wms-personalized-styles']}
                  />
                )} */}
                <Table
                  dataSet={this.tableDs}
                  queryBar="none"
                  highLightRow={false}
                  columns={this.tableColumns}
                  className={globalStyles['wms-personalized-styles']}
                />
              </AutoRestHeight>
            </TabPane>
            <TabPane tab={intl.get('winv.task.title.tab.sumDelivery').d('汇总')} key="2">
              <ShowTable
                tableDs={this.taskTableShowDs}
                columns={this.tableColumns}
                // customizeTable={customizeTable}
              />
            </TabPane>
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}
