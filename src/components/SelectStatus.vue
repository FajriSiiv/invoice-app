<template>
  <div class="flex gap-x-3">
    <label
      class="flex items-center space-x-2"
      v-for="option in options"
      :key="option.value"
    >
      <input
        type="radio"
        :value="option.value"
        v-model="selectedValue"
        class="form-radio text-blue-600"
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedValue = ref(props.modelValue);

watch(selectedValue, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  }
);
</script>
