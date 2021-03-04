import React, { Component, Fragment } from 'react';
import { Table } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import globalStyles from 'wmsGlobalStyle';

@formatterCollections({ code: ['winv.stockAdjust', 'winv.common'] })
export default class stockAdjustLineShow extends Component {
  get tableColumns() {
    return [
      { name: 'lineNum', align: 'left', width: 60, lock: 'left' },
      { name: 'sourceBillCode', align: 'left', width: 140 },
      { name: 'sourceLineNum', align: 'left', width: 100 },
      { name: 'warehouseName', align: 'left', width: 100 },
      // { name: 'ownerName', align: 'left', width: 100 },
      { name: 'whareaCode', align: 'left', width: 100 },
      { name: 'locationCode', align: 'left', width: 100 },
      { name: 'cidCode', align: 'left', width: 100 },
      { name: 'sku', align: 'left', width: 120 },
      { name: 'goodsName', align: 'left', width: 140 },
      { name: 'uomName', align: 'left', width: 60 },
      { name: 'batchCode', align: 'left', width: 100 },
      { name: 'serialNumber', align: 'left', width: 100 },
      { name: 'remark', align: 'left', width: 160 },
      { name: 'snapshotQty', align: 'left', width: 80 },
      { name: 'countQty', align: 'left', width: 80 },
      { name: 'adjustQty', align: 'left', lock: 'right', width: 80 },
    ];
  }

  render() {
    const { adjustlineDS } = this.props;
    return (
      <Fragment>
        <AutoRestHeight topSelector=".c7n-pro-table" diff={50}>
          <Table
            dataSet={adjustlineDS}
            queryBar="none"
            highLightRow={false}
            columns={this.tableColumns}
            className={globalStyles['wms-personalized-styles']}
          />
        </AutoRestHeight>
      </Fragment>
    );
  }
}
