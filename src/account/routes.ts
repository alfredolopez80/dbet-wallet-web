import { RouteConfig } from 'vue-router/types/router';

export const AccountRoutes: RouteConfig[] = [
  {
    path: '/account',
    meta: { requiresAuth: true },
    component: () => import('./Account/Account.vue').then((m: any) => m.default),
    children: [
      {
        path: 'personal-info',
        name: 'personalInfo.view',
        meta: { requiresAuth: true, removeRibbon: true, title: 'Personal Info' },
        component: () => import('./PersonalInfo/View.vue').then((m: any) => m.default),
      },
      {
        path: 'personal-info/edit',
        name: 'personalInfo.edit',
        meta: { requiresAuth: true, removeRibbon: true, title: 'Edit Personal Info' },
        component: () => import('./PersonalInfo/EditPage.vue').then((m: any) => m.default),
      },
      {
        path: 'wallet',
        name: 'wallet',
        meta: { requiresAuth: true, removeRibbon: true, title: 'Wallet' },
        component: () => import('./Wallet/Wallet.vue').then((m: any) => m.default)
      },
      {
        path: 'profiles',
        name: 'profiles',
        meta: { requiresAuth: true, removeRibbon: true, title: 'Profiles' },
        component: () => import('./GameProfiles/ProfileList.vue').then((m: any) => m.default)
      },
      {
        path: 'profiles/add',
        name: 'addNewEsportProfile',
        meta: { requiresAuth: true, removeRibbon: true, title: 'New Esport Profile' },
        component: () => import(/* webpackChunkName: "AddProfile" */ './GameProfiles/AddProfile.vue').then((m: any) => m.default)
      },
      {
        path: 'transactions',
        meta: { requiresAuth: true, removeRibbon: true },
        component: () => import('./Transactions/Transactions.vue').then((m: any) => m.default),
        children: [
          {
            path: 'contests',
            name: 'contests-transactions',
            meta: { requiresAuth: true, removeRibbon: true, title: 'Contests Transactions' },
            component: () => import('./Transactions/Contests/List.vue').then((m: any) => m.default)
          },
          {
            path: 'promos',
            name: 'promo-transactions',
            meta: { requiresAuth: true, removeRibbon: true, title: 'Promo Transactions' },
            component: () => import('./Transactions/Promos/List.vue').then((m: any) => m.default)
          }
        ]
      },
      {
        path: 'referral-code',
        name: 'referralCode',
        meta: { requiresAuth: true, removeRibbon: true, title: 'Referral Code' },
        component: () => import('./ReferralCode/ReferralCode.vue').then((m: any) => m.default)
      },
      {
        path: 'reward-stats',
        name: 'RewardStats',
        meta: { requiresAuth: true, removeRibbon: true, title: 'Reward Stats' },
        component: () => import('./RewardStats/RewardStats.vue').then((m: any) => m.default)
      },
      {
        path: '',
        redirect: '/account/personal-info'
      }
    ]
  },
];
