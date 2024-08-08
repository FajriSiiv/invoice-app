<template>
  <input
    class="p-1.5 pl-3 focus:outline-none rounded-md text-white bg-primary max-w-[400px]"
    :placeholder="placeholder"
    :type="type"
    :value="value"
    required
  />
</template>

<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  value: {
    type: String,
  },
});
</script>
