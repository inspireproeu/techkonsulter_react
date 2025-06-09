"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excelHeader = exports.LOGOBASE64 = exports.DATAURLS = exports.WAREHOUSE = exports.PROJECT_TYPES = exports.PROJECT_STATUS = exports.HEADER_MISMATCH1 = exports.HEADER_MISMATCH = exports.PROJECT_MISMATCH = exports.FILE_UPLOAD_EMPTY_FILE_MESSAGE = exports.FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE = exports.FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE = exports.FILE_UPLOAD_ROW_COUNT_ERROR = exports.APIPREFIX = void 0;

var _proxy = _interopRequireDefault(require("../../config/proxy"));

var _DATAURLS;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var domain = _proxy["default"].dev['/api/'].target + '/items';
var userdomain = _proxy["default"].dev['/api/'].target + ''; // let APIPREFIX = proxy.dev['/api/'];

var APIPREFIX = _proxy["default"].dev['/api/'].target;
exports.APIPREFIX = APIPREFIX;
var FILE_UPLOAD_ROW_COUNT_ERROR = 1000;
exports.FILE_UPLOAD_ROW_COUNT_ERROR = FILE_UPLOAD_ROW_COUNT_ERROR;
var FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE = 'Invalid file. Exceeds 1000 rows';
exports.FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE = FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE;
var FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE = 'Invalid file. Column asset_id (Asset Number) is missing';
exports.FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE = FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE;
var FILE_UPLOAD_EMPTY_FILE_MESSAGE = 'Invalid file. No records available';
exports.FILE_UPLOAD_EMPTY_FILE_MESSAGE = FILE_UPLOAD_EMPTY_FILE_MESSAGE;
var PROJECT_MISMATCH = 'Mismatch - Project number which you are trying to import is different from current project number';
exports.PROJECT_MISMATCH = PROJECT_MISMATCH;
var HEADER_MISMATCH = 'Warning - Column header';
exports.HEADER_MISMATCH = HEADER_MISMATCH;
var HEADER_MISMATCH1 = 'not match any column header';
exports.HEADER_MISMATCH1 = HEADER_MISMATCH1;
var PROJECT_STATUS = [{
  label: 'ORDER',
  value: 'ORDER'
}, {
  label: 'ARRIVED',
  value: 'ARRIVED'
}, {
  label: 'PROCESSING',
  value: 'PROCESSING'
}, {
  label: 'PROCESSING FINISHED',
  value: 'PROCESSING FINISHED'
}, // { label: 'SALES PERIOD', value: 'SALES PERIOD' },
{
  label: 'REPORTING',
  value: 'REPORTING'
}, {
  label: 'CLOSED',
  value: 'CLOSED'
}];
exports.PROJECT_STATUS = PROJECT_STATUS;
var PROJECT_TYPES = [{
  label: 'ITAD',
  value: 'ITAD'
}, {
  label: 'EOL',
  value: 'EOL'
}, {
  label: 'ON GOING',
  value: 'ON_GOING'
}, {
  label: 'PURCHASE',
  value: 'PURCHASE'
}, {
  label: 'ONHOLD',
  value: 'ONHOLD'
}];
exports.PROJECT_TYPES = PROJECT_TYPES;
var WAREHOUSE = [{
  label: 'SE01',
  value: 'SE01'
}, {
  label: 'SE02',
  value: 'SE02'
}, {
  label: 'NL01',
  value: 'NL01'
}, {
  label: 'NO01',
  value: 'NO01'
}, {
  label: 'FR01',
  value: 'FR01'
}]; // const domain = 'http://techapidev.inspirepro.co.in/api';
// const domain = 'http://localhost:5001/api';

exports.WAREHOUSE = WAREHOUSE;
var DATAURLS = (_DATAURLS = {
  FILES: {
    url: "".concat(userdomain, "/files")
  },
  ASSETS: {
    url: "".concat(domain, "/Assets")
  },
  ASSETS_ALL: {
    url: "".concat(domain, "/Assets/all")
  },
  ASSETS_MULTIPLE: {
    url: "".concat(domain, "/Assets/multiple")
  },
  PRICINGLIST_MULTIPLE: {
    url: "".concat(domain, "/Assets/pricingmassupdate")
  },
  PRICINGLIST_SINGLE: {
    url: "".concat(domain, "/Assets/pricingmassupdatesingle")
  },
  PRICINGLISTASSETS_MULTIPLE: {
    url: "".concat(domain, "/Assets/pricinglistAssets")
  },
  COLUMNDEFINITIONS: {
    url: "".concat(domain, "/Asset_Column_Definitions")
  },
  GRADE_REDUCTION: {
    url: "".concat(domain, "/gradereduction")
  },
  SETPRICING: {
    url: "".concat(domain, "/Assets/pricinglist")
  },
  PRICINGLIST: {
    url: "".concat(domain, "/Assets/pricinglist")
  },
  GRADE: {
    url: "".concat(domain, "/grade")
  },
  ASSETTYPES: {
    url: "".concat(domain, "/AssetType")
  },
  PALLETS: {
    url: "".concat(domain, "/Pallets")
  },
  PALLETS_COLUMNDEFINITIONS: {
    url: "".concat(domain, "/Pallet_Column_Definitions")
  },
  PALLETS_STATUS_CODES: {
    url: "".concat(domain, "/Pallets_Status_Codes")
  },
  PALLETS_IN_PRODUCTION: {
    url: "".concat(domain, "/Pallets")
  },
  PICEA: {
    url: "".concat(domain, "/picea")
  },
  PICEA_COLUMNDEFINITIONS: {
    url: "".concat(domain, "/picea/columnDefinitions")
  },
  CERTUS: {
    url: "".concat(domain, "/Certus")
  },
  CERTUS_MULTIPLE: {
    url: "".concat(domain, "/Certus/multiple")
  },
  CERTUS_MOBILE: {
    url: "".concat(domain, "/CertusMobile")
  },
  CERTUS_MOBILE_MULTIPLE: {
    url: "".concat(domain, "/CertusMobile/multiple")
  },
  CERTUS_ASSET_MOBILE_MULTIPLE: {
    url: "".concat(domain, "/CertusMobile")
  },
  CERTUS_ASSET_MOBILE_MULTIPLE_UPDATE: {
    url: "".concat(domain, "/CertusMobile/mobileupdatemultiple")
  },
  CERTUS_MOBILE_COLUMNDEFINITIONS: {
    url: "".concat(domain, "/Certus_Mobile_Column_Definitions")
  },
  CERTUS_MOBILE_NEW_COLUMNDEFINITIONS: {
    url: "".concat(domain, "/Certus_Mobile_New_Column_Definitions")
  },
  CERTUS_COLUMNDEFINITIONS: {
    url: "".concat(domain, "/Certus_Column_Definitions")
  },
  PICEA_DIRECT: {},
  STATUS_CODES: {
    url: "".concat(domain, "/Status_Codes")
  },
  USERS: {
    url: "".concat(userdomain, "/users")
  },
  INSTRUCTIONS: {
    url: "".concat(domain, "/instructions")
  },
  MULTIPLE_INSTRUCTIONS: {
    url: "".concat(domain, "/instructions/multiple")
  },
  MULTIPLE_USERS: {
    url: "".concat(domain, "/users/multiple")
  },
  USERS_COLUMNDEFINITIONS: {
    url: "".concat(domain, "/User_Column_Definitions")
  },
  USER_ROLES: {
    url: "".concat(userdomain, "/roles")
  },
  LOGIN: {
    url: "".concat(domain, "/users/login")
  },
  AUTHORIZE: {
    url: "".concat(domain, "/users/authorize")
  },
  PRICINGCHART: {
    url: "".concat(userdomain, "/assetitems/pricingchart")
  },
  MODELTYPES: {
    url: "".concat(userdomain, "/assetitems/getmodels")
  },
  PROCESSORTYPES: {
    url: "".concat(userdomain, "/assetitems/getprocessors")
  },
  GRADETYPES: {
    url: "".concat(userdomain, "/assetitems/getgrades")
  },
  EXPORTPRODUCTS: {
    url: "".concat(userdomain, "/assetitems/exportassets")
  },
  EXPORTASSETVALUES: {
    url: "".concat(userdomain, "/assetitems/exportassetsValues")
  },
  EXPORTESTIMATEDASSETVALUES: {
    url: "".concat(userdomain, "/assetitems/asset_value")
  },
  ESTIMATEDASSETVALUES: {
    url: "".concat(userdomain, "/assetitems/estimateassetvalues")
  },
  ESTIMATEDASSETVALUESNEW: {
    url: "".concat(userdomain, "/assetitems/estimateassetvaluesnew")
  },
  ESTIMATEDASSETVALUESCOMPUTER: {
    url: "".concat(userdomain, "/assetitems/estimateassetvalues_computer")
  },
  ESTIMATEDASSETVALUESMOBILE: {
    url: "".concat(userdomain, "/assetitems/estimateassetvalues_mobile")
  },
  CERTUSMOBILEGET: {
    url: "".concat(domain, "/CertusMobile")
  },
  CERTUSMOBILE: {
    url: "".concat(userdomain, "/assetitems/certusmobile")
  },
  CERTUSMOBILENEW: {
    url: "".concat(domain, "/CertusMobileNew")
  },
  PRICINGASSETS: {
    url: "".concat(userdomain, "/assetitems/pricingassets")
  },
  MAINTANCEASSETS: {
    url: "".concat(userdomain, "/assetitems/maintanceassets")
  },
  PROJECTCOLUMNDEFINITION: {
    url: "".concat(domain, "/project_column_definition")
  },
  PROJECT: {
    url: "".concat(domain, "/project")
  },
  CLIENT: {
    url: "".concat(domain, "/clients")
  },
  PARTNER: {
    url: "".concat(domain, "/partners")
  },
  COUNTRY: {
    url: "".concat(domain, "/countries")
  },
  CLIENTADDRESS: {
    url: "".concat(domain, "/clients_address")
  },
  PROJECTUSERSIDS: {
    url: "".concat(domain, "/project_access_users")
  },
  PROJECTFIELDS: ["id", "project_name", "project_status", "client.client_name", "client.id", "partner.id", "partner.partner_name", "delivery_info", "project_info", "finish_date", "client.phone_number", "client.city", "client.postal_code", "client.delivery_address", "partner.phone_number", "partner.city", "partner.postal_code"],
  PRESETS: {
    url: "".concat(userdomain, "/presets")
  },
  CLIENTASSETS: {
    url: "".concat(domain, "/client_assets")
  }
}, _defineProperty(_DATAURLS, "PRESETS", {
  url: "".concat(userdomain, "/presets")
}), _defineProperty(_DATAURLS, "BROKERBIN", {
  url: "".concat(userdomain, "/assetitems/brokerbin")
}), _defineProperty(_DATAURLS, "PARTNUMBERS", {
  url: "".concat(domain, "/part_numbers")
}), _defineProperty(_DATAURLS, "FILE", {
  url: "".concat(userdomain, "/files")
}), _defineProperty(_DATAURLS, "DEVIATION", {
  url: "".concat(domain, "/deviations")
}), _defineProperty(_DATAURLS, "COMPLAINTS", {
  url: "".concat(domain, "/complaints")
}), _defineProperty(_DATAURLS, "DEVIATION_COLUMNDEFINITIONS", {
  url: "".concat(domain, "/deviation_column_definitions")
}), _defineProperty(_DATAURLS, "COMPLAIN_COLUMNDEFINITIONS", {
  url: "".concat(domain, "/complain_column_definitions")
}), _defineProperty(_DATAURLS, "GETTARGETPRICE", {
  url: "".concat(userdomain, "/assetitems/getTargetPrice")
}), _defineProperty(_DATAURLS, "NOTES", {
  url: "".concat(domain, "/notes")
}), _defineProperty(_DATAURLS, "EXCELEXPORTSENDMAIL", {
  url: "".concat(userdomain, "/assetitems/excelexportsendmail")
}), _defineProperty(_DATAURLS, "COMPUTERSTOCKLIST", {
  url: "".concat(userdomain, "/assetitems/exportassetscomputer")
}), _defineProperty(_DATAURLS, "GENERALSTOCKLIST", {
  url: "".concat(userdomain, "/assetitems/exportassetsnew")
}), _defineProperty(_DATAURLS, "MOBILESTOCKLIST", {
  url: "".concat(userdomain, "/assetitems/exportassetsmobile")
}), _defineProperty(_DATAURLS, "FINANCECOLUMNDEFINITION", {
  url: "".concat(domain, "/finance_column_definitions")
}), _defineProperty(_DATAURLS, "PROJECTFINANCE", {
  url: "".concat(domain, "/project_finance")
}), _defineProperty(_DATAURLS, "CERTUSPDFDOWNLOAD", {
  url: "".concat(userdomain, "/assetitems/certus_pdf_download")
}), _defineProperty(_DATAURLS, "UPDATEPROJECTFINANCE", {
  url: "".concat(userdomain, "/assetitems/updateprojectfinance")
}), _defineProperty(_DATAURLS, "DUPLICATESERIALNUMBER", {
  url: "".concat(userdomain, "/assetitems/duplicateserialnumber")
}), _defineProperty(_DATAURLS, "CUSTOMERSTOCKLIST", {
  url: "".concat(userdomain, "/assetitems/customer-stocklist")
}), _defineProperty(_DATAURLS, "NERDFIX_HISTORY", {
  url: "".concat(domain, "/nerdfixs_history")
}), _defineProperty(_DATAURLS, "NERDFIXBULKUPDATE", {
  url: "".concat(userdomain, "/assetitems/updateNerdfixTransport")
}), _defineProperty(_DATAURLS, "ASSETS_HISTORY", {
  url: "".concat(userdomain, "/revisions")
}), _defineProperty(_DATAURLS, "ASSETS_HISTORY_UPDATE", {
  url: "".concat(userdomain, "/assetitems/update_revision")
}), _defineProperty(_DATAURLS, "ESTIMATE_VALUES_SETTINGS", {
  url: "".concat(domain, "/estimate_values_settings")
}), _defineProperty(_DATAURLS, "ESTIMATE_VALUES_BY_COMPUTER", {
  url: "".concat(domain, "/estimate_values_computer")
}), _DATAURLS);
exports.DATAURLS = DATAURLS;
var LOGOBASE64 = 'https://productionapi.techkonsult.se/assets/11911092-5e8b-4c73-8eae-2fe63487b978?cache-buster=2024-12-04T11%3A04%3A39.018Z&key=system-large-contain&access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhYmE1YjdlLTg0Y2MtNGVjZS04OTBjLWM4N2JkMDMxZjJhOCIsInJvbGUiOiI1YzJiM2QxNS01YmJmLTQ5MzMtOTMyNC1kYTNhN2MwNDYyNjciLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTczMzMwODA2OSwiZXhwIjoxODE5NjIxNjY5LCJpc3MiOiJkaXJlY3R1cyJ9.y8XLmmqAnmGwKGPbh5eXTfiL1yAjGXLzByd-k8fZ9_4';
exports.LOGOBASE64 = LOGOBASE64;
var excelHeader = [{
  "key": "project_id",
  "header": "Project ID"
}, {
  "key": "asset_id",
  "header": "Asset ID"
}, {
  "key": "asset_type",
  "header": "Asset Type"
}, {
  "key": "form_factor",
  "header": "Form Factor"
}, {
  "key": "Part_No",
  "header": "Part number"
}, {
  "key": "quantity",
  "header": "QTY"
}, {
  "key": "manufacturer",
  "header": "Manufacturer"
}, {
  "key": "model",
  "header": "Model"
}, {
  "key": "imei",
  "header": "IMEI"
}, {
  "key": "serial_number",
  "header": "Serial"
}, {
  "key": "processor",
  "header": "Processor"
}, {
  "key": "memory",
  "header": "Memory"
}, {
  "key": "hdd",
  "header": "HDD"
}, {
  "key": "hdd_serial_number",
  "header": "HDD Serial Number"
}, {
  "key": "optical",
  "header": "Optical"
}, {
  "key": "graphic_card",
  "header": "Graphic Card"
}, {
  "key": "battery",
  "header": "Battery"
}, {
  "key": "keyboard",
  "header": "Keyboard"
}, {
  "key": "screen",
  "header": "Screen"
}, {
  "key": "grade",
  "header": "Grade"
}, {
  "key": "complaint",
  "header": "Complaint"
}, {
  "key": "erasure_ended",
  "header": "Erasure ended"
}, {
  "key": "data_destruction",
  "header": "Data Destruction"
}, {
  "key": "wipe_standard",
  "header": "Wipe Standard"
}, {
  "key": "sample_co2",
  "header": "Sample CO2"
}, {
  "key": "sample_weight",
  "header": "Sample Weight"
}, {
  "key": "client_ref",
  "header": "Client reference"
}, {
  "key": "client_name",
  "header": "Client name"
}, {
  "key": "suborg_name",
  "header": "SUBORG NAME"
}];
exports.excelHeader = excelHeader;