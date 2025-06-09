import React from 'react';
import { connect } from 'umi';

import RightContent from '@/components/GlobalHeader/RightContent';
import LeftContent from '@/components/GlobalHeader/LeftContent';

const GlobalHeader = (props) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			<LeftContent />
			<RightContent />
		</div>
	);
};

export default connect(({ settings }) => ({
	theme: settings.navTheme,
	layout: settings.layout
}))(GlobalHeader);
