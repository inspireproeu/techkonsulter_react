import React from 'react';
import { Form, Select } from 'antd';
import styles from './uikit.less';
const { Option } = Select;

export const CustomSelect = (props) => {
	return (
		<Form.Item {...props} className={[ styles.select ].join(' ')}>
			<Select {...props.inputprops}>
				{props.options.map((item, index) => (
					<Option key={index} value={item.value}>
						{item.label}
					</Option>
				))}
			</Select>
		</Form.Item>
	);
};

export default CustomSelect;
