<template>
  <v-dialog :value="show" persistent max-width="800" scrollable>
    <v-card class="elevation-4 modal-card">
      <v-card-title primary-title class="elevation-0 modal-toolbar">
        <div class="headline">{{ modalTitle }}</div>
      </v-card-title>
      <ValidationObserver>
        <v-form
          @submit.prevent="validate().then(handleSubmit)"
          slot-scope="{ invalid, validated, validate }"
          autocomplete="off"
        >
          <v-card-text class="pa-3">
            <section-loading :loading="savingWallet" message="Saving a wallet...">
              <v-layout row wrap>
                <v-flex xs12>
                  <ValidationProvider name="Name" rules="required|min:2" v-slot="{ errors }">
                    <v-text-field
                      :disabled="walletSaved"
                      label="Name"
                      v-model="wallet.name"
                      class="input-group--focused"
                      required
                    />
                    <span color="primary">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="Mnemonic"
                    v-if="mode === 'IMPORT'"
                    rules="required|min:2"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      :disabled="walletSaved"
                      label="Mnemonic"
                      v-model="wallet.mnemonic"
                      class="input-group--focused"
                    ></v-text-field>
                    <span color="primary">{{ errors[0] }}</span>
                  </ValidationProvider>

                  <ValidationProvider
                    name="Passphrase"
                    rules="required|min:4"
                    v-slot="{ errors }"
                    vid="password"
                  >
                    <v-text-field
                      :disabled="walletSaved"
                      v-model="wallet.password"
                      :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                      :type="showPassword ? 'text' : 'password'"
                      label="Passphrase"
                      class="input-group--focused"
                      @click:append="showPassword = !showPassword"
                      autocomplete="new-password"
                    ></v-text-field>
                    <span color="primary">{{ errors[0] }}</span>
                  </ValidationProvider>

                  <ValidationProvider
                    name="Confirm passphrase"
                    rules="required|confirmed:password"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="confirmPassword"
                      :disabled="walletSaved"
                      :append-icon="showConfirmPassword ? 'visibility' : 'visibility_off'"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      label="Confirm passphrase"
                      class="input-group--focused"
                      @click:append="showConfirmPassword = !showConfirmPassword"
                      autocomplete="new-password"
                    ></v-text-field>
                    <span color="primary">{{ errors[0] }}</span>
                  </ValidationProvider>
                </v-flex>

                <v-flex xs12 v-if="newWalletMnemonic && newWalletMnemonic.length > 1" class="pt-4">
                  <v-flex>
                    <h3>Mnemonic</h3>
                  </v-flex>
                  <v-flex>
                    <div cols="12">
                      <div class="text-xs-center pa-4">
                        <v-chip
                          label
                          outline
                          class="ma-2"
                          v-for="(word, index) in newWalletMnemonic.split(' ')"
                          :key="index"
                          color="primary"
                        >
                          <v-badge left>
                            <template v-slot:badge>
                              <span>{{ index + 1 }}</span>
                            </template>
                            <span>{{ `${word} ` }}</span>
                          </v-badge>
                        </v-chip>
                      </div>
                    </div>
                  </v-flex>
                </v-flex>
              </v-layout>
            </section-loading>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="cancel-button"
              :disabled="savingWallet"
              v-if="!walletSaved"
              @click="onCancel"
              text
            >Cancel</v-btn>
            <v-btn
              class="confirm-button"
              v-if="!walletSaved"
              :disabled="invalid || !validated || savingWallet"
              type="submit"
              text
            >Save</v-btn>
            <v-btn class="confirm-button" v-if="walletSaved" @click="onOk" text>OK</v-btn>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import SectionLoading from '@/modules/shared/components/SectionLoading/SectionLoading.vue';
import { NewWalletMode, NewWalletModel } from '../models';

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    SectionLoading,
  },
})
export default class NewWalletModal extends Vue {
  @Prop()
  modalTitle: string;

  @Prop()
  mode: NewWalletMode;

  @Prop()
  walletSaved: boolean;

  @Prop()
  newWalletMnemonic: string;

  @Prop()
  savingWallet: boolean;

  @Prop()
  onSave: (wallet: NewWalletModel) => Promise<void>;

  @Prop()
  onOk: () => Promise<void>;

  @Prop()
  onCancel: () => Promise<void>;

  readonly show: boolean = true;

  showPassword: boolean = false;

  showConfirmPassword: boolean = false;

  confirmPassword: string = null;

  wallet: NewWalletModel = {
    name: null,
    password: null,
    mnemonic: null,
  };

  private async handleSubmit(): Promise<void> {
    await this.onSave(this.wallet);
  }
}
</script>

<style lang="stylus" module></style>
