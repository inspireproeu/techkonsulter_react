//import { PageLoading } from '@ant-design/pro-layout'; // loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
import logo from '@/assets/logo.gif';
const PageLoading = (props) => {
	return (
		<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor:'#ffffff' }}>
			<img src={logo} alt="logo" width="96" />
		</div>
	);
};

export default PageLoading;
