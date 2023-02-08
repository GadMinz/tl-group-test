<script setup lang="ts">
import Table from "@/components/Table/Table.vue";
import { computed } from "vue";
import { store } from "@/store";

const titles = [
  { value: "place", name: "Место" },
  { value: "login", name: "Логин" },
  { value: "orders", name: "Подтвержденные заказы" },
  { value: "status", name: "Статус" },
];
const users = computed(() => store.getters["users/sortedUsers"]);

const sort = computed(() => store.getters["users/selectedSort"]);
</script>

<template>
  <main>
    <Table :titles="titles" :users="users" :selectedSort="sort" />
  </main>
</template>
