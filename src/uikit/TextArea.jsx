import React from 'react';
import { Form, Input } from 'antd';
import styles from './uikit.less';

export const TextArea = (props) => {  
	const classes = props.type === 'borderless' ? styles.textAreaNoBorder : styles.textAreaBorder;
	return (
		<Form.Item {...props} className={[ styles.textArea, classes ].join(' ')}>
			<Input.TextArea {...props.inputprops} />
		</Form.Item>
	);
};

export default TextArea;
