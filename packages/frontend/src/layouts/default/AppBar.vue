<template>
  <v-app-bar
    image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
  >
    <template v-slot:image>
      <v-img
        gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
      ></v-img>
    </template>
    <template v-slot:prepend>
    </template>

    <v-app-bar-title>Picking System</v-app-bar-title>

    <v-spacer></v-spacer>

    CART
    <v-btn icon>
      <v-icon>mdi-cart</v-icon>
    </v-btn>
    <v-menu>
      <template v-slot:activator="{ props }" class="mx-10">
        {{ pickerLevel }}
        <v-btn icon="mdi-run" v-bind="props"></v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="picker in pickers"
          :key="picker.id"
        >
          <v-list-item-title class="no-underline">
            <router-link :to="{ name: picker.level, params: { pickerId: picker.id } }">
             <p>{{ picker.level.split('_').join(' ') }}</p>
            </router-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
  // fetch all pickers from the backend
  import { computed, ref } from 'vue'
  import { IPicker } from '../../../../../types';
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const pickers: IPicker[] = ref([])

  fetch('http://localhost:3000/api/v1/pickers')
    .then(response => response.json())
    .then(json => (pickers.value = json.pickers))


  const pickerLevel = computed(() => {
    return route.name;
  })

</script>

<style lang="sass">
.no-underline
  & p, a:link, a:visited
    text-decoration: none
</style>
