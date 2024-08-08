import { ref, onMounted } from "vue";

const countries = ref([]);

const todoTitle = ref("");
const todoTitleUpdate = ref("");

async function getCountries() {
  const { data } = await supabase.from("todos").select();
  countries.value = data;
}

async function newTodos() {
  const { data } = await supabase
    .from("todos")
    .insert([{ title: todoTitle.value }])
    .select();

  await getCountries();

  todoTitle.value = "";
}

const inputTitle = (e) => {
  todoTitle.value = e.target.value;
};

const inputTitleUpdate = (e) => {
  todoTitleUpdate.value = e.target.value;
};
const formTodo = (e) => {
  e.preventDefault();

  newTodos();
};

const deleteData = async (eValue) => {
  const { error } = await supabase.from("todos").delete().eq("id", eValue);
  await getCountries();
};

const updateTodo = async (eId, eValue) => {
  const { data, error } = await supabase
    .from("todos")
    .update({ title: eValue })
    .eq("id", eId)
    .select();

  await getCountries();
};

onMounted(() => {
  getCountries();
});
