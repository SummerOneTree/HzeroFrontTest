import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { backToMonitor } from '@/stores/customizedInterfaceDs';
import { Bind } from 'lodash-decorators';
import './index.less';

@connect((state) => ({
  state,
}))
class BackToMonitor extends Component {
  constructor(props) {
    super(props);

    this.formDs = new DataSet({
      ...backToMonitor(),
    });
    this.state = {
      spinProps: {},
    };
  }

  tableDs = new DataSet({
    paging: false,
    ...backToMonitor(),
  });

  get tableColumns() {
    return [
      { name: 'billCode', align: 'left', width: 150 },
      { name: 'billType', align: 'left', width: 150 },
      { name: 'sourceBillCode', align: 'left', width: 150 },
      { name: 'orgCode', align: 'left', width: 150 },
      { name: 'lineNum', align: 'left', width: 80 },
      { name: 'whareaCode', align: 'left', width: 150 },
      { name: 'transWhareaCode', align: 'left', width: 150 },
      { name: 'sku', align: 'left', width: 150 },
      { name: 'batchCode', align: 'left' },
      { name: 'uomCode', align: 'left' },
      { name: 'qty', align: 'left' },
      { name: 'logDate', align: 'left' },
      { name: 'reasonName', align: 'left' },
      { name: 'remark', align: 'left' },
      { name: 'createdUser', align: 'left' },
      { name: 'inspectResult', align: 'left' },
      { name: 'inspectQuantity', align: 'left', width: 150 },
      { name: 'attribute5', align: 'left' },
      { name: 'inspectDate', align: 'left' },
      { name: 'purposeDesc', align: 'left' },
      { name: 'feeRate', align: 'left' },
      { name: 'wmsStatus', align: 'left' },
      { name: 'wmsMessage', align: 'left', width: 150 },
      { name: 'ebsStatus', align: 'left' },
      { name: 'ebsMessage', align: 'left' },
      { name: 'creationDate', align: 'left' },
      { name: 'lastUpdateDate', align: 'left' },
      { name: 'lastUpdatedBy', align: 'left' },
      {
        header: intl.get('hzero.common.table.column.option').d('操作'),
        name: 'action',
        width: 100,
        align: 'left',
        lock: 'right',
        renderer: ({ record }) => {
          if (record.get('ebsStatus') === 'E') {
            return (
              <Fragment>
                <a
                  onClick={() => {
                    this.handleHeavyPush(record);
                  }}
                >
                  {intl.get('winv.inboundOrder.warrentLineShow.tabel.heavyPush').d('重推')}
                </a>
              </Fragment>
            );
          } else {
            return null;
          }
        },
      },
    ];
  }

  @Bind()
  async handleHeavyPush(record) {
    const { dispatch } = this.props;
    this.setState({ spinProps: { indicator: this.c7nIcon, size: 'large', spinning: true }, });
    dispatch({
      type: 'monitoringManagement/handleHeavyPush',
      payload: { syncGroupCode: record.get('syncGroupCode') },
    }).then((res) => {
      this.tableDs.query();
      this.setState({ spinProps: { spinning: false } });
    });
  }

  c7nIcon = (
    <span className="custom-spin-dot">
      <i />
      <i />
      <i />
      <i />
    </span>
  );

  render() {
    return (
      <>
        <Header
          title={intl
            .get('winv.inventoryTransfer.title.whareaTransfer.backToMonitor')
            .d('EBS回传监控界面')}
        />
        <Content>
          <Table
            spin={this.state.spinProps}
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

export default BackToMonitor;
