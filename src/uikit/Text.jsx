import React from 'react';
import { Typography } from 'antd';
import styles from './uikit.less';

export const Text = (props) => {
	let classes;
	let colorClass;
	let customclass = props.customclass ? props.customclass : false;

	if (props.texttype === 'h1') {
		classes = styles.textH1;
	} else if (props.texttype === 'h1small') {
		classes = styles.textH1Small;
	} else if (props.texttype === 'h2large') {
		classes = styles.textH2Large;
	} else if (props.texttype === 'h2') {
		classes = styles.textH2;
	} else if (props.texttype === 'h3') {
		classes = styles.textH3;
	} else if (props.texttype === 'h3light') {
		classes = styles.textH3Light;
	} else if (props.texttype === 'webinfo') {
		classes = styles.textWebInfo;
	} else if (props.texttype === 'webmenu') {
		classes = styles.textWebMenu;
	} else if (props.texttype === 'headline') {
		classes = styles.textHeadline;
	} else if (props.texttype === 'title') {
		classes = styles.textTitle;
	} else if (props.texttype === 'lines') {
		classes = styles.textLines;
	} else if (props.texttype === 'info') {
		classes = styles.textInfo;
	} else if (props.texttype === 'button') {
		classes = styles.textButton;
	} else if (props.texttype === 'steps') {
		classes = styles.textSteps;
	} else if (props.texttype === 'back') {
		classes = styles.textBack;
	} else if (props.texttype === 'link') {
		classes = styles.textLink;
	} else {
		classes = styles.textTitle;
	}

	if (props.colortype === 'primary') {
		colorClass = styles.textPrimaryColor;
	} else if (props.colortype === 'secondary') {
		colorClass = styles.textSecondaryColor;
	} else if (props.colortype === 'light') {
		colorClass = styles.textLightColor;
	} else if (props.colortype === 'back') {
		colorClass = styles.textBackColor;
	} else if (props.colortype === 'info') {
		colorClass = styles.textInfoColor;
	} else {
		colorClass = styles.textDarkColor;
	}

	return props.level ? (
		<Typography.Text className={[ classes, colorClass, customclass ].join(' ')} {...props} />
	) : (
		<Typography.Title className={[ classes, colorClass, customclass ].join(' ')} {...props} />
	);
};

export default Text;
