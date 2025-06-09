import { UserAddOutlined, LoginOutlined, UserOutlined, QuestionCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React, { useState } from 'react';
import { history, connect } from 'umi';
import { CircleButton } from '@/uikit/CircleButton';
import { ReactComponent as Peopleicon } from '@/assets/formicons/people.svg';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = (props) => {
	const { dispatch, currentUser, menu } = props;
	const [ selectedKeys, setSelectedKeys ] = useState([ 'login' ]);

	const onMenuClick = (event) => {
		const { key } = event;
		setSelectedKeys(key);

		if (key === 'login') {
			history.push(`/user/login`);
			return;
		}
		if (key === 'register') {
			history.push(`/user/register`);
			return;
		}
	};

	const menuHeaderDropdown = (
		<Menu className={styles.menu} selectedKeys={selectedKeys} onClick={onMenuClick}>
			{menu && (
				<Menu.Item key="login">
					<div className={styles.menuItemWrapper}>
						<LoginOutlined />
						Log in
					</div>
				</Menu.Item>
			)}
			{menu && <Menu.Divider style={{ background: 'rgba(255, 255, 255, 0.2)' }} />}
		</Menu>
	);

	let className = styles.right;

	return (
		<div className={className}>
			{/* <HeaderDropdown overlay={menuHeaderDropdown}>
				<span className={`${styles.action} ${styles.account}`}>
					<CircleButton size="small" className={styles.avatar} icon={<QuestionCircleOutlined />} />
				</span>
			</HeaderDropdown> */}
		</div>
	);
};

export default connect(({ user }) => ({
	currentUser: user.currentUser
}))(AvatarDropdown);
