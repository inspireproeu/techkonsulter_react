import { LogoutOutlined, SettingOutlined, UserOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React, { useState } from 'react';
import { history, connect } from 'umi';
import { CircleButton } from '@/uikit/CircleButton';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import UPDATEUSER from '../../pages/users/components/AddNewUser';

const AvatarDropdown = (props) => {
	const { dispatch, currentUser, menu, localeLanguage } = props;
	const [profileshow, setProfileshow] = useState(false);
	const [editData, seteditData] = useState({})

	const onMenuClick = (event) => {
		const { key } = event;

		if (key === 'logout') {
			localStorage.setItem('logoutmessage', 'please login again before making any changes'); // auto reload
			if (dispatch) {
				logout(dispatch);
			}

			return;
		}

		if (key === 'profile') {
			seteditData(currentUser)
			setProfileshow(true)
			return;
		}
	};

	const logout = () => {
		dispatch({
			type: 'user/logoutmessage'
		});
		dispatch({
			type: 'login/logoutResponse',
			payload: 'Logged out : please login again before making any changes'
		});
		dispatch({
			type: 'login/logout'
		});
	}

	const callCurrentUser = () => {
		dispatch({
			type: 'user/fetchCurrent',
		});
	}
	const menuHeaderDropdown = (
		<Menu className={styles.menu} onClick={onMenuClick}>
			{/* {
				<Menu.Item key="logout" className={styles.logoutbutton}>
					<div className={styles.menuItemWrapper}>
						{currentUser ? 'Logged' : 'Not Logged'}
					</div>
				</Menu.Item>
			} */}
			{menu && <Menu.Divider style={{ height: 2, background: 'rgba(255, 255, 255, 0.2)' }} />}
			<Menu.Item key="profile" className={styles.logoutbutton}>
				<div className={styles.menuItemWrapper}>
					{'Profile'}
				</div>
			</Menu.Item>
			{menu && <Menu.Divider style={{ height: 2, background: 'rgba(255, 255, 255, 0.2)' }} />}
			<Menu.Item key="logout" className={styles.logoutbutton}>
				<div className={styles.menuItemWrapper}>
					<LogoutOutlined />
					{'Logout'}
				</div>
			</Menu.Item>
		</Menu>
	);

	return <>
		{
			currentUser && currentUser.id ? (
				<HeaderDropdown overlay={menuHeaderDropdown}>
					<span>
						<span className={`${styles.email} anticon`}>{currentUser ? 'Logged' : 'Not Logged'}</span>
						<CircleButton size="small" className={styles.avatar} icon={<UserOutlined style={{ color: '#FFFFFF' }} />} />
						<span className={`${styles.name} anticon`}>{currentUser?.role?.description}</span>
						{/* <span className={`${styles.name} anticon`}>{currentUser?.role?.description}</span> */}
					</span>
				</HeaderDropdown>
			) : (
				<span className={`${styles.action} ${styles.account}`}>
					<Spin
						size="small"
						style={{
							marginLeft: 8,
							marginRight: 8
						}}
					/>
				</span>
			)
		}
		<UPDATEUSER
			currentpage="profile"
			open={profileshow}
			setOpen={setProfileshow}
			title={`User Profile`}
			editData={editData}
			logout={logout}
			seteditData={seteditData}
			callCurrentUser={callCurrentUser}
		/>
	</>
};

export default connect(({ user, language }) => ({
	currentUser: user.currentUser,
}))(AvatarDropdown);
