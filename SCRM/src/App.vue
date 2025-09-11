<script setup lang="ts">
</script>

<template>
  <div>
    <nav class="p-4 flex gap-4 border-b">
      <RouterLink to="/dashboard">Dashboard</RouterLink>
    </nav>
    <RouterView/>
  </div>
</template>

<style scoped>
.router-link-active {
  font-weight: 700;
  text-decoration: underline;
}
</style>
