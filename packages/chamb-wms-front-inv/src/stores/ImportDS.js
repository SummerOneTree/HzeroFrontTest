import { getCurrentOrganizationId } from 'utils/utils';
import { WMS_INV } from 'wmsUtils/config';

const currentTenantID = getCurrentOrganizationId();

const importInboundDs = () => ({
  primaryKey: 'id',
  selection: false,
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-orders/import`,
        method: 'GET',
        params,
      };
    },
  },
});

const importInboundNoticeDs = () => ({
  primaryKey: 'id',
  selection: false,
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-notice-orders/import`,
        method: 'GET',
        params,
      };
    },
  },
});

const importOutboundDs = () => ({
  primaryKey: 'id',
  selection: false,
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/winv-outbound-orders/import`,
        method: 'GET',
        params,
      };
    },
  },
});

const importRequisitionNoteDs = () => ({
  primaryKey: 'id',
  selection: false,
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/transfer-orders/import`,
        method: 'GET',
        params,
      };
    },
  },
});

const importSerialDs = () => ({
  primaryKey: 'id',
  selection: false,
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/inbound-serial-receipts/import`,
        method: 'GET',
        params,
      };
    },
  },
});

const importStockAdjustDs = () => ({
  primaryKey: 'id',
  selection: false,
  transport: {
    read: ({ params }) => {
      return {
        url: `${WMS_INV}/v1/${currentTenantID}/adjust-orders/import`,
        method: 'GET',
        params,
      };
    },
  },
});

export {
  importInboundDs,
  importOutboundDs,
  importRequisitionNoteDs,
  importSerialDs,
  importInboundNoticeDs,
  importStockAdjustDs,
};
