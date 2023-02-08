<script setup lang="ts">
import type { IUser } from "@/types";

defineProps<{ user: IUser }>();
</script>

<template>
  <td v-for="el in user">{{ el }}</td>
</template>
