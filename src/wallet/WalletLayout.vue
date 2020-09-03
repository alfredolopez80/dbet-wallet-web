<template>
  <v-container fluid fill-height pa-5>
    <v-layout column>
      <v-tabs fixed-tabs hide-slider :class="$style.ContestTabs" v-model="currentTab">
        <v-tab :class="$style.Tab" href="#Wallet">Wallet</v-tab>
        <v-tab :class="$style.Tab" href="#Transactions">Transactions</v-tab>
      </v-tabs>
      <v-tabs-items :class="$style.section" v-model="currentTab">
        <v-tab-item value="Wallet">
          <wallet :public-wallet="true" v-if="currentTab ==='Wallet'"/>
        </v-tab-item>
        <v-tab-item value="Transactions">
           <transaction-list v-if="currentTab ==='Transactions'"/>
        </v-tab-item>
      </v-tabs-items>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable no-underscore-dangle */
import { Component, Vue } from 'vue-property-decorator';
import Wallet from '@/modules/account/Wallet/Wallet.vue';
import TransactionList from './TransactionList.vue';
import { mapActions, mapGetters } from 'vuex';
import { IWallet } from '../account/models';

@Component({
  components: {
    Wallet,
    TransactionList
  },
  methods: {
    ...mapActions('account', [
      'setupWalletSubscription',
      'getDBETBalance',
      'getVTHOBalance',
    ]),
  },
  computed: {
    ...mapGetters('account', ['currentWallet']),
  },
})
export default class WalletLayout extends Vue {
  balanceInterval: any; // NodeJS.Timeout

  currentTab = 'Wallet';

  currentWallet: IWallet;

  setupWalletSubscription: () => Promise<void>;

  getDBETBalance: (payload: {
    address: string;
    showLoading: boolean;
  }) => Promise<void>;

  getVTHOBalance: (payload: {
    address: string;
    showLoading: boolean;
  }) => Promise<void>;

  async beforeMount(): Promise<void> {
    await this.setupWalletSubscription();
    this.balanceInterval = setInterval(async () => {
      await this.updateBalances();
    }, 3000);
  }

  private async updateBalances(): Promise<void> {
    if (this.currentWallet) {
      const { address } = this.currentWallet;
      await this.getDBETBalance({ address, showLoading: false });
      await this.getVTHOBalance({ address, showLoading: false });
    }
  }

  beforeDestroy() {
    if (this.balanceInterval) {
      clearInterval(this.balanceInterval);
    }
  }
}
</script>

<style lang="stylus" module>
.mainToolbar {
  z-index: 9 !important;

  & .v-toolbar__content {
    padding: 0 !important;
    margin: 0 !important;
  }
}

.mainContent {
  min-height: 100%;
}

$border-radius = 4px;
$color = #6078CB;
$precise-tab-button-size = 283px; // @boogle asked for this size

.ContestTabs {
  // Remove the default background
  // Note: This should have been removed by the theme, but it is not.
  :global(.v-tabs__bar.theme--dark) {
    background: none;
  }

  padding-bottom: 2em

  // Individual Pill Styles
  .Tab {
    min-width: $precise-tab-button-size;
    text-transform: capitalize;

    // Adds small rounded corner for the beginning and end of the bar
    &:first-of-type :global(.v-tabs__item) {
      border-radius: $border-radius 0px 0px $border-radius;
    }

    &:last-of-type :global(.v-tabs__item) {
      border-radius: 0px $border-radius $border-radius 0px;
    }

    // Tab Items
    :global(.v-tabs__item) {
      min-width: $precise-tab-button-size;
      border: 1px solid $color;

      // Regular state
      &:not(:global(.v-tabs__item--active)) {
        color: $color;
      }

      // Active State
      &:global(.v-tabs__item--active) {
        color: #fff;
        background-color: $color;
      }
    }
  }
}
</style>
