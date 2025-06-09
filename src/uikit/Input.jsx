import React from 'react';
import { Form, Input, DatePicker } from 'antd';
import styles from './uikit.less';

export const CustomInput = (props) => {
	const classes = props.type === 'borderless' ? styles.inputNoBorder : styles.inputBorder;
	let iconClass = props.hideIcon ? styles.inputHideIcon : false;

	// if (!props.inputprops.prefix) {
	// 	iconClass = styles.inputHideIcon;
	// 	props.inputprops.prefix = <div style={{ display: 'none' }} />;
	// }

	return (
		<Form.Item {...props} className={[ styles.input, classes, iconClass ].join(' ')}>
			<Input {...props.inputprops} />
		</Form.Item>
	);
};

export default CustomInput;
