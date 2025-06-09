import React from 'react';
import { Form, Slider } from 'antd';
import styles from './uikit.less';

export const CustomSlider = (props) => {
	const classes = props.inputprops.value === 0 ? styles.sliderZero:false;
	return (
		<Form.Item
			{...props}
			className={[ styles.slider, classes ].join(' ')}
			style={{
				display: 'inline-block',
				width: '100%',
				height: 100,
				marginLeft: 0
			}}
		>
			<Slider {...props.inputprops} style={{ marginBottom: 20 }}>
				{props.inputprops.text ? <br /> : false}
				{props.inputprops.text ? <br /> : false}
				{props.inputprops.text ? props.inputprops.text : false}
			</Slider>
		</Form.Item>
	);
};

export default CustomSlider;
