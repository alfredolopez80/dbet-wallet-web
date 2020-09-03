import BigNumber from 'bignumber.js';
import { IAccountState } from './state';
import { AccountModel } from '@/modules/shared/models/account';
import { SET_ERROR_MUTATION, SET_ERROR } from '@/modules/shared/mutations/error';
import { ListenAccountChangesPayload } from './payloads';
import { EsportProfile } from '@/modules/shared/models/esportProfile';
import { TransactionItem } from '../shared/models/transaction';
import { IWalletAddress } from './models/IWalletAddress';
import { PromoTransactionItem } from '@/modules/shared/models/promoTransactionItem';
import { IWallet } from './models/IWallet';
import { KeystoreIndex } from './models/KeystoreIndex';
import { WalletType } from './models';


const findWallet = (wallets: IWallet[], address: string): { wallet: IWallet, index: number } => {
  const index = wallets.findIndex(w => {
    if (address && w.address) {
      return w.address.toLowerCase() === address.toLowerCase();
    }
    return false;
  });
  if (index >= 0) {
    return { wallet: wallets[index], index };
  }
  return { wallet: null, index };
};

export interface IAccountMutations {
  SET_HAS_MPP_USER(state: IAccountState, payload: any): void;
  FAUCET_COMPLETE(state: IAccountState, payload: number): void;
  FAUCET_LOADING(state: IAccountState, payload: boolean): void;
  SET_LIST_TX(state: IAccountState, payload: TransactionItem[]): void;
  SET_LIST_TX_LOADING(state: IAccountState, loading: boolean): void;
  SET_HAS_TX_HISTORY(state: IAccountState, hasTx: boolean): void;
  ADD_TX_ITEM(state: IAccountState, payload: TransactionItem): void;
  SET_ACCOUNT(state: IAccountState, account: AccountModel): void;

  SET_ACCOUNT_LOADING(state: IAccountState, loading: boolean): void;

  SET_ACCOUNT_SAVING(state: IAccountState, saving: boolean): void;

  SET_BALANCE(
    state: IAccountState,
    balance: BigNumber
  ): void;

  LISTEN_ACCOUNT_CHANGES(state: IAccountState, payload: ListenAccountChangesPayload): void;
  ADD_WALLET_ADDRESS(state: IAccountState, payload: IWalletAddress): void;
  IS_LOADING_WALLET(state: IAccountState, payload: boolean): void;
  ADD_WALLET_ADDRESSES(state: IAccountState, payload: Array<IWalletAddress>): void;
  CLEAR_WALLET_ADDRESSES(state: IAccountState): void;
  SET_DEFAULT_WALLET_ADDRESS(state: IAccountState, payload: string): void;
  SET_WALLET_CHAINTAG(state: IAccountState, payload: string): void;
  SET_ESPORTS_LOADING(state: IAccountState, payload: boolean): void;
  SET_ESPORTS_PROFILES(state: IAccountState, payload: EsportProfile[]): void;
  ADD_ESPORTS_PROFILE(state: IAccountState, payload: EsportProfile): void;
  SET_CURRENT_ESPORT_PROFILE(state: IAccountState, payload: EsportProfile): void;
  SET_ERROR_ADDRESS_ABOVE_LIMIT(state: IAccountState, payload: boolean): void;
  SET_ERROR_ADDRESS_ALREADY_TAKEN(state: IAccountState, payload: boolean): void;
  CLEAR_ERRORS(state: IAccountState): void;
  UPDATE_ACCOUNT_STATUS(state: IAccountState, payload: any): void;

  SET_VERIFICATION_MODAL_OPEN(state: IAccountState, payload: boolean): void;
  SET_EDIT_PERSONALINFO_MODAL_OPEN(state: IAccountState, payload: boolean): void;
  SET_SENDING_ACCOUNT_VERIFICATION(state: IAccountState, payload: boolean): void;
  SET_RESULT_MODAL_OPEN(state: IAccountState, payload: boolean): void;
  SET_COMET_EXTENSION_MODAL_OPEN(state: IAccountState, payload: boolean): void;

  SET_REFERRALCODE(state: IAccountState, code: string): void;
  SET_LOADING_REFERRALCODE(state: IAccountState, loading: boolean): void;

  SET_LOADING_PROMO_TRANSACTIONS(state: IAccountState, loading: boolean): void;
  SET_PROMO_TRANSACTIONS(state: IAccountState, payload: PromoTransactionItem[]): void;

  SET_LOADING_PROMOTIONS(state: IAccountState, loading: boolean): void;
  SET_PROMOTIONS(state: IAccountState, payload: any[]): void;
  SET_CREATED_REDEMPTION(state: IAccountState, promotion: any): void;

  SET_LOADING_PROMO_BALANCE(state: IAccountState, loading: boolean): void;
  SET_PROMO_BALANCE(state: IAccountState, balance: number): void;

  SET_ERROR: SET_ERROR_MUTATION;

  SET_VTHO_BALANCE(state: IAccountState, payload: { balance: BigNumber, address: string }): void;
  SET_DBET_BALANCE(state: IAccountState, payload: { balance: BigNumber, address: string }): void;

  SET_VTHO_BALANCE_LOADING(state: IAccountState, address: string): void;
  SET_DBET_BALANCE_LOADING(state: IAccountState, address: string): void;

  SET_WALLETS_LOADING(state: IAccountState, loading: boolean): void;
  SET_WALLETS(state: IAccountState, keystoreIndexes: KeystoreIndex[]): void;
  SET_PRIMARY_ADDRESS(state: IAccountState, address: string): void;

  SET_WALLET_LIST_VISIBLE(state: IAccountState, visible: boolean): void;

  SET_PRIMARY_REGISTRY_LOADING(state: IAccountState, loading: boolean): void;
  SET_NEW_WALLET_MODAL_VISIBLE(state: IAccountState, loading: boolean): void;

  SET_SAVING_NEW_WALLET(state: IAccountState, saving: boolean): void;
  SET_NEW_WALLET_SAVED(state: IAccountState, saved: boolean): void;

  SET_TRANSFER_MODAL_VISIBLE(
    state: IAccountState, payload: { visible: boolean; walletType: WalletType }
  ): void;

  SET_TRANSFER_TRANSACTION_ID(
    state: IAccountState, id: string
  ): void;
  SET_MAKING_TRANSFER(state: IAccountState, making: boolean): void;
  ADD_WALLET_ITEM(state: IAccountState, item: KeystoreIndex): void;
  SET_NEW_WALLET_MNEMONIC(state: IAccountState, mnemonic: string): void;

  SET_UNLOCK_MODAL_VISIBLE(state: IAccountState, visible: boolean): void;
  SET_UNLOCK_MODAL_ERROR(state: IAccountState, error: boolean): void;
  SET_WALLET_UNLOCKED(state: IAccountState, unlocked: boolean): void;

  SET_TRANSACTION_LIST_LOADING(state: IAccountState, loading: boolean): void;
  SET_TRANSACTION_LIST(state: IAccountState, items: any[]): void;
}

export const AccountMutations: IAccountMutations = {
  SET_HAS_MPP_USER: (state: IAccountState, payload: any) => {
    state.wallet.hasMPP = payload;
  },

  FAUCET_COMPLETE: (state: IAccountState, payload: any) => {
    state.faucet.result = payload;
  },
  FAUCET_LOADING: (state: IAccountState, payload: boolean) => {
    state.faucet.isLoading = payload;
  },

  SET_LIST_TX: (state: IAccountState, payload: TransactionItem[]) => {
    state.transactions.items = payload;
  },
  ADD_TX_ITEM: (state: IAccountState, payload: TransactionItem) => {
    state.transactions.items = [...state.transactions.items, payload];
  },
  SET_LIST_TX_LOADING: (state: IAccountState, payload: boolean) => {
    state.transactions.isLoading = payload;
  },
  SET_HAS_TX_HISTORY: (state: IAccountState, payload: boolean) => {
    state.transactions.hasTransactions = payload;
  },
  LISTEN_ACCOUNT_CHANGES: (state: IAccountState, payload: any) => {
    // TODO: Function not implemented
    SET_ERROR(state, {
      name: 'Not Implemented',
      message: 'LISTEN_ACCOUNT_CHANGES not implemented'
    });
  },
  IS_LOADING_WALLET: (state, payload) => {
    state.wallet.isLoading = payload;
  },
  ADD_WALLET_ADDRESS: (state, payload) => {
    state.wallet.addresses.push(payload);
  },
  ADD_WALLET_ADDRESSES: (state, payload) => {
    if (!state.wallet.addresses) {
      state.wallet.addresses = [];
    }
    state.wallet.addresses.push(...payload);
  },

  CLEAR_WALLET_ADDRESSES: (state) => {
    state.wallet.addresses = [];
  },

  SET_DEFAULT_WALLET_ADDRESS: (state, payload) => {
    state.wallet.defaultAddress = payload;
  },

  SET_WALLET_CHAINTAG: (state, payload) => {
    state.wallet.chainTag = payload;
  },

  SET_ACCOUNT: (state: IAccountState, account: AccountModel) => {
    if (account && account.dob) {
      state.me.account = { ...account };
    } else {
      state.me.account = account;
    }
  },

  SET_BALANCE: (state, balance) => {
    state.wallet.balance = balance;
  },

  SET_ACCOUNT_LOADING: (state: IAccountState, loading: boolean) => {
    state.me.isLoading = loading;
  },

  SET_ACCOUNT_SAVING: (state: IAccountState, saving: boolean) => {
    state.me.isSaving = saving;
  },

  SET_ESPORTS_LOADING: (state: IAccountState, payload: boolean) => {
    state.esports.isLoading = payload;
  },
  SET_ESPORTS_PROFILES: (state: IAccountState, payload: EsportProfile[]) => {
    state.esports.profiles = [...payload];
  },

  ADD_ESPORTS_PROFILE: (state: IAccountState, payload: EsportProfile) => {
    state.esports.profiles.push(payload);
  },

  SET_CURRENT_ESPORT_PROFILE: (state: IAccountState, payload: EsportProfile) => {
    state.esports.currentEsportProfile = payload;
  },

  SET_ERROR_ADDRESS_ABOVE_LIMIT: (state, payload) => {
    state.criticalErrors.isAddressAboveLimit = payload;
  },

  SET_ERROR_ADDRESS_ALREADY_TAKEN: (state, payload) => {
    state.criticalErrors.isAddressAlreadyTaken = payload;
  },

  CLEAR_ERRORS: state => {
    state.criticalErrors = {
      isAddressAboveLimit: false,
      isAddressAlreadyTaken: false
    };
  },

  UPDATE_ACCOUNT_STATUS: (state, payload) => {
    if (payload && payload.identificationStatus) {
      state.me = {
        ...state.me,
        account: {
          ...state.me.account,
          identificationStatus: payload.identificationStatus
        }
      };

      switch (payload.identificationStatus) {
        case 'PROCESSING':
          state.accountVerificationProcessingModalOpen = true;
          state.accountVerificationResultModalOpen = false;
          break;
        case 'COMPLETED':
          state.accountVerificationProcessingModalOpen = false;
          state.accountVerificationResultModalOpen = true;
          break;

        default:
          state.accountVerificationProcessingModalOpen = false;
          state.accountVerificationResultModalOpen = false;
          break;
      }
    }
  },

  SET_VERIFICATION_MODAL_OPEN: (state, payload) => {
    state.accountVerificationProcessingModalOpen = payload;
  },

  SET_RESULT_MODAL_OPEN: (state, payload) => {
    state.accountVerificationResultModalOpen = payload;
  },

  SET_EDIT_PERSONALINFO_MODAL_OPEN: (state, payload) => {
    state.editPersonalInfoModalOpen = payload;
  },

  SET_SENDING_ACCOUNT_VERIFICATION: (state, payload) => {
    state.sendingAccountVerification = payload;
  },

  SET_COMET_EXTENSION_MODAL_OPEN: (state, payload) => {
    state.cometExtensionDetectorModalOpen = payload;
  },

  SET_REFERRALCODE: (state, payload) => {
    state.referralCode = payload;
  },
  SET_LOADING_REFERRALCODE: (state, loading) => {
    state.loadingReferralCode = loading;
  },

  SET_LOADING_PROMO_TRANSACTIONS: (state, loading) => {
    state.loadingPromoTransactions = loading;
  },
  SET_PROMO_TRANSACTIONS: (state, payload) => {
    state.promoTransactions = payload;
  },

  SET_LOADING_PROMOTIONS: (state, loading) => {
    state.loadingPromotions = loading;
  },
  SET_PROMOTIONS: (state, payload) => {
    state.promotions = payload;
  },

  SET_CREATED_REDEMPTION: (state, promotion) => {
    state.promotions.push(promotion);
  },

  SET_LOADING_PROMO_BALANCE: (state, loading) => {
    state.loadingPromoBalance = loading;
  },

  SET_PROMO_BALANCE: (state, balance) => {
    state.promoBalance = balance;
  },

  SET_DBET_BALANCE: (state, { balance, address }) => {
    const { wallet, index } = findWallet(state.walletInfo.wallets, address);
    if (wallet) {
      const finalBalance = balance.toFormat(3);
      wallet.balances.dbet.amount = finalBalance;
      if (wallet.address === state.walletInfo.currentAddress) {
        state.wallet.balance = balance;
      }
      wallet.balances.dbet.loading = false;
      Object.assign(state.walletInfo.wallets[index], { ...wallet });
    }
  },

  SET_VTHO_BALANCE: (state, { balance, address }) => {
    const { wallet, index } = findWallet(state.walletInfo.wallets, address);
    if (wallet) {
      const finalBalance = balance.toFormat(3);
      wallet.balances.vtho.amount = finalBalance;
      wallet.balances.vtho.loading = false;
      Object.assign(state.walletInfo.wallets[index], { ...wallet });
    }
  },

  SET_VTHO_BALANCE_LOADING: (state, address: string) => {
    const { wallet, index } = findWallet(state.walletInfo.wallets, address);
    if (wallet) {
      wallet.balances.vtho.loading = true;
      Object.assign(state.walletInfo.wallets[index], { ...wallet });
    }
  },

  SET_DBET_BALANCE_LOADING: (state, address: string) => {
    const { wallet, index } = findWallet(state.walletInfo.wallets, address);
    if (wallet) {
      wallet.balances.dbet.loading = true;
      Object.assign(state.walletInfo.wallets[index], { ...wallet });
    }
  },

  SET_WALLETS_LOADING: (state, loading: boolean) => {
    state.walletInfo.walletsLoading = loading;
  },

  SET_WALLETS: (state, keystoreIndexes: KeystoreIndex[]) => {
    const wallets: IWallet[] = keystoreIndexes.map(k => (
      {
        name: k.name,
        address: k.address,
        created: k.created,
        balances: {
          dbet: { amount: null, loading: false },
          vtho: { amount: null, loading: false },
        }
      }
    ));
    state.walletInfo.wallets = wallets;
    state.walletInfo.walletsLoading = false;
  },

  SET_PRIMARY_ADDRESS: (state, address: string) => {
    state.walletInfo.currentAddress = address;
  },

  SET_WALLET_LIST_VISIBLE: (state, visible: boolean) => {
    state.walletInfo.walletListVisible = visible;
  },

  SET_PRIMARY_REGISTRY_LOADING: (state, loading: boolean) => {
    state.walletInfo.assigningPrimaryWallet = loading;
  },

  SET_NEW_WALLET_MODAL_VISIBLE: (state, visible: boolean) => {
    state.walletInfo.newWalletModalVisible = visible;
    if (!visible) {
      state.walletInfo.newWalletSaved = false;
      state.walletInfo.savingWallet = false;
    }
  },

  SET_SAVING_NEW_WALLET: (state, saving: boolean) => {
    state.walletInfo.savingWallet = saving;
  },

  SET_NEW_WALLET_SAVED: (state, saved: boolean) => {
    state.walletInfo.newWalletSaved = saved;
  },

  SET_TRANSFER_MODAL_VISIBLE: (state, { visible, walletType }) => {
    state.walletInfo.transferTransactionId = null;
    state.walletInfo.transferWalletType = walletType;
    state.walletInfo.transferModalVisible = visible;
  },
  SET_TRANSFER_TRANSACTION_ID: (state, id: string) => {
    state.walletInfo.transferTransactionId = id;
  },

  SET_MAKING_TRANSFER: (state, making: boolean) => {
    state.walletInfo.makingTransfer = making;
  },

  ADD_WALLET_ITEM: (state, item: KeystoreIndex) => {
    const { wallets } = state.walletInfo;
    const { name, address, created } = item;
    state.walletInfo.wallets = [...wallets, {
      name,
      address,
      created,
      balances: {
        dbet: { amount: null, loading: false },
        vtho: { amount: null, loading: false },
      }
    }];
  },

  SET_NEW_WALLET_MNEMONIC: (state, mnemonic: string) => {
    state.walletInfo.newWalletMnemonic = mnemonic;
  },

  SET_UNLOCK_MODAL_VISIBLE: (state, visible: boolean) => {
    state.walletInfo.unlockModalVisible = visible;
  },
  SET_UNLOCK_MODAL_ERROR: (state, error: boolean) => {
    state.walletInfo.unlockModalError = error;
  },
  SET_WALLET_UNLOCKED: (state, unlocked: boolean) => {
    state.walletInfo.walletUnlocked = unlocked;
  },

  SET_TRANSACTION_LIST_LOADING: (state, loading: boolean) => {
    state.walletInfo.transactionListLoading = loading;
  },
  SET_TRANSACTION_LIST: (state, items: any[]) => {
    state.walletInfo.transactionList = items;
  },
  SET_ERROR
};
