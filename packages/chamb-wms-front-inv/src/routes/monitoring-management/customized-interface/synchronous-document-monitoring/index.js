import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { synchronousDocumentMonitoring } from '@/stores/customizedInterfaceDs';
import { Bind } from 'lodash-decorators';
import './index.less';

@connect((state) => ({
  state,
}))
class SynchronousDocumentMonitoring extends Component {
  constructor(props) {
    super(props);

    this.formDs = new DataSet({
      ...synchronousDocumentMonitoring(),
    });
    this.state = {
      heavyPushLoading: false,
    };
  }

  tableDs = new DataSet({
    paging: false,
    ...synchronousDocumentMonitoring(),
  });

  get tableColumns() {
    return [
      { name: 'orderCode', align: 'left', width: 150 },
      { name: 'billType', align: 'left', width: 150 },
      { name: 'sourceOrderCode', align: 'left', width: 150 },
      { name: 'orgCode', align: 'left', width: 150 },
      { name: 'userRealName', align: 'left', width: 80 },
      { name: 'vendorCode', align: 'left', width: 150 },
      { name: 'customerCode', align: 'left', width: 150 },
      { name: 'remark', align: 'left', width: 150 },
      { name: 'processStatus', align: 'left', width: 150 },
      { name: 'processMessage', align: 'left', width: 150 },
      { name: 'processDate', align: 'left' },
      { name: 'validateStatus', align: 'left' },
      { name: 'validateMessage', align: 'left' },
      { name: 'createdDate', align: 'left' },
    ];
  }

  render() {
    return (
      <>
        <Header
          title={intl
            .get('winv.inventoryTransfer.title.whareaTransfer.synchronousDocumentMonitoring')
            .d('EBS单据同步监控界面')}
        />
        <Content>
          <Table
            dataSet={this.tableDs}
            queryFieldsLimit={3}
            selectionMode="dblclick"
            highLightRow={false}
            columns={this.tableColumns}
          />
        </Content>
      </>
    );
  }
}

export default SynchronousDocumentMonitoring;
