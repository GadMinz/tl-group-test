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
const searchInput = ref({
  login: "",
  status: "",
});
const sort = computed(() => store.getters["users/selectedSort"]);
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
  if (query.sort) {
    store.dispatch("users/setSort", JSON.parse(query.sort as string));
  }
  if (query.search) {
    const search = JSON.parse(query.search as string);
    store.dispatch("users/setSearch", search);
    searchInput.value.login = search.login;
    searchInput.value.status = search.status;
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
watch([searchInput.value, intervalInput.value, sort], () => {
  router.replace({
    query: {
      search: JSON.stringify(searchInput.value),
      interval: `${intervalInput.value.start},${intervalInput.value.end}`,
      sort: JSON.stringify(sort.value),
    },
  });
});
watch(searchInput.value, () => {
  store.dispatch("users/setSearch", {
    login: searchInput.value.login.toLowerCase(),
    status: searchInput.value.status.toLowerCase(),
  });
});
watch(intervalInput.value, () => {
  store.dispatch("users/setInterval", {
    start: intervalInput.value.start,
    end: intervalInput.value.end === "" ? maxOrders : intervalInput.value.end,
  });
});

const setSort = (selectedSort: string) => {
  store.dispatch("users/setSort", {
    value: selectedSort,
    reversed: sort.value.value === selectedSort ? !sort.value.reversed : false,
  });
};
const clearSort = () => {
  searchInput.value.login = "";
  searchInput.value.status = "";
  intervalInput.value.start = 0;
  intervalInput.value.end = maxOrders;
  store.dispatch("users/setSort", {
    value: "place",
    reversed: false,
  });
};
</script>

<template>
  <main>
    <div class="tools">
      <div class="tools_search">
        <input
          type="text"
          placeholder="Введите логин"
          class="base-input"
          v-model="searchInput.login"
        />
        <input
          type="text"
          placeholder="Введите статус"
          class="base-input"
          v-model="searchInput.status"
        />
      </div>
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
      <button class="btn" @click="clearSort">Сбросить фильтры</button>
    </div>
    <Table
      :setSort="setSort"
      :titles="titles"
      :users="users"
      :selectedSort="sort"
    />
  </main>
</template>
