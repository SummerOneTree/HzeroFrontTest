/**
 * vendor - 序列号明细
 * @date: 2020-02-20
 * @author: sundae<haiqiang.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component, Fragment } from 'react';
import { DataSet, Table, Form, TextField } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { Content } from 'components/Page';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import { serialDetailFormDs } from '@/stores/InboundOrderDS';
import globalStyles from 'wmsGlobalStyle';

@formatterCollections({
  code: ['winv.common', 'winv.inboundOrder'],
})
export default class ShowSerialNumberDetail extends Component {
  constructor(props) {
    super(props);
    const { tableDs } = props;
    this.tableDs = tableDs;
    this.formDs = new DataSet({ ...serialDetailFormDs() });
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
    return (
      <Fragment>
        <Content>
          <Form dataSet={this.formDs} columns={3}>
            <TextField name="serialLength" />
          </Form>
          <AutoRestHeight topSelector=".c7n-pro-table" diff={100}>
            <Table
              dataSet={this.tableDs}
              queryBar="none"
              highLightRow={false}
              columns={[...this.tableColumns]}
              className={globalStyles['wms-personalized-styles']}
            />
          </AutoRestHeight>
        </Content>
      </Fragment>
    );
  }
}
