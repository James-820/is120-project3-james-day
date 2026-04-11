// Database connection:
const db = supabase.createClient(
  "https://vqlhtyvynqihglblncqi.supabase.co",
  "sb_publishable_1ea-DNH4krkYWXU5K45PVg_V6jZGV9L",
);

// Function declarations:
// ================================================================================

// Render function:
// ========================================
function renderAll(t_data) {
  for (const object of t_data) {
    // Make a new div to display information:
    // Append to container:
  }
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

// On load:
// ================================================================================

readAll();
