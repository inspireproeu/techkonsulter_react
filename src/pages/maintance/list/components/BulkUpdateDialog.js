import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import QueueAnim from 'rc-queue-anim';
import { CustomButton } from '@/uikit/Button';
import { CustomInput } from '@/uikit/Input';
import { message, Form, Row, Col } from 'antd';
import { CustomRadio } from '@/uikit/Radio';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import React, { useState, useContext } from 'react';

import { DATAURLS } from '../../../../utils/constants';
import { fetchPut, fetchGet } from '../../../../utils/utils';
// const accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload
import { getAccessToken } from '@/utils/authority';

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogTitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '40px',
      background: 'linear-gradient(to right, #eef2f3, #8e9eab)',
      boxShadow: '1px 1px 3px #8e9eab',
    },
    dialogRoot: {
      width: '650px !important',
      height: '500px',
      //   display: 'flex',
      //   flexDirection: 'column',
    },
    dialogTitleText: {
      // fontFamily: "'Poppins'",
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: '0.85rem',
    },
    dialogContent: {
      marginTop: '10px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '50%',
      marginBottom: '15px',
      marginRight: '15px',
    },
    button: {
      marginLeft: '15px',
    },
    uploadIcon: {
      fontSize: '80px'
    },
    animatedItem: {
      animation: `$myEffect 300ms ${theme.transitions.easing.easeInOut}`,
    },
    successIcon: {
      color: '#004750',
      marginBottom: '15px',
    },
    uploadArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // color: '#ababab',
      '&:hover': {
        color: '#004750',
        cursor: 'pointer',
      },
    },
    successArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    buttonProgress: { marginLeft: '5px' },
  })
);

const BulkUpdateDialog = ({
  open,
  setOpen,
  title,
  parentGridApi,
  getNewData,
  reductionData
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [enableSubmission, setEnableSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [actionType, setActionType] = useState('fixed')
  const [form] = Form.useForm();
  const { validateFields, getFieldsValue } = form;
  const [updateRecordsCount, setUpdateRecordsCount] = useState(0);


  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    setGridApi(params.api);
    setEnableSubmission(false);
  };

  const onCellEditingStarted = (params) => {
    setEnableSubmission(false);
  };
  const handleSubmit = async () => {
    const values = await validateFields();

    // setLoading(true);
    let updateObject = {};
    // selectedRows.forEach((row) => {
    //   updateObject[row.field] = row.value;
    // });
    let selectedData = [];
    // values.fix_value
    selectedData = parentGridApi.getSelectedRows().map((row) => {
      if (row.a_grade_values) {
        // let status = 'IN STOCK'
        // let asset_type = row.asset_type.toUpperCase() || null
        // let modelquery = ""
        // if (row.model) {
        //   modelquery = `,{"model":{"_eq":"${row.model}"}}`
        // }
        // let processorquery = ""
        // if (row.processor) {
        //   processorquery = `,{"processor":{"_eq":"${row.processor}"}}`
        // }
        // let manuquery = ""
        // if (row.manufacturer) {
        //   manuquery = `,{"manufacturer":{"_eq":"${row.manufacturer}"}}`
        // }
        let asset_type = row.asset_type.toUpperCase() || null
        let manufacturer = row.manufacturer ? row.manufacturer.toUpperCase() : ""
        let processor = row.processor ? row.processor.toUpperCase() : ""
        let model = row.model ? row.model.toUpperCase() : ""
    
        //,{"manufacturer":{"_eq":"${manufacturer}"}},{"processor":{"_eq":"${processor}"}},
        // let fieldsQuery = `limit=-1&filter={"_and":[{"_and":[]},{"status":{"_eq":"${status}"}},{"asset_type":{"_eq":"${asset_type}"}}${modelquery}${processorquery}${manuquery}]}&fields=asset_id,grade,status,asset_type,manufacturer,model,processor,part_no,a_grade_values,default_grade,grade_last_update`
        setLoading(true)
        let fields = `asset_type=${asset_type}&processor=${processor}&manufacturer=${manufacturer}&model=${model}`

        fetchGet(`${DATAURLS.PRICINGASSETS.url}?${fields}`, getAccessToken())
          .then(async (response) => {
            // setRowData(response.data);
            let data = {
              asset_type: row.asset_type,
              manufacturer: row.manufacturer ? row.manufacturer : '',
              model: row.model ? row.model : '',
              processor: row.processor ? row.processor : '',
              part_no: row.part_no ? row.part_no : '',
              a_grade_values: row.a_grade_values,
              fix_value: values.fix_value,
              percentage: values.percentage,
              actiontype: values.actiontype,
              valueType: values.valueType

            };
            const updateRows = await handlePricingUpdate(response.data, data)

            if (updateRows && updateRows.length > 0) {
              try {
                let updateSuccess = ''
                // for (let j = 0; j <= assetIDRows.length; j += 20) {
                // let filterassetIDRows = tempassetIDRows.slice(i, noofRequests + i);
                let filterassetIDRows = updateRows;
                // console.log("filterassetIDRows", filterassetIDRows)
                for (let i = 0; i <= filterassetIDRows.length; i++) {
                  if (updateRows.length > 0 && filterassetIDRows[i] && filterassetIDRows[i].asset_id) {
                    // console.log(filterassetIDRows.length,"assetIDRows", assetIDRows.length)
                    if (updateRecordsCount === filterassetIDRows.length) {
                      break
                    }
                    updateSuccess = await fetchPut(
                      `${DATAURLS.ASSETS.url}/${filterassetIDRows[i].asset_id}`,
                      filterassetIDRows[i],
                      getAccessToken()
                    )
                    setUpdateRecordsCount(i + 1);

                  }
                }

                // console.log("updated success", updateSuccess)
                if (updateSuccess?.data?.asset_id) {
                  // console.log("updateSuccess", updateSuccess)
                  // summaryOffset += filterassetIDRows.length;
                  setUpdateRecordsCount(0);
                  // set
                  setSuccess(true)
                  setLoading(false);
                }
                // }
              } catch (err) {
                console.log('update error', err);
                setLoading(false);
                setUpdateRecordsCount(0);
                setFileUploadErrorMessage("Failed to update. Try after something");
                throw err;
              }
            }
            // console.log("updateRows", updateRows)
          })
          .catch((err) => {
            throw err;
          });

      }
    });
  }

  const getGradeValue = (props, reduction = null) => {
    // console.log(props, "reductionData", data)

    let filtered_array = _.filter(reductionData,
      { 'reduction': props.default_grade }
    );
    // console.log("filtered_array", filtered_array)

    return filtered_array[0] ? filtered_array[0][props.grade.toUpperCase()] : 0
  }

  const handlePricingUpdate = async (rows = [], data = null) => {
    if (rows.length > 0) {
      let promise = new Promise((resolve, reject) => {
        rows.map(async (field) => {
          // let grade = field.grade.toLowerCase();
          if (field.a_grade_values) {
            // console.log(gradeValues[grade], "default grade", percentage.VALUE)
            let changedValue = 0
            if (data.fix_value) {
              changedValue = parseFloat(data.fix_value)
            } else {
              changedValue = ((parseFloat(field.a_grade_values) / 100) * parseFloat(data.percentage))
            }
            // console.log(data.valueType, "changedValue", changedValue)

            if (data.actiontype === 'plus') {
              field.a_grade_values = (parseFloat(field.a_grade_values) + parseFloat(changedValue)).toFixed(2);
            } else {
              field.a_grade_values = (parseFloat(field.a_grade_values) - parseFloat(changedValue)).toFixed(2);
            }
            if (field.grade) {
              let gradeUpper = field.grade.toUpperCase();
              if (gradeUpper === 'A' || gradeUpper === 'A+') {
                field.target_price = field.a_grade_values ? parseFloat(field.a_grade_values) : null;
              } else {
                let percentage = getGradeValue(field, reductionData);
                // console.log(gradeUpper, "percentage", percentage)
                let price = null;
                if (field.a_grade_values) {
                  field.target_price = percentage ? ((parseFloat(field.a_grade_values) / 100) * Number(percentage)) : null
                }
                field.target_price = price;
                // let percentage = gradeValues[gradeUpper].find(element => element["NAME"] === field.default_grade);
                // field.price = percentage.VALUE ? ((parseFloat(field.a_grade_values) / 100) * Number(percentage.VALUE)).toFixed(2) : 0
              }
            }

          } else {
            field.target_price = field.a_grade_values ? parseFloat(field.a_grade_values).toFixed(2) : null;
          }
        });
        resolve(rows)
      })
      return promise
    }
  }
  const zoomAnmation = {
    appear: true,
    type: ['right', 'left'],
    component: 'div',
    interval: [200, 0],
    duration: [750, 0],
    ease: ['easeOutCirc', 'easeOutCirc'],
    animConfig: [{ x: [0, 0], scale: [1, 0] }, { x: [0, 0], scale: [0, 1] }]
  };

  return (
    <Dialog
      open={open}
      //   onClose={getNewData(p)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='md'
      className='dialogRoot'
      classes={{ paper: classes.dialogRoot }}
    >
      <DialogTitle id='alert-dialog-title' className={classes.dialogTitle}>
        <div className={classes.dialogTitleText}>{title}</div>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <Form
          layout="vertical"
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name="customerForm"
        // initialValues={customersById.data}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        // onValuesChange={onValuesChange}
        >
          {
            !success &&
            < QueueAnim
              {...zoomAnmation}
              forcedReplay
              component="div"
            >
              <Row gutter={8} key="1">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomRadio
                    key="actiontype"
                    rules={[
                      {
                        required: true,
                        message: 'Action Type is required'
                      }
                    ]}
                    label="Action Type"
                    name="actiontype"
                    // inputprops={{ onChange: (e) => setdetailedplan(e.target.value) }}
                    options={[{ value: 'plus', label: 'Increase' }, { value: 'minus', label: 'Decrease' }]}
                  />
                </Col>
              </Row>
              <Row gutter={8} key="2">
                <Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomRadio
                    key="valueType"
                    label="Action Type"
                    name="valueType"
                    inputprops={{ defaultValue: 'fixed', onChange: (e) => setActionType(e.target.value) }}
                    options={[{ value: 'fixed', label: 'Fixed Value' }, { value: 'percentage', label: 'Percentage' }]}
                  />
                </Col>
                {actionType === 'fixed' && <Col span={11} md={{ span: 11 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="Fix value"
                    label="Fix value"
                    name="fix_value"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Fix value is required'
                    //   }
                    // ]}
                    inputprops={{
                      placeholder: "",
                      prefix: '€',
                      onChange: (e) => {
                        const { value } = e.target;
                        let newval =
                          value != undefined ? value.replace(/\D/g, '') : '';
                        form.setFieldsValue({
                          'fix_value': newval.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ','
                          )
                        });
                      }
                    }}
                  />
                </Col>}
                {actionType === 'percentage' && <Col span={11} md={{ span: 11 }} xs={{ span: 24 }} sm={{ span: 24 }}>
                  <CustomInput
                    key="percentage"
                    name="percentage"
                    label="%-ish changes"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '%-ish changes is required'
                    //   }
                    // ]}
                    inputprops={{
                      placeholder: "",
                      prefix: '%',
                      onChange: (e) => {
                        const { value } = e.target;
                        let newval =
                          value != undefined ? value.replace(/\D/g, '') : '';
                        form.setFieldsValue({
                          'percentage': newval.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ','
                          )
                        });
                      }
                    }}
                  />
                </Col>}
              </Row>

            </QueueAnim>
          }
          {success && <div style={{ fontSize: 24, textAlign: 'center' }}>Update Successful</div>}

          <DialogActions>
            {success && (
              <div className={classes.buttonContainer}>
                <Button
                  variant='contained'
                  color='primary'
                  className={classes.button}
                  onClick={() => {
                    getNewData(parentGridApi);
                    parentGridApi.deselectAll();
                    setSuccess(false);
                    setOpen(false);
                    form.resetFields()
                  }}
                >
                  Ok!
            </Button>
              </div>
            )}
            {!success && (
              <div className={classes.buttonContainer}>
                <Button
                  variant='contained'
                  onClick={() => setOpen(false)}
                  color='secondary'
                  disabled={loading}
                  className={classes.button}
                >
                  Cancel
            </Button>
                <Button
                  variant='contained'
                  onClick={() => handleSubmit()}
                  color='primary'
                  // disabled={loading || !enableSubmission}
                  className={classes.button}
                >
                  Confirm
              {loading && (
                    <CircularProgress
                      size='1rem'
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </div>)
            }
          </DialogActions>
        </Form>
      </DialogContent>

    </Dialog >
  );
};

export default BulkUpdateDialog;
