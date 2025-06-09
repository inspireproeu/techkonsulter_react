import React from 'react';
import { Form, Radio } from 'antd';
import styles from './uikit.less';

export const CustomRadio = (props) => {
	return (
		<Form.Item {...props} className={[ styles.radio ].join(' ')}>
			<Radio.Group {...props.inputprops}>
				{props.options.map((item, index) => (
					<Radio key={index} value={item.value} className={styles.radioButton}>
						{item.label}
					</Radio>
				))}
			</Radio.Group>
		</Form.Item>
	);
};

export default CustomRadio;
