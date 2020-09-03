import { Module } from 'vuex';
import { IState } from '@/state';
import { AccountDefaultState, IAccountState } from './state';
import { AccountActions } from './actions';
import { AccountGetters } from './getters';
import { AccountMutations } from './mutations';

export const AccountModule: Module<IAccountState, IState> = {
  namespaced: true,
  actions: {
    ...AccountActions,
  },
  getters: {
    ...AccountGetters,
  },
  state: {
    ...AccountDefaultState(),
  },
  mutations: {
    ...AccountMutations,
  },
};
