const paths = require('hzero-webpack-scripts/config/paths');
const path = require('path');

module.exports = {
  '@common': path.resolve(paths.appRootPath, 'packages', 'wms-front-common/src'),
  'hzero-boot-customize-init-config': path.resolve(paths.appRootPath, 'src/global.ts'),
  '@/assets': path.resolve(
    paths.appRootPath,
    'src/assets'
  ),
  // '@': path.resolve(paths.appPath, 'src'),
  'hzero-front/lib/index': path.resolve(__dirname, 'emptyFile'),
  'hzero-front/lib/utils/getConvertRouter': 'hzero-boot/lib/utils/getConvertRouter',

  components: 'hzero-front/lib/components/',
  utils: 'hzero-front/lib/utils/',
  services: 'hzero-front/lib/services/',

};
