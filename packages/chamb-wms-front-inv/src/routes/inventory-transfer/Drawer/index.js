import React from 'react';
import { withRouter } from 'react-router';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { Table, DataSet, Modal } from 'choerodon-ui/pro';
import globalStyles from 'wmsGlobalStyle';
import ShowSerialNumberDetail from './ShowSerialNumberDetail';
import SerialNumberDetail from './SerialNumberDetail';

const keyModal = Modal.key();

@formatterCollections({ code: ['winv.inventoryTransfer', 'winv.common'] })
@withRouter
export default class dataTypeDrawer extends React.Component {
  get tableColumns() {
    return [
      { name: 'locationCode', align: 'left', width: 120 },
      { name: 'cidCode', align: 'left', width: 120 },
      { name: 'sku', align: 'left', width: 100 },
      { name: 'ownerName', align: 'left', minWidth: 120 },
      { name: 'batchCode', align: 'left', width: 120 },
      { name: 'uomName', align: 'left', width: 80 },
      { name: 'qty', align: 'left', width: 80 },
      { name: 'validQty', align: 'left', width: 80 },
      {
        header: intl.get('hzero.common.table.column.option').d('操作'),
        name: 'action',
        width: 100,
        align: 'left',
        lock: 'right',
        renderer: ({ record }) => {
          const serialType = record.get('serialType');
          if (serialType === 'INV_CTRL' || serialType === 'SEMI_INV_CTRL') {
            return (
              <a
                onClick={() => {
                  this.openSerialModal(record);
                }}
              >
                {intl.get('winv.common.title.serialDetail').d('序列号明细')}
              </a>
            );
          } else {
            return null;
          }
        },
      },
    ];
  }

  @Bind()
  async openSerialModal(record) {
    const serialType = record.get('serialType');

    // 初始化序列号明细界面的ds
    this.serialTableDs = new DataSet({
      selection: serialType === 'INV_CTRL' ? false : 'multiple',
      paging: false,
      fields: [
        {
          name: 'serialNumber',
          label: intl.get('winv.inboundOrder.model.detail.serialNumber').d('序列号'),
        },
        {
          name: 'qualityStatusName',
          label: intl.get('winv.inboundOrder.model.detail.qualityStatus').d('质量状态'),
        },
        {
          name: 'qty',
          label: intl.get('winv.inboundOrder.model.detail.qty').d('数量'),
          defaultValue: 1,
        },
      ],
    });
    const { modalDs } = this.props;
    if (serialType === 'INV_CTRL') {
      // 把录入所有的序列号存在allSerialNumber这个数组里面，后面用这个进行重复校验
      const allSerialNumber = [];
      const sundryGoodsList = modalDs.toData();
      sundryGoodsList.forEach((element) => {
        if (element.serialStockProcessDtoList) {
          element.serialStockProcessDtoList.forEach((item) => {
            allSerialNumber.push(item.serialNumber);
          });
        }
      });
      modalDs.allSerialNumber = allSerialNumber;

      // 把状态为删除的序列号丢弃，不展示在序列号明细界面
      let getSerialData;
      const removeSerialData = [];
      if (record.get('serialStockProcessDtoList')) {
        getSerialData = record.get('serialStockProcessDtoList').slice();
        getSerialData.forEach((item) => {
          if (item._status !== 'delete') {
            removeSerialData.push(item);
          }
        });
      }
      // 给序列号明细界面赋值
      this.serialTableDs.data = removeSerialData;
    } else if (serialType === 'SEMI_INV_CTRL') {
      const receivedData = record.get('serialStockProcessDtoList')
        ? record.get('serialStockProcessDtoList').slice()
        : [];
      const tableNoSelectList = record.get('_noSelectSerial')
        ? record.get('_noSelectSerial').slice()
        : [];

      // this.tableDs.select(receivedData);
      if (record.get('_noSelectSerial')) {
        record.get('_noSelectSerial').forEach((item) => {
          receivedData.push(item);
        });
      }
      this.serialTableDs.data = receivedData;
      if (tableNoSelectList && tableNoSelectList.length > 0) {
        record.get('_selectIndex').forEach((item) => {
          this.serialTableDs.select(item);
        });
      } else {
        this.serialTableDs.selectAll();
      }
    }

    Modal.open({
      drawer: true,
      maskClosable: true,
      keyModal,
      destroyOnClose: true,
      closable: true,
      style: {
        width: '80%',
      },
      title: intl.get('winv.inboundOrder.model.title.serailDetail').d('序列号明细'),
      children:
        serialType === 'INV_CTRL' ? (
          <ShowSerialNumberDetail
            currentRecord={record}
            formDs={this.formDs}
            transferDs={modalDs}
            tableDs={this.serialTableDs}
          />
        ) : (
          <SerialNumberDetail
            currentRecord={record}
            formDs={this.formDs}
            transferDs={modalDs}
            tableDs={this.serialTableDs}
          />
        ),
      afterClose: () => this.setSerialDataToTable(record, this.serialTableDs),
      footer: (cancelBtn) => (serialType === 'INV_CTRL' ? null : <div>{cancelBtn}</div>),
      okText: intl.get('hzero.common.button.ok').d('确定'),
    });
  }

  /**
   * 关闭序列号明细 将序列号数据回写到外层table中
   * @param {Object} record
   * @param {Object} serialTableDs
   */
  @Bind()
  setSerialDataToTable(record, serialTableDs) {
    const serialType = record.get('serialType');
    if (serialType === 'INV_CTRL') {
      const { modalDs } = this.props;
      const tableList = serialTableDs.toData();
      record.set('transferQty', tableList.length);
      record.set('serialStockProcessDtoList', tableList);
      const serialNumberList = modalDs.existedSerial || [];
      tableList.forEach((item) => {
        serialNumberList.push(item.serialNumber);
      });
      modalDs.existedSerial = serialNumberList;
    } else if (serialType === 'SEMI_INV_CTRL') {
      const tablelist = serialTableDs.toData();
      const tableSelectList = serialTableDs.selected;
      const tableListArr = [];
      const selectIds = [];
      const noSelectSerial = [];
      const selectIndex = [];
      tableSelectList.forEach((item) => {
        tableListArr.push(item.toData());
        selectIds.push(item.get('serialId'));
      });
      tablelist.forEach((element, index) => {
        if (!selectIds.includes(element.serialId)) {
          noSelectSerial.push(element);
        } else {
          selectIndex.push(index);
        }
      });
      record.set('receiveQty', tableSelectList.length);
      record.set('serialStockProcessDtoList', tableListArr);
      record.set('_noSelectSerial', noSelectSerial);
      record.set('_selectIndex', selectIndex);
      if (tableSelectList.length !== record.get('validQty')) {
        notification.info({
          message: intl
            .get('winv.common.message.serialNumber.equal.valiQty')
            .d('出入库控制的物料所选序列号的数量必须等于可用量'),
        });
      }
    }
  }

  render() {
    const { modalDs } = this.props;
    return (
      <React.Fragment>
        <Table
          dataSet={modalDs}
          highLightRow={false}
          queryBar="none"
          columns={this.tableColumns}
          className={globalStyles['wms-personalized-styles']}
        />
      </React.Fragment>
    );
  }
}
