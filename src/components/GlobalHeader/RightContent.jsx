import { Tooltip, Tag, Menu } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import { getLocale, setLocale } from 'umi';
import HeaderDropdown from '../HeaderDropdown';

const ENVTagColor = {
	dev: 'orange',
	test: 'green',
	pre: '#87d068'
};

const GlobalHeaderRight = (props) => {
	const { theme, layout, currentUser } = props;
	let className = styles.right;

	if (theme === 'dark' && layout === 'top') {
		className = `${styles.right}  ${styles.dark}`;
	}
  const selectedLang = getLocale();
  const changeLang = ({ key }) => setLocale(key);
  const locales = ['en-US', 'sv-SE'];
  const languageLabels = {
    'en-US': 'English',
    'sv-SE': 'Swedish'
  };
  const languageIcons = {
    'en-US': '🇺🇸',
    'sv-SE': '🇸🇪'
  };
  const langMenu = (
    <Menu
      // className={styles.menu}
      selectedKeys={[selectedLang]}
      onClick={changeLang}
    >
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );

	return (
		<div className={className}>
      <Avatar menu />
			{/* <SelectLang prefixIcon={<QuestionCircleOutlined />} className={styles.action} /> */}
		</div>
	);
};

export default connect(({ settings, user }) => ({
	theme: settings.navTheme,
  layout: settings.layout,
  currentUser: user.currentUser,
}))(GlobalHeaderRight);
