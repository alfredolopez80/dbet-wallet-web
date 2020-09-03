<template>
  <v-dialog :value="show" persistent width="680" scrollable>
    <v-card class="elevation-4 modal-card">
      <v-card-title primary-title class="elevation-0 modal-toolbar">
        <div class="headline">My Wallets</div>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-list two-line>
          <template v-for="(wallet, index) in wallets">
            <wallet-item
              :key="wallet.address"
              :on-click="onItemClick"
              :selected="isSelected(wallet.address)"
              :wallet="wallet"
              :get-dbet-balance="getDbetBalance"
              :get-vtho-balance="getVthoBalance"
            />
            <v-divider inset :key="index"></v-divider>
          </template>
        </v-list>
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-btn class="cancel-button"
               @click="onCancel"
               :loading="assigningPrimaryWallet">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IWallet } from '../models/IWallet';
import WalletItem from './WalletItem.vue';

@Component({
  components: {
    WalletItem,
  },
})
export default class WalletList extends Vue {
  @Prop()
  wallets: IWallet[];

  @Prop()
  currentWallet: IWallet;

  @Prop()
  assigningPrimaryWallet: boolean;

  @Prop()
  onItemClick: (wallet: IWallet) => Promise<void>;

  @Prop()
  onCancel: () => Promise<void>;

  @Prop()
  getDbetBalance: (payload: { address: string, showLoading: boolean },) => Promise<void>;

  @Prop()
  getVthoBalance: (payload: { address: string, showLoading: boolean },) => Promise<void>;

  private show: boolean = true;

  private isSelected(address: string) {
    return this.currentWallet.address === address;
  }
}
</script>

<style lang="stylus" module></style>
