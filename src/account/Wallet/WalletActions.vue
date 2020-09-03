<template>
  <v-card-actions>
    <v-btn class="confirm-button" @click="onCreate">
      <v-icon left dark>add_box</v-icon>Create New Wallet
    </v-btn>
    <v-btn class="confirm-button" @click="onImport">
      <v-icon left dark>publish</v-icon>Import Wallet
    </v-btn>
    <v-spacer></v-spacer>
  </v-card-actions>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class WalletActions extends Vue {
  @Prop()
  onCreate: () => Promise<void>;

  @Prop()
  onImport: () => Promise<void>;
}
</script>

<style lang="stylus" module>
</style>
