/**
 * vendor - 物料接收记录日志
 * @date: 2020-06-23
 * @author: yikang.dai <yikang.dai@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import { Bind } from 'lodash-decorators';
import { withRouter } from 'react-router-dom';
import { DataSet, Tooltip } from 'choerodon-ui/pro';
// 简单table 优点：提高页面切换流畅性，缺点：没有强大的ds功能
import Table from 'components/Table';
import ExcelExport from 'components/ExcelExport';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { inboundReceiptRecordLogDs } from '@/stores/InboundReceiptRecordLogDS';
import { WMS_INV } from 'wmsUtils/config';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import globalStyles from 'wmsGlobalStyle';

const currentTenantID = getCurrentOrganizationId();

@formatterCollections({
  code: ['winv.inboundReceiptRecordLog'],
})
@withRouter
@connect(({ global }) => ({ global }))
export default class inboundReceiptRecordLog extends Component {
  constructor(props) {
    super(props);
    const {
      global: { warehousePermission: { orgList = [], warehouseList = [], ownerList = [] } = {} },
    } = this.props;

    this.state = {
      orgIds: (orgList && orgList.map((org) => org.orgId).join(',')) || [],
      ownerIds: (ownerList && ownerList.map((owner) => owner.ownerId).join(',')) || [],
      warehouseIds:
        (warehouseList && warehouseList.map((warehouse) => warehouse.warehouseId).join(',')) || [],
    };

    const defaultOrgValue =
      orgList.length === 1
        ? {
            orgId: orgList[0].orgId,
            orgName: orgList[0].orgName,
          }
        : null;
    const defaultHouseValue =
      warehouseList.length === 1
        ? {
            warehouseId: warehouseList[0].warehouseId,
            warehouseName: warehouseList[0].warehouseName,
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

    this.tableDs = new DataSet({
      ...inboundReceiptRecordLogDs(
        this.state.orgIds,
        this.state.warehouseIds,
        this.state.ownerIds,
        defaultOrgValue,
        defaultHouseValue,
        defaultOwner
      ),
    });
  }

  componentDidMount() {
    this.refreshPage();
  }

  get tableColumns() {
    return [
      {
        name: 'createdByName',
        align: 'left',
        width: 100,
        renderer: ({ value, record }) => {
          return (
            <Tooltip
              placement="bottom"
              title={`${record.get('createdByName')}/${record.get('createdByLoginName')}`}
              arrowPointAtCenter
            >
              {value}
            </Tooltip>
          );
        },
      },
      { name: 'creationDate', align: 'left', width: 200 },
      { name: 'logTypeName', align: 'left', width: 100 },
      { name: 'receiptNumber', align: 'left', width: 180 },
      { name: 'lineNum', align: 'left', width: 75 },
      {
        name: 'warehouseCode',
        align: 'left',
        width: 160,
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
        name: 'ownerCode',
        align: 'left',
        width: 120,
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
      { name: 'sku', align: 'left', width: 120 },
      { name: 'goodsName', align: 'left', width: 180 },
      { name: 'uomName', align: 'left', width: 80 },
      { name: 'batchCode', align: 'left', width: 120 },
      {
        name: 'whareaCode',
        align: 'left',
        width: 120,
        renderer: ({ value, record }) => {
          return (
            <Tooltip
              placement="bottom"
              title={`${record.get('whareaCode')}/${record.get('whareaName')}`}
              arrowPointAtCenter
            >
              {value}
            </Tooltip>
          );
        },
      },
      { name: 'locationCode', align: 'left', width: 120 },
      { name: 'cidCode', align: 'left', width: 120 },
      { name: 'qty', align: 'left', width: 120 },
      { name: 'reason', align: 'left', width: 120 },
      { name: 'billCode', align: 'left', width: 160 },
      { name: 'billTypeName', align: 'left', width: 120 },
      { name: 'detailLineNum', align: 'left', width: 120 },
      { name: 'vendorName', align: 'left', width: 120 },
      { name: 'customerName', align: 'left', width: 120 },
      { name: 'sourceBillCode', align: 'left', width: 120 },
      { name: 'sourceLineNum', align: 'left', width: 120 },
      {
        name: 'orgCode',
        align: 'left',
        width: 180,
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
      { name: 'functionName', align: 'left', width: 120 },
      { name: 'deviceCode', align: 'left', width: 100 },
      { name: 'attribute1', align: 'left', width: 120 },
      { name: 'attribute2', align: 'left', width: 100 },
      { name: 'attribute3', align: 'left', width: 120 },
      { name: 'attribute4', align: 'left', width: 100 },
    ];
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
    const queryData = this.tableDs.queryDataSet.toData()[0];
    for (const item in queryData) {
      if (!queryData[item]) {
        delete queryData[item];
      }
    }
    return {
      ...queryData,
    };
  }

  render() {
    return (
      <Fragment>
        <Header
          title={intl.get('winv.inboundReceiptRecordLog.title.irrLog.list').d('物料接收日志记录')}
        >
          <ExcelExport
            requestUrl={`${WMS_INV}/v1/${currentTenantID}/inbound-receipt-record-logs/export`}
            queryParams={this.getExportQueryParams}
            otherButtonProps={{ className: 'label-btn' }}
          />
        </Header>
        <Content>
          <AutoRestHeight topSelector=".c7n-pro-table" diff={100}>
            <Table
              dataSet={this.tableDs}
              queryFieldsLimit={3}
              columns={this.tableColumns}
              className={globalStyles['wms-personalized-styles']}
            />
          </AutoRestHeight>
        </Content>
      </Fragment>
    );
  }
}
