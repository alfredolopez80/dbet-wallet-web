import { AccountMutations } from './mutations';
import { AccountDefaultState, IAccountState } from './state';

describe('AccountMutations', () => {
  let testState: IAccountState;

  beforeEach(() => {
    testState = AccountDefaultState();
  });
});
