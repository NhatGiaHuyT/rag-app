import { Icon } from './lib/chakra';
import {
  MdFileCopy,
  MdHome,
  MdLayers,
  MdAutoAwesome,
  MdOutlineManageAccounts,
  MdDashboard,
  MdEdit,
} from 'react-icons/md';
import { IRoute } from './types/navigation';

const routes: IRoute[] = [
  // ─── Main ───────────────────────────────────────────────────────────────────
  {
    name: 'Chat UI',
    path: '/',
    icon: <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'All Templates',
    path: '/all-templates',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'My Projects',
    path: '/my-projects',
    icon: <Icon as={MdLayers} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },

  // ─── AI Tools ───────────────────────────────────────────────────────────────
  {
    name: 'AI Tools',
    path: '/ai-tools',
    icon: <Icon as={MdEdit} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Essay Generator',        path: '/essay' },
      { name: 'Article Generator',      path: '/article' },
      { name: 'Content Simplifier',     path: '/simplifier' },
      { name: 'Product Description',    path: '/product-description' },
      { name: 'Email Enhancer',         path: '/email-enhancer' },
      { name: 'LinkedIn Message',       path: '/linkedin-message' },
      { name: 'Instagram Caption',      path: '/caption' },
      { name: 'FAQs Content',           path: '/faq' },
      { name: 'Product Name Generator', path: '/name-generator' },
      { name: 'SEO Keywords',           path: '/seo-keywords' },
      { name: 'Review Responder',       path: '/review-responder' },
      { name: 'Business Ideas',         path: '/business-generator' },
    ],
  },

  // ─── Admin ──────────────────────────────────────────────────────────────────
  {
    name: 'Admin',
    path: '/admin',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Dashboard',    layout: '/admin', path: '/dashboard' },
      { name: 'Users',        layout: '/admin', path: '/users' },
      { name: 'Chat History', layout: '/admin', path: '/chat-history' },
      { name: 'API Keys',     layout: '/admin', path: '/api-keys' },
      { name: 'Analytics',    layout: '/admin', path: '/analytics' },
      { name: 'Settings',     layout: '/admin', path: '/settings' },
    ],
  },

  // ─── Account ────────────────────────────────────────────────────────────────
  {
    name: 'Account',
    path: '/account',
    icon: <Icon as={MdOutlineManageAccounts} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Profile Settings', path: '/settings' },
      { name: 'History',          path: '/history' },
      { name: 'Usage',            path: '/usage' },
      { name: 'My Plan',          path: '/my-plan' },
      { name: 'Sign In',          path: '/sign-in' },
      { name: 'Register',         path: '/register' },
    ],
  },

  // ─── Other Pages (hidden from sidebar) ──────────────────────────────────────
  {
    name: 'Other Pages',
    path: '/others',
    icon: <Icon as={MdFileCopy} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
];

export default routes;
