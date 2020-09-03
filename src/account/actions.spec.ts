import MockAdapter from 'axios-mock-adapter';
import { ActionContext, Commit, Dispatch } from 'vuex';
import { $http } from '@/modules/shared/services/HttpService/$http';
import { AccountDefaultState, IAccountState } from './state';
import { IState } from '@/state';

describe('ProfileActions', () => {
  let testContext: ActionContext<IAccountState, IState>;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    testContext = {
      dispatch: jest.fn() as Dispatch,
      commit: jest.fn() as Commit,
      state: AccountDefaultState()
    } as ActionContext<IAccountState, IState>;

    mockAxios = new MockAdapter($http);
  });
});
