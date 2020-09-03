<template>
  <tr :class="$style.row">
    <td>{{ item.from }}</td>
    <td>{{ item.to }}</td>
    <td>{{ item.token }}</td>
    <td>{{ item.value }}</td>
    <td>{{ item.date }}</td>
    <td class="justify-center layout px-0">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="info" icon :href="transactionUrl" target="_blank">
            <v-icon small>search</v-icon>
          </v-btn>
        </template>
        <span>View Transaction</span>
      </v-tooltip>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

const env = process.env.VUE_APP_ENV;

@Component({})
export default class TransactionItem extends Vue {
  @Prop()
  item: any;

  get transactionUrl(): string {
    const { hash } = this.item;
    if (env === 'production') {
      return `https://insight.vecha.in/#/main/txs/${hash}`;
    }
    return `https://insight.vecha.in/#/test/txs/${hash}`;
  }
}
</script>

<style lang="stylus" module>
.row {
  margin: 0;

  // Other Text Cells
  > td {
    text-align: center;

    // Removes the Color from the links
    a {
      color: unset;
    }
  }
}
</style>
