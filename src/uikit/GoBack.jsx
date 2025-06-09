import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import './uikit.less';
import { history } from 'umi';

export const CustomGoBackButton = (
    {
        to,
        color,
        title
    }
) => {


    return <Button
        variant="contained"
        color={color}
        style={{ verticalAlign: 'bottom', background: '#ed6c02', color: '#FFFFFF' }}
        onClick={() => {
            history.push({
                pathname: `/${to}`,
            });
        }}
        className={"actionbutton"}
    >
        <span className='indicator-label'>{title}</span>
    </Button>;
};

export default CustomGoBackButton;
