import { RouteConfig } from 'vue-router/types/router';

export const WalletRoutes: RouteConfig[] = [
  {
    path: '/wallet',
    name: 'publicWallet',
    meta: { requiresAuth: false, title: 'Wallet' },
    component: () => import('./WalletLayout.vue').then((m: any) => m.default),
  }
];
