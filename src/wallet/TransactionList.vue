<template>
  <page-layout>
    <v-layout justify-space-between column fill-height>
      <v-card-title primary>
        <h2>Transactions</h2>
      </v-card-title>
      <v-card-text style="height: 100%" :min-height="200">
        <v-data-table
              :loading="loading"
              color="primary" :pagination.sync="pagination"
              :headers="headers" no-data-text="" :loading-text="tableMessage"
              :items="transactionList" :hide-actions="!hasTransactions"
              :disable-initial-sort="true"
            >
              <template v-slot:items="props">
                <transaction-item :item="props.item" />
              </template>
              <template v-slot:no-data>
                <div v-if="!hasTransactions">No transactions found</div>
                <div v-if="loading && hasTransactions">{{ tableMessage }}</div>
              </template>
            </v-data-table>
      </v-card-text>
    </v-layout>
  </page-layout>
</template>

<script lang="ts">
import {
  Component, Vue, Watch
} from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import PageLayout from '@/modules/shared/layouts/PageLayout.vue';
import TransactionItem from './TransactionItem.vue';
import { IWallet } from '../account/models';

@Component({
  components: {
    TransactionItem,
    PageLayout
  },
  computed: {
    ...mapGetters('account', [
      'walletsLoading',
      'transactionListLoading',
      'transactionList',
      'currentWallet'
    ]),
  },
  methods: {
    ...mapActions('account', [
      'getTransactionList'
    ])
  },
})
export default class TransactionList extends Vue {
  transactionListLoading: boolean;

  transactionList: any[];

  walletsLoading: boolean;

  currentWallet: IWallet;

  getTransactionList: (address: string) => Promise<void>;

  get loading(): boolean {
    return this.walletsLoading || this.transactionListLoading;
  }

  get hasTransactions(): boolean {
    return this.transactionList.length > 0;
  }

   pagination = { rowsPerPage: 25 };

  tableMessage = 'Loading...';

  headers = [
    {
      text: 'From',
      align: 'center',
      value: 'from',
    }, {
      text: 'To',
      align: 'center',
      value: 'to',
    }, {
      text: 'Token',
      value: 'token',
      align: 'center'
    }, {
      text: 'Amount',
      value: 'value',
      align: 'center'
    }, {
      text: 'Date',
      value: '',
      align: 'center'
    },
    { text: '', value: 'hash', sortable: false }
  ];

  async beforeMount(): Promise<void> {
    if (this.currentWallet) {
      await this.getTransactionList(this.currentWallet.address);
    }
  }
}
</script>

<style lang="stylus" module>

  & table
    margin 0
    width: 100%
    background: none !important

    thead
      background-color: #4f5e92
      & > tr > th
        color: unset !important;

    tbody
      tr
        border: none !important;
      td, th
        height: 92px
      & > :nth-child(even)
        background-color: rgba(136, 146, 183, 0.1) !important;
      & > :nth-child(odd)
        background-color: rgba(96, 120, 203, 0.17) !important;

:global(.v-datatable.v-table.theme--dark) :global(.v-datatable__actions)
  background-color #4f5e92;

</style>
