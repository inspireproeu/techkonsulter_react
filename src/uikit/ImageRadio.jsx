import React from 'react';
import { Form, Radio } from 'antd';
import styles from './uikit.less';

export const ImageRadio = (props) => {
	return (
		<Form.Item {...props} className={[ styles.imageRadio ].join(' ')}>
			<Radio.Group {...props.inputprops}>
				{props.options.map((item, index) => (
					<Radio.Button key={index} value={item.value} className={styles.imageRadioButton}>
						<div className={styles.imageRadioWrapper}>
							{item.icon}{item.label}
						</div>
					</Radio.Button>
				))}
			</Radio.Group>
		</Form.Item>
	);
};

export default ImageRadio;
