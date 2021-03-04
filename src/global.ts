// 全局配置
import { overWriteConfig } from 'hzero-boot';
import { setLayout } from 'hzero-front/lib/customize/layout';
// import { getConfig } from 'choerodon-ui';
// import { AxiosStatic } from 'axios';
// import { extendsEnvConfig } from 'utils/iocUtils';

overWriteConfig({
  dvaAppInit: () => {
    // extendsEnvConfig({
    //     TODO_API: '/htodo',
    // });

    // const axios: AxiosStatic = getConfig('axios');
    // axios.interceptors.request.use(
    //   (config) => {
    //     return {
    //       ...config,
    //       headers: {
    //         ...config?.headers,
    //         get: {
    //           test: 'abcd',
    //           ...config?.headers?.get,
    //         },
    //       },
    //     };
    //   },
    //   (error) => {
    //     return Promise.reject(error);
    //   }
    // );

    // 全局配置
    //@ts-ignore
    setLayout('wearehouse-choose', async () => import('wms-front/lib/layouts/WearehouseChoose'));
    setLayout('wearehouse-choose-in', async () => import('wms-front/lib/layouts/WearehouseChoose'));
    setLayout('company-horizontal', async () =>
      import('wms-front-common/src/layouts/CustomLayout')
    );
    require('./global.module.less');
  },
});
