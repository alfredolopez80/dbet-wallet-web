<template>
  <span :class="$style.balanceContainer">
    <v-progress-circular
      v-if="balance.loading"
      ma-2
      indeterminate
      color="primary"
      :size="25"
      :width="5"
    />
    <span v-else>{{ balance.amount }}</span>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IWalletBalance } from '../models/IWallet';

@Component({
  name: 'WalletBalance',
})
export default class WalletBalance extends Vue {
  @Prop()
  balance: IWalletBalance;
}
</script>

<style lang="stylus" module>
.balanceContainer {
  width: 100%;
}
</style>
