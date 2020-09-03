<template>
  <v-flex xs12 sm6>
    <v-card color="transparent" flat>
      <v-list two-line>
        <v-list-tile avatar class="mb-5 elevation-2">
          <v-list-tile-avatar>
            <v-icon x-large>account_balance_wallet</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ wallet.name }}</v-list-tile-title>
            <v-list-tile-sub-title>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on"
                      class="link"
                       @click="didClickOnCopyAddress">
                    {{ wallet.address }} <v-icon small>content_copy</v-icon>
                  </div>
                </template>
                <span>Copy Address</span>
              </v-tooltip>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn flat icon color="primary" v-on="on" @click="onClick">
                  <v-icon medium>playlist_add_check</v-icon>
                </v-btn>
              </template>
              <span>View Wallets</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile avatar>
          <v-list-tile-avatar>DBET</v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-sub-title>
              <wallet-balance :balance="wallet.balances.dbet" />
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip left v-if="dbetTransferEnabled">
              <template v-slot:activator="{ on }">
                <v-btn class="confirm-button" v-on="on" @click="onTransfer('DBET')">
                  <v-icon left dark>send</v-icon>Send
                </v-btn>
              </template>
              <span>Send DBETs</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile avatar>
          <v-list-tile-avatar>VTHO</v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-sub-title>
              <wallet-balance :balance="wallet.balances.vtho" />
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip left v-if="vthoTransferEnabled">
              <template v-slot:activator="{ on }">
                <v-btn class="info-button" v-on="on" @click="onTransfer('VTHO')">
                  <v-icon left dark>send</v-icon>Send
                </v-btn>
              </template>
              <span>Send VTHO</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IWallet, IWalletBalance } from '@/modules/account/models/IWallet';
import WalletBalance from './WalletBalance.vue';
import { AppNotificationConfig } from '@/modules/shared/state/ui';

@Component({
  components: {
    WalletBalance,
  },
})
export default class CurrentWallet extends Vue {
  @Prop()
  wallet: IWallet;

  @Prop()
  onClick: () => Promise<void>;

  @Prop()
  getDbetBalance: ({ address: string, showLoading: boolean }) => Promise<void>;

  @Prop()
  getVthoBalance: ({ address: string, showLoading: boolean }) => Promise<void>;

  @Prop()
  onTransfer: (symbol: string) => Promise<void>;

  @Prop()
  onCopy: (value: string, message: string) => Promise<void>;

  beforeMount() {
    const { address } = this.wallet;
    this.getDbetBalance({ address, showLoading: true });
    this.getVthoBalance({ address, showLoading: true });
  }

  get vthoTransferEnabled(): boolean {
    if (
      this.wallet
      && this.wallet.balances.vtho
      && this.transferEnabled(this.wallet.balances.vtho)
    ) {
      return true;
    }
    return false;
  }

  get dbetTransferEnabled(): boolean {
    if (
      this.wallet
      && this.wallet.balances.dbet
      && this.transferEnabled(this.wallet.balances.dbet)
    ) {
      return true;
    }
    return false;
  }

  private transferEnabled(balance: IWalletBalance): boolean {
    if (balance && !balance.loading) {
      if (balance.amount && parseFloat(balance.amount) > 0) {
        return true;
      }
    }
    return false;
  }

  async didClickOnCopyAddress() {
    await this.onCopy(this.wallet.address, 'The current wallet address');
  }
}
</script>

<style lang="stylus" module>
.title {
  cursor: pointer;
}
</style>
