import React from 'react';
import { Avatar } from 'antd';
import styles from './uikit.less';

export const CircleButton = (props) => {
	return (
		<Avatar {...props} className={[ styles.circleButton ].join(' ')} />
	);
};

export default CircleButton;
