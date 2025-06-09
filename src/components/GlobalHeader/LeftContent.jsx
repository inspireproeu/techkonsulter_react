import { Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, SelectLang, history} from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIconView from './NoticeIconView';

import logo from '../../assets/logo.jpg';
import logoText from '../../assets/logo.png';

const ENVTagColor = {
	dev: 'orange',
	test: 'green',
	pre: '#87d068'
};

const GlobalHeaderLeft = (props) => {
	const { theme, layout, currentUser } = props;
	let className = styles.left;
	let page;
	if (theme === 'dark' && layout === 'top') {
		className = `${styles.left}  ${styles.dark}`;
	}
	// if (currentUser?.role?.name === 'customer') {
	// 	page = '/dashboard'	
	// } else {
	// 	page = '/customer';
	// }

	return (
		<div className={className} onClick={() => history.push(page)}>
			{/* <div className={styles.headerLogo}>
				<img src={logo} />
			</div> */}
			<div className={styles.headerLogoText}>
				<img src={logoText} />
			</div>
		</div>
	);
};

export default connect(({ settings, user }) => ({
	theme: settings.navTheme,
	layout: settings.layout,
	currentUser: user.currentUser
}))(GlobalHeaderLeft);
