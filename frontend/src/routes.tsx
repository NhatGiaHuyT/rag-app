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
      { name: 'Documents',    layout: '/admin', path: '/documents' },
      { name: 'Manual Answer', layout: '/admin', path: '/manual-answer' },
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
      { name: 'Documents',        path: '/documents' },
      { name: 'Usage',            path: '/usage' },
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
