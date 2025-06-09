import component from './sv-SE/component';
import globalHeader from './sv-SE/globalHeader';
import menu from './sv-SE/menu';
import pwa from './sv-SE/pwa';
import settingDrawer from './sv-SE/settingDrawer';
import settings from './sv-SE/settings';
export default {
  'navBar.lang': 'Idiomas',
  'layout.user.link.help': 'ajuda',
  'layout.user.link.privacy': 'política de privacidade',
  'layout.user.link.terms': 'termos de serviços',
  'app.preview.down.block': 'Download this page to your local project',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
