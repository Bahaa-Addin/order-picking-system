<template>
  <v-layout v-if="activeOrderId">
      <v-card
        class="mx-auto my-10"
        min-width="450"
      >
        <v-list
          v-if="orderItemsList.length"
          :items="orderItemsList"
          item-props
          lines="three"
        >
          <template v-slot:append="{ item }">
            <v-btn
              :key="item.key"
              icon
              small
              class="ml-2"
              @click="addToCart(item)"
              :disabled="item.disabled"
            >
              <v-icon>{{ item.appendIcon }}</v-icon>
            </v-btn>
          </template>
        </v-list>
      </v-card>
  </v-layout>

  <v-layout
    align-center
    justify-center
    row
  >
    <v-card
      v-for="item in items"
      :key="item.id"
      class="ma-3"
      width="374"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img
        cover
        height="250"
        :src="item.image"
      ></v-img>

      <v-card-item>
        <v-card-title>{{item.name}}</v-card-title>

        <v-card-subtitle>
          <span class="me-1">{{item.status.split('_').join(' ')}}</span>
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <div class="text-grey">
          {{item.quantity}} Available
        </div>

        <div class="my-4 text-subtitle-1">
          $ {{item.price}}
        </div>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { subscribeToItems } from '@/services/items';
import { IItem } from '../../../../types';

const ITEMS_IMAGES = {
  Bread: 'https://www.goldmedalbakery.com/content/uploads/2019/12/Sandwich-White.jpg',
  Eggs: 'https://www.eggcartons.com/cdn/shop/products/FHP-56T-1-YELLOW-TOPWEGGS_2048x2048.jpg?v=1661178954',
  Milk: 'https://res.cloudinary.com/farm-boy/image/upload/c_fill,g_center,h_600,w_600,f_auto/Products/23558_Reg.png',
}

export default defineComponent({
  name: 'Items',
  data() {
    return {
      items: [],
      activeOrderId: '',
      order: undefined,
      orderItemsList: [],
    }
  },
  methods: {
    setListItems() {
      if (this.order && this.items.length) {
        this.orderItemsList =  this.order.itemsDetails.flatMap((orderItemDetails, idx, arr) => {
          const item = this.items.find((item) => item.id === orderItemDetails.item_id);
          const listItem = [
            {
              key: orderItemDetails.item_id,
              prependAvatar: ITEMS_IMAGES[orderItemDetails.name],
              title: orderItemDetails.name,
              subtitle: `Qty: ${orderItemDetails.quantity}`,
              appendIcon: 'mdi-cart-plus',
              id: orderItemDetails.item_id,
              quantity: orderItemDetails.quantity,
              disabled: orderItemDetails.quantity > item.quantity
            }
          ];
          if (idx !== arr.length - 1) {
            listItem.push({ type: 'divider', inset: true });
          }

          return listItem;
        });

        this.orderItemsList.unshift({ type: 'subheader', title: 'Order' });
        return this.orderItemsList;
      } else {
        return [];
      }
    },
    addToCart(orderItemDetails) {
      const item = this.items.find((item) => item.id === orderItemDetails.id);
      if (orderItemDetails.quantity > item.quantity) {
        return;
      }

      const foundItemIdx = this.orderItemsList.findIndex((orderItm) => orderItm.id === item.id)
      this.orderItemsList[foundItemIdx].appendIcon = 'mdi-cart-check';
      this.orderItemsList[foundItemIdx].disabled = true;


      const cartId = this.order.cart_id;
      fetch(`http://localhost:3000/api/v1/carts/${cartId}/addItem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId: orderItemDetails.id, quantity: orderItemDetails.quantity
        })
      })
        .then(response => response.json())
        // console.log('orderItemQuantity: ', orderItemQuantity);
        .then(json => console.log('add to cart response: ', json))
    }
  },
  async mounted() {
    const itemsData = await fetch(`http://localhost:3000/api/v1/items`)
      .then((res) => res.json())
      .then(json => {
        console.log('items: ', json);
        return json
      })
      .then((data) => data.items.map((item: IItem) => ({ ...item, image: ITEMS_IMAGES[item.name] })))
    this.items = itemsData;

    this.activeOrderId = this.$router.currentRoute.value.params.activeOrderId;
    console.log('this.activeOrderId: ', this.activeOrderId);
    if (!this.activeOrderId) {
      return;
    }


    const activeOrder = await fetch(`http://localhost:3000/api/v1/orders/${this.activeOrderId}`)
      .then(response => response.json())
      .then(json => {
        console.log('order: ', json.order);
        return json
      })
      .then(json => json.order)
    this.order = activeOrder;

    console.log('this.order.id ', this.order.id);
    console.log('this.order.cart_id: ', this.order.cart_id);

    this.setListItems();

    subscribeToItems((change) => {
      console.log('items change', change);
      const updatedItem = change.fullDocument;
      updatedItem.image = ITEMS_IMAGES[updatedItem.name];
      const itemIndex = this.items.findIndex((item) => item.id === updatedItem._id.toString());
      this.items[itemIndex].quantity = updatedItem.quantity;
    })
  }
})
</script>

<style scoped lang="sass">

</style>
