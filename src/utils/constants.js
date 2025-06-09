import proxy from '../../config/proxy';
let domain = proxy.dev['/api/'].target + '/items';
let userdomain = proxy.dev['/api/'].target + '';
// let APIPREFIX = proxy.dev['/api/'];
export const APIPREFIX = proxy.dev['/api/'].target;
export const FILE_UPLOAD_ROW_COUNT_ERROR = 1000;
export const FILE_UPLOAD_ROW_COUNT_ERROR_MESSAGE =
  'Invalid file. Exceeds 1000 rows';
export const FILE_UPLOAD_ASSET_ID_MISSING_MESSAGE =
  'Invalid file. Column asset_id (Asset Number) is missing';
export const FILE_UPLOAD_EMPTY_FILE_MESSAGE =
  'Invalid file. No records available';
export const PROJECT_MISMATCH =
  'Mismatch - Project number which you are trying to import is different from current project number';
export const HEADER_MISMATCH =
  'Warning - Column header';
export const HEADER_MISMATCH1 =
  'not match any column header';


export const PROJECT_STATUS = [
  { label: 'ORDER', value: 'ORDER' },
  { label: 'ARRIVED', value: 'ARRIVED' },
  { label: 'PROCESSING', value: 'PROCESSING' },
  { label: 'PROCESSING FINISHED', value: 'PROCESSING FINISHED' },
  // { label: 'SALES PERIOD', value: 'SALES PERIOD' },
  { label: 'REPORTING', value: 'REPORTING' },
  { label: 'CLOSED', value: 'CLOSED' },
]
export const PROJECT_TYPES = [
  { label: 'ITAD', value: 'ITAD' },
  { label: 'EOL', value: 'EOL' },
  { label: 'ON GOING', value: 'ON_GOING' },
  { label: 'PURCHASE', value: 'PURCHASE' },
  { label: 'ONHOLD', value: 'ONHOLD' }

]
export const WAREHOUSE = [
  { label: 'SE01', value: 'SE01' },
  { label: 'SE02', value: 'SE02' },
  { label: 'NL01', value: 'NL01' },
  { label: 'NO01', value: 'NO01' },
  { label: 'FR01', value: 'FR01' }
]
// const domain = 'http://techapidev.inspirepro.co.in/api';
// const domain = 'http://localhost:5001/api';

export const DATAURLS = {
  FILES: { url: `${userdomain}/files` },
  ASSETS: { url: `${domain}/Assets` },
  ASSETS_ALL: { url: `${domain}/Assets/all` },
  ASSETS_MULTIPLE: { url: `${domain}/Assets/multiple` },
  PRICINGLIST_MULTIPLE: { url: `${domain}/Assets/pricingmassupdate` },
  PRICINGLIST_SINGLE: { url: `${domain}/Assets/pricingmassupdatesingle` },
  PRICINGLISTASSETS_MULTIPLE: { url: `${domain}/Assets/pricinglistAssets` },
  COLUMNDEFINITIONS: {
    url: `${domain}/Asset_Column_Definitions`,
  },
  GRADE_REDUCTION: { url: `${domain}/gradereduction` },
  SETPRICING: { url: `${domain}/Assets/pricinglist` },
  PRICINGLIST: { url: `${domain}/Assets/pricinglist` },
  GRADE: { url: `${domain}/grade` },
  ASSETTYPES: { url: `${domain}/AssetType` },
  PALLETS: { url: `${domain}/Pallets` },
  PALLETS_COLUMNDEFINITIONS: {
    url: `${domain}/Pallet_Column_Definitions`,
  },
  PALLETS_STATUS_CODES: {
    url: `${domain}/Pallets_Status_Codes`,
  },
  PALLETS_IN_PRODUCTION: {
    url: `${domain}/Pallets`,
  },
  PICEA: { url: `${domain}/picea` },
  PICEA_COLUMNDEFINITIONS: {
    url: `${domain}/picea/columnDefinitions`,
  },
  CERTUS: { url: `${domain}/Certus` },
  CERTUS_MULTIPLE: { url: `${domain}/Certus/multiple` },

  CERTUS_MOBILE: { url: `${domain}/CertusMobile` },
  CERTUS_MOBILE_MULTIPLE: { url: `${domain}/CertusMobile/multiple` },
  CERTUS_ASSET_MOBILE_MULTIPLE: { url: `${domain}/CertusMobile` },
  CERTUS_ASSET_MOBILE_MULTIPLE_UPDATE: { url: `${domain}/CertusMobile/mobileupdatemultiple` },
  CERTUS_MOBILE_COLUMNDEFINITIONS: {
    url: `${domain}/Certus_Mobile_Column_Definitions`,
  },
  CERTUS_MOBILE_NEW_COLUMNDEFINITIONS: {
    url: `${domain}/Certus_Mobile_New_Column_Definitions`,
  },
  CERTUS_COLUMNDEFINITIONS: {
    url: `${domain}/Certus_Column_Definitions`,
  },
  PICEA_DIRECT: {},
  STATUS_CODES: {
    url: `${domain}/Status_Codes`,
  },
  USERS: { url: `${userdomain}/users` },
  INSTRUCTIONS: { url: `${domain}/instructions` },
  MULTIPLE_INSTRUCTIONS: { url: `${domain}/instructions/multiple` },
  MULTIPLE_USERS: { url: `${domain}/users/multiple` },
  USERS_COLUMNDEFINITIONS: { url: `${domain}/User_Column_Definitions` },
  USER_ROLES: { url: `${userdomain}/roles` },
  LOGIN: { url: `${domain}/users/login` },
  AUTHORIZE: { url: `${domain}/users/authorize` },
  PRICINGCHART: { url: `${userdomain}/assetitems/pricingchart` },
  MODELTYPES: { url: `${userdomain}/assetitems/getmodels` },
  PROCESSORTYPES: { url: `${userdomain}/assetitems/getprocessors` },
  GRADETYPES: { url: `${userdomain}/assetitems/getgrades` },
  EXPORTPRODUCTS: { url: `${userdomain}/assetitems/exportassets` },
  EXPORTASSETVALUES: { url: `${userdomain}/assetitems/exportassetsValues` },
  EXPORTESTIMATEDASSETVALUES: { url: `${userdomain}/assetitems/asset_value` },
  ESTIMATEDASSETVALUES: { url: `${userdomain}/assetitems/estimateassetvalues` },
  ESTIMATEDASSETVALUESNEW: { url: `${userdomain}/assetitems/estimateassetvaluesnew` },
  ESTIMATEDASSETVALUESCOMPUTER: { url: `${userdomain}/assetitems/estimateassetvalues_computer` },
  ESTIMATEDASSETVALUESMOBILE: { url: `${userdomain}/assetitems/estimateassetvalues_mobile` },
  CERTUSMOBILEGET: { url: `${domain}/CertusMobile` },
  CERTUSMOBILE: { url: `${userdomain}/assetitems/certusmobile` },
  CERTUSMOBILENEW: { url: `${domain}/CertusMobileNew` },
  PRICINGASSETS: { url: `${userdomain}/assetitems/pricingassets` },
  MAINTANCEASSETS: { url: `${userdomain}/assetitems/maintanceassets` },
  PROJECTCOLUMNDEFINITION: { url: `${domain}/project_column_definition` },
  PROJECT: { url: `${domain}/project` },
  CLIENT: { url: `${domain}/clients` },
  PARTNER: { url: `${domain}/partners` },
  COUNTRY: { url: `${domain}/countries` },
  CLIENTADDRESS: { url: `${domain}/clients_address` },
  PROJECTUSERSIDS: { url: `${domain}/project_access_users` },
  PROJECTFIELDS: ["id", "project_name", "project_status", "client.client_name", "client.id", "partner.id", "partner.partner_name", "delivery_info", "project_info", "finish_date", "client.phone_number", "client.city", "client.postal_code", "client.delivery_address", "partner.phone_number", "partner.city", "partner.postal_code"],
  PRESETS: { url: `${userdomain}/presets` },
  CLIENTASSETS: { url: `${domain}/client_assets` },
  PRESETS: { url: `${userdomain}/presets` },
  BROKERBIN: { url: `${userdomain}/assetitems/brokerbin` },
  PARTNUMBERS: { url: `${domain}/part_numbers` },
  FILE: { url: `${userdomain}/files` },
  DEVIATION: { url: `${domain}/deviations` },
  COMPLAINTS: { url: `${domain}/complaints` },
  DEVIATION_COLUMNDEFINITIONS: { url: `${domain}/deviation_column_definitions` },
  COMPLAIN_COLUMNDEFINITIONS: { url: `${domain}/complain_column_definitions` },
  GETTARGETPRICE: { url: `${userdomain}/assetitems/getTargetPrice` },
  NOTES: { url: `${domain}/notes` },
  EXCELEXPORTSENDMAIL: { url: `${userdomain}/assetitems/excelexportsendmail` },
  COMPUTERSTOCKLIST: { url: `${userdomain}/assetitems/exportassetscomputer` },
  GENERALSTOCKLIST: { url: `${userdomain}/assetitems/exportassetsnew` },
  MOBILESTOCKLIST: { url: `${userdomain}/assetitems/exportassetsmobile` },
  FINANCECOLUMNDEFINITION: { url: `${domain}/finance_column_definitions` },
  PROJECTFINANCE: { url: `${domain}/project_finance` },
  CERTUSPDFDOWNLOAD: { url: `${userdomain}/assetitems/certus_pdf_download` },
  UPDATEPROJECTFINANCE: { url: `${userdomain}/assetitems/updateprojectfinance` },
  DUPLICATESERIALNUMBER: { url: `${userdomain}/assetitems/duplicateserialnumber` },
  CUSTOMERSTOCKLIST: { url: `${userdomain}/assetitems/customer-stocklist` },
  NERDFIX_HISTORY: { url: `${domain}/nerdfixs_history` },
  NERDFIXBULKUPDATE: { url: `${userdomain}/assetitems/updateNerdfixTransport` },
  ASSETS_HISTORY: { url: `${userdomain}/revisions` },
  ASSETS_HISTORY_UPDATE: { url: `${userdomain}/assetitems/update_revision` },
  ESTIMATE_VALUES_SETTINGS: { url: `${domain}/estimate_values_settings` },
  ESTIMATE_VALUES_BY_COMPUTER: { url: `${domain}/estimate_values_computer` },
};


export const LOGOBASE64 = 'https://productionapi.techkonsult.se/assets/11911092-5e8b-4c73-8eae-2fe63487b978?cache-buster=2024-12-04T11%3A04%3A39.018Z&key=system-large-contain&access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhYmE1YjdlLTg0Y2MtNGVjZS04OTBjLWM4N2JkMDMxZjJhOCIsInJvbGUiOiI1YzJiM2QxNS01YmJmLTQ5MzMtOTMyNC1kYTNhN2MwNDYyNjciLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTczMzMwODA2OSwiZXhwIjoxODE5NjIxNjY5LCJpc3MiOiJkaXJlY3R1cyJ9.y8XLmmqAnmGwKGPbh5eXTfiL1yAjGXLzByd-k8fZ9_4';
export const excelHeader = [
  {
    "key": "project_id",
    "header": "Project ID"
  },
  {
    "key": "asset_id",
    "header": "Asset ID"
  },
  {
    "key": "asset_type",
    "header": "Asset Type"
  },
  {
    "key": "form_factor",
    "header": "Form Factor"
  },
  {
    "key": "Part_No",
    "header": "Part number"
  },
  {
    "key": "quantity",
    "header": "QTY"
  },
  {
    "key": "manufacturer",
    "header": "Manufacturer"
  },
  {
    "key": "model",
    "header": "Model"
  },
  {
    "key": "imei",
    "header": "IMEI"
  },
  {
    "key": "serial_number",
    "header": "Serial"
  },
  {
    "key": "processor",
    "header": "Processor"
  },
  {
    "key": "memory",
    "header": "Memory"
  },
  {
    "key": "hdd",
    "header": "HDD"
  },
  {
    "key": "hdd_serial_number",
    "header": "HDD Serial Number"
  },
  {
    "key": "optical",
    "header": "Optical"
  },
  {
    "key": "graphic_card",
    "header": "Graphic Card"
  },
  {
    "key": "battery",
    "header": "Battery"
  },
  {
    "key": "keyboard",
    "header": "Keyboard"
  },
  {
    "key": "screen",
    "header": "Screen"
  },
  {
    "key": "grade",
    "header": "Grade"
  },
  {
    "key": "complaint",
    "header": "Complaint"
  },
  {
    "key": "erasure_ended",
    "header": "Erasure ended"
  },
  {
    "key": "data_destruction",
    "header": "Data Destruction"
  },
  {
    "key": "wipe_standard",
    "header": "Wipe Standard"
  },
  {
    "key": "sample_co2",
    "header": "Sample CO2"
  },
  {
    "key": "sample_weight",
    "header": "Sample Weight"
  },
  {
    "key": "client_ref",
    "header": "Client reference"
  },
  {
    "key": "client_name",
    "header": "Client name"
  },
  {
    "key": "suborg_name",
    "header": "SUBORG NAME"
  }
]