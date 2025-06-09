import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Button
} from 'antd';

const useStyles = makeStyles((theme) =>
    createStyles({
        selected: {
            background: '#004750 !important',
            border: '1px solid',
            color: '#ffffff !important',
            cursor: 'pointer',
            marginLeft: '4px'
        },
        notselected: {
            background: '#ffffff !important',
            border: '1px solid',
            color: '#898b8eeb !important',
            cursor: 'pointer',
            marginLeft: '4px'
        },
    })
);

export default (props) => {
    const classes = useStyles();
    const [selectedGrade, setSelectedGrade] = useState('')
    const handleSave = (value) => {
        setSelectedGrade(value)
        props.data.default_grade = value;
        // console.log("props.data.a_grade_values", props)
        // // return;
        props.handleSave(props);
    };
    // console.log("props.value", props.colDef.cellRendererParams.grades)

    return (
        <>
            <span>
                {
                    <>
                        {

                            props.colDef.cellRendererParams && props.colDef.cellRendererParams?.grades?.length > 0 && props.colDef.cellRendererParams?.grades.map((item, index) => {

                                return <>
                                    <Button key={index} className={(selectedGrade === item) || (parseFloat(props.value) === parseFloat(item)) ? classes.selected : classes.notselected} onClick={() => handleSave(item)}>{item}</Button></>

                            })
                        }
                    </>
                }
            </span>
        </>
    );
};