import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const routerConfig: RoutersConfig = [
  {
    path: '/chamb/winv/stockAdjust',
    components: [
      {
        key: '/chamb/winv/stockAdjust',
        path: '/chamb/winv/stockAdjust/list',
        component: () => import('../routes/stock-adjust/index'),
      },
      {
        key: '/chamb/winv/stockAdjust',
        path: '/chamb/winv/stockAdjust/create',
        component: () => import('../routes/stock-adjust/create'),
      },
      {
        key: '/chamb/winv/stockAdjust',
        path: '/chamb/winv/stockAdjust/detail',
        component: () => import('../routes/stock-adjust/detail'),
      },
    ],
  },
];

export default routerConfig;
