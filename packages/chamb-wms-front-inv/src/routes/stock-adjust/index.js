/**
 * vendor - 调整单
 * @date: 2019-12-09
 * @author: david<yikang.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { withRouter } from 'react-router';
import { Divider, Tooltip } from 'choerodon-ui';
import { connect } from 'dva';
import { DataSet, Modal } from 'choerodon-ui/pro';
import { Button } from 'components/Permission';
// 简单table 优点：提高页面切换流畅性，缺点：没有强大的ds功能
import Table from 'components/Table';

import intl from 'utils/intl';
import withCacheDsQueryData from 'wmsUtils/withCacheDsQueryData';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { stockAdjustHeadDs } from 'wms-front-winv/lib/stores/StockAdjustDS';
import { getAdjustLock, releaseAdjustLock } from 'wms-front-winv/lib/services/adjustService';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import { WMS_INV } from 'wmsUtils/config';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId } from 'utils/utils';
import globalStyles from 'wmsGlobalStyle';
import { handleImportFile } from 'wmsUtils/common';
import { importStockAdjustDs } from '../../stores/ImportDS';

import Drawer from 'wms-front-winv/lib/routes/stock-adjust/drawer/Drawer';

const currentTenantID = getCurrentOrganizationId();

@withRouter
@connect(({ global }) => ({
  warehousePermission: global.warehousePermission,
  tabsData: global.tabs, // 获取当前页面的pageCode
  activeTabKey: global.activeTabKey, // 获取当前页面的pageCode
}))
@formatterCollections({ code: ['winv.stockAdjust', 'winv.common'] })
@connect(({ global, stockAdjust }) => ({
  stockAdjust,
  warehousePermission: global.warehousePermission,
  tabsData: global.tabs, // 获取当前页面的pageCode
  activeTabKey: global.activeTabKey, // 获取当前页面的pageCode
}))
@withCacheDsQueryData(
  () => {
    const tableDs = new DataSet({
      dataKey: 'content',
      autoQuery: false,
      ...stockAdjustHeadDs(),
    });
    return {
      tableDs,
    };
  },
  { cacheState: true }
)
export default class StockAdjust extends Component {
  constructor(props) {
    super(props);
    const {
      tableDs,
      warehousePermission: { orgList = [], warehouseList = [], ownerList = [] } = {}, // 默认仓库权限
    } = this.props;
    const { tabsData, activeTabKey } = this.props;
    const tabCode = tabsData.find((i) => i.key === activeTabKey);
    this.state = {
      pageCode: tabCode.title,
      key: '',
      modalVisible: false,
      status: '',
      currentRecord: '',
      orgIds: (orgList && orgList.map((org) => org.orgId).join(',')) || [],
      ownerIds: (ownerList && ownerList.map((owner) => owner.ownerId).join(',')) || [],
      warehouseIds:
        (warehouseList && warehouseList.map((warehouse) => warehouse.warehouseId).join(',')) || [],
    };
    this.handleDefaultValue(tableDs, orgList, warehouseList, ownerList);
  }

  importDs = new DataSet({ ...importStockAdjustDs() });

  handleDefaultValue = (tableDs, orgList, warehouseList, ownerList) => {
    const defaultOrg =
      orgList.length === 1
        ? {
            orgId: orgList[0].orgId,
            orgName: orgList[0].orgName,
            orgCode: orgList[0].orgCode,
          }
        : null;
    const defaultOwner =
      ownerList.length === 1
        ? {
            ownerId: ownerList[0].ownerId,
            ownerName: ownerList[0].ownerName,
            ownerCode: ownerList[0].ownerCode,
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

    tableDs.queryDataSet.getField('org').set('lovPara', { idStr: this.state.orgIds });
    tableDs.queryDataSet.getField('org').set('defaultValue', defaultOrg);
    tableDs.queryDataSet.getField('owner').set('lovPara', { idStr: this.state.ownerIds });
    tableDs.queryDataSet.getField('owner').set('defaultValue', defaultOwner);
    tableDs.queryDataSet.getField('warehouse').set('lovPara', { idStr: this.state.warehouseIds });
    tableDs.queryDataSet.getField('warehouse').set('defaultValue', defaultHouse);
  };

  componentDidMount() {
    const { tabsData, activeTabKey } = this.props;
    const tabCode = tabsData.find((i) => i.key === activeTabKey);
    // 当前界面code
    const { key, title } = tabCode;
    this.setState({
      key,
      pageCode: title,
    });
    this.refreshPage();
  }

  get tableColumns() {
    return [
      {
        name: 'billCode',
        width: 140,
        lock: 'left',
        align: 'left',
        renderer: ({ record, value }) => {
          return (
            <a
              onClick={() => {
                this.handleGoToDetail(record);
              }}
            >
              {value}
            </a>
          );
        },
      },
      {
        name: 'sourceBillCode',
        align: 'left',
        width: 140,
      },
      {
        name: 'billStatusMeaning',
        align: 'left',
        width: 100,
      },
      {
        name: 'dataSourceMeaning',
        align: 'left',
        width: 80,
      },
      {
        name: 'orgCode',
        align: 'left',
        width: 80,
        renderer: ({ value, record }) => {
          return (
            <Tooltip
              placement="bottom"
              title={`${record.get('orgCode')}/${record.get('orgName')}`}
              arrowPointAtCenter
            >
              {value}
            </Tooltip>
          );
        },
      },
      {
        name: 'ownerCode',
        align: 'left',
        width: 80,
        renderer: ({ value, record }) => {
          return (
            <Tooltip
              placement="bottom"
              title={`${record.get('ownerCode')}/${record.get('ownerName')}`}
              arrowPointAtCenter
            >
              {value}
            </Tooltip>
          );
        },
      },
      {
        name: 'warehouseCode',
        align: 'left',
        width: 80,
        renderer: ({ value, record }) => {
          return (
            <Tooltip
              placement="bottom"
              title={`${record.get('warehouseCode')}/${record.get('warehouseName')}`}
              arrowPointAtCenter
            >
              {value}
            </Tooltip>
          );
        },
      },
      {
        name: 'adjustReason',
        align: 'left',
        width: 200,
      },
      { name: 'createdByName', align: 'left', width: 80 },
      { name: 'creationDate', align: 'left', width: 140 },
      { name: 'lastUpdatedByName', align: 'left', width: 80 },
      { name: 'lastUpdateDate', align: 'left', width: 140 },
      { name: 'approvedByName', align: 'left', width: 80 },
      { name: 'approvedDate', align: 'left', width: 140 },
      { name: 'cancelledByName', align: 'left', width: 80 },
      { name: 'cancelledDate', align: 'left', width: 140 },
      { name: 'remark', align: 'left' },
      {
        header: intl.get('winv.common.table.column.option').d('操作'),
        name: 'action',
        width: 160,
        align: 'left',
        lock: 'right',
        renderer: ({ record }) => {
          if (record.get('billStatus') === 'INITIAL') {
            return (
              <Fragment>
                <a
                  onClick={() => {
                    this.handleGoToEdit(record);
                  }}
                >
                  {intl.get('winv.stockAdjust.button.deploy').d('配置')}
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    this.openModal('edit', record);
                  }}
                >
                  {intl.get('winv.common.button.edit').d('编辑')}
                </a>
              </Fragment>
            );
          } else {
            // return (
            //   <Fragment>
            //     <a
            //       onClick={() => {
            //         this.openModal('edit', record);
            //       }}
            //     >
            //       {intl.get('winv.common.button.edit').d('编辑')}
            //     </a>
            //   </Fragment>
            // );
          }
        },
      },
    ];
  }

  @Bind()
  openModal(status, record) {
    this.setState({
      modalVisible: true,
      status: status === 'edit' ? 'edit' : 'create',
      currentRecord: status === 'edit' ? record.data : '',
    });
  }

  @Bind()
  closeModal() {
    this.setState({
      modalVisible: false,
      status: '',
      currentRecord: '',
    });
  }

  /**
   * 刷新页面
   */
  @Bind()
  async refreshPage() {
    await this.props.tableDs.query();
    const { pageCode } = this.state;
    this.props.tableDs.forEach((record) => {
      record.set('pageCode', pageCode);
    });
  }

  @Bind()
  handleCreateOrder() {
    const { history } = this.props;
    const { key } = this.state;
    history.push(`${key}/create`);
  }

  @Bind()
  async handleCreateDetail(flag) {
    try {
      if (this.props.tableDs.selected.length === 0) {
        notification.warning({
          message: intl.get('winv.common.message.please.select.data.first').d('请先勾选数据'),
        });
        return;
      }
      this.props.tableDs._flag = flag;
      const validateValue = await this.props.tableDs.submit(true, false);
      if (!validateValue) {
        return false;
      } else {
        this.refreshPage();
      }
    } catch {
      return false;
    }
  }

  @Bind()
  async handleGoToEdit(record) {
    const { history } = this.props;
    const { key } = this.state;
    const id = record.get('id');
    const billId = record.get('id');
    const data = record.toData();

    const result = await getAdjustLock(data);
    const { message } = result || {};
    if (message !== undefined) {
      await releaseAdjustLock({
        id,
        billId,
      });
      notification.warning({
        message,
      });
    } else {
      history.push(`${key}/create?id=${id}&billId=${id}`);
    }
  }

  @Bind()
  openCancelModal() {
    Modal.open({
      maskClosable: true,
      key: 'delete',
      title: intl.get('winv.common.message.data.is.toVoid').d('是否要作废'),
      children: (
        <div>
          <p>
            {intl.get('winv.common.message.data.operation.toVoid').d('作废操作不可逆，是否作废')}
          </p>
        </div>
      ),
      closable: true,
      onOk: () => this.handleOperation('cancel'),
      onCancel: this.refreshPage,
    });
  }

  @Bind()
  openCompleteModal() {
    Modal.open({
      maskClosable: true,
      key: 'complete',
      title: intl.get('winv.common.message.data.is.end').d('是否执行调整'),
      children: (
        <div>
          <p>
            {intl
              .get('winv.common.message.data.implement.end')
              .d('执行调整操作不可逆，是否确认执行')}
          </p>
        </div>
      ),
      closable: true,
      onOk: () => this.handleOperation('complete'),
      onCancel: this.refreshPage,
    });
  }

  @Bind()
  async handleOperation(flag) {
    try {
      this.props.tableDs._flag = flag;
      await this.props.tableDs.submit(true, false);
    } catch {
      return false;
    }
    this.refreshPage();
  }

  @Bind()
  async handleApproveOrCancel(flag) {
    try {
      if (this.props.tableDs.selected.length === 0) {
        notification.warning({
          message: intl.get('winv.common.message.please.select.data.first').d('请先勾选数据'),
        });
        return;
      }
      if (flag === 'cancel') {
        await this.openCancelModal();
      } else if (flag === 'complete') {
        const currentRecord = this.props.tableDs.selected;
        const arr = currentRecord.map((item) => item.toData());
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].billStatus !== 'APPROVED') {
            notification.warning({
              message: intl
                .get('winv.stockAdjust.message.completeCheck')
                .d('非审核状态数据不允许执行调整'),
            });
            return;
          }
        }
        await this.openCompleteModal();
      } else {
        this.props.tableDs._flag = flag;
        const validateValue = await this.props.tableDs.submit(true, false);
        if (!validateValue) {
          return false;
        } else {
          this.refreshPage();
        }
      }
    } catch {
      return false;
    }
  }

  @Bind()
  handleGoToDetail(record) {
    const { history } = this.props;
    const { key } = this.state;
    const id = record.get('id');
    history.push(`${key}/detail?billId=${id}`);
  }

  /**
   * 获取导出字段查询参数
   */
  @Bind()
  getExportQueryParams() {
    const queryData = this.props.tableDs.queryDataSet.toData()[0];
    for (const item in queryData) {
      if (!queryData[item]) {
        delete queryData[item];
      }
    }
    const billIdList = this.props.tableDs.currentSelected.map((item) => item.get('id'));
    return {
      billIdList,
      ...queryData,
    };
  }

  @Bind()
  async handleImport() {
    await this.importDs.query();
    const args = this.importDs.toData();
    const name = intl.get('winv.stockAdjust.title.import').d('调整单导入');
    handleImportFile('WINV.ADJUST.ORDER', name, JSON.stringify(args[0]));
  }

  render() {
    const { modalVisible, status, currentRecord } = this.state;
    const drawerProps = {
      onCloseModal: this.closeModal,
      onRefreshPage: this.refreshPage,
      status,
      currentRecord,
    };
    return (
      <Fragment>
        <Header title={intl.get('winv.stockAdjust.title.stockAdjust.list').d('调整单')}>
          <Button
            type="c7n-pro"
            onClick={this.handleImport}
            icon="get_app"
            permissionList={[
              {
                code: `${this.props.match.path}/import`,
                type: 'button',
                meaning: '调整单-导入',
              },
            ]}
          >
            {intl.get('winv.common.button.import').d('导入')}
          </Button>
          <ExcelExport
            requestUrl={`${WMS_INV}/v1/${currentTenantID}/adjust-orders/export`}
            queryParams={this.getExportQueryParams}
            otherButtonProps={{ className: 'label-btn' }}
          />
          <Button
            type="c7n-pro"
            color="primary"
            onClick={() => this.handleApproveOrCancel('complete')}
            permissionList={[
              {
                code: `${this.props.match.path}/executeAdjust`,
                type: 'button',
                meaning: '调整单-执行调整',
              },
            ]}
          >
            {intl.get('winv.stockAdjust.button.executeAdjust').d('执行调整')}
          </Button>
          <Button
            type="c7n-pro"
            color="primary"
            onClick={() => this.handleApproveOrCancel('cancel')}
            permissionList={[
              {
                code: `${this.props.match.path}/cancel`,
                type: 'button',
                meaning: '调整单-作废',
              },
            ]}
          >
            {intl.get('winv.stockAdjust.button.cancel').d('作废')}
          </Button>
          <Button
            type="c7n-pro"
            color="primary"
            onClick={() => this.handleApproveOrCancel('approveCancel')}
            permissionList={[
              {
                code: `${this.props.match.path}/cancelApp`,
                type: 'button',
                meaning: '调整单-反审',
              },
            ]}
          >
            {intl.get('winv.stockAdjust.button.cancelApp').d('反审')}
          </Button>
          <Button
            type="c7n-pro"
            color="primary"
            onClick={() => this.handleApproveOrCancel('approve')}
            permissionList={[
              {
                code: `${this.props.match.path}/approve`,
                type: 'button',
                meaning: '调整单-审核',
              },
            ]}
          >
            {intl.get('winv.stockAdjust.button.approve').d('审核')}
          </Button>
          <Button
            type="c7n-pro"
            icon="add"
            color="primary"
            onClick={this.openModal}
            permissionList={[
              {
                code: `${this.props.match.path}/create`,
                type: 'button',
                meaning: '调整单-新建',
              },
            ]}
          >
            {intl.get('winv.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <AutoRestHeight topSelector=".c7n-pro-table" diff={90}>
            <Table
              dataSet={this.props.tableDs}
              queryFieldsLimit={3}
              columns={this.tableColumns}
              className={globalStyles['wms-personalized-styles']}
            />
          </AutoRestHeight>
          {modalVisible && <Drawer {...drawerProps} />}
        </Content>
      </Fragment>
    );
  }
}
