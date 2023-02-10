<script setup lang="ts">
import Table from "@/components/Table/Table.vue";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { store } from "@/store";
import type { IUser } from "@/types";

const titles = [
  { value: "place", name: "Место" },
  { value: "login", name: "Логин" },
  { value: "orders", name: "Подтвержденные заказы" },
  { value: "status", name: "Статус" },
];
const users = computed(() => store.getters["users/sortedUsers"]);

const router = useRouter();
const route = useRoute();
const searchInput = ref("");
const maxOrders = users.value.reduce(
  (max: number, user: IUser) => (max < user.orders ? user.orders : max),
  0
);
const intervalInput = ref({
  start: 0,
  end: maxOrders,
});
onMounted(() => {
  const query = route.query;
  if (query.sortQuery) {
    store.dispatch("users/setSort", {
      value: query.sortQuery,
      reversed: query.reversed === "true",
    });
  }
  if (query.search || query.search === "") {
    store.dispatch("users/setSearch", query.search);
    searchInput.value = query.search as string;
  }
  if (query.interval) {
    const [start, end] = (query.interval as string).split(",");
    intervalInput.value.start = Number(start);
    intervalInput.value.end = Number(end);
    store.dispatch("users/setInterval", {
      start: Number(start),
      end: Number(end),
    });
  }
});
watch(searchInput, () => {
  router.replace({
    query: { ...route.query, search: searchInput.value },
  });
});
watch(intervalInput.value, () => {
  router.replace({
    query: {
      ...route.query,
      interval: `${intervalInput.value.start},${
        intervalInput.value.end === "" ? maxOrders : intervalInput.value.end
      }`,
    },
  });
});
watch(route, () => {
  const query = route.query;
  if (query.sortQuery) {
    store.dispatch("users/setSort", {
      value: query.sortQuery,
      reversed: query.reversed === "true",
    });
  }
  if (query.search || query.search === "") {
    store.dispatch("users/setSearch", query.search);
  }
  if (query.interval) {
    const [start, end] = (query.interval as string).split(",");
    const interval = { start: Number(start), end: Number(end) };
    store.dispatch("users/setInterval", interval);
  }
});
const sort = computed(() => store.getters["users/selectedSort"]);
const setSortQuery = (sortQuery: string) => {
  let reversed = false;
  if (sort.value.value === sortQuery) {
    reversed = !sort.value.reversed;
  }
  router.replace({
    query: { ...route.query, sortQuery, reversed: reversed + "" },
  });
};
</script>

<template>
  <main>
    <div class="tools">
      <input
        type="text"
        placeholder="Введите логин или статус"
        class="base-input"
        v-model="searchInput"
      />
      <div class="tools_interval">
        <p>Подтвержденные заказы</p>
        <div>
          от
          <input
            class="base-input"
            v-model="intervalInput.start"
            type="number"
            min="0"
            max="2147483647"
            step="1"
          />
          до
          <input
            class="base-input"
            v-model="intervalInput.end"
            type="number"
            min="0"
            max="2147483647"
            step="1"
          />
        </div>
      </div>
    </div>
    <Table
      :setSortQuery="setSortQuery"
      :titles="titles"
      :users="users"
      :selectedSort="sort"
    />
  </main>
</template>
