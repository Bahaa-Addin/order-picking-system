<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      CART
      <v-btn icon v-bind="props">
        <v-badge :content="cartItems.length" color="error">
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-layout row>
      <v-card
        variant="outlined"
      >
        <v-list
          v-if="cartItemsList && cartItemsList.length"
          :items="cartItemsList"
          item-props
          lines="three"
          min-width="200"
        > </v-list>
      </v-card>
    </v-layout>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { subscribeToCart } from '@/services/cart';
import { API_BASE_URL } from '../constants';

const ITEMS_IMAGES = {
  Bread: 'https://www.goldmedalbakery.com/content/uploads/2019/12/Sandwich-White.jpg',
  Eggs: 'https://www.eggcartons.com/cdn/shop/products/FHP-56T-1-YELLOW-TOPWEGGS_2048x2048.jpg?v=1661178954',
  Milk: 'https://res.cloudinary.com/farm-boy/image/upload/c_fill,g_center,h_600,w_600,f_auto/Products/23558_Reg.png',
}
export default defineComponent({
  name: "Cart",
  props: {
    activeOrderId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      cart: {},
      cartItems: []
    }
  },
  mounted() {
    console.log('cart mounted');
    console.log('cart activeOrderId: ', this.activeOrderId);
    if(!this.activeOrderId) {
      return;
    } else {
       fetch(`${API_BASE_URL}/carts/order/${this.activeOrderId}`)
        .then(response => response.json())
        // log and return the cart items
        .then(json => {this.cart = json.cart; this.cartItems = json.cart.itemsDetails; })
    }

    subscribeToCart((change) => {
      console.log('cart change: ', change);
      this.cartItems = change.fullDocument.itemsDetails
    })
  },
  computed: {
    cartItemsList() {
      return this.cartItems.map((item: any) => ({
        key: item.id,
        prependAvatar: ITEMS_IMAGES[item.name],
        title: item.name,
        subtitle: `Qty: ${item.quantity}`,
        id: item.id,
        quantity: item.quantity,
      }))
    }
  }
})
</script>

<style scoped lang="sass">

</style>
