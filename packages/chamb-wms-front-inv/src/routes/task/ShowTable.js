import React, { Component } from 'react';
import { Table } from 'choerodon-ui/pro';

import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import globalStyles from 'wmsGlobalStyle';

export default class DeliveryShow extends Component {
  render() {
    const { tableDs, columns, customizeTable } = this.props;
    return (
      // <AutoRestHeight topSelector=".c7n-pro-table" diff={100}>
      //   {customizeTable(
      //     {
      //       code: 'HWMS_INV_TASK.HEAD_TABLE',
      //     },
      //     <Table
      //       dataSet={tableDs}
      //       queryBar="none"
      //       highLightRow={false}
      //       columns={columns}
      //       className={globalStyles['wms-personalized-styles']}
      //     />
      //   )}
      // </AutoRestHeight>
      <Table
        dataSet={tableDs}
        queryBar="none"
        highLightRow={false}
        columns={columns}
        className={globalStyles['wms-personalized-styles']}
      />
    );
  }
}
