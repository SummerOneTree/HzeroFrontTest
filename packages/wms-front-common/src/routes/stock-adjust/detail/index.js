import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { DataSet } from 'choerodon-ui/pro';
import { Tabs } from 'choerodon-ui';
import qs from 'query-string';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';

import { stockAdjustHeadFormDs, stockAdjustLineShowDs } from '@/stores/StockAdjustDS';

import AdjustLineTableShow from './AdjustLineTableShow';
import HeadForm from '../HeadForm';

const { TabPane } = Tabs;

@formatterCollections({ code: ['winv.stockAdjust', 'winv.common'] })
export default class outboundDetail extends Component {
  formDs = new DataSet({
    ...stockAdjustHeadFormDs(),
  });

  adjustlineDS = new DataSet({ ...stockAdjustLineShowDs() });

  componentDidMount() {
    const { location: { search } = {} } = this.props;
    const { billId } = qs.parse(search);
    if (billId) {
      this.refreshPage(billId);
    }
  }

  @Bind()
  refreshPage(billId) {
    this.formDs.setQueryParameter('id', billId);
    this.adjustlineDS.setQueryParameter('billId', billId);

    this.formDs.query();
    this.adjustlineDS.query();
  }

  @Bind()
  getExportQueryLineDiff() {
    const queryData = this.adjustlineDS.queryParameter;
    return {
      ...queryData,
    };
  }

  render() {
    return (
      <Fragment>
        <Header
          backPath="/winv/stockAdjust/list"
          title={intl.get('winv.stockAdjust.title.stockAdjustDetail.list').d('调整单详情')}
        />
        <Content>
          <HeadForm disabled formDs={this.formDs} />
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={intl.get('winv.stockAdjust.title.stockAdjustLineDetail').d('调整明细')}
              key="1"
            >
              <AdjustLineTableShow adjustlineDS={this.adjustlineDS} formDs={this.formDs} />
            </TabPane>
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}
