// Database connection:
const db = supabase.createClient(
  "https://vqlhtyvynqihglblncqi.supabase.co",
  "sb_publishable_1ea-DNH4krkYWXU5K45PVg_V6jZGV9L",
);

let card_container = document.querySelector("#card-container");
let in_name = document.querySelector("#in-name");
let in_weight = document.querySelector("#in-weight");
let in_reps = document.querySelector("#in-reps");
let add_btn = document.querySelector("#add-btn");
add_btn.addEventListener("click", saveInput);
let current_edit_id = null;

// Function declarations:
// ================================================================================

// Render function:
// ========================================
function renderAll(t_data) {
  // Clear the card container:
  card_container.innerHTML = "";
  for (const object of t_data) {
    // Make a new card to display information:
    let card = document.createElement("div");
    card.classList = "card";
    card.id = object.id;
    // Make all the information elements and append to the card:
    // Delete button:
    let btn = document.createElement("button");
    btn.classList = "delete-btn";
    btn.textContent = "Delete";
    btn.addEventListener("click", () => deleteRow(object.id));
    card.appendChild(btn);
    // Edit button:
    let btn2 = document.createElement("button");
    btn2.classList = "edit-btn";
    btn2.textContent = "Edit";
    btn2.addEventListener("click", () => startEdit(object));
    card.appendChild(btn2);
    // Name:
    let name = document.createElement("h3");
    name.classList = "card-name";
    name.textContent = object.name;
    card.appendChild(name);
    // Weight:
    let weight = document.createElement("p");
    weight.classList = "card-weight";
    weight.textContent = "Weight: " + object.weight;
    card.appendChild(weight);
    // Reps:
    let reps = document.createElement("ul");
    reps.classList = "card-reps";
    for (let i = 0; i < object.reps.reps.length; i++) {
      let li = document.createElement("li");
      li.textContent = "Set " + (i + 1) + ": " + object.reps.reps[i];
      reps.appendChild(li);
    }
    card.appendChild(reps);
    // Append to container:
    card_container.appendChild(card);
  }
  // Clear input values:
  in_name.value = "";
  in_weight.value = 0;
  in_reps.value = "";
}

// Read function:
// ========================================
async function readAll() {
  // Read in all rows:
  let { data, error } = await db.from("Lift-Tracker").select("*");
  //   let response = await db.from("Lift-Tracker").select("*");
  //   let error = response.error;
  //   let data = response.data;
  // Error catch:
  if (error) {
    console.log(error);
    return;
  }
  // Log the data:
  console.log(data);
  // Render to webpage:
  renderAll(data);
}

// Create function:
// ========================================
async function createRow(object) {
  const { data, error } = await db
    .from("Lift-Tracker")
    .insert([{ name: object.name, weight: object.weight, reps: object.reps }])
    .select();
  // Catch error:
  if (error) {
    console.log(error);
    return;
  }
  // Log added data:
  console.log("Added:");
  console.log(data);
  // Re-read and update webpage:
  readAll();
}

// Delete function:
// ========================================
async function deleteRow(id) {
  const { data, error } = await db
    .from("Lift-Tracker")
    .delete()
    .eq("id", id)
    .select();
  // Catch error:
  if (error) {
    console.log(error);
    return;
  }
  // Log deleted data:
  console.log("Deleted:");
  console.log(data);
  // Re-read and update webpage:
  readAll();
}

// Update function:
// ========================================
async function updateRow(id, object) {
  const { data, error } = await db
    .from("Lift-Tracker")
    .update({ weight: object.weight, reps: object.reps })
    .eq("id", id)
    .select();
  // Catch error:
  if (error) {
    console.log(error);
    return;
  }
  // Log updated data:
  console.log("Updated:");
  console.log(data);
  // Re-read and update webpage:
  readAll();
}

// Create helper function/event listener:
// ========================================
function makeLiftObject() {
  // As dangerous as it is, I will assume correct user input
  let name = in_name.value;
  let weight = in_weight.value;
  let reps = { reps: in_reps.value.split(", ") };
  let object = { name: name, weight: weight, reps: reps };
  return object;
}

// Update/Create helper function:
// ========================================
function saveInput() {
  let obj = makeLiftObject();
  if (current_edit_id === null) {
    createRow(obj);
  } else {
    updateRow(current_edit_id, obj);
    current_edit_id = null;
    add_btn.textContent = "Add";
  }
}

// Edit helper:
// ========================================
function startEdit(entry) {
  in_name.value = entry.name;
  in_name.focus();
  in_weight.value = entry.weight;
  let rep_list = "";
  for (const num in entry.reps.reps) {
    rep_list += num + ", ";
  }
  in_reps.value = rep_list;
  current_edit_id = entry.id;
  add_btn.textContent = "Save Edit";
}

// On load:
// ================================================================================

readAll();
