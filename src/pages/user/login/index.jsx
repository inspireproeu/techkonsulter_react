import { RightCircleOutlined } from '@ant-design/icons';
import { Alert, Col, Row, Button, message, Form, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, history } from 'umi';

import { Text } from '@/uikit/Text';
import { CustomInput } from '@/uikit/Input';
import QueueAnim from 'rc-queue-anim';
import { CustomButton } from '@/uikit/Button';
import { useMobile, useMobileSmall } from '@/utils/utils';
import { FormattedMessage, getLocale, setLocale } from 'umi';

import styles from '../style.less';
import LoginFrom from './components/Login';
import { ReactComponent as Mailicon } from '@/assets/formicons/mail.svg';
import { ReactComponent as Keyicon } from '@/assets/formicons/key.svg';
import logoDark from '../../../assets/logo_new.png';


const zoomAnmation = {
	appear: true,
	type: ['right', 'left'],
	component: 'div',
	interval: [200, 0],
	duration: [750, 0],
	ease: ['easeOutCirc', 'easeOutCirc'],
	animConfig: [{ x: [0, 0], scale: [1, 0] }, { x: [0, 0], scale: [0, 1] }]
};

const LoginMessage = ({ content }) => (
	<Alert
		style={{
			marginBottom: 24
		}}
		message={content}
		type="error"
		showIcon
	/>
);

const Login = (props) => {
	const isMobile = useMobile();
	const isMobileSmall = useMobileSmall();
	localStorage.setItem('logoutmessage', '');
	const { login = {}, submitting, localeLanguage } = props;
	const { status, type: loginType, loginStatus } = login;
	const [autoLogin, setAutoLogin] = useState(true);
	const [serviceError, setServiceError] = useState(false);
	const [type, setType] = useState('account');

	const handleSubmit = (values) => {
		// console.log("**** handle submit")
		const { dispatch } = props;
		dispatch({
			type: 'login/login',
			payload: { ...values, mode: "cookie" },
			errorHandler: (e) => {
				setServiceError(true);
				message.error(e.data.error.message);
			}
		});
	};

	useEffect(() => {
		// console.log("getLocale()", getLocale())
		localStorage.removeItem('antd-pro-authority'); // auto reload
		// console.log("**************")
		const { dispatch } = props;

		dispatch({
			type: 'user/resetCurrentUser'
		});
		dispatch({
			type: 'login/logout'
		});
		if (getLocale() === '') {
			setLocale('sv-SE', true)
		}
	}, [])


	return (
		<div>
			<div className={styles.header}>
				<div className={styles.textContainer}>
					<img src={logoDark} style={{ width: '160px' }} />
				</div>
			</div>
			<div className={styles.container}>
				{/* <div className={styles.inputContainer4}>
                    <img
                      src={logowhite}
                      width="15%"
                      // className={styles.image}
                      alt="login-image-work-chat"
                    />
                  </div>
                  <div className={styles.welcomeText}>
                    <h3>Tech konsulter production system</h3>
                  </div>
                  <div className={styles.inputContainer5}>
                    <img
                      src={WorkChatLog}
                      className={styles.image}
                      alt="login-image-work-chat"
                    />
                  </div> */}
				<div className={[styles.main, isMobile ? styles.mainmobile : false].join(' ')}>
					<div className={styles.formsection}>
						<Text style={{ paddingBottom: 20, paddingTop: 15 }} texttype="title" colortype="primary">
							Välkommen
						</Text>

						<LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
							{((status === 'error' && !submitting) || serviceError) && (
								<LoginMessage content={'Invalid username and password.'} />
							)}
							<QueueAnim
								{...zoomAnmation}
								forcedReplay
								component="div"
							>
								<Row gutter={8} key="5">
									<Col span={24} md={{ span: 24 }} xs={{ span: 24 }} sm={{ span: 24 }}>
										<CustomInput
											name="email"
											label={'E-Mail'}
											rules={[
												{
													required: true,
													message: 'Required'
												}
											]}
											size="large"
											// type="borderless"
											id="userName"
											inputprops={{ placeholder: `E-Mail`, prefix: <Mailicon /> }}
										/>
									</Col>
								</Row>
							</QueueAnim>
							<QueueAnim
								{...zoomAnmation}
								forcedReplay
								component="div"
							>
								<Row gutter={8} key="5">
									<Col span={24} md={{ span: 24 }} xs={{ span: 24 }} sm={{ span: 24 }}>
										<CustomInput
											name="password"
											label={'password'}
											rules={[
												{
													required: true,
													message: 'Required'
												}
											]}
											size="large"
											//type="borderless"
											id="password"
											inputprops={{
												type: 'password',
												placeholder: `Password`,
												prefix: <Keyicon />
											}}
										/>
									</Col>
								</Row>
							</QueueAnim>
							{/* <a className={styles.links}>
					<Text texttype="link" colortype="info">
						Glöm lösenord?
					</Text>
				</a> */}

							<Form.Item>
								<CustomButton
									buttontype="type4Dark"
									type="primary"
									loading={submitting}
									htmlType="submit"
								>
									{'Login'}
								</CustomButton>
							</Form.Item>
						</LoginFrom>
					</div>
				</div>
			</div>
		</div>

	);
};

export default connect(({ login, loading }) => ({
	login,
	submitting: loading.effects['login/login']
}))(Login);
