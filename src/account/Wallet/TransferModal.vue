<template>
  <v-dialog :value="show" persistent max-width="600" scrollable>
    <v-card class="elevation-4 modal-card">
      <v-card-title primary-title class="elevation-0 modal-toolbar">
        <div class="headline">Transfer {{ title }}</div>
      </v-card-title>
      <ValidationObserver>
        <v-form
          @submit.prevent="validate().then(handleSubmit)"
          slot-scope="{ invalid, validated, validate }"
          autocomplete="off"
        >
          <v-card-text class="pa-3">
            <section-loading
              :loading="makingTransfer"
              message="Making a transfer..."
            >
              <v-layout row wrap>
                <v-flex xs12>
                  <ValidationProvider
                    name="To"
                    v-slot="{ errors }"
                    :rules="{ required: true }"
                  >
                    <v-text-field
                      v-model="transfer.to"
                      label="To"
                      required
                    ></v-text-field>
                    <span color="primary">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="Amount"
                    v-slot="{ errors }"
                    :rules="{ required: true, numeric: true }"
                  >
                    <v-text-field
                      v-model="transfer.amount"
                      label="Amount"
                      required
                    ></v-text-field>
                    <span color="primary">{{ errors[0] }}</span>
                  </ValidationProvider>
                </v-flex>
                <v-flex
                  xs12
                  v-if="!makingTransfer && transactionId !== null"
                  class="pt-4"
                >
                  <v-flex>
                    <h3>Transaction:</h3>
                  </v-flex>
                  <v-flex>
                    <div cols="12">
                      <div class="text-xs-center pa-4">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <a v-on="on" :href="transactionUrl" target="_blank">
                              {{ transactionId }}
                            </a>
                          </template>
                          <span>View the transaction</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </v-flex>
                </v-flex>
              </v-layout>
            </section-loading>
          </v-card-text>
          <v-card-actions v-if="!makingTransfer && transactionId !== null">
            <v-btn
              class="confirm-button"
              :disabled="makingTransfer"
              @click="onOk"
              text
            >
              OK
            </v-btn>
          </v-card-actions>
          <v-card-actions v-else>
            <v-btn
              class="cancel-button"
              :disabled="makingTransfer"
              @click="onCancel"
              text
            >
              Cancel
            </v-btn>
            <v-btn
              class="confirm-button"
              :disabled="(invalid && !validated) || makingTransfer"
              type="submit"
              text
            >
              Transfer
            </v-btn>
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
import { WalletType } from '../models';

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    SectionLoading,
  },
})
export default class TransferModal extends Vue {
  @Prop()
  walletType: WalletType

  @Prop()
  transactionId: string

  @Prop()
  makingTransfer: boolean

  @Prop()
  onCancel: () => Promise<void>

  @Prop()
  onOk: () => Promise<void>

  @Prop()
  onMakeTransfer: (payload: {
    to: string
    amount: string
    type: WalletType
  }) => Promise<void>

  get title(): string {
    if (this.walletType === 'DBET') {
      return 'DBETs';
    }

    return this.walletType;
  }

  private transfer = {
    to: null,
    amount: null,
  }

  async handleSubmit() {
    const { to, amount } = this.transfer;
    await this.onMakeTransfer({ to, amount, type: this.walletType });
  }

  readonly show: boolean = true

  get transactionUrl(): string {
    const env = process.env.VUE_APP_ENV;
    if (env === 'production') {
      return `https://insight.vecha.in/#/main/txs/${this.transactionId}`;
    }
    return `https://insight.vecha.in/#/test/txs/${this.transactionId}`;
  }
}
</script>

<style lang="stylus" module></style>
