<script setup>
import { supabase } from "@/lib/supabaseClient";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Section from "../Section.vue";
import SelectStatus from "../SelectStatus.vue";
import Input from "../Input.vue";
import DateInput from "../DateInput.vue";
import { toast } from "vue3-toastify";

const route = useRoute();

const state = reactive({
  jobs: "",
  total_amount: 0,
  status: "",
  due_date: new Date(),
});

const options = [
  { value: "Unpaid", label: "Unpaid" },
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
];

const invoiceId = route.params.id;
const isLoading = ref(false);

const invoice = ref();

const getInvoiceByID = async () => {
  isLoading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { data: Invoice, error } = await supabase
      .from("Invoice")
      .select()
      .eq("invoice_number", invoiceId)
      .single();
    invoice.value = Invoice;
    state.jobs = invoice.value.jobs;
    state.total_amount = invoice.value.total_amount;
    state.status = invoice.value.status;
    state.due_date = invoice.value.due_date;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const updateInvoice = async (e) => {
  console.log(state.jobs);
  e.preventDefault();
  isLoading.value = true;
  try {
    toast.info("Update succcess invoice" + " " + `#${invoiceId}`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await supabase
      .from("Invoice")
      .update({
        jobs: state.jobs,
        status: state.status,
        total_amount: state.total_amount,
        due_date: state.due_date,
      })
      .eq("invoice_number", invoiceId)
      .select();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
    window.location.href = "/";
  }
};

onMounted(() => {
  getInvoiceByID();
});
</script>

<template>
  <Section>
    <div class="h-full w-full bg-primary text-white rounded-lg overflow-hidden">
      <h2 class="mt-10 text-3xl font-bold text-center">
        Edit Invoice # {{ state.invoice_number }}
      </h2>
      <div class="w-full flex flex-col justify-center items-center">
        <div
          class="flex flex-col items-center justify-center gap-y-2 max-w-[1000px] w-full mx-auto mt-5"
          v-if="isLoading"
        >
          <div class="w-fit h-fit animate-spin">
            <v-icon name="fa-virus" scale="2" />
          </div>
        </div>
        <form v-else class="flex flex-col gap-5 mt-10" @submit="updateInvoice">
          <div class="flex flex-col gap-[2px]">
            <span class="text-lg">Jobs</span>
            <Input
              class="border w-[500px]"
              placeholder="Jobs"
              :value="state.jobs"
              :onchange="(e) => (state.jobs = e.target.value)"
            />
          </div>
          <div class="flex flex-col gap-[2px]">
            <span class="text-lg">Status</span>
            <SelectStatus v-model="state.status" :options="options" />
          </div>
          <div class="flex flex-col gap-[2px]">
            <span class="text-lg">Due Date</span>
            <DateInput
              class="border"
              v-model="state.due_date"
              label="Pick a Date"
              id="custom-date-input"
            />
          </div>
          <div class="flex flex-col gap-[2px]">
            <span class="text-lg">Total Amount</span>
            <Input
              class="border w-[500px]"
              placeholder="Total Amount, Ex : 1000"
              type="number"
              :value="state.total_amount"
              :onchange="(e) => (state.total_amount = e.target.value)"
            />
          </div>
          <div class="w-full flex items-end justify-end gap-x-3 mt-4">
            <a
              href="/"
              :class="[
                'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600',
                isLoading ? '!bg-blue-900' : '',
              ]"
              type="submit"
              :disabled="isLoading"
            >
              Back
            </a>
            <button
              :class="[
                'bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600',
                isLoading ? '!bg-emerald-900' : '',
              ]"
              type="submit"
              :disabled="isLoading"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </Section>
</template>
