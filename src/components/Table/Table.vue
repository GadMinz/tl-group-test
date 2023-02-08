<script setup lang="ts">
import TableLine from "@/components/Table/TableLine.vue";
import type { IUser, TSort } from "@/types";

defineProps<{
  titles: { value: string; name: string }[];
  users: IUser[];
  selectedSort: TSort;
}>();
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th
          @click="setSortQuery(title.value)"
          v-for="title in titles"
          :key="title.value"
        >
          <span
            :class="[
              {
                active: title.value === selectedSort.value,
                reversed: selectedSort.reversed,
              },
            ]"
            >{{ title.name }}</span
          >
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="users.length === 0">
        <td colspan="88">Ничего не найдено</td>
      </tr>
      <tr v-else v-for="user in users" :key="user.place">
        <TableLine :user="user" />
      </tr>
    </tbody>
  </table>
</template>
