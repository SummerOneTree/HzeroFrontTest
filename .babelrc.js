const babelConfigFactory = require('hzero-boot/lib/babelConfigFactory');

const config = babelConfigFactory();
//注释5、6行修复子模块启动问题
// const { NODE_ENV } = process.env;
// console.log(process.env);


config.plugins.push([
  "module-resolver",
  {
    alias: {
      '@': './src',
      components: 'hzero-front/lib/components',
      utils: 'hzero-front/lib/utils',
      hcuz: 'hzero-front-hcuz/lib/components/c7n',
      services: 'hzero-front/lib/services',
      wmsUtils: 'wms-front/lib/utils',
      comComponents: 'wms-front/lib/components',
      wmsIcon: 'wms-front/lib/assets/icons',
      wmsGlobalStyle: 'wms-front/lib/hwms.module.less',
      wmsGlobalServices: 'wms-front/lib/services/warehouseChooseService'
    },
  },
])
// if(process.env.MULTIPLE_SKIN_ENABLE === 'true') {
  // const uedConfig = require('hzero-front/lib/utils/uedUtils');
  // config.plugins=([
  //   ...uedConfig.generateHzeroUIConfig(),
  //   ...uedConfig.generateC7nUiConfig(),
  //   ...config.plugins.filter(([_1,_2,pName]=[])=>!['ant', 'c7n', 'c7n-pro'].includes(pName)),
  // ]);
// }

module.exports = config;
