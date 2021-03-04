import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { DataSet } from 'choerodon-ui/pro';
import { Button } from 'components/Permission';

import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import queryString from 'query-string';

import { Header, Content } from 'components/Page';
import { releaseAdjustLock } from '@/services/adjustService';
import { stockAdjustHeadFormDs, stockAdjustLineDs } from '@/stores/StockAdjustDS';

import LineTable from '../line/LineTable';
import HeadForm from '../HeadForm';

@formatterCollections({
  code: ['winv.stockAdjust', 'winv.common'],
})
export default class CreateStockAdjust extends Component {
  lineTableDs = new DataSet({ ...stockAdjustLineDs() });

  formDs = new DataSet({
    ...stockAdjustHeadFormDs(),
    children: {
      adjustOrderLinesList: this.lineTableDs,
    },
  });

  componentDidMount() {
    const { location: { search } = {} } = this.props;
    const { id } = queryString.parse(search);
    const { billId } = queryString.parse(search);
    if (!id) {
      // 初始化
      this.formDs.create({
        creationDate: new Date(),
      });
    } else {
      this.refreshPage(id, billId);
    }
  }

  componentWillUnmount() {
    const { location: { search } = {} } = this.props;
    const { id, billId } = queryString.parse(search);
    // 页面销毁时解锁
    if (id) {
      releaseAdjustLock({
        id,
        billId,
      });
    }
  }

  @Bind()
  refreshPage(id, billId) {
    this.formDs.setQueryParameter('id', id);
    this.lineTableDs.queryParameter = {
      billId,
    };

    this.formDs.query();
  }

  @Bind()
  goBack() {
    const pathname = `/winv/stockAdjust/list`;
    this.props.history.push({
      pathname,
    });
  }

  @Bind()
  async handleSave() {
    try {
      const { location: { search } = {} } = this.props;
      const { id } = queryString.parse(search);
      const { billId } = queryString.parse(search);
      const validateValue = await this.lineTableDs.validate(false, false);
      if (!validateValue) {
        notification.error({
          message: intl.get('winv.common.message.data.validate').d('数据校验不通过!'),
        });
        return;
      }
      const res = await this.formDs.submit(false, false);
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
      releaseAdjustLock({
        id,
        billId,
      });
      // 保存数据成功跳到列表页
      this.goBack();
      return res;
    } catch {
      return false;
    }
  }

  render() {
    return (
      <Fragment>
        <Header
          backPath="/winv/stockAdjust/list"
          title={intl.get('winv.stockAdjust.title.edit.adjust').d('编辑调整单信息')}
        >
          <Button
            type="c7n-pro"
            color="primary"
            onClick={this.handleSave}
            permissionList={[
              {
                code: `${this.props.match.path}/save`,
                type: 'button',
                meaning: '编辑调整单信息-保存',
              },
            ]}
          >
            {intl.get('winv.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <HeadForm formDs={this.formDs} />
          <LineTable lineTableDs={this.lineTableDs} formDs={this.formDs} isEdit />
        </Content>
      </Fragment>
    );
  }
}
