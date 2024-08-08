<script setup>
import DateInput from "@/components/DateInput.vue";
import Input from "@/components/Input.vue";
import Modal from "@/components/Modal.vue";
import Section from "@/components/Section.vue";
import SelectStatus from "@/components/SelectStatus.vue";
import { supabase } from "@/lib/supabaseClient";
import { generateShortID } from "@/utils/shortId";
import { onMounted, reactive, ref } from "vue";
import { toast } from "vue3-toastify";

const state = reactive({
  jobs: "",
  total_amount: 0,
  status: "",
  due_date: new Date(),
  invoice_number: 0,
});

const isLoading = ref(false);
const invoices = ref([]);
const showModal = ref(false);
const showModalUpdate = ref(false);

const getInvoice = async () => {
  isLoading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { data: Invoice, error } = await supabase
      .from("Invoice")
      .select()
      .limit(10);
    invoices.value = Invoice;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const addInvoice = async (e) => {
  e.preventDefault();

  if (invoices.value.length >= 10) {
    toast.error("Cannot add more invoices. Limit of 10 reached!");

    showModal.value = false;
    isLoading.value = false;
    getInvoice();

    return;
  }

  isLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    await supabase
      .from("Invoice")
      .insert([
        {
          jobs: state.jobs,
          invoice_number: generateShortID(),
          total_amount: state.total_amount,
          due_date: state.due_date,
          status: state.status,
        },
      ])
      .select();

    toast.success("You create an invoice!");
    state.jobs = "";
    state.total_amount = 0;
    state.status = "";
    state.due_date = new Date();
    state.invoice_number = 0;
  } catch (error) {
    console.log(error);
  } finally {
    showModal.value = false;
    isLoading.value = false;
    getInvoice();
  }
};

const deleteInvoice = async (id, invoice_number) => {
  isLoading.value = true;

  try {
    await supabase.from("Invoice").delete().eq("invoice_id", id);
    toast.info("Deleted an invoice" + " " + `#${invoice_number}`);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
    getInvoice();
  }
};

const options = [
  { value: "Unpaid", label: "Unpaid" },
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
];

onMounted(() => {
  getInvoice();
});
</script>

<template>
  <Section>
    <div class="h-full w-full bg-primary text-white rounded-lg overflow-hidden">
      <div class="h-[50px] flex items-center justify-evenly pt-5 bg-primary">
        <span class="text-3xl font-bold">Invoice</span>
      </div>
      <div
        class="flex flex-col items-center justify-center gap-y-2 max-w-[1000px] w-full mx-auto mt-5"
        v-if="isLoading"
      >
        <div class="w-fit h-fit animate-spin">
          <v-icon name="fa-virus" scale="2" />
        </div>
      </div>
      <ul
        v-else
        class="flex flex-col gap-y-2 max-w-[1000px] w-full mx-auto mt-5"
      >
        <li class="grid grid-cols-6 p-2 rounded-md bg-[#4a4e69]">
          <span>Invoice Number</span>
          <span>Due Date</span>
          <span>Status</span>
          <span>Jobs</span>
          <span class="text-center">Total Amount</span>
          <span class="text-right">Action</span>
        </li>
        <li
          v-for="item in invoices"
          :key="item.invoice_number"
          :class="[
            'grid grid-cols-6 p-2 rounded-md bg-[#4a4e69]',
            item.status === 'Paid' ? 'bg-emerald-500/90' : 'bg-[#4a4e69]',
            item.status === 'Unpaid' ? 'bg-rose-500/70' : 'bg-[#4a4e69]',
          ]"
        >
          <span>#{{ item.invoice_number }}</span>
          <span>{{ item.due_date }}</span>
          <span>{{ item.status }}</span>
          <span>{{ item.jobs }}</span>
          <span class="text-center">{{ item.total_amount }}</span>
          <span class="flex gap-2 justify-end items-end w-full">
            <button
              @click="() => deleteInvoice(item.invoice_id, item.invoice_number)"
              class="text-right border px-2 rounded"
            >
              Delete
            </button>
            <button
              @click="showModalUpdate = true"
              class="text-right border px-2 rounded"
            >
              Edit
            </button>
          </span>
        </li>
      </ul>
    </div>
  </Section>
  <button
    class="bg-[#4a4e69] text-white p-3.5 rounded-full hover:bg-emerald-600 absolute right-10 bottom-10"
    @click="showModal = true"
    :disabled="isLoading"
  >
    <v-icon name="hi-solid-document-add" scale="1.4" />
  </button>
  <Modal :show="showModal" @close="showModal = false">
    <h2 class="text-3xl font-semibold mb-2 text-center">Create new invoice</h2>
    <div
      class="flex flex-col items-center justify-center gap-y-2 max-w-[1000px] w-full mx-auto mt-5"
      v-if="isLoading"
    >
      <div class="w-fit h-fit animate-spin">
        <v-icon name="fa-virus" scale="2" />
      </div>
    </div>
    <form v-else class="flex flex-col gap-5" :onsubmit="addInvoice">
      <div class="flex flex-col gap-[2px]">
        <span class="text-lg">Jobs</span>
        <Input
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
          v-model="state.due_date"
          label="Pick a Date"
          id="custom-date-input"
        />
      </div>
      <div class="flex flex-col gap-[2px]">
        <span class="text-lg">Total Amount</span>
        <Input
          placeholder="Total Amount, Ex : 1000"
          type="number"
          :value="state.total_amount"
          :onchange="(e) => (state.total_amount = e.target.value)"
        />
      </div>
      <div class="w-full flex items-end justify-end gap-x-3 mt-4">
        <button
          :class="[
            'bg-rose-500 text-white px-4 py-2 rounded hover:bg-red-600',
            isLoading ? '!bg-rose-900' : '',
          ]"
          @click="showModal = false"
          :disabled="isLoading"
        >
          Close
        </button>
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
  </Modal>
  <Modal :show="showModalUpdate" @close="showModalUpdate = false">
    <h2 class="text-3xl font-semibold mb-2 text-center">Edit invoice</h2>
    <!-- <div
      class="flex flex-col items-center justify-center gap-y-2 max-w-[1000px] w-full mx-auto mt-5"
      v-if="isLoading"
    >
      <div class="w-fit h-fit animate-spin">
        <v-icon name="fa-virus" scale="2" />
      </div>
    </div>
    <form v-else class="flex flex-col gap-5" :onsubmit="addInvoice">
      <div class="flex flex-col gap-[2px]">
        <span class="text-lg">Jobs</span>
        <Input
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
          v-model="state.due_date"
          label="Pick a Date"
          id="custom-date-input"
        />
      </div>
      <div class="flex flex-col gap-[2px]">
        <span class="text-lg">Total Amount</span>
        <Input
          placeholder="Total Amount, Ex : 1000"
          type="number"
          :value="state.total_amount"
          :onchange="(e) => (state.total_amount = e.target.value)"
        />
      </div>
      <div class="w-full flex items-end justify-end gap-x-3 mt-4">
        <button
          :class="[
            'bg-rose-500 text-white px-4 py-2 rounded hover:bg-red-600',
            isLoading ? '!bg-rose-900' : '',
          ]"
          @click="showModal = false"
          :disabled="isLoading"
        >
          Close
        </button>
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
    </form> -->
  </Modal>
</template>
