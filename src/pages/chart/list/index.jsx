import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';

import { useState, useEffect, useContext } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import { AppTheme } from '../../../utils/Theme';
import { DATAURLS } from '../../../utils/constants';
import {
  fetchPut,
  fetchPost,
  fetchGet,
  fetchDelete,
} from '@/utils/utils';
import { Column } from '@ant-design/plots';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const accesstoken = localStorage.getItem('antd-pro-accesstoken'); // auto reload
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      //   display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '93vh',
      //   marginLeft: '4vw',
      // marginTop: '80px',
    },

    buttonBox: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '50%',
    },
    buttonArea: {
      display: 'flex',
    },
    select: {
      color: 'white',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      // color: '#212121',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1rem',
      // marginTop: '10px',
      width: '95%',
      height: '40px',
      boxShadow: '0px 0px 5px #222',
      paddingLeft: '10px',
      background:
        'linear-gradient(90deg, rgba(39,105,85,1) 55%, rgba(39,96,0,1) 100%)',
    },
    actionArea: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '30%',
    },
    actionIcon: {
      fontSize: '1rem',
      cursor: 'pointer',
      color: theme.primary,
    },
    textRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
      height: '30px',
    },
    input: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  })
);



const Users = (props) => {
  const theme = useTheme(AppTheme);
  const classes = useStyles(theme);
  console.log("props", props)
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [processors, setProcessors] = useState([]);
  const [models, setModels] = useState([]);
  const [rowdata, setRowData] = useState([]);
  const [personName, setPersonName] = React.useState([]);
  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    getNewData()
  }, []);

  const getNewData = async () => {
    setLoading(true);

    // Fetching all users
    fetchGet(DATAURLS.PRICINGCHART.url, accesstoken)
      .then((response) => {
        response.data.forEach(element => {
          element.soldprice = parseFloat(element.soldprice)
        });
        setRowData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

    // Fetching all user roles
    fetchGet(DATAURLS.MODELTYPES.url, accesstoken)
      .then((response) => {
        setModels(response.data);
      })
      .catch((err) => {
        throw err;
      });
    fetchGet(DATAURLS.PROCESSORTYPES.url, accesstoken)
      .then((response) => {
        setProcessors(response.data);
      })
      .catch((err) => {
        throw err;
      });
    fetchGet(DATAURLS.GRADETYPES.url, accesstoken)
      .then((response) => {
        setGrades(response.data);
      })
      .catch((err) => {
        throw err;
      });
  };

  //   function SVformatter(v) {
  //     return v ? new Number(Math.round(v)).toLocaleString("sv-SE", { minimumFractionDigits: 0 }) : 0;
  // }
  var barconfig = {
    data: rowdata,
    xField: 'datenor',
    yField: 'soldprice',
    seriesField: '',
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return (
    <div className={classes.root}>
      {/* <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<TextField label="Name" />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            null
            // <MenuItem
            //   key={name}
            //   value={name}
            //   // style={getStyles(name, personName, theme)}
            // >
            //   {name}
            // </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div> */}
      <div className={'sectionHeader'}>
        Chart
      </div>
      <div
        className='ag-theme-balham'
        style={{
          width: '95%',
          height: '80vh',
          boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)',
        }}
      >
      <div className='row gy-5 g-xl-12'>
        <div className='col-xl-12'>
          <div className="card card-custom gutter-b">
            <div
              className='card-header border-0 cursor-pointer'
            >
              <div className='card-title m-0'>
                <h3 className='fw-bolder m-0'>{''}</h3>
              </div>
            </div>
            <div className='card-body'>
              <div>
                <Column {...barconfig} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Users;
