<template>
  <page-layout>
    <wallet-list
      v-if="walletListVisible"
      :assigning-primary-wallet="assigningPrimaryWallet"
      :current-wallet="currentWallet"
      :wallets="wallets"
      :on-item-click="didClickOnWalletItem"
      :on-cancel="didClickOnWalletListCancel"
      :get-dbet-balance="getDBETBalance"
      :get-vtho-balance="getVTHOBalance"
    />
    <new-wallet-modal
      v-if="newWalletModalVisible"
      :saving-wallet="savingWallet"
      :wallet-saved="newWalletSaved"
      :mode="newWalletMode"
      :modal-title="newWalletTitle"
      :on-save="didClickOnNewWalletSave"
      :on-ok="didClickOnNewWalletOK"
      :on-cancel="didClickOnNewWalletCancel"
      :new-wallet-mnemonic="newWalletMnemonic"
    />
    <transfer-modal
      v-if="transferModalVisible"
      :making-transfer="makingTransfer"
      :transaction-id="transferTransactionId"
      :wallet-type="transferWalletType"
      :on-make-transfer="didClickOnTransferModalMake"
      :on-cancel="didClickOnTransferModalCancel"
      :on-ok="didClickOnTransferModalOK"
    />
    <v-layout justify-space-between column fill-height>
      <v-card-title primary>
        <h2>Wallet</h2>
      </v-card-title>
      <v-card-text style="height: 100%" :min-height="200">
        <section-loading :loading="walletsLoading">
          <current-wallet
            v-if="currentWallet"
            :on-click="didClickOnPrimaryWallet"
            :wallet="currentWallet"
            :get-dbet-balance="getDBETBalance"
            :get-vtho-balance="getVTHOBalance"
            :on-transfer="didClickOnTransfer"
            :on-copy="didClickOnCopy"
          />
          <h3 v-else>No wallets found.</h3>
        </section-loading>
      </v-card-text>
      <wallet-actions :on-create="didClickOnCreateWallet" :on-import="didClickOnImportWallet" />
    </v-layout>
  </page-layout>
</template>

<script lang="ts">
import {
  Component, Vue, Watch, Prop
} from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import SectionLoading from '@/modules/shared/components/SectionLoading/SectionLoading.vue';
import PageLayout from '@/modules/shared/layouts/PageLayout.vue';
import CurrentWallet from './CurrentWallet.vue';
import NewWalletModal from './NewWalletModal.vue';
import TransferModal from './TransferModal.vue';
import WalletList from './WalletList.vue';
import WalletActions from './WalletActions.vue';
import {
  IWallet, NewWalletMode, WalletType, NewWalletModel
} from '../models';
import { AppNotificationConfig } from '@/modules/shared/state/ui';

@Component({
  components: {
    PageLayout,
    SectionLoading,
    CurrentWallet,
    WalletActions,
    WalletList,
    NewWalletModal,
    TransferModal,
  },
  computed: {
    ...mapGetters('account', [
      'walletsLoading',
      'wallets',
      'currentWallet',
      'walletListVisible',
      'assigningPrimaryWallet',
      'newWalletModalVisible',
      'newWalletSaved',
      'savingWallet',
      'transferModalVisible',
      'makingTransfer',
      'newWalletMnemonic',
      'transferTransactionId',
      'transferWalletType',
      'walletUnlocked',
    ]),
  },
  methods: {
    ...mapActions('account', [
      'getDBETBalance',
      'getVTHOBalance',
      'getWallets',
      'transferDBETs',
      'transferVTHO',
      'setWalletListVisible',
      'setPrimaryWallet',
      'setNewWalletModalVisible',
      'setTransferModalVisible',
      'createNewWallet',
      'requestUnlockWallet',
    ]),
    ...mapActions('ui', ['showAppNotification']),
    ...mapActions('session', ['setupSolido']),
  },
})
export default class Wallet extends Vue {
  @Prop()
  publicWallet: boolean;

  walletsLoading: boolean;

  walletUnlocked: boolean;

  wallets: IWallet[];

  currentWallet: IWallet;

  walletListVisible: boolean;

  assigningPrimaryWallet: boolean;

  newWalletModalVisible: boolean;

  newWalletSaved: boolean;

  newWalletMnemonic: string;

  savingWallet: boolean;

  transferModalVisible: boolean;

  makingTransfer: boolean;

  transferTransactionId: string;

  newWalletMode: NewWalletMode = 'CREATE';

  transferWalletType: WalletType;

  newWalletTitle: string = '';

  requestedTransfer: { to: string; amount: string; type: WalletType } = null;

  getDBETBalance: (payload: { address: string, showLoading: boolean }) => Promise<void>;

  getVTHOBalance: (payload: { address: string, showLoading: boolean }) => Promise<void>;

  transferVTHO: (payload: { to: string; amount: string }) => Promise<string>;

  transferDBETs: (payload: { to: string; amount: string }) => Promise<string>;

  getWallets: () => Promise<void>;

  setPrimaryWallet: (address: string) => Promise<void>;

  setWalletListVisible: (visible: boolean) => Promise<void>;

  setNewWalletModalVisible: (visible: boolean) => Promise<void>;

  setTransferModalVisible: (payload: {
    visible: boolean;
    walletType?: WalletType;
  }) => Promise<void>;

  createNewWallet: (payload: NewWalletModel) => Promise<void>;

  showAppNotification: (config: AppNotificationConfig) => Promise<void>;

  setupSolido: () => Promise<void>;

  requestUnlockWallet: () => Promise<void>;

  async beforeMount(): Promise<void> {
    if (this.publicWallet) {
      await this.setupSolido();
    }
    await this.getWallets();
  }

  private async updateBalances(): Promise<void> {
    const { address } = this.currentWallet;
    await this.getDBETBalance({ address, showLoading: true });
    await this.getVTHOBalance({ address, showLoading: true });
  }

  async didClickOnPrimaryWallet(): Promise<void> {
    await this.setWalletListVisible(true);
  }

  async didClickOnWalletItem(wallet: IWallet): Promise<void> {
    await this.setPrimaryWallet(wallet.address);
    await this.setWalletListVisible(false);
    await this.setupSolido();
    await this.updateBalances();
  }

  async didClickOnNewWalletSave(walletModel: NewWalletModel): Promise<void> {
    await this.createNewWallet({ ...walletModel, publicWallet: this.publicWallet });
    if (this.newWalletSaved) {
      await this.setupSolido();
      await this.updateBalances();
    }
  }

  async didClickOnNewWalletOK(): Promise<void> {
    await this.setNewWalletModalVisible(false);
  }

  async didClickOnNewWalletCancel(): Promise<void> {
    await this.setNewWalletModalVisible(false);
  }

  async didClickOnTransfer(type: WalletType): Promise<void> {
    this.setTransferModalVisible({ visible: true, walletType: type });
  }

  async didClickOnTransferModalCancel(): Promise<void> {
    this.setTransferModalVisible({ visible: false });
  }

  async didClickOnTransferModalOK(): Promise<void> {
    await this.setTransferModalVisible({ visible: false });
    await this.updateBalances();
  }

  async didClickOnTransferModalMake(payload: {
    to: string;
    amount: string;
    type: WalletType;
  }): Promise<void> {
    this.requestedTransfer = payload;
    if (this.walletUnlocked) {
      await this.onWalletUnlock(true);
    } else {
      await this.requestUnlockWallet();
    }
  }

  @Watch('walletUnlocked')
  async onWalletUnlock(unlocked: boolean): Promise<void> {
    if (unlocked) {
      if (this.requestedTransfer != null) {
        const { to, amount, type } = this.requestedTransfer;
        switch (type) {
          case 'DBET':
            await this.transferDBETs({ to, amount });
            break;
          case 'VTHO':
            await this.transferVTHO({ to, amount });
            break;
          default:
            break;
        }
        this.updateBalances();
        this.setTransferModalVisible({ visible: false });
        this.requestedTransfer = null;
      }
    } else {
      this.requestedTransfer = null;
    }
  }

  async didClickOnCreateWallet(): Promise<void> {
    this.newWalletTitle = 'Create New Wallet';
    this.newWalletMode = 'CREATE';
    await this.setNewWalletModalVisible(true);
  }

  async didClickOnImportWallet(): Promise<void> {
    this.newWalletTitle = 'Import New Wallet';
    this.newWalletMode = 'IMPORT';
    await this.setNewWalletModalVisible(true);
  }

  async didClickOnWalletListCancel() {
    await this.setWalletListVisible(false);
  }

  async didClickOnCopy(value: string, message: string): Promise<void> {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.value = value;

    input.focus();
    input.select();

    const isSuccessful = document.execCommand('copy');
    document.body.removeChild(input);

    if (isSuccessful) {
      await this.showAppNotification({
        color: 'info',
        title: 'Copied!',
        text: `${message} is in your clipboard.`,
      });
    } else {
      await this.showAppNotification({
        color: 'error',
        title: 'Error!',
        text: `Error when trying to copy ${message}.`,
      });
    }
  }
}
</script>

<style lang="stylus" module>
$step = 8px;

.btnLink {
  margin-left: 0px;
  margin-right: 0px;
  height: $step * 6;

  :global(.v-btn__content) {
    text-transform: none;
  }
}

.cometIcon {
  flex: 0 $step * 20;
  max-width: $step * 15;
  align-self: center;
  padding: $step * 2 0;
  object-fit: contain;
}

.setupContainer {
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
