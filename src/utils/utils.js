import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { history } from 'umi';
import useMediaQuery, { MediaQueryKey } from 'use-media-antd-query';
import axios from 'axios'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from "exceljs";
import { LOGOBASE64, excelHeader } from './constants';
import moment from "moment";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
// const accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload


// console.log("getAccessToken utilsss", getAccessToken())
export const isAntDesignPro = () => {
	if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
		return true;
	}

	return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
	const { NODE_ENV } = process.env;

	if (NODE_ENV === 'development') {
		return true;
	}

	return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
	const authority = router.find(
		({ routes, path = '/', target = '_self' }) =>
			(path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
			(routes && getAuthorityFromRouter(routes, pathname))
	);
	if (authority) return authority;
	return undefined;
};
export const getRouteAuthority = (path, routeData) => {
	let authorities;
	routeData.forEach((route) => {
		// match prefix
		if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
			if (route.authority) {
				authorities = route.authority;
			} // exact match
			if (route.path === path) {
				authorities = route.authority || authorities;
			} // get children authority recursively

			if (route.routes) {
				authorities = getRouteAuthority(path, route.routes) || authorities;
			}
		}
	});
	return authorities;
};

export function useMobile() {
	const colSize = useMediaQuery();
	return colSize === 'xs' || colSize === 'sm' || colSize === 'md';
}

export function useMobileSmall() {
	const colSize = useMediaQuery();
	return colSize === 'xs';
}

export function ExportExcel1(csvData, fileName) {
	const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const fileExtension = '.xlsx';
	const ws = XLSX.utils.json_to_sheet(csvData);
	const wb = { Sheets: { 'stock': ws }, SheetNames: ['stock'] };
	const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
	const data = new Blob([excelBuffer], { type: fileType });
	return FileSaver.saveAs(data, fileName + fileExtension);
}

// const convertToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// };

export const ExportExcel = async (csvData, fileName, partner_logo = null) => {
	const wb = new Excel.Workbook()
	const worksheet = wb.addWorksheet('PF Report');
	// add the image to the workbook
	// const imageID = wb.addImage({
	// 	base64: LOGOBASE64,
	// 	extension: 'png'
	// })
	partner_logo = partner_logo ? partner_logo : LOGOBASE64;
	// worksheet.mergeCells('H2:K2');
	// let keyValues = Object.keys(csvData[0])
	let header = [];
	let headerName = [];
	excelHeader.map((val) => {
		let width = 14
		if (val.key === 'model') {
			width = 40
		}
		header.push({ key: val.key, width: width })
		headerName.push(val.header.toUpperCase())
	})
	// let allHeaders = colValues.map((itm) => itm.header);

	worksheet.getRow(3).values = ['           Product report'];
	worksheet.getRow(4).values = [`           Client: ${csvData[0].client_name || ''}`];
	worksheet.getRow(5).values = [`           Project number: ${csvData[0].project_id || ''}`];
	worksheet.getRow(8).values = headerName;
	['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'A3', 'B3', 'C3', 'D3', 'E3',
		'F3', 'A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'A7', 'B7', 'C7', 'D7', 'E7', 'F7']
		.map(key => {
			worksheet.getCell(key).fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '004750' },
				color: { argb: 'FFFFFF' },
				bgColor: { argb: '004750' }
			};
		});

	['G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1', 'AA1', 'AB1', 'AC1',
		'G2', 'H2', 'I2', 'J2', 'K2', 'L2', 'M2', 'N2', 'O2', 'P2', 'Q2', 'R2', 'S2', 'T2', 'U2', 'V2', 'W2', 'X2', 'Y2', 'Z2', 'AA2', 'AB2', 'AC2',
		'G3', 'H3', 'I3', 'J3', 'K3', 'L3', 'M3', 'N3', 'O3', 'P3', 'Q3', 'R3', 'S3', 'T3', 'U3', 'V3', 'W3', 'X3', 'Y3', 'Z3', 'AA3', 'AB3', 'AC3',
		'G4', 'H4', 'I4', 'J4', 'K4', 'L4', 'M4', 'N4', 'O4', 'P4', 'Q4', 'R4', 'S4', 'T4', 'U4', 'V4', 'W4', 'X4', 'Y4', 'Z4', 'AA4', 'AB4', 'AC4',
		'G5', 'H5', 'I5', 'J5', 'K5', 'L5', 'M5', 'N5', 'O5', 'P5', 'Q5', 'R5', 'S5', 'T5', 'U5', 'V5', 'W5', 'X5', 'Y5', 'Z5', 'AA5', 'AB5', 'AC5',
		'G6', 'H6', 'I6', 'J6', 'K6', 'L6', 'M6', 'N6', 'O6', 'P6', 'Q6', 'R6', 'S6', 'T6', 'U6', 'V6', 'W6', 'X6', 'Y6', 'Z6', 'AA6', 'AB6', 'AC6',
		'G7', 'H7', 'I7', 'J7', 'K7', 'L7', 'M7', 'N7', 'O7', 'P7', 'Q7', 'R7', 'S7', 'T7', 'U7', 'V7', 'W7', 'X7', 'Y7', 'Z7', 'AA7', 'AB7', 'AC7']
		.map(key => {
			worksheet.getCell(key).fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFFFFF' },
				color: { argb: 'FFFFFF' },
				bgColor: { argb: 'FFFFFF' }
			};
		});

	worksheet.columns = header // Asign header
	worksheet.columns.forEach(column => {
		column.width = column.width
	})
	csvData.forEach(function (item, index) {
		worksheet.getRow(index + 8).height = 24;
		worksheet.addRow(item)
	})
	worksheet.eachRow((row, rowNumber) => {
		row.eachCell((cell) => {
			if (rowNumber == 3 || rowNumber == 4 || rowNumber == 5) {
				cell.font = {
					// bold: true,
					color: { argb: 'FFFFFF' }, // white text
					size: 12, // Font size 14 for header
					name: 'Work Sans' // Custom font family for header
				};
			} else if (rowNumber == 8) {
				if (cell._address === "F8") {
					cell.alignment = { horizontal: 'center', wrapText: true };
				}
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					color: { argb: 'FFFFFF' },
					bgColor: { argb: 'BBC6C3' },
					fgColor: { argb: 'BBC6C3' }
				};
				cell.font = {
					color: { argb: '004750' }, // white text
					size: 12, // Font size 14 for header
					name: 'Work Sans', // Custom font family for header

				};
			} else {
				cell.alignment = { wrapText: true };
				cell.height = 40;
				cell.font = {
					size: 10, // Font size 14 for header
					name: 'Work Sans' // Custom font family for header
				};
			}

		})
	})
	if (partner_logo) {
		fetch(partner_logo)
			.then((r) => {
				const image = wb.addImage({
					buffer: r.arrayBuffer(),
					extension: "png",
				});
				worksheet.addImage(image, {
					tl: { col: 7, row: 2 },
					ext: { width: 200, height: 60 },
					bgColor: { argb: 'BBC6C3' },
					fgColor: { argb: 'BBC6C3' },
					editAs: 'absolute'
				});
				return wb.xlsx
					.writeBuffer()
					.then((arrayBuffer) => saveAs(new Blob([arrayBuffer]), `${fileName}.xlsx`));
			}).catch(console.error);

	} else {
		console.log("elseeeee")
		//assuming the width and height of the image are 100px
		// worksheet.addImage(imageID, {
		// 	tl: { col: 7, row: 2 },
		// 	ext: { width: 200, height: 40 },
		// 	editAs: 'absolute'
		// });
		// wb.xlsx.writeBuffer().then(function (data) {
		// 	const blob = new Blob([data], {
		// 		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		// 	});
		// 	const url = window.URL.createObjectURL(blob);
		// 	const anchor = document.createElement('a');
		// 	anchor.href = url;
		// 	anchor.download = fileName + '.xlsx';
		// 	anchor.click();
		// 	window.URL.revokeObjectURL(url);
		// });
	}

};


export function ExcelDateToJSDate(serialDate) {
	var days = Math.floor(serialDate);
	var hours = Math.floor((serialDate % 1) * 24);
	var minutes = Math.floor((((serialDate % 1) * 24) - hours) * 60)
	return new Date(Date.UTC(0, 0, serialDate, hours - 17, minutes));
}

export const fetchPost = (endPoint, params) => {
	const accesstoken1 = localStorage.getItem('antd-pro-accesstoken'); // auto reload

	let promise = new Promise((resolve, reject) => {
		axios.post(endPoint, params, {
			headers: {
				"Authorization": `Bearer ${accesstoken1}`
			},
		})
			.then(async (response) => {
				// let response = await res.json();
				// response.ok = res.ok;
				//   console.log("***", response)

				resolve(response.data);
			})
			.catch((err) => {
				if (err.code === 403) {
					history.push({
						pathname: '/user/login'
					});
				} if (err.code === 400) {
					err = "Field must to be unique"
				}
				console.log(err, `Error in adding ${err}`);
				reject(err);
			});
	});

	return promise;
};

export const fetchPut = (endPoint, params, accesstoken) => {
	let promise = new Promise((resolve, reject) => {
		axios.patch(endPoint, params, {
			headers: {
				"Authorization": `Bearer ${accesstoken}`,
			},
		})
			.then(async (response) => {
				// let response = await res.json();
				response.ok = response.statusText === 'OK' ? true : false;
				resolve(response.data);
			})
			.catch((err) => {
				if (err.code === 403) {
					window.location.reload();
				}
				console.log(`Error in updating ${params} at ${endPoint}`);
				reject(err);
			});
	});

	return promise;
};

export const fetchGet = (endPoint) => {
	const accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload
	let promise = new Promise((resolve, reject) => {
		axios.get(endPoint, {
			headers: {

				"Authorization": `Bearer ${accesstoken}`,
			},
			// timeout: 1000 * 50, // Wait for 5 seconds
		})
			.then(async (response) => {
				// let response = await res.json();
				response.ok = response.statusText === 'OK' ? true : false;
				resolve(response.data);
			})
			.catch((err) => {

				if (err.code === 403) {
					history.push({
						pathname: '/user/login'
					});
				}
				console.log(err, `Error fetching data from ${endPoint}`);
				reject(err);
			});
	});

	return promise;
};

export const fetchGetWithoutLogin = (endPoint) => {

	let promise = new Promise((resolve, reject) => {
		axios.get(endPoint)
			.then(async (response) => {
				// let response = await res.json();
				//console.log("response", response)
				response.ok = response.statusText === 'OK' ? true : false;
				resolve(response.data);
			})
			.catch((err) => {

				if (err.code === 403) {
					history.push({
						pathname: '/user/login'
					});
				}
				console.log(`Error fetching data from ${endPoint}`);
				reject(err);
			});
	});

	return promise;
};

export const fetchDelete = (endPoint, params, accesstoken) => {
	let promise = new Promise((resolve, reject) => {
		axios.delete(endPoint, {
			headers: {
				"Authorization": `Bearer ${accesstoken}`,
			},
			data: params
		})
			.then(async (res) => {
				// let response = await res.json();
				res.ok = 'ok';
				resolve(res);
			})
			.catch((err) => {
				if (err.code === 403) {
					window.location.reload();
				}
				console.log(`Error in updating ${params} at ${endPoint}`);
				reject(err);
			});
	});

	return promise;
};

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}
function isNumber(value) {
	return !isNaN(value);
}


export const FormatFilterValues = (filterColumns, page = null) => {

	let filters = [];
	let filterVal = {};
	let opList = { "_in": "oneOfThe", "_eq": "equals", "_icontains": "contains", "_neq": "notEqual", "_nicontains": "notContains", "_between": "inRange", "_null": "blank", "_nnull": "notBlank" }
	Object.keys(filterColumns).map((key, index) => {
		let values = filterColumns[key].filter
		let datevalues = filterColumns[key].dateFrom
		let operator1 = filterColumns[key].type;
		let filterType = filterColumns[key].filterType;
		let operator = getKeyByValue(opList, operator1)
		if ((key) === "date_nor" || (key) === "date_created" || (key) === "date_updated") {
			values = values;
		} else if ((key) === "grade" && values && values.includes('+')) {
			values = values.replace('+', '%2B').trim()
		} else {
			if (operator === '_null' || operator === '_nnull') {
				values = true;
			} else {
				values = isNumber(values) ? values : values.trim()
			}
		}
		// Check fields are numeric and assign to number;
		if (filterType === 'text' && ((key) === "asset_id_nl" || (key) === "asset_id" || (key) === "project_id")) {
			// filterType = 'number';
			if (operator === '_eq') {
				operator = '_in'
			} else if ((key) === "asset_id_nl" && operator === '_icontains') {
				operator = '_in'
			}
			if (values.indexOf(' ') > -1) {
				operator = '_in'
			}
		}
		if (page === 'assets') {
			if (key === 'asset_id') {
				key = 'asset_id_1'
			} else if (key === 'project_id') {
				key = 'project_id_1'
			}
		}

		// if (values || datevalues) {
		let obj = {};
		if ((key) === "project_id.client.client_name") {
			obj = {
				"_or": [
					{
						"project_id": {
							"client": {
								"client_name": {
									[operator]: values
								}
							}
						}
					}
				]
			}
			filters.push(obj)
			return
		} else if ((key) === "project_id.client.client_org_no") {
			obj = {
				"_or": [
					{
						"project_id": {
							"client": {
								"client_org_no": {
									[operator]: values
								}
							}
						}
					}
				]
			}
			filters.push(obj)
			return
		} else if ((key) === "project_id.partner.partner_name") {
			obj = {
				"_or": [
					{
						"project_id": {
							"partner": {
								"partner_name": {
									[operator]: values
								}
							}
						}
					}
				]
			}
			filters.push(obj)
			return
		} else if ((key) === "project_id.partner.partner_org_no") {
			obj = {
				"_or": [
					{
						"project_id": {
							"partner": {
								"partner_org_no": {
									[operator]: values
								}
							}
						}
					}
				]
			}

			filters.push(obj)
			return
		} else if ((key) === "warehouse") {
			obj = {
				"_or": [
					{
						"project_id": {
							"warehouse": {
								[operator]: values
							}
						}
					}
				]
			}
			filters.push(obj)
			return
		} else if ((key) === "created_by") {
			obj = {
				"_or": [
					{
						"user_created": {
							"email": {
								[operator]: values
							}
						}
					}
				]
			}
			filters.push(obj)
			return
		} else {
			let comma = ''
			if (operator === '_eq') {
				// if (item.fromdate) {
				//     values = item.fromdate
				// }
				if (key === 'asset_id' || key === 'project_id') {
					if ((values.toString().indexOf(' ') > -1) || (values.toString().indexOf(',') > -1)) {
						comma = values.split(' ') || values.split(',')
					}
				}
				if (((key) === "date_created") || (key) === "date_nor" || (key) === "date_updated") {
					values = datevalues;
				}

				if (comma?.length > 0) {
					obj = {
						[(key)]: {
							['_in']: comma.toString()
						}
					}
				} else {
					obj = {
						[(key)]: {
							[operator]: values
						}
					}
				}

			} else if ((operator === '_in' || operator === '_nin')) {
				if (values.indexOf(' ') > -1) {
					comma = values.split(' ')
				}
				if (comma?.length > 0) {
					obj = {
						[(key)]: {
							['_in']: comma.toString()
						}
					}
				} else {
					console.log("=====>", operator)
					obj = {
						[(key)]: {
							[operator]: values
						}
					}
				}
			} else if ((operator === '_null' || operator === '_null')) {

				obj = {
					[(key)]: {
						[operator]: true
					}
				}
			} else if (operator === '_between' || operator === '_nbetween') {
				let fromdate = filterColumns[key].dateFrom
				let todate = filterColumns[key].dateTo
				if (fromdate && !todate) {
					values = fromdate
				}
				if (fromdate && todate) {
					let dates = [];
					dates.push(fromdate, todate)
					values = dates.toString()
				}
				if (values.indexOf(',') > -1) {
					comma = values.split(',')
				}
				if (comma?.length > 0) {
					obj = {
						[(key || field)]: {
							[operator]: comma.toString()
						}
					}
				} else {
					obj = {
						[(key || field)]: {
							[operator]: item.values
						}
					}
				}

			}
			else {
				if ((key) !== "project_id.client.client_name") {
					if (filterType === 'text') {
						obj = {
							"_or": [
								{
									[(key)]: {
										[operator]: values
									}
								}


							]
						}
					} else {
						if (operator === '_null' || operator === '_nnull') {
							obj = {
								[(key)]: {
									[operator]: true
								}
							}
						}else {
							obj = {
								[(key)]: {
									[operator]: values.trim()
								}
							}
						}

						
					}
				}

			}
		}
		filters.push(obj)
		// }
		if (filters?.length > 0) {
			filterVal = filters
		}
	})

	return filters
}

export const calculateDays = (startDate) => {
	const start = moment(startDate); // Parse the start date
	const end = moment(); // Parse the end date
	const dayDifference = end.diff(start, 'days'); // Calculate difference in days
	return dayDifference;
};