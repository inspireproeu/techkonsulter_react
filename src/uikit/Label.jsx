import React from 'react';
import { Form } from 'antd';
import styles from './uikit.less';

export const Label = (props) => {  
	return (
		<Form.Item {...props} className={[ styles.label ].join(' ')} />
	);
};

export default Label;
