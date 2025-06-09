import React from 'react';
import { Form, DatePicker} from 'antd';
import styles from './uikit.less';

export const Picker = (props) => {
	const classes = props.type === 'borderless' ? styles.pickerNoBorder : styles.pickerBorder;
	return (
		<Form.Item {...props} className={[ styles.picker, classes ].join(' ')}>
			<DatePicker {...props.inputprops} />
		</Form.Item>
	);
};

export default Picker;
