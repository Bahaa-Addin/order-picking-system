<template>
    <v-navigation-drawer
      floating
      permanent
    >
      <v-list
        density="compact"
        nav
      >
        <router-link :to="{ name: 'FIRST_LINE' }" class="no-underline text-grey-darken-4">
          <v-list-item prepend-icon="mdi-basket" title="Orders" value="orders"></v-list-item>
        </router-link>
        <router-link :to="{ name: 'ITEMS' }" class="no-underline text-grey-darken-4">
          <v-list-item prepend-icon="mdi-store" title="Items" value="items"></v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

</script>

<style lang="sass">
.no-underline
  text-decoration: none
  & div a:link, a:visited a:hover, a:active
    text-decoration: none
</style>
