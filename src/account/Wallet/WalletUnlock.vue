<template>
  <v-dialog
    :value="unlockModalVisible"
    persistent
    max-width="600"
    height="300"
    transition="scale-transition"
    origin="center center"
    lazy
  >
    <v-card class="elevation-4 modal-card" v-if="unlockModalVisible">
      <v-card-title primary-title class="elevation-0 modal-toolbar">
        <div class="headline">Enter passphrase for wallet {{ currentWallet.name }}</div>
      </v-card-title>
      <ValidationObserver>
        <v-form
          @submit.prevent="validate().then(handleSubmit)"
          slot-scope="{ invalid, validated, validate }"
          autocomplete="off"
        >
          <v-card-text class="pa-3" :class="$style.cardText">
              <v-layout row wrap>
                <v-flex xs12>
                  <ValidationProvider
                    name="Passphrase"
                    v-slot="{ errors }"
                    :rules="{ required: true }"
                  >
                    <v-text-field
                      v-model="passphrase"
                      :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                      :type="showPassword ? 'text' : 'password'"
                      label="Passphrase"
                      class="input-group--focused"
                      @click:append="showPassword = !showPassword"
                    ></v-text-field>
                    <span color="primary">{{ errors[0] }}</span>
                    <span color="primary" v-if="unlockModalError">Invalid passphrase</span>
                  </ValidationProvider>
                </v-flex>
              </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="cancel-button"
              @click="didClickOnCancel"
              text
            >Cancel</v-btn>
            <v-btn
              class="confirm-button"
              :disabled="(invalid && !validated)"
              type="submit"
              text
            >Ok</v-btn>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import {
  TypedRFE, TasaISC, ISC, Wallet
} from 'xdvplatform-wallet/src';
import {
  Component, Prop, Vue, Watch
} from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { ethers } from 'ethers';
import { IWallet } from '../models';
import { mapActions, mapGetters } from 'vuex';
import SectionLoading from '@/modules/shared/components/SectionLoading/SectionLoading.vue';

@Component({
  components: { SectionLoading, ValidationObserver, ValidationProvider },
  computed: {
    ...mapGetters('account', [
      'unlockModalVisible',
      'currentWallet',
      'unlockModalError',
    ]),
  },
  methods: {
    ...mapActions('account', ['setUnlockWalletResult']),
  },
})
export default class WalletUnlock extends Vue {
  unlockModalVisible: boolean;

  unlockModalError: boolean;

  passphrase: string = '';

  currentWallet: IWallet;

  showPassword = false;

  setUnlockWalletResult: (payload: {
    accepted: boolean;
    passphrase?: string;
  }) => Promise<void>;

  mounted() {
    this.passphrase = '';
  }

  async didClickOnCancel(): Promise<void> {
    await this.setUnlockWalletResult({ accepted: false });
  }

  async handleSubmit() {
    await this.setUnlockWalletResult({
      accepted: true,
      passphrase: this.passphrase,
    });
  }
}
</script>


<style lang="stylus" module>
.cardText {
  min-height: 170px;
}
</style>
