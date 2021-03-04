import React from 'react';
import { withRouter } from 'react-router';
import { Bind } from 'lodash-decorators';
import { Modal, DataSet, Table } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import intl from 'utils/intl';
import globalStyles from 'wmsGlobalStyle';
import SerialModal from './serialModal';

@withRouter
@formatterCollections({ code: ['winv.inventoryTransfer', 'winv.common'] })
export default class transferDrawer extends React.Component {
  constructor(props) {
    super(props);
    const { modalDs } = props;
    this.modalDs = modalDs;
  }

  get tableColumns() {
    return [
      { name: 'locationName', align: 'left', width: 140 },
      { name: 'cidCode', align: 'left', width: 140 },
      { name: 'sku', align: 'left', width: 120 },
      { name: 'ownerName', align: 'left', width: 120 },
      { name: 'batchCode', align: 'left', width: 100 },
      { name: 'qty', align: 'left', width: 80 },
      { name: 'validQty', align: 'left', width: 80 },
      {
        header: intl.get('winv.inventoryTransfer.model.table.serialNumber').d('序列号'),
        name: 'action',
        width: 160,
        align: 'left',
        renderer: ({ record }) => {
          if (['INV_CTRL', 'SEMI_INV_CTRL'].includes(record.get('serialType'))) {
            return (
              <a
                onClick={() => {
                  this.openSerialModal(record);
                }}
              >
                {intl.get('winv.common.title.serialDetail').d('序列号明细')}
              </a>
            );
          }
        },
      },
    ];
  }

  @Bind()
  openSerialModal(record) {
    this.serialTableDs = new DataSet({
      selection: record.get('serialType') === 'SEMI_INV_CTRL' ? 'multiple' : false,
      paging: false,
      style: {
        width: '60%',
      },
      fields: [
        {
          name: 'serialNumber',
          label: intl.get('winv.inventoryTransfer.model.table.serialNumber').d('序列号'),
        },
        {
          name: 'qualityStatusName',
          label: intl.get('winv.inventoryTransfer.model.table.qualityStatus').d('质量状态'),
        },
      ],
    });

    this.serialTableDs.data = record.get('serialStockProcessDtoList') || [];
    (record.get('selectedIndex') || []).forEach((item) => {
      this.serialTableDs.select(item);
    });
    Modal.open({
      maskClosable: true,
      destroyOnClose: true,
      closable: true,
      title: intl.get('winv.common.title.serialDetail').d('序列号明细'),
      children: <SerialModal serialTableDs={this.serialTableDs} currentTrayRecord={record} />,
      footer: (cancelBtn) => <div>{cancelBtn}</div>,
      onOk: () => this.handleConfirmSerial(record, this.serialTableDs),
    });
  }

  @Bind()
  handleConfirmSerial(record, serialTableDs) {
    if (record.get('serialType') === 'SEMI_INV_CTRL') {
      const selectedRecords = serialTableDs.selected;
      if (selectedRecords.length !== record.get('validQty')) {
        notification.info({
          message: intl
            .get('winv.common.message.serialNumber.equal.valiQty')
            .d('出入库控制的物料所选序列号的数量必须等于可用量'),
        });
      }
      const selectedSerial = [];
      const selectedIds = [];
      const selectedIndex = [];
      selectedRecords.forEach((item) => {
        selectedIds.push(item.get('serialId'));
      });

      serialTableDs.toData().forEach((element, index) => {
        if (selectedIds.includes(element.serialId)) {
          selectedIndex.push(index);
          selectedSerial.push(element);
        }
      });
      record.set('selectedSerial', selectedSerial);
      record.set('selectedIndex', selectedIndex);
      record.set('transferQty', selectedSerial.length);
    }
  }

  render() {
    return (
      <Table
        dataSet={this.modalDs}
        highLightRow={false}
        queryBar="none"
        columns={this.tableColumns}
        className={globalStyles['wms-personalized-styles']}
      />
    );
  }
}
