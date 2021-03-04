import React, { Component } from 'react';
import { Form, TextField, Lov } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';

import styles from './hwms.module.less';

@formatterCollections({ code: ['winv.stockAdjust', 'winv.common'] })
export default class HeadFrom extends Component {
  render() {
    const { formDs } = this.props;
    return (
      <div className={styles.headerForm}>
        <Form dataSet={formDs} columns={4} disabled>
          <TextField name="billCode" disabled />
          <TextField name="sourceBillCode" disabled />
          <TextField name="dataSourceMeaning" />
          <Lov name="org" />
          <Lov name="owner" />
          <Lov name="warehouse" />
          <TextField name="adjustReason" />
        </Form>
      </div>
    );
  }
}
