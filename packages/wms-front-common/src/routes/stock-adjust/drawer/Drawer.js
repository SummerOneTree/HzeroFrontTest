import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import { Bind } from 'lodash-decorators';
import { ModalContainer, Modal, Form, DataSet, Lov, TextField } from 'choerodon-ui/pro';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { HeadDs } from '@/stores/StockAdjustDS';

@formatterCollections({ code: ['winv.stockAdjust', 'winv.common'] })
@withRouter
@connect(({ global }) => ({
  warehousePermission: global.warehousePermission,
}))
export default class Drawer extends React.Component {
  constructor(props) {
    super(props);
    const {
      warehousePermission: { orgList = [], warehouseList = [], ownerList = [] } = {}, // 默认仓库权限
    } = this.props;
    this.state = {
      orgIds: (orgList && orgList.map((org) => org.orgId).join(',')) || [],
      ownerIds: (ownerList && ownerList.map((owner) => owner.ownerId).join(',')) || [],
      warehouseIds:
        (warehouseList && warehouseList.map((warehouse) => warehouse.warehouseId).join(',')) || [],
    };
    this.handleDefaultValue(this.HeadDs, orgList, warehouseList, ownerList);
  }

  handleDefaultValue = (ds, orgList, warehouseList, ownerList) => {
    const { orgIds, ownerIds, warehouseIds } = this.state;
    const defaultOrg =
      orgList.length === 1
        ? {
            orgId: orgList[0].orgId,
            orgName: orgList[0].orgName,
            orgCode: orgList[0].orgCode,
          }
        : null;
    const defaultOwner =
      ownerList.length === 1
        ? {
            ownerId: ownerList[0].ownerId,
            ownerName: ownerList[0].ownerName,
            ownerCode: ownerList[0].ownerCode,
          }
        : null;
    const defaultHouse =
      warehouseList.length === 1
        ? {
            warehouseId: warehouseList[0].warehouseId,
            warehouseName: warehouseList[0].warehouseName,
            warehouseCode: warehouseList[0].warehouseCode,
          }
        : null;
    this.HeadDs = new DataSet({
      ...HeadDs(orgIds, ownerIds, warehouseIds, defaultOrg, defaultOwner, defaultHouse),
    });
  };

  componentDidMount() {
    this.renderDrawer();
  }

  componentDidUpdate() {
    this.renderDrawer();
  }

  @Bind()
  async queryData() {
    const {
      currentRecord: { id },
    } = this.props;
    this.HeadDs.setQueryParameter('id', id);
    await this.HeadDs.query();
  }

  @Bind()
  async renderDrawer() {
    const { status, onCloseModal } = this.props;
    if (status === 'edit') {
      await this.queryData();
    }
    Modal.open({
      drawer: true,
      key: 'createStockCount',
      destroyOnClose: true,
      maskClosable: true,
      closable: true,
      title:
        status === 'edit'
          ? intl.get('winv.stockAdjust.title.edit.stockAdjust').d('编辑调整单头信息')
          : intl.get('winv.stockAdjust.title.create.stockAdjust').d('新建调整单头信息'),
      children: (
        <Form dataSet={this.HeadDs}>
          <TextField name="billCode" disabled />
          <TextField name="adjustType" disabled />
          <Lov name="countOrderList" />
          <Lov name="org" />
          <Lov name="warehouse" />
          <Lov name="owner" />
          <TextField name="adjustReason" />
          <TextField name="remark" />
        </Form>
      ),
      okText: intl.get('winv.common.button.save').d('保存'),
      onOk: this.handleCreate,
      onCancel: onCloseModal,
      onClose: onCloseModal,
    });
  }

  @Bind
  async handleCreate() {
    const { onRefreshPage, onCloseModal } = this.props;
    try {
      const validateValue = await this.HeadDs.submit();
      if (!validateValue) {
        return false;
      }
    } catch {
      return false;
    }
    onCloseModal();
    onRefreshPage();
  }

  render() {
    return (
      <React.Fragment>
        <ModalContainer location={location} />
      </React.Fragment>
    );
  }
}
