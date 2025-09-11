<template>
    <h1>
        <div>Contacts Component</div>
    </h1>
</template>

<script setup lang="ts">
import type { Contact } from "@models/Contact"

defineProps<{
    Contacts: Contact[];
}>();

</script>
