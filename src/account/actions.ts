import BigNumber from 'bignumber.js';
import {
  IProfile, NewWalletModel, KeystoreIndex, WalletType
} from './models';
import moment from 'moment';
import { AccountEditModel } from './models/account.edit';
import { AccountModel } from '@/modules/shared/models/account';
import { ActionContext } from 'vuex';
import {
  DBETNodeContract,
  DBETVETTokenContract,
  QuestContract,
} from '@decent-bet/playdbet-contract-entities';
import { DBETWallet } from '../wallet-storage/DBETWallet';
import { EsportProfile } from '@/modules/shared/models/esportProfile';
import { EventFilter, SolidoContract, SolidoProvider } from '@decent-bet/solido';
import { from, Subject } from 'rxjs';
import { IAccountState } from './state';
import { IState } from '@/state';
import { IWalletAddress } from './models/IWalletAddress';
import { mergeMap, toArray } from 'rxjs/operators';
import { PromoTransactionItem } from '../shared/models/promoTransactionItem';
import { Quest } from '@/modules/games/models/Quest';
import { solidoAction } from '@decent-bet/vuex-solido';
import { VTHOWallet } from '../wallet-storage/VTHOWallet';
/* eslint-disable no-underscore-dangle */
import { $http } from '@/modules/shared/services/HttpService/$http';
import { Wallet as XdvWallet } from 'xdvplatform-wallet';
import { WalletSession } from '../shared/actions/WalletSession';
import { ethers, Wallet } from 'ethers';
import { cry } from 'thor-devkit';

export interface IAccountActions {
  listTransactions(
    context: ActionContext<IAccountState, IState>,
    payload: any,
  ): Promise<void>
  getAccount(context: ActionContext<IAccountState, IState>): Promise<void>
  hasUserMpp(context: ActionContext<IAccountState, IState>): Promise<void>

  faucet(
    context: ActionContext<IAccountState, IState>,
    payload: any,
  ): Promise<void>

  setWalletBalance(
    context: ActionContext<IAccountState, IState>,
    payload?: any,
  ): Promise<void>

  updateAccount(
    context: ActionContext<IAccountState, IState>,
    payload: AccountEditModel,
  ): Promise<boolean>

  listAddresses(context: ActionContext<IAccountState, IState>): Promise<void>

  getEsportProfiles(
    context: ActionContext<IAccountState, IState>,
  ): Promise<void>

  getProfileByEsportId(
    context: ActionContext<IAccountState, IState>,
    payload: { id: string },
  ): Promise<EsportProfile>

  postEsportProfile(
    context: ActionContext<IAccountState, IState>,
    payload: IProfile,
  ): Promise<boolean>

  postCometAddress(
    context: ActionContext<IAccountState, IState>,
    payload: string | null,
  ): Promise<boolean>

  setVerificationProcessingModalOpen(
    context: ActionContext<IAccountState, IState>,
    open: boolean,
  ): Promise<void>

  setEditPersonalInfoModalOpen(
    context: ActionContext<IAccountState, IState>,
    open: boolean,
  ): Promise<void>

  setVerificationResultModalOpen(
    context: ActionContext<IAccountState, IState>,
    open: boolean,
  ): Promise<void>

  setCometExtensionDetectorModalOpen(
    context: ActionContext<IAccountState, IState>,
    open: boolean,
  ): Promise<void>

  startAccountVerification(
    context: ActionContext<IAccountState, IState>,
  ): Promise<boolean>

  fetchReferralCode(
    context: ActionContext<IAccountState, IState>,
  ): Promise<void>

  fetchPromoTransactions(
    context: ActionContext<IAccountState, IState>,
    lastId?: string,
  ): Promise<PromoTransactionItem[]>

  fetchPromotions(context: ActionContext<IAccountState, IState>): Promise<void>

  getPromoBalance(
    context: ActionContext<IAccountState, IState>,
  ): Promise<number>

  getVTHOBalance(
    context: ActionContext<IAccountState, IState>,
    payload: { address: string, showLoading: boolean },
  ): Promise<void>

  getDBETBalance(
    context: ActionContext<IAccountState, IState>,
    payload: { address: string, showLoading: boolean },
  ): Promise<void>

  transferVTHO(
    context: ActionContext<IAccountState, IState>,
    payload: { to: string; amount: string },
  ): Promise<string>

  getTransactionList(
    context: ActionContext<IAccountState, IState>,
    address: string,
  ): Promise<void>

  transferDBETs(
    context: ActionContext<IAccountState, IState>,
    payload: { to: string; amount: string },
  ): Promise<string>

  getWallets(context: ActionContext<IAccountState, IState>): Promise<void>

  setWalletListVisible(
    context: ActionContext<IAccountState, IState>,
    visible: boolean,
  ): Promise<void>

  setPrimaryWallet(
    context: ActionContext<IAccountState, IState>,
    address: string,
  ): Promise<void>

  setNewWalletModalVisible(
    context: ActionContext<IAccountState, IState>,
    visible: boolean,
  ): Promise<void>

  setTransferModalVisible(
    context: ActionContext<IAccountState, IState>,
    payload: { visible: boolean; walletType: WalletType },
  ): Promise<void>

  createNewWallet(
    context: ActionContext<IAccountState, IState>,
    payload: NewWalletModel,
  ): Promise<void>

  requestUnlockWallet(
    context: ActionContext<IAccountState, IState>
  ): Promise<void>

  setupWalletSubscription(context: ActionContext<IAccountState, IState>): Promise<void>;

  setUnlockWalletResult(
    context: ActionContext<IAccountState, IState>,
    payload: { accepted: boolean, passphrase: string }
  ): Promise<void>;
}


/**
 * Manage wallet subscriptions and unlock
 */

let walletSubject = new Subject();


/**
 * Pushes the Comet Address to the server.
 * @returns did it succeed?
 */
const postCometAddress = solidoAction<Promise<boolean>>(
  async <ISessionState, IState>(
    { commit, getContract }: ActionContext<ISessionState, IState>,
    payload: string | null,
  ) => {
    commit('SET_ACCOUNT_SAVING', true);
    commit('CLEAR_ERRORS');
    try {
      const tokenContract = await getContract<DBETVETTokenContract>('DBET');
      const thorify = (tokenContract as any).thor;
      // Get the raw address from Comet or from the `payload`
      let unnormalizedAddress: string;
      if (payload) {
        unnormalizedAddress = payload;
      } else {
        const [defaultAddress] = await thorify.eth.getAccounts();
        unnormalizedAddress = defaultAddress;
      }

      // Normalize the address and post it
      if (unnormalizedAddress && getContract) {
        const address = thorify.utils.toChecksumAddress(unnormalizedAddress);

        const { defaultAccount } = tokenContract;
        const result = await tokenContract.balanceOf(defaultAccount);
        const balance = result;

        const dbetBalance = new BigNumber(balance).shiftedBy(-18).toNumber();

        await $http.post('/accounts/me/wallets', {
          address,
          token: 'dummy',
          description: 'Playdbet Web Client',
          primary: true,
          dbetBalance,
        });
      }
      commit('SET_ACCOUNT_SAVING', false);
      // Success!!
      return true;
    } catch (error) {
      commit('SET_ACCOUNT_SAVING', false);

      // Undefined Error
      if (!error.response) {
        commit('SET_ERROR', error);
        return false;
      }

      // Custom error codes. These are coordinated with backend.
      const { status } = error.response;
      if (status === 470) {
        // Address Already taken by another user
        commit('SET_ERROR_ADDRESS_ALREADY_TAKEN', true);
      } else if (status === 471) {
        // User tried to add a sixth address
        commit('SET_ERROR_ADDRESS_ABOVE_LIMIT', true);
      } else {
        // Undefined Error
        commit('SET_ERROR', error);
      }

      // Failed!!x
      return false;
    }
  },
);

const setWalletBalance = solidoAction<Promise<void>>(
  async <ISessionState, IState>(
    { commit, getContract }: ActionContext<ISessionState, IState>,
    _payload?: any,
  ) => {
    try {
      const tokenContract = await getContract<DBETVETTokenContract>('DBET');
      const { defaultAccount } = tokenContract;
      const result = await tokenContract.balanceOf(defaultAccount);
      const balance = result;

      const finalBalance = new BigNumber(balance).shiftedBy(-18);
      commit('SET_BALANCE', finalBalance);
    } catch (error) {
      console.error(error);
    }
  },
);

const getDBETBalance = solidoAction<Promise<void>>(
  async <ISessionState, IState>(
    { getContract, commit }: ActionContext<ISessionState, IState>,
    payload: { address: string, showLoading?: boolean }
  ) => {
    if (!payload) {
      return;
    }

    const { address, showLoading } = payload;
    if (!address) {
      return;
    }

    if (showLoading) {
      commit('SET_DBET_BALANCE_LOADING', address);
    }
    try {
      const tokenContract = await getContract<DBETVETTokenContract>('DBET');
      const result = await tokenContract.balanceOf(address);
      const balance = new BigNumber(result).shiftedBy(-18);
      commit('SET_DBET_BALANCE', { balance, address });
    } catch (error) {
      console.error(error);
      commit('SET_DBET_BALANCE', { balance: new BigNumber(0), address });
    }
  },
);

const getVTHOBalance = solidoAction<Promise<void>>(
  async <ISessionState, IState>(
    { getContract, commit }: ActionContext<ISessionState, IState>,
    payload: { address: string, showLoading?: boolean }
  ) => {
    if (!payload) {
      return;
    }

    const { address, showLoading } = payload;
    if (!address) {
      return;
    }

    if (showLoading) {
      commit('SET_VTHO_BALANCE_LOADING', address);
    }
    try {
      const vthoContract = await getContract<SolidoProvider & SolidoContract>(
        'VTHO',
      );
      const result = await vthoContract.methods.balanceOf(address);
      const balance = new BigNumber(result).shiftedBy(-18);
      commit('SET_VTHO_BALANCE', { balance, address });
    } catch (error) {
      console.error(error);
      commit('SET_DBET_BALANCE', { balance: new BigNumber(0), address });
    }
  },
);


const getTransactionLogs = async (token: string, address: string, contract: any) => {
  const logs = await contract.getPastEvents({
    topics: null,
    order: 'ASC'
  } as any);

  const items = logs
    .filter(
      (i: any) => {
        if (i.event && i.returnValues) {
          // eslint-disable-next-line no-shadow
          const { from, to } = i.returnValues;
          if (from && to) {
            return (to.toLowerCase() === address
              || from.toLowerCase() === address);
          }
        }

        return false;
      }
    )
    .map((tx: any) => {
      const { blockTimestamp } = tx.meta;
      // eslint-disable-next-line no-shadow
      const { from, to, value } = tx.returnValues;
      const amount = new BigNumber(value).shiftedBy(-18).toFormat(3);
      const timestamp = new BigNumber(blockTimestamp);
      return {
        token,
        evt: tx.event,
        block: {
          timestamp,
          number: tx.blockNumber
        },
        date: moment(timestamp).format(),
        hash: tx.transactionHash,
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        value: amount
      };
    });
  return items;
};
const getTransactionList = solidoAction<Promise<void>>(
  async <ISessionState, IState>(
    { getContract, commit }: ActionContext<ISessionState, IState>,
    address: string
  ) => {
    if (!address) {
      return;
    }
    commit('SET_TRANSACTION_LIST_LOADING', true);
    commit('SET_TRANSACTION_LIST', []);
    try {
      const tokenContract = await getContract<DBETVETTokenContract>('DBET');
      const dbetLogs = await getTransactionLogs('DBET', address, tokenContract.instance);

      commit('SET_TRANSACTION_LIST', dbetLogs);
      commit('SET_TRANSACTION_LIST_LOADING', false);
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_TRANSACTION_LIST_LOADING', false);
    }
  }
);

const faucet = solidoAction<Promise<void>>(
  async <IAccountState, IState>(
    context: ActionContext<IAccountState, IState>,
  ) => {
    const { commit, currentConfig } = context;
    commit('SET_ERROR', null);
    commit('FAUCET_COMPLETE', { success: false, amount: 0 });

    try {
      commit('FAUCET_LOADING', true);
      const { connex } = currentConfig;

      const request = {
        to: connex ? connex.defaultAccount : '',
      };

      await $http.post('/faucet', request);

      const amountSent = 1_000;
      commit('FAUCET_COMPLETE', { success: true, amount: amountSent });
      commit(
        'ui/SHOW_APP_NOTIFICATION',
        {
          text: `Faucet executed successfully. Amount sent: ${amountSent}`,
          color: 'success',
        },
        { root: true },
      );
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('FAUCET_LOADING', false);
    }
  },
);

const transferDBETs = solidoAction<Promise<string>>(
  async <ISessionState, IState>(
    { getContract, commit }: ActionContext<ISessionState, IState>,
    payload: { to: string; amount: string },
  ) => {
    commit('SET_TRANSFER_TRANSACTION_ID', null);
    commit('SET_MAKING_TRANSFER', true);
    try {
      const { to, amount } = payload;
      const tokenContract = await getContract<DBETVETTokenContract>('DBET');
      const wallet = new DBETWallet(tokenContract);
      const tx = await wallet.send(to, new BigNumber(amount).multipliedBy(1e18));
      commit('SET_TRANSFER_TRANSACTION_ID', tx.txid);
      commit('SET_MAKING_TRANSFER', false);
      return tx.txid;
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_MAKING_TRANSFER', false);
      return null;
    }
  },
);

const transferVTHO = solidoAction<Promise<string>>(
  async <ISessionState, IState>(
    { getContract, commit }: ActionContext<ISessionState, IState>,
    payload: { to: string; amount: string },
  ) => {
    commit('SET_TRANSFER_TRANSACTION_ID', null);
    commit('SET_MAKING_TRANSFER', true);
    try {
      const { to, amount } = payload;
      const vthoContract = await getContract<SolidoProvider & SolidoContract>(
        'VTHO',
      );
      const wallet = new VTHOWallet(vthoContract);
      const tx = await wallet.send(to, new BigNumber(amount).multipliedBy(1e18));
      commit('SET_TRANSFER_TRANSACTION_ID', tx.txid);
      commit('SET_MAKING_TRANSFER', false);
      return tx.txid;
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_MAKING_TRANSFER', false);
      return null;
    }
  },
);

const listTransactions = solidoAction<Promise<void>>(
  async <IAccountState, IState>(
    context: ActionContext<IAccountState, IState>,
    payload: any,
  ) => {
    const { commit, getContract, state } = context;
    commit('SET_ERROR', null);
    commit('SET_LIST_TX', []);
    try {
      const { wallet } = state as any;
      const { chainTag } = wallet;
      const quest = await getContract<QuestContract>('ConnexQuestContract');
      const dbetNode = await getContract<DBETNodeContract>('ConnexDBETNode');
      const topicNames = (quest as any).topics;
      const statusMappings = {
        [topicNames.LogPayForQuest.signature]: 'Entered',
        [topicNames.LogRefundQuestEntry.signature]: 'Refunded',
        [topicNames.LogCancelQuest.signature]: 'Cancel',
        [topicNames.LogSetQuestOutcome.signature]: 'Completed',
      };

      // Get quests from db
      const response = await $http.get<Quest[]>('/quests');
      const quests = response.data;

      // Maps a Connex Thor Event to a UI Transaction item
      const mapToTransactionItem = (signature, logs) => logs
        .map((l) => ({
          chainTag,
          txid: l.meta.txID,
          type: signature,
          timestamp: l.meta ? moment(l.meta.blockTimestamp * 1000) : null,
          from: (l as any).txOrigin,
          status: statusMappings[signature],
          ...l,
        }))
        .filter((i: any) => i.type)
        .map(async (i) => {
          const questApi: any = quests.find(
            (q) => q.contract && q.contract.publishedId === i.id,
          ) || {
            mission: {
              esport: {},
            },
            description: '',
          };
          let outcomeSuccess: boolean;
          let isRefund = false;
          let prize = '';

          const questItem = await quest.quests(i.id);
          const toEther = (val) => new BigNumber(val).shiftedBy(-18).toFixed();
          const questEntry = await quest.userQuestEntries(
            i.user,
            i.id,
            parseInt(i.questEntryCount, 10),
          );

          if (i.status === 'Completed') {
            // read outcome

            outcomeSuccess = questEntry.status === '2';
          }
          if (i.status === 'Refunded') {
            isRefund = true;
          }

          if (questEntry.nodeId && parseInt(questEntry.nodeId, 10) >= 0) {
            // Read the user node
            const usernode = await dbetNode.methods.userNodes(
              questEntry.nodeId.toString(),
            );
            const nodePrize = await quest.methods.getPrizePayoutForNodeType(
              usernode.node,
              questItem.prize,
            );
            // eslint-disable-next-line prefer-destructuring
            prize = nodePrize;
          } else {
            // eslint-disable-next-line prefer-destructuring
            prize = questItem.prize;
          }

          return {
            ...i,
            quest: {
              mission: questApi.mission,
              description: questApi.description,
              entryFee: toEther(questEntry.entryFee),
              prize: toEther(prize),
            },
            outcomeSuccess,
            isRefund,
            displayDate: i.timestamp.format('MM/DD/YYYY'),
          };
        });

      // set filter options
      const filterOptions: EventFilter<any> = {
        filter: [
          {
            user: quest.defaultAccount,
          },
        ],
        pageOptions: {
          limit: 100,
          offset: 0,
        },
        // topics: topicQuery,
        // range: {
        //   from: 0,
        //   to: 2383616,
        //   unit: 'block'
        // }
      };

      // const payForQuestLogs = await quest.logPayForQuest(filterOptions);
      // console.log(`payed: ${payForQuestLogs.length}`);

      const setQuestOutcomeLogs = await quest.logSetQuestOutcome(filterOptions);
      // console.log(`outcome: ${setQuestOutcomeLogs.length}`);

      const refundQuestLogs = await quest.logRefundQuestEntry(filterOptions);

      const setOutcomes = mapToTransactionItem(
        topicNames.LogSetQuestOutcome.signature,
        setQuestOutcomeLogs,
      );
      const refunded = mapToTransactionItem(
        topicNames.LogRefundQuestEntry.signature,
        refundQuestLogs,
      );

      from([...setOutcomes, ...refunded])
        .pipe(
          mergeMap((i) => i),
          toArray(),
        )
        .subscribe((txs) => {
          const dateSort = (obj1, obj2) => {
            if (obj1.timestamp > obj2.timestamp) return -1;
            if (obj1.timestamp < obj2.timestamp) return 1;
            return 0;
          };

          // Sort by timestamp
          txs.sort(dateSort);
          commit('SET_HAS_TX_HISTORY', txs.length > 0);

          txs.forEach((i) => commit('ADD_TX_ITEM', i));
        });
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_LIST_TX_LOADING', false);
    }
  },
);

export const AccountActions: IAccountActions = {
  faucet,
  setWalletBalance,
  listTransactions,
  postCometAddress,

  getDBETBalance,
  getVTHOBalance,

  transferDBETs,
  transferVTHO,

  getTransactionList,

  async getAccount({
    commit,
  }: ActionContext<IAccountState, IState>): Promise<void> {
    commit('SET_ACCOUNT_LOADING', true);
    try {
      const resp: any = await $http.get<AccountModel>('/accounts/me');

      if (resp.data && resp.data.dob) {
        resp.data.dob = moment
          .parseZone(resp.data.dob, 'YYYY-MM-DD')
          .format('MM/DD/YYYY');
      }

      commit('SET_ACCOUNT', resp.data);
      commit('SET_ACCOUNT_LOADING', false);
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_ACCOUNT_LOADING', false);
    }
  },

  async hasUserMpp({
    commit,
    state,
  }: ActionContext<IAccountState, IState>): Promise<void> {
    try {
      if (state.wallet.defaultAddress) {
        const { address } = state.wallet.defaultAddress;
        commit('SET_ACCOUNT_LOADING', true);
        const resp = await $http.get<any>(`/mpp/user/${address}`);

        if (resp.data === false) {
          throw new Error('Missing MPP');
        }
        commit('SET_HAS_MPP_USER', true);
        commit('SET_ACCOUNT_LOADING', false);
      }
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_HAS_MPP_USER', false);
      commit('SET_ACCOUNT_LOADING', false);
    }
  },

  async updateAccount(
    { commit, rootState }: ActionContext<IAccountState, IState>,
    payload: AccountEditModel,
  ): Promise<boolean> {
    commit('SET_ACCOUNT_SAVING', true);
    try {
      const { _id } = rootState.account.me.account;

      const dob = moment.parseZone(payload.dob, 'MM/DD/YYYY').toISOString(false);

      const {
        country,
        state,
        city,
        address,
        postalCode,
        firstName,
        lastName,
        mobileNumber,
      } = payload;

      const request: any = {
        _id,
        firstName,
        lastName,
        mobileNumber,
        address: {
          city,
          countryCode: country.code3,
          country: country.name,
          stateCode: state.code,
          state: state.name,
          address1: address,
          postalCode,
        },
      };

      if (dob) {
        request.dob = dob;
      }

      const resp = await $http.post<AccountModel>('/accounts/me', request);
      const account = resp.data;
      if (account.dob) {
        account.dob = moment
          .parseZone(account.dob, 'YYYY-MM-DD')
          .format('MM/DD/YYYY');
      }

      commit('SET_ACCOUNT', account);
      commit('SET_ACCOUNT_SAVING', false);
      return true;
    } catch (error) {
      commit('SET_ACCOUNT_SAVING', false);
      commit('SET_ERROR', error);
      return false;
    }
  },

  // TODO: Need to refactor to use a different approach.
  async listAddresses({ commit }) {
    commit('IS_LOADING_WALLET', true);
    commit('CLEAR_WALLET_ADDRESSES');
    try {
      // Get all the wallet addresses
      const resp = await $http.get<IWalletAddress[]>('/accounts/me/wallets');
      commit('ADD_WALLET_ADDRESSES', resp.data);

      // Find the default address
      const defaultWallet = resp.data.find((wallet) => wallet.primary);
      if (defaultWallet) {
        commit('SET_DEFAULT_WALLET_ADDRESS', defaultWallet);
      }

      commit('IS_LOADING_WALLET', false);
    } catch (error) {
      commit('CLEAR_WALLET_ADDRESSES');
      commit('IS_LOADING_WALLET', false);
      commit('SET_ERROR', error);
    }
  },

  async getEsportProfiles({
    commit,
  }: ActionContext<IAccountState, IState>): Promise<void> {
    commit('SET_ESPORTS_LOADING', true);
    try {
      const resp = await $http.get('/accounts/me/profiles');

      commit('SET_ESPORTS_PROFILES', resp.data);
      commit('SET_ESPORTS_LOADING', false);
    } catch (error) {
      commit('SET_ESPORTS_LOADING', false);
      commit('SET_ERROR', error);
    }
  },

  async getProfileByEsportId(
    { commit, rootState }: ActionContext<IAccountState, IState>,
    payload: { id: string },
  ): Promise<EsportProfile> {
    commit('SET_ESPORTS_LOADING', true);
    try {
      const { id } = payload;
      let { profiles } = rootState.account.esports;
      if (!profiles || profiles.length <= 0) {
        commit('SET_ESPORTS_LOADING', true);
        const resp = await $http.get('/accounts/me/profiles');
        commit('SET_ESPORTS_PROFILES', resp.data);
        profiles = resp.data;
      }
      const [currentProfile] = profiles.filter(
        (p: EsportProfile) => p.esport._id === id,
      );
      commit('SET_CURRENT_ESPORT_PROFILE', currentProfile || null);
      return currentProfile;
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_ESPORTS_LOADING', false);
    }
  },

  async postEsportProfile({ commit }, { gameId, username }) {
    commit('SET_ACCOUNT_SAVING', true);
    try {
      const resp = await $http.post('/accounts/me/profiles', {
        esport: gameId,
        username,
      });
      commit('ADD_ESPORTS_PROFILE', resp.data);
      commit('SET_ACCOUNT_SAVING', false);
      return true;
    } catch (error) {
      commit('SET_ACCOUNT_SAVING', false);
      console.error(error);
      commit('SET_ERROR', {
        code: '',
        message:
          'Error creating the esport profile, please check your username and try again.',
      });
      return false;
    }
  },

  async setVerificationProcessingModalOpen({ commit }, open: boolean) {
    commit('SET_VERIFICATION_MODAL_OPEN', open);
  },

  async setCometExtensionDetectorModalOpen({ commit }, open: boolean) {
    commit('SET_COMET_EXTENSION_MODAL_OPEN', open);
  },

  async setVerificationResultModalOpen({ commit }, open: boolean) {
    commit('SET_RESULT_MODAL_OPEN', open);
  },

  async setEditPersonalInfoModalOpen({ commit }, open: boolean) {
    commit('SET_EDIT_PERSONALINFO_MODAL_OPEN', open);
  },

  async startAccountVerification({ commit }) {
    commit('SET_SENDING_ACCOUNT_VERIFICATION', true);
    try {
      const resp = await $http.get('/accounts/me/verifications/identity');
      commit('SET_SENDING_ACCOUNT_VERIFICATION', false);
      commit('SET_ACCOUNT', resp.data);
      return true;
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_SENDING_ACCOUNT_VERIFICATION', false);
      return false;
    }
  },

  async fetchReferralCode({ commit }) {
    commit('SET_LOADING_REFERRALCODE', true);
    try {
      const { data } = await $http.get(
        '/accounts/me/promocodes/type/referafriend',
      );
      commit('SET_REFERRALCODE', data);
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_LOADING_REFERRALCODE', false);
    }
  },

  async fetchPromoTransactions(
    { commit },
    lastId?: string,
  ): Promise<PromoTransactionItem[]> {
    commit('SET_LOADING_PROMO_TRANSACTIONS', true);
    try {
      const url = lastId
        ? `/accounts/me/transactions?lastId=${lastId}`
        : '/accounts/me/transactions';
      const { data } = await $http.get<PromoTransactionItem[]>(url);
      commit('SET_LOADING_PROMO_TRANSACTIONS', false);
      return data;
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_LOADING_PROMO_TRANSACTIONS', false);
      return [];
    }
  },

  async fetchPromotions({ commit }) {
    commit('SET_LOADING_PROMOTIONS', true);
    try {
      const { data } = await $http.get('/accounts/me/promotions');
      commit('SET_PROMOTIONS', data);
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_LOADING_PROMOTIONS', false);
    }
  },

  getPromoBalance: async ({ commit }) => {
    commit('SET_LOADING_PROMO_BALANCE', true);
    try {
      const { data } = await $http.get('/accounts/me/balance');
      const { balance } = data;
      commit('SET_PROMO_BALANCE', balance);
      return balance;
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_LOADING_PROMO_BALANCE', false);
    }
  },
  async getWallets({ commit }) {
    commit('SET_WALLETS_LOADING', true);
    try {
      const wallets = await WalletSession.getWalletRefs();
      if (wallets) {
        const { currentKeystore } = await WalletSession.getSessionInfo();
        if (currentKeystore) {
          const { address } = currentKeystore;
          if (address) {
            commit('SET_PRIMARY_ADDRESS', address);
          }
        }
        commit('SET_WALLETS', wallets);
      }
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_WALLETS_LOADING', false);
    }
  },

  async setWalletListVisible({ commit }, visible: boolean) {
    commit('SET_WALLET_LIST_VISIBLE', visible);
  },
  async setPrimaryWallet({ commit }, address: string) {
    commit('SET_PRIMARY_REGISTRY_LOADING', true);
    try {
      const wallets: any[] = (await WalletSession.getWalletRefs()) as any[];

      if (wallets) {
        const index = wallets.findIndex((w) => w.address === address);
        if (index >= 0) {
          const ks = wallets[index];
          await WalletSession.set({ ks, unlock: false });
          commit('SET_PRIMARY_ADDRESS', address);
        }
      }
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_PRIMARY_REGISTRY_LOADING', false);
    }
  },
  async setNewWalletModalVisible({ commit }, visible: boolean) {
    commit('SET_NEW_WALLET_MNEMONIC', null);
    commit('SET_NEW_WALLET_MODAL_VISIBLE', visible);
  },

  async setTransferModalVisible({ commit }, { visible, walletType }) {
    commit('SET_TRANSFER_MODAL_VISIBLE', { visible, walletType });
  },

  async createNewWallet({ commit }, {
    name, password, mnemonic, publicWallet
  }) {
    commit('SET_NEW_WALLET_MNEMONIC', null);
    commit('SET_SAVING_NEW_WALLET', true);
    commit('SET_NEW_WALLET_SAVED', false);
    try {
      if (!name) {
        throw new Error('The wallet name is not valid.');
      }

      if (mnemonic) {
        if (!ethers.utils.HDNode.isValidMnemonic(mnemonic)) {
          throw new Error('The Mnemonic is not valid.');
        }
      }

      const walletManager = new XdvWallet();
      const wallet = await walletManager.createWallet(password, mnemonic);

      const keystorItem: KeystoreIndex = {
        created: new Date(),
        name,
        keystore: wallet.id,
      };

      const vechainkeys = cry.mnemonic.derivePrivateKey(
        wallet.mnemonic.split(' '),
      );
      await wallet.setImportKey(`import:vechain:${wallet.id}`, {
        key: `0x${vechainkeys.toString('hex')}`,
      });
      const pub = cry.secp256k1.derivePublicKey(vechainkeys);
      const address = `0x${cry.publicKeyToAddress(pub).toString('hex')}`;
      keystorItem.address = address;
      await WalletSession.setWalletRefs(keystorItem);

      // TODO: check if we need to send to the backend or improve error management
      if (!publicWallet) {
        try {
          await $http.post('/accounts/me/wallets', {
            address,
            token: 'dummy',
            description: 'Playdbet Web Client',
            primary: true,
            dbetBalance: 0,
          });
        } catch (error) {
          console.error(error);
        }
      }

      // setup for list and current wallet
      commit('ADD_WALLET_ITEM', keystorItem);
      commit('SET_PRIMARY_ADDRESS', address);
      commit('SET_SAVING_NEW_WALLET', false);
      commit('SET_NEW_WALLET_SAVED', true);
      commit('SET_NEW_WALLET_MNEMONIC', wallet.mnemonic);
    } catch (error) {
      commit('SET_SAVING_NEW_WALLET', false);
      commit('SET_NEW_WALLET_SAVED', false);
      commit('SET_ERROR', error);
    }
  },

  async requestUnlockWallet({ commit }) {
    commit('SET_UNLOCK_MODAL_ERROR', false);
    commit('SET_WALLET_UNLOCKED', false);
    const { currentKeystore, unlock } = await WalletSession.getSessionInfo();
    if (currentKeystore) {
      const hasMnemonic = !!WalletSession.Wallet.mnemonic !== false;
      if (unlock && hasMnemonic) {
        WalletSession.Wallet.id = currentKeystore.keystore;
        commit('SET_UNLOCK_MODAL_VISIBLE', false);
        commit('SET_UNLOCK_MODAL_ERROR', false);
        commit('SET_WALLET_UNLOCKED', true);
      } else {
        await WalletSession.Wallet.open(currentKeystore.keystore);
      }
    }
  },

  async setUnlockWalletResult({ commit }, { accepted, passphrase }) {
    const { currentKeystore } = await WalletSession.getSessionInfo();
    if (currentKeystore) {
      if (accepted) {
        await WalletSession.set({
          ks: currentKeystore,
          unlock: true,
        });

        WalletSession.Wallet.onRequestPassphraseWallet.next({
          type: 'ui',
          passphrase,
        });
      } else {
        commit('SET_UNLOCK_MODAL_VISIBLE', false);
        commit('SET_WALLET_UNLOCKED', false);
      }
    }
  },


  async setupWalletSubscription({ commit }) {
    walletSubject.unsubscribe();
    commit('SET_WALLET_UNLOCKED', false);
    walletSubject = WalletSession.Wallet.onRequestPassphraseSubscriber.subscribe(
      async (request: any) => {
        const {
          currentKeystore,
        } = await WalletSession.getSessionInfo();
        const askForPassphrase = !!WalletSession.Wallet.mnemonic === false;
        if (askForPassphrase) {
          commit('SET_UNLOCK_MODAL_VISIBLE', true);
        } else {
          WalletSession.Wallet.id = currentKeystore.keystore;
          await WalletSession.set({ ks: currentKeystore, unlock: true });
          commit('SET_UNLOCK_MODAL_VISIBLE', false);
          commit('SET_UNLOCK_MODAL_ERROR', false);
          commit('SET_WALLET_UNLOCKED', true);
        }

        const { type } = request;

        switch (type) {
          case 'wallet':
            // TODO: check if we need this option
            break;
          case 'request_tx':
            // TODO: check if we need this option
            break;
          case 'request_tx_response':
            // TODO: check if we need this option
            break;
          case 'done':
            WalletSession.Wallet.id = currentKeystore.keystore;
            await WalletSession.set({ ks: currentKeystore, unlock: true });
            commit('SET_UNLOCK_MODAL_VISIBLE', false);
            commit('SET_UNLOCK_MODAL_ERROR', false);
            commit('SET_WALLET_UNLOCKED', true);
            break;

          case 'error':
            commit('SET_UNLOCK_MODAL_ERROR', true);
            commit('SET_WALLET_UNLOCKED', false);
            break;

          default:
            break;
        }
      }
    );
  },
};
