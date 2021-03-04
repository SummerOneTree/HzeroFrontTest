import { RoutersConfig } from 'hzero-boot/lib/typings/IRouterConfig';

const routerConfig: RoutersConfig = [
  // 任务明细                     覆盖路由
  {
    path: '/winv/task',
    component: () => import('../routes/task/index'),
  },
  // 库存杂项                    覆盖路由
  {
    path: '/winv/inventoryTransfer/sundry',
    component: () => import('../routes/inventory-transfer/Sundry'),
  },
  // 物料接收记录日志
  {
    path: '/winv/inboundReceiptRecordLog',
    component: () => import('../routes/inbound-receipt-record-log/index'),
  },
  // 调整单                 覆盖路由
  {
    path: '/winv/stockAdjust',
    components: [
      {
        key: '/winv/stockAdjust',
        path: '/winv/stockAdjust/list',
        component: () => import('../routes/stock-adjust/index'),
      },
      {
        key: '/winv/stockAdjust',
        path: '/winv/stockAdjust/create',
        component: () => import('wms-front-winv/lib/routes/stock-adjust/create'),
      },
      {
        key: '/winv/stockAdjust',
        path: '/winv/stockAdjust/detail',
        component: () => import('wms-front-winv/lib/routes/stock-adjust/detail'),
      },
    ],
  },

  // EBS回传监控界面
  {
    path: '/winv/monitoringManagement/backToMonitor',
    models: [() => import('../models/monitoringManagement')],
    component: () =>
      import('../routes/monitoring-management/customized-interface/back-to-monitor/index'),
  },
  // EBS单据同步监控界面
  {
    path: '/winv/monitoringManagement/synchronousDocumentMonitoring',
    models: [() => import('../models/monitoringManagement')],
    component: () =>
      import(
        '../routes/monitoring-management/customized-interface/synchronous-document-monitoring/index'
      ),
  },
];

export default routerConfig;
