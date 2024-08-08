<template>
  <div class="flex flex-col space-y-2">
    <input
      :id="id"
      type="date"
      v-model="selectedDate"
      class="rounded-md p-1.5 bg-primary"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },

  id: {
    type: String,
    default: "date-input",
  },
});

const emit = defineEmits(["update:modelValue"]);
const selectedDate = ref(props.modelValue);

watch(selectedDate, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>
