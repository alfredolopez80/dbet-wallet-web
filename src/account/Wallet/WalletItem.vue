<template>
  <v-list-tile avatar @click="didClickOnWallet">
    <v-list-tile-avatar>
      <v-icon medium v-if="selected">check</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>{{ wallet.name }}</v-list-tile-title>
      <v-list-tile-sub-title>{{ wallet.address }}</v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action>
      <v-list-tile-action-text>DBET:
      <wallet-balance :balance="wallet.balances.dbet" />
      </v-list-tile-action-text>
      <v-list-tile-action-text>VTHO:
      <wallet-balance :balance="wallet.balances.vtho" />
      </v-list-tile-action-text>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IWallet } from '@/modules/account/models/IWallet';
import WalletBalance from './WalletBalance.vue';

@Component({
  components: {
    WalletBalance,
  },
})
export default class WalletItem extends Vue {
  @Prop()
  wallet: IWallet;

  @Prop()
  selected: boolean;

  @Prop()
  onClick: (wallet: IWallet) => Promise<void>;

  @Prop()
  getDbetBalance: (address: string) => Promise<void>;

  @Prop()
  getVthoBalance: (address: string) => Promise<void>;

  private async didClickOnWallet(): Promise<void> {
    await this.onClick(this.wallet);
  }

  beforeMount() {
    const { address } = this.wallet;
    this.getDbetBalance(address);
    this.getVthoBalance(address);
  }
}
</script>

<style lang="stylus" module>
.balanceContainer {
  width: 100%;
  height: 100% auto;
}
</style>
