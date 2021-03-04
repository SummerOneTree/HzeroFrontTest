/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import {
  DataSet,
  Table,
  Form,
  Lov,
  TextField,
  DateTimePicker,
  Select,
  Modal,
  NumberField,
  DatePicker,
} from 'choerodon-ui/pro';
import { Button } from 'components/Permission';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import AutoRestHeight from 'wmsUtils/AutoRestHeight';
import {
  sundryFormDs,
  outSundryTableDs,
  inSundryTableDs,
  modalDs,
  batchModalDs,
} from '@/stores/InventoryTransferDS';
import {
  getQtyData,
  isCidController,
  unstacking,
  cidIsInOther,
  queryParam,
} from '@/services/inventoryTransferService';
import { checkBatchCode, queryParamsValue } from '@/services/warehouseService';
import globalStyles from 'wmsGlobalStyle';

// import WithCustomize from 'hzero-front-hcuz/lib/components/c7n/withCustomize';
// import CustButton from 'hzero-front-hcuz/lib/components/c7n/custBox/CustButton';

import Drawer from './Drawer';
import SerialNumberDetail from './SerialNumberDetail';
import InSerialNumberDetail from './SerialNumberDetail/InSerialNumberDetail';

const keyModal = Modal.key();

// @WithCustomize({
//   unitCode: ['WINV_INVENTORY_TRANSFER_SUN.TABLE'],
// })
@connect(({ global }) => ({
  global,
  tabsData: global.tabs,
  activeTabKey: global.activeTabKey,
}))
@formatterCollections({ code: ['winv.inventoryTransfer', 'winv.common'] })
@withRouter
export default class Sundry extends Component {
  constructor(props) {
    super(props);
    const {
      global: { warehousePermission: { orgList = [] } = {} },
    } = this.props;

    this.state = {
      inOrOut: '',
      // oneOrMore: 'ONE',
      toRefresh: false,
      orgIds: (orgList && orgList.map((org) => org.orgId).join(',')) || [],
    };

    const defaultOrgValue =
      orgList.length === 1
        ? {
            orgId: orgList[0].orgId,
            orgName: orgList[0].orgName,
            orgCode: orgList[0].orgCode,
          }
        : null;
    this.formDs = new DataSet({
      ...sundryFormDs(this.state.orgIds, defaultOrgValue),
    });
  }

  newRes = [];

  tableDs = new DataSet({
    paging: false,
    ...inSundryTableDs(),
  });

  componentDidMount() {
    this.handleReset();
  }

  addButton = (
    <Button
      type="c7n-pro"
      icon="add"
      onClick={this.handleAdd}
      key="add"
      permissionList={[
        {
          code: `${this.props.match.path}/createOne`,
          type: 'button',
          meaning: '库存杂项-新建',
        },
      ]}
    >
      {intl.get('hzero.common.button.create').d('新增')}
    </Button>
  );

  @Bind()
  handleChangeLineDs() {
    const record = this.formDs.get(0);
    if (record.get('sundryType') === 'IN') {
      this.tableDs = new DataSet({
        paging: false,
        ...inSundryTableDs(),
      });
      this.setState({
        inOrOut: 'IN',
      });
    } else {
      this.tableDs = new DataSet({
        paging: false,
        ...outSundryTableDs(),
      });
      this.setState({
        inOrOut: 'OUT',
      });
    }
  }

  @Bind()
  handleChangeLineLocation() {
    const formRecord = this.formDs.get(0);
    const record = this.tableDs.get(0);
    if (record) {
      record.set({
        locationLov: formRecord.get('locationLov'),
        reasonLov: formRecord.get('reasonLov'),
        remark: formRecord.get('remark'),
      });
    }
  }

  @Bind()
  async handleAdd() {
    const validateValue = await this.formDs.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('winv.common.message.data.validate').d('数据校验不通过!'),
      });
      return;
    }
    const validateLineValue = await this.tableDs.validate(false, false);
    if (!validateLineValue) {
      return false;
    }
    const formRecord = this.formDs.get(0);
    console.log(formRecord);
    const { tabsData, activeTabKey } = this.props;
    const tabCode = tabsData.find((i) => i.key === activeTabKey);
    // 当前界面code
    const pageCode = tabCode.title;
    const control = await queryParam(pageCode);
    const record = this.tableDs.create({
      orgId: formRecord.get('orgId'),
      orgCode: formRecord.get('orgCode'),
      orgName: formRecord.get('orgName'),
      locationLov: formRecord.get('locationLov'),
      reasonLov: formRecord.get('reasonLov'),
      remark: formRecord.get('remark'),
      transferQty: 0,
    });
    record.set('isAbleCreated', control.loadCreateBatchControl);
    this.tableDs.unshift(record);
  }

  @Bind()
  async handleSave() {
    try {
      this.newRes = [];
      const tableRecord = this.tableDs.toData();
      const record = this.formDs.get(0);
      const validateValue = await this.formDs.validate(false, false);
      const validateTableValue = await this.tableDs.validate(false, false);
      // const { oneOrMore } = this.state;
      const { tabsData, activeTabKey } = this.props;
      console.log(tableRecord);
      const tabCode = tabsData.find((i) => i.key === activeTabKey);
      // 当前界面code
      const pageCode = tabCode.title;
      record.set({
        pageCode,
      });
      if (!validateValue || !validateTableValue) {
        notification.error({
          message: intl.get('winv.common.message.data.validate').d('数据校验不通过!'),
        });
        return;
      }
      if (tableRecord.length === 0) {
        notification.error({
          message: intl.get('winv.common.message.confirm.create').d('请至少新增一条数据'),
        });
        return;
      }
      if (this.state.inOrOut === 'IN') {
        const inTableRecord = this.tableDs.get(0);
        const recordDate = inTableRecord.toData();
        const { cidCode, locationId } = recordDate;
        if (cidCode) {
          const data = {
            locationId,
            cidCodeTmp: cidCode,
          };
          const result = await cidIsInOther(data);
          if (result.failed) {
            notification.error({
              message: intl
                .get('winv.common.message.data.cid.error')
                .d('该托盘已经存在于其他库位上，不允许杂入!'),
            });
            return;
          }
        }
      }
      // if (oneOrMore === 'MORE') {
      //   const modalRecord = this.modalDs.toData();
      //   const _modalRecord = [];
      //   modalRecord.forEach((item) => {
      //     // eslint-disable-next-line no-param-reassign
      //     item.transferQty = item.validQty;
      //     _modalRecord.push(item);
      //   });
      // }
      const tableSubmitDataList = [];
      tableRecord.forEach((item) => {
        if (item && item.sku === 'xxx') {
          const modalRecord = this.modalDs.toData();
          modalRecord.forEach((element) => {
            const _element = element;
            _element.transferQty = _element.validQty;
            tableSubmitDataList.push(_element);
          });
        } else {
          tableSubmitDataList.push(item);
        }
      });
      record.set({
        transferLinesDtoList: tableSubmitDataList,
      });
      if (this.state.inOrOut === 'OUT') {
        const formData = this.formDs.toData();
        formData.forEach((element) => {
          element.transferLinesDtoList.forEach((item) => {
            if (
              item.serialType === 'SEMI_INV_CTRL' &&
              item.cidId &&
              item.validQty !== item.receiveQty
            ) {
              notification.info({
                message: intl
                  .get('winv.common.message.serialNumber.equal.valiQty')
                  .d('出入库控制的物料所选序列号的数量必须等于可用量'),
              });
              throw new Error();
            }
          });
        });
      }
      const res = await this.formDs.submit(false, false);
      const batchCodeObj = [];
      if (res.content && res.content.length > 0) {
        res.content.forEach((v) => {
          if (v.resId === 0) {
            this.newRes.push(v);
            batchCodeObj.push(v.batchCode);
          }
        });
        const newString = batchCodeObj.join(',');
        if (batchCodeObj.length > 0 && newString) {
          notification.error({
            message:
              newString + intl.get('winv.common.message.sundry.batch.null').d('批次不存在，请核查'),
          });
        }
      } else {
        this.newRes = [];
      }

      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
        throw new Error(res);
      } else if (res === undefined) {
        notification.info({
          message: intl.get('winv.common.message.data.noChange').d('当前没有修改数据，不需要保存'),
        });
        return;
      }
      // 保存数据成功清空页面数据
      this.handleReset();
      return res;
    } catch {
      return false;
    }
  }

  @Bind()
  checkTransferQty(record) {
    if (record.get('transferQty') === 0) {
      record.set('transferQty', null);
    }
  }

  @Bind()
  async handleReset() {
    if (this.newRes && this.newRes.length > 0 && this.state.inOrOut === 'IN') {
      this.newRes.forEach((v) => {
        // eslint-disable-next-line no-param-reassign
        v.batchLov = v.batchCode;
        // map return { ...v,batchLov: v.batchCode };
      });
      this.tableDs.data = this.newRes;
      this.newRes = [];
      this.tableDs.get(0).status = 'add';
      this.setState({
        toRefresh: true,
      });
      if (this.state.toRefresh) {
        console.log(1);
      }
    } else if (this.newRes.length === 0) {
      this.formDs.reset();
      this.tableDs.data = this.newRes;
      this.tableDs.reset();
      const record = this.formDs.get(0);
      const date = moment();
      record.set('processTime', date);
      const { tabsData, activeTabKey } = this.props;
      const tabCode = tabsData.find((i) => i.key === activeTabKey);
      // 当前界面code
      const pageCode = tabCode.title;
      this.result = await queryParamsValue({
        device: 'PC',
        functionCode: 'RECEIVE',
        pageCode,
        paramCode: 'CREATE_LOT',
      });
    } else {
      this.formDs.reset();
      this.tableDs.reset();
      this.tableDs.deleteAll();
      const record = this.formDs.get(0);
      const date = moment();
      record.set('processTime', date);
      const { tabsData, activeTabKey } = this.props;
      const tabCode = tabsData.find((i) => i.key === activeTabKey);
      // 当前界面code
      const pageCode = tabCode.title;
      this.result = await queryParamsValue({
        device: 'PC',
        functionCode: 'RECEIVE',
        pageCode,
        paramCode: 'CREATE_LOT',
      });
    }
  }

  get tableColumns() {
    const { inOrOut } = this.state;
    const TableColumnsArr = [
      { name: 'locationLov', align: 'left', width: 140, editor: true },
      { name: 'whareaName', align: 'left', width: 140 },
      { name: 'warehouseName', align: 'left', width: 140 },
      {
        name: 'cidCode',
        align: 'left',
        width: 120,
        editor: (record) => {
          if (record.get('goodsId') && inOrOut === 'OUT') {
            return false;
          } else if (inOrOut === 'OUT') {
            return <Lov name="cidCode" onBlur={(e) => this.handleQueryData(e, record)} />;
          } else {
            return <TextField name="cidCode" onBlur={(e) => this.handleQueryData(e, record)} />;
          }
        },
      },
      {
        name: 'goodsLov',
        align: 'left',
        width: 120,
        editor: (record) => {
          if (record.get('cidCode') && inOrOut === 'OUT') {
            return false;
          } else {
            return (
              <Lov name="goodsLov" onBlur={(e) => this.noCidQueryData(e, record, 'goodsLov')} />
            );
          }
        },
      },
      { name: 'ownerCode', align: 'left', width: 120 },
      {
        name: 'batchLov',
        align: 'left',
        width: 120,
        editor: (record) => {
          if (record.get('cidCode') && inOrOut === 'OUT') {
            return false;
          } else if (record.get('isbatch') === 1 && inOrOut === 'IN') {
            return (
              <TextField
                name="batchLov"
                onBlur={(e) => this.noCidQueryData(e, record, 'batchCode')}
              />
            );
          } else if (record.get('isbatch') === 1 && inOrOut === 'OUT') {
            return (
              <Lov name="batchLov" onBlur={(e) => this.noCidQueryData(e, record, 'batchCodeObj')} />
            );
          } else {
            return false;
          }
        },
      },
      { name: 'uomName', align: 'left', width: 80 },
      {
        name: 'transferQty',
        align: 'left',
        width: 80,
        editor: (record) => {
          const cidCode = record.get('cidCode');
          const serialType = record.get('serialType');
          if (
            (cidCode && inOrOut === 'OUT') ||
            serialType === 'INV_CTRL' ||
            serialType === 'SEMI_INV_CTRL'
          ) {
            return false;
          } else {
            return <NumberField name="transferQty" onBlur={() => this.checkTransferQty(record)} />;
          }
        },
      },
      { name: 'qty', align: 'left', width: 80 },
      { name: 'validQty', align: 'left', width: 80 },
      { name: 'reasonLov', align: 'left', width: 120, editor: true },
      { name: 'remark', align: 'left', editor: true },
      {
        header: intl.get('hzero.common.table.column.option').d('操作'),
        name: 'action',
        width: 100,
        align: 'left',
        lock: 'right',
        renderer: ({ record }) => {
          const cidCode = record.get('cidCode');
          const serialType = record.get('serialType');
          if (cidCode && inOrOut === 'OUT') {
            return (
              <a
                onClick={() => {
                  this.openModal(record);
                }}
              >
                {intl.get('hzero.common.button.cidDetail').d('托盘明细')}
              </a>
            );
          } else if (serialType === 'INV_CTRL' || serialType === 'SEMI_INV_CTRL') {
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
    return TableColumnsArr;
  }

  @Bind()
  async openSerialModal(record) {
    const validValue = await record.validate(true, true);
    if (!validValue) {
      notification.error({
        message: intl.get('winv.common.message.data.validate').d('数据校验不通过!'),
      });
      return;
    }
    const { inOrOut } = this.state;
    // 把录入所有的序列号存在allSerialNumber这个数组里面，后面用这个进行重复校验
    const allSerialNumber = [];
    const sundryGoodsList = this.tableDs.toData();
    sundryGoodsList.forEach((element) => {
      if (element.serialStockProcessDtoList) {
        element.serialStockProcessDtoList.forEach((item) => {
          allSerialNumber.push(item.serialNumber);
        });
      }
    });
    this.tableDs.allSerialNumber = allSerialNumber;

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

    // 初始化序列号明细界面的ds
    this.serialTableDs = new DataSet({
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

    // 给序列号明细界面赋值
    this.serialTableDs.data = removeSerialData;

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
        inOrOut === 'IN' ? (
          <InSerialNumberDetail
            status={status}
            currentRecord={record}
            formDs={this.formDs}
            transferDs={this.tableDs}
            tableDs={this.serialTableDs}
          />
        ) : (
          <SerialNumberDetail
            status={status}
            currentRecord={record}
            formDs={this.formDs}
            transferDs={this.tableDs}
            tableDs={this.serialTableDs}
          />
        ),
      afterClose: () => this.setSerialDataToTable(record, this.serialTableDs),
      footer: (cancelBtn) => <div>{cancelBtn}</div>,
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
    const tableList = serialTableDs.toData();
    record.set('transferQty', tableList.length);
    record.set('serialStockProcessDtoList', tableList);
    const serialNumberList = [];
    this.tableDs.toData().forEach((item) => {
      if (item.serialStockProcessDtoList) {
        for (const i of item.serialStockProcessDtoList) {
          serialNumberList.push(i.serialNumber);
        }
      }
    });
    this.tableDs.existedSerial = serialNumberList;
  }

  @Bind()
  async noCidQueryData(e, record, flag) {
    const recordDate = record.toData();
    const {
      locationId,
      whareaId,
      warehouseId,
      goodsId,
      ownerId,
      ownerCode,
      isbatch,
      batchLov,
      cidCode,
      orgId,
      orgCode,
      goodsName,
      sku,
      orgName,
      ownerName,
    } = recordDate;
    let result = {};
    if (flag === 'goodsLov' && isbatch === 0) {
      record.set('batchLov', null);
      result = await getQtyData({
        locationId,
        whareaId,
        warehouseId,
        goodsId,
        ownerId,
        cidCode,
      });
    } else if (flag === 'batchCode') {
      if (batchLov) {
        record.set('batchCode', batchLov);
        result = await getQtyData({
          locationId,
          whareaId,
          warehouseId,
          goodsId,
          ownerId,
          batchCode: batchLov,
          cidCode,
        });
      }

      const resultCheckBatch = await checkBatchCode({
        batchCode: batchLov,
        goodsId,
        orgId,
        ownerId,
        isAbleCreated: record.get('isAbleCreated'),
      });
      if (resultCheckBatch && resultCheckBatch.failed) {
        notification.error({
          message: resultCheckBatch.message,
        });
      } else if (resultCheckBatch.batchId) {
        record.set('batchId', resultCheckBatch.batchId);
      } else {
        if (this.result.paramValue === '0') {
          notification.error({
            message: intl.get('winv.common.message.data.nocreatlotnum').d('不允许新建批次!'),
          });
          record.set('batchCode', null);
          return;
        }
        this.batchModalDs = new DataSet({ ...batchModalDs() });
        this.batchModalDs.create({
          id: null,
          batchCode: batchLov,
          goodsId,
          goodsName,
          sku,
          orgId,
          orgCode,
          ownerId,
          ownerCode,
          orgName,
          ownerName,
        });
        this.handleOpenModule(record, this.batchModalDs);
      }
    } else if (flag === 'batchCodeObj') {
      if (batchLov) {
        const batch = batchLov.batchCode;
        result = await getQtyData({
          locationId,
          whareaId,
          warehouseId,
          goodsId,
          ownerId,
          sku,
          orgId,
          orgCode,
          ownerCode,
          cidCode,
          batchCode: batch,
        });
      }
    }
    if (result.qty) {
      record.set('qty', result.qty);
      record.set('validQty', result.validQty);
    } else {
      record.set('qty', 0);
      record.set('validQty', 0);
    }
  }

  @Bind()
  handleOpenModule(record, batchDs) {
    Modal.open({
      drawer: true,
      maskClosable: true,
      keyModal,
      destroyOnClose: true,
      closable: true,
      title: intl.get('winv.inventoryTransfer.model.title.addBatchCode').d('新建批次档案'),
      children: (
        <Form dataSet={batchDs}>
          <TextField name="batchCode" disabled />
          <TextField name="orgName" disabled />
          <TextField name="ownerName" disabled />
          <TextField name="goodsName" disabled />
          <Lov name="vendorLov" />
          <TextField name="vendorBatch" />
          <Select name="batchStatus" />
          <DatePicker name="produceDate" />
          <DatePicker name="expireDate" />
          <DatePicker name="nextCheckDate" />
          <TextField name="remark" />
        </Form>
      ),
      okText: intl.get('hzero.common.button.save').d('保存'),
      onOk: () => this.handleCreateBatchCode(record, batchDs),
    });
  }

  @Bind()
  async handleCreateBatchCode(record, batchDs) {
    try {
      const res = await batchDs.submit(false, false);
      if (res && res.failed && res.message) {
        notification.error({
          message: res.message,
        });
        throw new Error(res);
      } else if (res && res.content) {
        const data = res.content[0];
        record.set('batchId', data.batchId);
      }
    } catch {
      return false;
    }
  }

  @Bind()
  async handleQueryData(e, record) {
    const recordDate = record.toData();
    const { locationId, whareaId, warehouseId, cidId } = recordDate;
    if (!cidId) {
      return;
    }
    if (this.state.inOrOut === 'OUT') {
      this.modalDs = new DataSet({ ...modalDs() });
      this.modalDs.setQueryParameter('locationId', locationId);
      this.modalDs.setQueryParameter('whareaId', whareaId);
      this.modalDs.setQueryParameter('warehouseId', warehouseId);
      this.modalDs.setQueryParameter('cidId', cidId);
      await this.modalDs.query();
      const cidDataArr = this.modalDs.toData();
      const tableRecord = this.tableDs.get(0);
      if (cidDataArr.length >= 1) {
        let totalQty = 0;
        let totalValidQty = 0;
        cidDataArr.forEach((element) => {
          totalQty += element.qty;
          totalValidQty += element.validQty;
        });
        tableRecord.set('qty', totalQty);
        tableRecord.set('validQty', totalValidQty);
        tableRecord.set('transferQty', totalValidQty);
        tableRecord.set('goodsLov', { sku: 'xxx' });
        tableRecord.set('uomName', 'xxx');
        tableRecord.set('ownerCode', 'xxx');
        tableRecord.set('batchLov', { batchCode: 'xxx' });
        // this.setState({
        //   oneOrMore: 'MORE',
        // });
      } else if (cidDataArr.length === 1) {
        const {
          qty,
          validQty,
          batchCode,
          uomName,
          goodsId,
          sku,
          goodsName,
          ownerId,
          ownerCode,
          batchId,
        } = cidDataArr[0];
        const goodsObj = { goodsId, sku, goodsName };
        const batchObj = { batchCode, batchId };
        tableRecord.set('qty', qty);
        tableRecord.set('validQty', validQty);
        tableRecord.set('transferQty', validQty);
        tableRecord.set('batchLov', batchObj);
        tableRecord.set('uomName', uomName);
        tableRecord.set('goodsLov', goodsObj);
        tableRecord.set('ownerCode', ownerCode);
        tableRecord.set('ownerId', ownerId);
        tableRecord.set('ownerCode', ownerCode);
        // this.setState({
        //   oneOrMore: 'ONE',
        // });
      }
    } else {
      const result = await isCidController(locationId);
      const { containerManageFlag } = result.content[0];
      if (containerManageFlag === 0) {
        this.openActionModal();
      }
    }
  }

  @Bind()
  openActionModal() {
    Modal.open({
      maskClosable: true,
      key: 'unstacking',
      title: intl.get('hzero.common.modal.title.unstacking').d('是否进行撤销码垛操作'),
      children: (
        <div>
          <p>
            {intl
              .get('winv.common.message.data.operation.unstacking')
              .d('库位未启用托盘管理，系统将自动撤销码垛，是否继续')}
          </p>
        </div>
      ),
      closable: true,
      onOk: this.handleUnstacking,
    });
  }

  @Bind()
  async handleUnstacking() {
    const record = this.tableDs.get(0);
    const cidCode = record.get('cidCode');
    const result = await unstacking(cidCode);
    if (result.failed) {
      notification.error(result.message);
    } else if (!result.failed) {
      notification.success({
        message: intl.get('winv.inventoryTransfer.message.optionSuccess').d('操作成功'),
      });
    }
  }

  @Bind()
  openModal(record) {
    const currentRecord = record.toData();
    Modal.open({
      drawer: true,
      maskClosable: true,
      key: 'cidOutDetailModel',
      destroyOnClose: true,
      closable: true,
      style: {
        width: '80%',
      },
      title: intl.get('winv.inventoryTransfer.title.cidDetail').d('托盘明细'),
      children: <Drawer modalDs={this.modalDs} currentRecord={currentRecord} />,
      footer: null,
    });
  }

  render() {
    const buttons = [this.addButton, 'remove'];
    // const { inOrOut } = this.state;
    const { customizeTable } = this.props;
    // const tableCode =
    //   inOrOut === 'IN'
    //     ? 'WINV_INVENTORY_TRANSFER_SUN.SUNDRY_INTABLE'
    //     : 'WINV_INVENTORY_TRANSFER_SUN.SUNDRY_OUTTABLE';
    // const unitCodeList = [
    //   {
    //     code: tableCode,
    //   },
    // ];
    return (
      <>
        <Header title={intl.get('winv.inventoryTransfer.title.sundry.list').d('库存杂项')}>
          {/* <CustButton
            unit={[
              {
                code: 'WINV_INVENTORY_TRANSFER_SUN.TABLE',
              },
            ]}
          /> */}
          <Button
            type="c7n-pro"
            color="primary"
            onClick={this.handleReset}
            permissionList={[
              {
                code: `${this.props.match.path}/reset`,
                type: 'button',
                meaning: '库存杂项-重置',
              },
            ]}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
          <Button
            type="c7n-pro"
            color="primary"
            onClick={this.handleSave}
            permissionList={[
              {
                code: `${this.props.match.path}/save`,
                type: 'button',
                meaning: '库存杂项-保存',
              },
            ]}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <Form dataSet={this.formDs} columns={3}>
            <Select name="sundryType" onChange={this.handleChangeLineDs} />
            <Lov name="orgLov" />
            <Lov name="locationLov" onChange={this.handleChangeLineLocation} />
            <DateTimePicker name="processTime" />
            <Lov name="reasonLov" onChange={this.handleChangeLineLocation} />
            <TextField name="remark" onChange={this.handleChangeLineLocation} />
          </Form>
          <AutoRestHeight topSelector=".c7n-pro-table" diff={30}>
            {/* {customizeTable(
              {
                code: 'WINV_INVENTORY_TRANSFER_SUN.TABLE',
              },
              <Table
                buttons={buttons}
                dataSet={this.tableDs}
                highLightRow={false}
                queryBar="none"
                columns={this.tableColumns}
                className={globalStyles['wms-personalized-styles']}
              />
            )} */}
            <Table
              buttons={buttons}
              dataSet={this.tableDs}
              highLightRow={false}
              queryBar="none"
              columns={this.tableColumns}
              className={globalStyles['wms-personalized-styles']}
            />
          </AutoRestHeight>
        </Content>
      </>
    );
  }
}
