<template>
    <v-card
      v-if="orders.length"
      v-for="order in orders"
      :key="order.id"
      class="mx-auto ma-10"
      max-width="344"
      variant="outlined"
      prepend-icon="mdi-basket"
    >
      <v-card-item>
        <div>
          <div class="text-overline mb-1">
            {{ order.status }}
          </div>
          <div class="text-h6 mb-1">
            Order by {{ order.customerName }}
          </div>
          <div class="text-caption">
            {{ formatDate(new Date(order.createdAt), 'DD/MM/YYYY') }}
          </div>
        </div>
      </v-card-item>

      <v-card-actions class="ma-3">
        <v-btn variant="outlined" @click="pickOrder(order)">
          Pick
        </v-btn>
        <v-btn variant="outlined" @click="delegateOrder(order)">
          Delegate
        </v-btn>
      </v-card-actions>
    </v-card>

  <v-card
    v-else
    class="mx-auto ma-10"
    max-width="344"
    variant="outlined"
    prepend-icon="mdi-basket"
  >
    <v-skeleton-loader type="list-item-three-line, actions" />
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from "@vueuse/core";
import { IOrder } from '../../../../types';

export default defineComponent({
  name: 'Orders',
  setup() {
    // console.log('$route.params.id', this.$route.params.id);
    const route = useRoute()
    const pickerId = ref('')
    const orders: IOrder[] = ref([])
    const loading = ref(true);

    const pickerLevel = computed(() => {
      return route.name;
    })

    watch(pickerLevel, async () => {
      // fetch picker by level from backend
      console.log('pickerLevel: ', pickerLevel.value)
      orders.value = [];
      await fetch(`http://localhost:3000/api/v1/pickers/level/${pickerLevel.value}`)
        .then(response => response.json())
        .then(json => (pickerId.value = json.picker.id))
    }, { immediate: true });

    watch(pickerId, async () => {
      if (pickerId.value) {
        fetch(`http://localhost:3000/api/v1/orders/picker-orders/${pickerId.value}`)
          .then(response => response.json())
          .then(json => { console.log('picker-orders: ', json); return json })
          .then(json => (orders.value = json.orders))
      }
    })

    return { orders }
  },
  methods: {
    formatDate,
    pickOrder(order: IOrder) {
      // make a post request to the backend
      const { id: orderId } = order
      fetch(`http://localhost:3000/api/v1/orders/${orderId}/pick`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pickerId: this.pickerId }),
      })
        .then(response => response.json())
        .then(json => {
          console.log('json: ', json)
        })
    },
    delegateOrder(order: IOrder) {
      // make a post request to the backend
      const { id: orderId } = order
      fetch(`http://localhost:3000/api/v1/orders/${orderId}/delegate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pickerId: this.pickerId }),
      })
        .then(response => response.json())
        .then(json => {
          console.log('json: ', json)
        })
    },
  },
})
</script>