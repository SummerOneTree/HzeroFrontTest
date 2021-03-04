/**
 * vendor - 序列号明细
 * @date: 2020-02-20
 * @author: sundae<haiqiang.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Table, Spin, Form, TextField, DataSet } from 'choerodon-ui/pro';
// import { Table } from 'choerodon-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import { Content } from 'components/Page';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import globalStyles from 'wmsGlobalStyle';
import { serialDetailFormDs } from '@/stores/InboundOrderDS';

@formatterCollections({
  code: ['winv.common', 'winv.inboundOrder'],
})
export default class ReceivedSerialDetail extends Component {
  constructor(props) {
    super(props);
    const { tableDs } = props;
    this.tableDs = tableDs;
    this.formDs = new DataSet({ ...serialDetailFormDs() });
    this.state = {
      addLoading: false,
    };
    const serialLength = this.tableDs.currentSelected.length;
    this.formDs.get(0).set('serialLength', serialLength);
  }

  componentDidMount() {
    this.tableDs.addEventListener('select', this.handleSelectChange);
    this.tableDs.addEventListener('unSelect', this.handleSelectChange);
  }

  componentWillUnmount() {
    this.tableDs.removeEventListener('select', this.handleSelectChange);
    this.tableDs.removeEventListener('unSelect', this.handleSelectChange);
  }

  get tableColumns() {
    return [
      { name: 'serialNumber', align: 'left' },
      { name: 'qualityStatusName', align: 'left', width: 180 },
      { name: 'qty', align: 'left', width: 180 },
    ];
  }

  @Bind()
  handleSelectChange() {
    const serialLength = this.tableDs.currentSelected.length;
    this.formDs.get(0).set('serialLength', serialLength);
  }

  render() {
    const { addLoading } = this.state;
    return (
      <Fragment>
        <Content>
          <Spin spinning={addLoading}>
            <Form dataSet={this.formDs} columns={3}>
              <TextField disabled name="serialLength" />
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
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
