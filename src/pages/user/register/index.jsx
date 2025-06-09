// import { LeftCircleOutlined } from '@ant-design/icons';
// import { Form, Button, Col, Input, Popover, Progress, Row, Select, message, Alert } from 'antd';
// import { ArrowLeftOutlined } from '@ant-design/icons';
// import React, { useState, useEffect } from 'react';
// import { Link, connect, history, FormattedMessage, formatMessage } from 'umi';
// import QueueAnim from 'rc-queue-anim';

// import { Text } from '@/uikit/Text';
// import { CustomInput } from '@/uikit/Input';
// import { CustomButton } from '@/uikit/Button';
// import { TextArea } from '@/uikit/TextArea';
// import { useMobile, useMobileSmall } from '@/utils/utils';

// import { ReactComponent as Mailicon } from '@/assets/formicons/mail.svg';
// import { ReactComponent as Keyicon } from '@/assets/formicons/key.svg';
// import { ReactComponent as Peopleicon } from '@/assets/formicons/people.svg';
// import { ReactComponent as Idcardicon } from '@/assets/formicons/idcard.svg';
// import { ReactComponent as Phoneicon } from '@/assets/formicons/phone.svg';
// import { ReactComponent as Briefcaseicon } from '@/assets/formicons/briefcase.svg';

// import styles from '../style.less';
// import logo from '../../../assets/light_logo_text.png';

// const FormItem = Form.Item;
// const { Option } = Select;
// const InputGroup = Input.Group;
// const passwordStatusMap = {
// 	ok: <div className={styles.success}>Strong</div>,
// 	pass: <div className={styles.warning}>Medium</div>,
// 	poor: <div className={styles.error}>Weak</div>
// };
// const passwordProgressMap = {
// 	ok: 'success',
// 	pass: 'normal',
// 	poor: 'exception'
// };

// const zoomAnmation = {
// 	appear: true,
// 	type: [ 'right', 'left' ],
// 	component: 'div',
// 	interval: [ 200, 0 ],
// 	duration: [ 750, 0 ],
// 	ease: [ 'easeOutCirc', 'easeOutCirc' ],
// 	animConfig: [ { x: [ 0, 0 ], scale: [ 1, 0 ] }, { x: [ 0, 0 ], scale: [ 0, 1 ] } ]
// };

// const LoginMessage = ({ content }) => (
// 	<Alert
// 		style={{
// 			marginBottom: 10
// 		}}
// 		closable
// 		description={content}
// 		type="error"
// 		showIcon
// 	/>
// );

// const Register = ({ submitting, dispatch, userAndregister }) => {
// 	const isMobile = useMobile();
// 	const isMobileSmall = useMobileSmall();

// 	const [ count, setcount ] = useState(0);
// 	const [ validationerror, setValidationerror ] = useState([]);
// 	const [ visible, setvisible ] = useState(false);
// 	const [ currentstep, setCurrentStep ] = useState(0);
// 	const [ popover, setpopover ] = useState(false);
// 	const [ prefix, setprefix ] = useState('86');
// 	const confirmDirty = false;
// 	const animduration = 1000;
// 	const animinterval = 200;
// 	const animtype = [ 'bottom', 'top' ];

// 	const sampleValues = {
// 		password: '123456',
// 		confirm: '123456',
// 		company: 'Inspirepro',
// 		first_name: 'Vivek',
// 		org_number: '1234567',
// 		last_name: 'test',
// 		phone: '123456789',
// 		email: 'fliptechsolutions@gmail.com',
// 		experience: 'Test',
// 		description: 'Good experience'
// 	};

// 	let interval;
// 	const [ form ] = Form.useForm();
// 	useEffect(
// 		() => {
// 			if (!userAndregister) {
// 				return;
// 			}

// 			const account = form.getFieldValue('email');

// 			if (userAndregister.status === 'ok') {
// 				//form.resetFields();
// 				message.success('Success');
// 				history.push({
// 					pathname: '/user/register-result',
// 					search: `?email=${account}`,
// 					state: {
// 						account
// 					}
// 				});
// 			}
// 		},
// 		[ userAndregister ]
// 	);
// 	useEffect(
// 		() => () => {
// 			clearInterval(interval);
// 		},
// 		[]
// 	);

// 	const onGetCaptcha = () => {
// 		let counts = 59;
// 		setcount(counts);
// 		interval = window.setInterval(() => {
// 			counts -= 1;
// 			setcount(counts);

// 			if (counts === 0) {
// 				clearInterval(interval);
// 			}
// 		}, 1000);
// 	};

// 	const getPasswordStatus = () => {
// 		const value = form.getFieldValue('password');

// 		if (value && value.length > 9) {
// 			return 'ok';
// 		}

// 		if (value && value.length > 5) {
// 			return 'pass';
// 		}

// 		return 'poor';
// 	};

// 	const onFinish = (values) => {
// 		setValidationerror([]);
// 		values['confirm_url'] = 'https://TECH KONSULTER.com';
// 		dispatch({
// 			type: 'userAndregister/submit',
// 			payload: { ...values, prefix },
// 			errorHandler: (e) => {
// 				//alert(JSON.stringify(e));
// 				//message.error(e.data.errors.email[0]);
// 				if (e.data.error && e.data.error) {
// 					setValidationerror([ e.data.error.message ]);
// 				}
// 			}
// 		});
// 	};

// 	const checkConfirm = (_, value) => {
// 		const promise = Promise;

// 		if (value && value !== form.getFieldValue('password')) {
// 			return promise.reject('Password not matching.');
// 		}

// 		return promise.resolve();
// 	};

// 	const checkPassword = (_, value) => {
// 		const promise = Promise; // 没有值的情况

// 		if (!value) {
// 			setvisible(!!value);
// 			return promise.reject('Password is required.');
// 		} // 有值的情况

// 		if (!visible) {
// 			setvisible(!!value);
// 		}

// 		setpopover(!popover);

// 		if (value.length < 6) {
// 			return promise.reject('Password should be minimum 6 characters.');
// 		}

// 		if (value && confirmDirty) {
// 			form.validateFields([ 'confirm' ]);
// 		}

// 		return promise.resolve();
// 	};

// 	const changePrefix = (value) => {
// 		setprefix(value);
// 		return false;
// 	};

// 	const renderPasswordProgress = () => {
// 		const value = form.getFieldValue('password');
// 		const passwordStatus = getPasswordStatus();
// 		return value && value.length ? (
// 			<div className={styles[`progress-${passwordStatus}`]}>
// 				<Progress
// 					status={passwordProgressMap[passwordStatus]}
// 					className={styles.progress}
// 					strokeWidth={6}
// 					percent={value.length * 10 > 100 ? 100 : value.length * 10}
// 					showInfo={false}
// 				/>
// 			</div>
// 		) : null;
// 	};

// 	const mergeNames = (arr) => _.chain(arr).mapValues((v) => _.chain(v).map('errors').flattenDeep()).value();

// 	const handleNext = () => {
// 		form
// 			.validateFields()
// 			.then((values) => {
// 				setValidationerror([]);
// 				setCurrentStep(1);
// 				return false;
// 			})
// 			.catch((errorInfo) => {
// 				const errorlist = [];
// 				errorInfo.errorFields.reduce((acc, obj) => {
// 					errorlist.push(obj.errors.join(', '));
// 				}, {});

// 				setValidationerror(errorlist.length > 0 ? errorlist.slice(0, 1) : []);
// 				return false;
// 			});
// 		return false;
// 	};

// 	const handlePrevious = () => {
// 		setCurrentStep(0);
// 		return false;
// 	};

// 	return (
// 		<div className={styles.container}>
// 			<div className={[ styles.main, isMobile ? styles.mainmobile : false, styles.registerpage ].join(' ')}>
// 				{!isMobile && (
// 					<div className={styles.contentsection}>
// 						<img alt="logo" className={styles.logo} src={logo} />

// 						<Text texttype="headline" colortype="light">
// 							Welcome back!
// 						</Text>
// 						<div className={styles.contentsectiontext}>
// 							<Text texttype="info" colortype="light">
// 								To keep connected with us please login with your personal info
// 							</Text>
// 						</div>

// 						<Link to="/user/login">
// 							<CustomButton buttontype="type7">Logga in</CustomButton>
// 						</Link>
// 					</div>
// 				)}

// 				<div className={styles.registerformsection}>
// 					<Text style={{ paddingBottom: 20, paddingTop: 15 }} texttype="title" colortype="primary">
// 						Registrera
// 					</Text>
// 					{validationerror.map((error) => <LoginMessage content={error} />)}

// 					<Form layout="vertical" form={form} name="UserRegister" onFinish={onFinish} initialValues={{}}>
// 						<QueueAnim
// 							{...zoomAnmation}
// 							forcedReplay={currentstep === 0}
// 							component="div"
// 							style={{ display: currentstep === 0 ? 'block' : 'none', minHeight: 300 }}
// 						>
// 							<Row gutter={8} key="6">
// 								<Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
// 									<CustomInput
// 										name="company"
// 										type="borderless"
// 										rules={[
// 											{
// 												required: true,
// 												message: 'Utvecklarens namn required'
// 											}
// 										]}
// 										inputprops={{ placeholder: 'Utvecklarens namn', prefix: <Briefcaseicon /> }}
// 									/>
// 								</Col>
// 								<Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
// 									<CustomInput
// 										name="org_number"
// 										type="borderless"
// 										rules={[
// 											{
// 												required: true,
// 												message: 'Org nummer Required'
// 											}
// 										]}
// 										inputprops={{ placeholder: 'Org nummer', prefix: <Idcardicon /> }}
// 									/>
// 								</Col>
// 							</Row>

// 							<Row gutter={8} key="2">
// 								<Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
// 									<CustomInput
// 										name="first_name"
// 										type="borderless"
// 										rules={[
// 											{
// 												required: true,
// 												message: 'Förnamn required'
// 											}
// 										]}
// 										inputprops={{ placeholder: 'Förnamn', prefix: <Peopleicon /> }}
// 									/>
// 								</Col>
// 								<Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
// 									<CustomInput
// 										name="last_name"
// 										type="borderless"
// 										rules={[
// 											{
// 												required: true,
// 												message: 'Efternamn Required'
// 											}
// 										]}
// 										inputprops={{ placeholder: 'Efternamn', prefix: <Peopleicon /> }}
// 									/>
// 								</Col>
// 							</Row>

// 							<Row gutter={8} key="3">
// 								<Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
// 									<CustomInput
// 										name="email"
// 										type="borderless"
// 										rules={[
// 											{
// 												required: true,
// 												message: 'E-post required'
// 											},
// 											{
// 												type: 'email',
// 												message: 'Invalid email format'
// 											}
// 										]}
// 										inputprops={{ placeholder: 'E-post', prefix: <Mailicon /> }}
// 									/>
// 								</Col>
// 								<Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
// 									<CustomInput
// 										name="phone"
// 										type="borderless"
// 										rules={[
// 											{
// 												required: true,
// 												message: 'Telefonnummer Required'
// 											}
// 										]}
// 										inputprops={{ placeholder: 'Telefonnummer', prefix: <Phoneicon /> }}
// 									/>
// 								</Col>
// 							</Row>
// 							<Row gutter={8} key="4">
// 								<Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
// 									<CustomInput
// 										name="password"
// 										type="borderless"
// 										className={
// 											form.getFieldValue('password') &&
// 											form.getFieldValue('password').length > 0 &&
// 											styles.password
// 										}
// 										rules={[
// 											{
// 												validator: checkPassword
// 											}
// 										]}
// 										inputprops={{
// 											type: 'password',
// 											placeholder: 'Lösenord',
// 											prefix: <Keyicon />
// 										}}
// 									/>
// 								</Col>
// 								<Col span={12} md={{ span: 12 }} xs={{ span: 24 }} sm={{ span: 24 }}>
// 									<CustomInput
// 										name="confirm"
// 										type="borderless"
// 										rules={[
// 											{
// 												required: true,
// 												message: 'Password is required.'
// 											},
// 											{
// 												validator: checkConfirm
// 											}
// 										]}
// 										inputprops={{
// 											type: 'password',
// 											placeholder: 'Confirm Lösenord',
// 											prefix: <Keyicon />
// 										}}
// 									/>
// 								</Col>
// 							</Row>
// 						</QueueAnim>
// 						{currentstep === 1 ? (
// 							<QueueAnim
// 								{...zoomAnmation}
// 								forcedReplay={currentstep === 1}
// 								component="div"
// 								style={{ minHeight: 300 }}
// 							>
// 								<div key="0">
// 									<CustomInput
// 										name="description"
// 										type="borderless"
// 										hideIcon
// 										inputprops={{
// 											prefix: <div style={{ display: 'none' }} />,
// 											placeholder: 'Beskrivning av er som utvecklaren'
// 										}}
// 									/>

// 									<div key="2" className={styles.formsectiontext}>
// 										<Text key="2" texttype="info" colortype="info">
// 											Finns det några tidigare projekt? Beskriv kortfattat
// 										</Text>
// 									</div>
// 									<TextArea
// 										key="3"
// 										name="experience"
// 										type="borderless"
// 										inputprops={{
// 											placeholder: 'Finns det några tidigare projekt? Beskriv kortfattat',
// 											rows: 4
// 										}}
// 									/>
// 								</div>
// 							</QueueAnim>
// 						) : (
// 							false
// 						)}

// 						<Row gutter={8} key="0" style={{ justifyContent: currentstep === 0 ? 'center' : 'flex-end' }}>
// 							{currentstep === 1 && (
// 								<Col
// 									span={12}
// 									xs={{ span: 8 }}
// 									sm={{ span: 8 }}
// 									style={{ textAlign: 'left', marginTop: 10 }}
// 								>
// 									<CustomButton
// 										buttontype="type3"
// 										icon={isMobileSmall ? <ArrowLeftOutlined /> : false}
// 										htmlType="button"
// 										onClick={handlePrevious}
// 										size="large"
// 									>
// 										{isMobileSmall ? '' : 'Tillbaka'}
// 									</CustomButton>
// 								</Col>
// 							)}
// 							<Col
// 								span={currentstep === 0 ? 24 : 12}
// 								xs={{ span: 16 }}
// 								sm={{ span: 16 }}
// 								style={{ textAlign: currentstep === 0 ? 'center' : 'right', marginTop: 10 }}
// 							>
// 								<div style={{ display: currentstep === 0 ? 'block' : 'none' }}>
// 									<FormItem>
// 										<CustomButton
// 											buttontype="type4Dark"
// 											type="primary"
// 											onClick={handleNext}
// 											htmlType="button"
// 										>
// 											Nästa
// 										</CustomButton>
// 									</FormItem>
// 								</div>

// 								<div style={{ display: currentstep === 1 ? 'block' : 'none' }}>
// 									<FormItem>
// 										<CustomButton
// 											loading={submitting}
// 											buttontype="type4Dark"
// 											type="primary"
// 											htmlType="submit"
// 										>
// 											Skicka
// 										</CustomButton>
// 									</FormItem>
// 								</div>
// 							</Col>
// 						</Row>

// 						{isMobile && (
// 							<Link to="/user/login">
// 								<Text texttype="link" colortype="secondary">
// 									<LeftCircleOutlined style={{ marginRight: 16 }} />
// 									Sign in
// 								</Text>
// 							</Link>
// 						)}
// 					</Form>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default connect(({ userAndregister, loading }) => ({
// 	userAndregister,
// 	submitting: loading.effects['userAndregister/submit']
// }))(Register);
