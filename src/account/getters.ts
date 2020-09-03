import BigNumber from 'bignumber.js';
import { IAccountState } from './state';
import { AccountModel } from '@/modules/shared/models/account';
import { StateError } from '@/modules/shared/models/state-error';
import { EsportProfile } from '@/modules/shared/models/esportProfile';
import { TransactionItem } from '../shared/models/transaction';
import { IWalletAddress } from './models/IWalletAddress';
import { PromotionItem } from '../shared/models/promotionItem';
import { PromoTransactionItem } from '@/modules/shared/models/promoTransactionItem';
import { IWallet } from './models/IWallet';
import { WalletType } from './models';

export interface IAccountGetters {
  isUserMppEnabled(state: IAccountState): boolean;

  faucetLoading(state: IAccountState): boolean;
  faucetResult(state: IAccountState): { success: boolean; amount: number };

  transactionsLoading(state: IAccountState): boolean;
  hasTransactions(state: IAccountState): boolean;
  transactions(state: IAccountState): TransactionItem[];
  addresses(state: IAccountState): Array<IWalletAddress>;

  defaultAddress(state: IAccountState): string;
  walletIsLoading(state: IAccountState): boolean;
  walletAddresses(state: IAccountState): Array<IWalletAddress>;
  balance(state: IAccountState): BigNumber | null;
  chainTag(state: IAccountState): string;

  account(state: IAccountState): AccountModel;
  accountIsLoading(state: IAccountState): boolean;
  accountIsSaving(state: IAccountState): boolean;

  esportProfiles(state: IAccountState): EsportProfile[];
  esportProfilesLoading(state: IAccountState): boolean;
  currentEsportProfile(state: IAccountState): EsportProfile;

  errorIsAddressAlreadyTaken(state: IAccountState): boolean;
  errorIsAddressAboveLimit(state: IAccountState): boolean;
  error(state: IAccountState): StateError;

  validatingRegion(state: IAccountState): string;
  regionIsEligible(state: IAccountState): boolean;
  accountIdentificationStatus(state: IAccountState): string;
  editPersonalInfoModalOpen(state: IAccountState): boolean;
  accountVerificationProcessingModalOpen(state: IAccountState): boolean;
  accountVerificationResultModalOpen(state: IAccountState): boolean;
  cometExtensionDetectorModalOpen(state: IAccountState): boolean;
  sendingAccountVerification(state: IAccountState): boolean;

  referralCode(state: IAccountState): string;
  loadingReferralCode(state: IAccountState): boolean;

  promoTransactions(state: IAccountState): PromoTransactionItem[];
  loadingPromoTransactions(state: IAccountState): boolean;

  promotions(state: IAccountState): PromotionItem[];
  availablePromotions(state: IAccountState): PromotionItem[];
  activePromotions(state: IAccountState): PromotionItem[];
  loadingPromotions(state: IAccountState): boolean;

  loadingPromoBalance(state: IAccountState): boolean;
  promoBalance(state: IAccountState): number;
  hasPromo(state: IAccountState): boolean;

  wallets(state: IAccountState): IWallet[];
  currentWallet(state: IAccountState): IWallet;
  walletsLoading(state: IAccountState): boolean;
  walletListVisible(state: IAccountState): boolean;
  assigningPrimaryWallet(state: IAccountState): boolean;
  newWalletModalVisible(state: IAccountState): boolean;
  newWalletSaved(state: IAccountState): boolean;
  newWalletMnemonic(state: IAccountState): string;
  savingWallet(state: IAccountState): boolean;

  transferModalVisible(state: IAccountState): boolean;
  makingTransfer(state: IAccountState): boolean;
  transferTransactionId(state: IAccountState): string;
  transferWalletType(state: IAccountState): WalletType;
  unlockModalVisible(state: IAccountState): boolean;
  unlockModalError(state: IAccountState): boolean;
  walletUnlocked(state: IAccountState): boolean;

  transactionList(state: IAccountState): any[];
  transactionListLoading(state: IAccountState): boolean;
}

export const AccountGetters: IAccountGetters = {
  isUserMppEnabled: (state: IAccountState) => state.wallet.hasMPP,
  validatingRegion: (state: IAccountState) => state.region.validating,
  regionIsEligible: (state: IAccountState) => state.region.isEligible,

  faucetLoading: (state: IAccountState) => state.faucet.isLoading,
  faucetResult: (state: IAccountState) => state.faucet.result,

  hasTransactions: (state: IAccountState) => state.transactions.hasTransactions,
  transactionsLoading: (state: IAccountState) => state.transactions.isLoading,
  transactions: (state: IAccountState) => state.transactions.items,
  addresses: (state: IAccountState) => state.wallet.addresses,
  balance: (state: IAccountState) => state.wallet.balance,
  chainTag: (state: IAccountState) => state.wallet.chainTag,

  defaultAddress: (state: IAccountState) => state.wallet.defaultAddress,
  walletIsLoading: (state: IAccountState) => state.wallet.isLoading,
  walletAddresses: (state: IAccountState) => state.wallet.addresses,

  account: (state: IAccountState) => state.me.account,
  accountIsLoading: (state: IAccountState) => state.me.isLoading,
  accountIsSaving: (state: IAccountState) => state.me.isSaving,

  esportProfiles: (state: IAccountState) => state.esports.profiles,
  esportProfilesLoading: (state: IAccountState) => state.esports.isLoading,
  currentEsportProfile: (state: IAccountState) => state.esports.currentEsportProfile || null,

  errorIsAddressAlreadyTaken: state => state.criticalErrors.isAddressAlreadyTaken,
  errorIsAddressAboveLimit: state => state.criticalErrors.isAddressAboveLimit,
  error: (state: IAccountState) => state.error,
  accountIdentificationStatus: (state: IAccountState) => (state.me && state.me.account
    ? state.me.account.identificationStatus : null),

  editPersonalInfoModalOpen: (state: IAccountState) => state.editPersonalInfoModalOpen,

  accountVerificationResultModalOpen:
    (state: IAccountState) => state.accountVerificationResultModalOpen,

  accountVerificationProcessingModalOpen:
    (state: IAccountState) => state.accountVerificationProcessingModalOpen,

  cometExtensionDetectorModalOpen:
    (state: IAccountState) => state.cometExtensionDetectorModalOpen,

  sendingAccountVerification: (state: IAccountState) => state.sendingAccountVerification,

  referralCode: (state: IAccountState) => state.referralCode,
  loadingReferralCode: (state: IAccountState) => state.loadingReferralCode,

  promoTransactions: (state: IAccountState) => state.promoTransactions,
  loadingPromoTransactions: (state: IAccountState) => state.loadingPromoTransactions,

  promotions: (state: IAccountState) => state.promotions,
  availablePromotions: (state: IAccountState) => state.promotions.filter(p => p.status === 'NEW'),
  activePromotions: (state: IAccountState) => state.promotions.filter(p => p.status === 'ACTIVE'),
  hasPromo: (state: IAccountState) => {
    const hasFreeEntries = state.promotions.filter(
      p => ['NEW', 'ACTIVE'].includes(p.status)
    ).some(p => p.type === 'FREE ENTRY');
    return hasFreeEntries || state.promoBalance > 0;
  },
  loadingPromotions: (state: IAccountState) => state.loadingPromotions,
  loadingPromoBalance: (state: IAccountState) => state.loadingPromoBalance,
  promoBalance: (state: IAccountState) => state.promoBalance,

  wallets: (state: IAccountState) => state.walletInfo.wallets,
  walletsLoading: (state: IAccountState) => state.walletInfo.walletsLoading,
  currentWallet: (state: IAccountState) => {
    const index = state.walletInfo.wallets.findIndex(
      w => {
        if (w.address && state.walletInfo.currentAddress) {
          return w.address.toLowerCase() === state.walletInfo.currentAddress.toLowerCase();
        }
        return false;
      }
    );
    if (index >= 0) {
      return state.walletInfo.wallets[index];
    }
    return null;
  },
  walletListVisible: (state: IAccountState) => state.walletInfo.walletListVisible,
  assigningPrimaryWallet: (
    state: IAccountState
  ) => state.walletInfo.assigningPrimaryWallet,

  newWalletModalVisible: (state: IAccountState) => state.walletInfo.newWalletModalVisible,
  newWalletSaved: (state: IAccountState) => state.walletInfo.newWalletSaved,
  newWalletMnemonic: (state: IAccountState) => state.walletInfo.newWalletMnemonic,
  savingWallet: (state: IAccountState) => state.walletInfo.savingWallet,
  makingTransfer: (state: IAccountState) => state.walletInfo.makingTransfer,
  transferModalVisible: (state: IAccountState) => state.walletInfo.transferModalVisible,
  transferTransactionId: (state: IAccountState) => state.walletInfo.transferTransactionId,
  transferWalletType: (state: IAccountState) => state.walletInfo.transferWalletType,
  unlockModalVisible: (state: IAccountState) => state.walletInfo.unlockModalVisible,
  unlockModalError: (state: IAccountState) => state.walletInfo.unlockModalError,
  walletUnlocked: (state: IAccountState) => state.walletInfo.walletUnlocked,
  transactionList: (state: IAccountState) => state.walletInfo.transactionList,
  transactionListLoading: (
    state: IAccountState
  ) => state.walletInfo.transactionListLoading,
};
