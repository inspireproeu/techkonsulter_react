import React from 'react';
import { Form, Button } from 'antd';
import styles from './uikit.less';

export const CustomButton = (props) => {
	let classes;
	let colorClasses = false;
	if (props.buttontype === 'type1') {
		classes = styles.buttonType1;
	} else if (props.buttontype === 'type2') {
		classes = styles.buttonType2;
	} else if (props.buttontype === 'type3') {
		classes = styles.buttonType3;
	} else if (props.buttontype === 'type4White') {
		classes = styles.buttonType4White;
	} else if (props.buttontype === 'type4') {
		classes = styles.buttonType4;
	} else if (props.buttontype === 'type4Dark') {
		classes = styles.buttonType4Dark;
	} else if (props.buttontype === 'type5') {
		classes = styles.buttonType5;
	} else if (props.buttontype === 'type6') {
		classes = styles.buttonType6;
	} else if (props.buttontype === 'type7') {
		classes = styles.buttonType7;
	} else {
		classes = styles.buttonType4;
	}

	return <Button {...props} className={[ styles.button, classes ].join(' ')} type="primary" />;
};

export default CustomButton;
