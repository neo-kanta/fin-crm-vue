<template>
    <h1>
        <div>Companies Component</div>
    </h1>
</template>

<script setup lang="ts">
import type { Company } from "@models/Company"

defineProps<{
    Companies: Company[];
}>();

</script>
