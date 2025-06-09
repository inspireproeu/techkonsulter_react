import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import {
    SettingOutlined,
    CloseSquareOutlined,
    CheckSquareFilled
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
    Button as Btn,
    Select
} from 'antd';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const Filter = ({
    columnDefs,
    setTempColumnDefs,
    submitFilter,
    onClick,
    setIsSelect,
    isSelect,
    values,
    setValues
}) => {
    const { Option } = Select;

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [filterColumns, setFilterColumns] = useState([]);
    useEffect(() => {
        if (columnDefs) {
            setFilterColumns(columnDefs)
        }

    }, [columnDefs])

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        // if (!open) {
        //   submitFilter()
        // }
        setState({ ...state, [anchor]: open });
    };

    const icon = <CloseSquareOutlined fontSize="small" />;
    const checkedIcon = <CheckSquareFilled fontSize="small" />;

    const setCheckbox = (item, i) => {
        let temp = columnDefs;
        item.checked = !item.checked;
        temp[i] = item;
        setTempColumnDefs(temp);
    }

    return (
        <ul className="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-3 mt-4 side_filter">
            <li className="nav-item mb-2" data-placement="left">
                <Link to="#" className="btn btn-sm btn-icon  btn-text-primary btn-hover-primary">
                    <SettingOutlined onClick={toggleDrawer('right', true)}></SettingOutlined>
                    <React.Fragment key={'anchor'}>
                        {/* <Button>{'right'}</Button> */}
                        <Drawer
                            anchor={'right'}
                            open={state['right']}
                            onClose={toggleDrawer('right', false)}
                        >
                            <div>
                                <div style={{ width: '100%', margin: '15px' }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Btn onClick={() => onClick(isSelect ? false : true)} style={{ verticalAlign: 'bottom', background: 'green', color: '#FFFFFF' }} >
                                                    {isSelect ? 'UnSelect all' : 'Select all'}
                                                </Btn>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Btn onClick={() => submitFilter(null, true)} style={{ verticalAlign: 'bottom', background: '#009ef7', color: '#FFFFFF' }} >
                                                    STD view
                                                </Btn>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Btn onClick={() => submitFilter(null, false)} style={{ verticalAlign: 'bottom', background: '#009ef7', color: '#FFFFFF' }}  >
                                                    Apply
                                                </Btn>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </div>
                                <List className="sidebar">
                                    {filterColumns?.length > 0 && filterColumns.map((option, index) => (
                                        !option.hide &&
                                        <ListItem key={index}>
                                            {
                                                (option.field !== 'actions') ? <><Button type="text" disableFocusRipple disableElevation
                                                    disabled={option.field == 'actions' ? true : false}
                                                    onClick={() => { setCheckbox(option, index) }} style={{ width: '100%', justifyContent: 'flex-start' }} startIcon={option.checked ? checkedIcon : icon}>
                                                    {option.header_name}
                                                </Button>
                                                </> : null
                                            }
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Drawer>
                    </React.Fragment>
                </Link>
            </li>
        </ul >
    );
};

export default Filter;
