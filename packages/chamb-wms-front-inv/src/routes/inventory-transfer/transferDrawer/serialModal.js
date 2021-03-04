import React, { Component } from 'react';
import { Table } from 'choerodon-ui/pro';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import globalStyles from 'wmsGlobalStyle';

export default class InSerialNumberDetail extends Component {
  constructor(props) {
    super(props);
    const { serialTableDs, currentTrayRecord } = this.props;
    this.serialTableDs = serialTableDs;
    this.state = {
      checkedData: (currentTrayRecord.get('selectedIndex') || []).length,
    };
  }

  componentDidMount() {
    this.serialTableDs.addEventListener('select', this.handleSelectChange);
    this.serialTableDs.addEventListener('unSelect', this.handleSelectChange);
    this.serialTableDs.addEventListener('selectAll', this.handleSelectChange);
    this.serialTableDs.addEventListener('unSelectAll', this.handleSelectChange);
  }

  @Bind()
  handleSelectChange() {
    const selectedRecords = this.serialTableDs.selected;
    this.setState({
      checkedData: selectedRecords.length,
    });
  }

  render() {
    const { currentTrayRecord } = this.props;
    const { checkedData } = this.state;
    return (
      <>
        {currentTrayRecord.get('serialType') === 'SEMI_INV_CTRL' && (
          <div style={{ margin: '10px 0' }}>
            {intl.get('winv.inventoryTransfer.serialDetail.selectedSerial').d('已录入序列号数')}:
            {checkedData}
          </div>
        )}
        <Table
          dataSet={this.serialTableDs}
          highLightRow={false}
          columns={[
            { name: 'serialNumber', align: 'left' },
            { name: 'qualityStatusName', align: 'left' },
          ]}
          className={globalStyles['wms-personalized-styles']}
        />
      </>
    );
  }
}
