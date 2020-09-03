import BigNumber from 'bignumber.js';
import { AccountModel } from '@/modules/shared/models/account';
import { StateError } from '@/modules/shared/models/state-error';
import { EsportProfile } from '@/modules/shared/models/esportProfile';
import { IWalletAddress } from './models/IWalletAddress';
import { TransactionItem } from '@/modules/shared/models/transaction';
import { PromoTransactionItem } from '@/modules/shared/models/promoTransactionItem';
import { PromotionItem } from '../shared/models/promotionItem';
import { IWallet } from './models/IWallet';
import { WalletType } from './models';

export interface IWalletAccountState {
  defaultAddress?: any;
  addresses: Array<IWalletAddress>;
  chainTag: string;
  balance: BigNumber | null;
  isSaving: boolean;
  isLoading: boolean;
  hasMPP: boolean;
}

export interface WalletState {
  wallets: IWallet[];
  walletsLoading: boolean;
  currentAddress: string;
  walletListVisible: boolean;
  assigningPrimaryWallet: boolean;
  newWalletModalVisible: boolean;
  newWalletSaved: boolean;
  newWalletMnemonic:string;
  savingWallet: boolean;
  transferModalVisible: boolean;
  makingTransfer: boolean;
  transferTransactionId: string;
  transferWalletType: WalletType;
  unlockModalVisible: boolean;
  unlockModalError: boolean;
  walletUnlocked: boolean;
  transactionList: any[];
  transactionListLoading: boolean;
}

export interface IAccountState {
  transactions: {
    hasTransactions: boolean;
    items: TransactionItem[];
    isLoading: boolean;
  },
  me: {
    account: AccountModel;
    isLoading: boolean;
    isSaving: boolean;
  };

  wallet: IWalletAccountState;

  walletInfo: WalletState;

  esports: {
    profiles: EsportProfile[],
    isSaving: boolean;
    isLoading: boolean;
    currentEsportProfile: EsportProfile
  };

  faucet: {
    isLoading: boolean;
    result: {
      success: boolean;
      amount: number;
    }
  };

  // These errors will block the User Interface!
  criticalErrors : {
    isAddressAlreadyTaken: boolean;
    isAddressAboveLimit: boolean
  };

  region: {
    validating: string;
    isEligible: boolean;
  }

  error?: StateError;

  editPersonalInfoModalOpen: boolean;

  accountVerificationProcessingModalOpen: boolean;

  accountVerificationResultModalOpen: boolean;

  sendingAccountVerification: boolean;

  cometExtensionDetectorModalOpen: boolean;

  referralCode: string;

  loadingReferralCode: boolean;

  promoTransactions: PromoTransactionItem[];
  loadingPromoTransactions: boolean;

  promotions: PromotionItem[];
  loadingPromotions: boolean;

  promoBalance: number;
  loadingPromoBalance: boolean;
}


export const AccountDefaultState = (): IAccountState => ({
  transactions: {
    hasTransactions: true,
    isLoading: false,
    items: [],
  },
  me: {
    account: null,
    isLoading: false,
    isSaving: false
  },
  wallet: {
    defaultAddress: null,
    addresses: [],
    isSaving: false,
    isLoading: true,
    chainTag: null,
    balance: null,
    hasMPP: false,
  },

  walletInfo: {
    wallets: [],
    walletsLoading: false,
    currentAddress: '',
    walletListVisible: false,
    assigningPrimaryWallet: false,
    newWalletModalVisible: false,
    newWalletSaved: false,
    newWalletMnemonic: null,
    savingWallet: false,
    transferModalVisible: false,
    makingTransfer: false,
    transferTransactionId: null,
    transferWalletType: 'DBET',
    unlockModalVisible: false,
    unlockModalError: false,
    walletUnlocked: false,
    transactionList: [],
    transactionListLoading: false
  },

  esports: {
    profiles: [],
    isSaving: false,
    isLoading: false,
    currentEsportProfile: null
  },

  faucet: {
    isLoading: false,
    result: {
      success: false,
      amount: 0
    }
  },

  criticalErrors: {
    isAddressAboveLimit: false,
    isAddressAlreadyTaken: false
  },

  region: {
    validating: null,
    isEligible: false
  },

  editPersonalInfoModalOpen: false,
  accountVerificationProcessingModalOpen: false,
  accountVerificationResultModalOpen: false,
  sendingAccountVerification: false,
  cometExtensionDetectorModalOpen: false,

  referralCode: null,
  loadingReferralCode: false,

  promoTransactions: [],
  loadingPromoTransactions: false,

  promotions: [],
  loadingPromotions: false,

  promoBalance: 0.00,
  loadingPromoBalance: false
});
