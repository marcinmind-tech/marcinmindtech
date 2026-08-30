/*
  Marc in Mind - Classy Simple To-Do

  Keep this architecture simple:
  Browser -> Google Apps Script -> Google Sheet

  Only update APPS_SCRIPT_URL if your deployment URL changes.
*/

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyeun-vGlLel22tdsdpmrkE9Izt1wpJVhKKUtecckdDq1KFtXpIjv3arEOo279hKkdA/exec";

const state = {
  token: sessionStorage.getItem("todo_token") || "",
  tasks: [],
  deleteId: null
};

const timeLabels = {
  5: "5 min",
  10: "10 min",
  15: "15 min",
  30: "30 min",
  45: "45 min",
  60: "1 hour",
  90: "1.5 hours",
  120: "2 hours",
  180: "3 hours",
  240: "Half day",
  480: "Full day"
};

const priorityRank = { High: 1, Medium: 2, Low: 3 };

const $ = id => document.getElementById(id);

const els = {
  loginView: $("loginView"),
  appView: $("appView"),
  loginForm: $("loginForm"),
  username: $("username"),
  password: $("password"),
  passwordToggle: $("passwordToggle"),
  loginBtn: $("loginBtn"),
  loginMessage: $("loginMessage"),

  logoutBtn: $("logoutBtn"),
  confirmLogoutBtn: $("confirmLogoutBtn"),
  addTaskBtn: $("addTaskBtn"),

  searchInput: $("searchInput"),
  priorityFilter: $("priorityFilter"),
  statusFilter: $("statusFilter"),
  clearFiltersBtn: $("clearFiltersBtn"),
  visibleCount: $("visibleCount"),

  emptyState: $("emptyState"),
  taskTableBody: $("taskTableBody"),
  mobileTasks: $("mobileTasks"),

  taskForm: $("taskForm"),
  taskId: $("taskId"),
  taskName: $("taskName"),
  taskPriority: $("taskPriority"),
  taskTime: $("taskTime"),
  taskStatus: $("taskStatus"),
  taskNotes: $("taskNotes"),
  taskMessage: $("taskMessage"),
  saveTaskBtn: $("saveTaskBtn"),
  taskModalTitle: $("taskModalTitle"),
  modalEyebrow: $("modalEyebrow"),

  confirmDeleteBtn: $("confirmDeleteBtn"),

  loadingOverlay: $("loadingOverlay"),
  loadingText: $("loadingText"),
  toastMessage: $("toastMessage")
};

const taskModal = new bootstrap.Modal($("taskModal"));
const deleteModal = new bootstrap.Modal($("deleteModal"));
const logoutModal = new bootstrap.Modal($("logoutModal"));
const appToast = new bootstrap.Toast($("appToast"), { delay: 2300 });

function configured() {
  return APPS_SCRIPT_URL.startsWith("https://script.google.com/macros/s/") &&
         APPS_SCRIPT_URL.endsWith("/exec");
}

function showMessage(el, message) {
  el.textContent = message;
  el.classList.remove("d-none");
}

function hideMessage(el) {
  el.textContent = "";
  el.classList.add("d-none");
}

function showLoading(text = "Working…") {
  els.loadingText.textContent = text;
  els.loadingOverlay.classList.remove("d-none");
}

function hideLoading() {
  els.loadingOverlay.classList.add("d-none");
}

function toast(message) {
  els.toastMessage.textContent = message;
  appToast.show();
}

async function api(action, payload = {}) {
  if (!configured()) {
    throw new Error("Apps Script URL is not configured in js/app.js.");
  }

  const body = new URLSearchParams({
    action,
    token: state.token,
    ...payload
  });

  let response;
  try {
    response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body,
      redirect: "follow"
    });
  } catch {
    throw new Error("Could not reach Google Apps Script.");
  }

  if (!response.ok) {
    throw new Error(`Apps Script returned HTTP ${response.status}.`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Apps Script returned an invalid response.");
  }

  if (!data.ok) {
    if (data.code === "AUTH_REQUIRED") {
      signOutLocal();
    }
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function setLoggedIn(value) {
  els.loginView.classList.toggle("d-none", value);
  els.appView.classList.toggle("d-none", !value);
}

function signOutLocal() {
  state.token = "";
  state.tasks = [];
  sessionStorage.removeItem("todo_token");
  setLoggedIn(false);
  els.password.value = "";
  hideMessage(els.loginMessage);
}

async function performLogout() {
  const oldToken = state.token;

  showLoading("Logging out…");

  try {
    if (oldToken && configured()) {
      const body = new URLSearchParams({ action: "logout", token: oldToken });
      await fetch(APPS_SCRIPT_URL, { method: "POST", body }).catch(() => {});
    }
  } finally {
    logoutModal.hide();
    signOutLocal();
    hideLoading();
  }
}

async function loadTasks(showOverlay = false) {
  if (showOverlay) showLoading("Loading tasks…");

  try {
    const data = await api("list");
    state.tasks = Array.isArray(data.tasks) ? data.tasks : [];
    render();
  } finally {
    if (showOverlay) hideLoading();
  }
}

function filteredTasks() {
  const search = els.searchInput.value.trim().toLowerCase();
  const priority = els.priorityFilter.value;
  const status = els.statusFilter.value;

  return state.tasks
    .filter(task => {
      const haystack = `${task.id || ""} ${task.todo || ""} ${task.notes || ""}`.toLowerCase();

      if (search && !haystack.includes(search)) return false;
      if (priority !== "all" && task.priority !== priority) return false;
      if (status !== "all" && task.status !== status) return false;

      return true;
    })
    .sort((a, b) => {
      const p = (priorityRank[a.priority] || 9) - (priorityRank[b.priority] || 9);
      if (p !== 0) return p;

      if (a.status === "Done" && b.status !== "Done") return 1;
      if (a.status !== "Done" && b.status === "Done") return -1;

      return String(a.id || "").localeCompare(String(b.id || ""), undefined, {
        numeric: true,
        sensitivity: "base"
      });
    });
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function priorityClass(priority) {
  return priority === "High" ? "meta-pill is-strong" : "meta-pill";
}

function actionButtons(task) {
  const statusAction =
    task.status === "Done"
      ? `<button class="btn btn-outline-dark" data-action="status" data-id="${esc(task.id)}" data-status="Pending">Reopen</button>`
      : task.status === "In Progress"
        ? `<button class="btn btn-dark" data-action="status" data-id="${esc(task.id)}" data-status="Done">Done</button>`
        : `<button class="btn btn-outline-dark" data-action="status" data-id="${esc(task.id)}" data-status="In Progress">Start</button>`;

  return `
    ${statusAction}
    <button class="btn btn-outline-dark" data-action="edit" data-id="${esc(task.id)}">Edit</button>
    <button class="btn btn-outline-dark" data-action="delete" data-id="${esc(task.id)}">Delete</button>
  `;
}

function render() {
  const tasks = filteredTasks();

  els.visibleCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  els.emptyState.classList.toggle("d-none", tasks.length !== 0);

  els.taskTableBody.innerHTML = tasks.map(task => `
    <tr>
      <td><span class="task-id">${esc(task.id)}</span></td>
      <td>
        <div class="task-title">${esc(task.todo)}</div>
        ${task.notes ? `<div class="task-notes">${esc(task.notes)}</div>` : ""}
      </td>
      <td><span class="${priorityClass(task.priority)}">${esc(task.priority)}</span></td>
      <td><span class="meta-pill">${esc(task.timeNeeded || timeLabels[task.minutes] || "")}</span></td>
      <td><span class="meta-pill">${esc(task.status)}</span></td>
      <td class="text-end">
        <div class="task-actions">${actionButtons(task)}</div>
      </td>
    </tr>
  `).join("");

  els.mobileTasks.innerHTML = tasks.map(task => `
    <article class="mobile-task">
      <div class="mobile-task-head">
        <div>
          <div class="mobile-task-id">${esc(task.id)}</div>
          <div class="task-title">${esc(task.todo)}</div>
          ${task.notes ? `<div class="task-notes">${esc(task.notes)}</div>` : ""}
        </div>
      </div>

      <div class="mobile-task-meta">
        <span class="${priorityClass(task.priority)}">${esc(task.priority)}</span>
        <span class="meta-pill">${esc(task.timeNeeded || timeLabels[task.minutes] || "")}</span>
        <span class="meta-pill">${esc(task.status)}</span>
      </div>

      <div class="task-actions">${actionButtons(task)}</div>
    </article>
  `).join("");
}

function openAddModal() {
  hideMessage(els.taskMessage);
  els.taskForm.reset();
  els.taskId.value = "";
  els.taskPriority.value = "Medium";
  els.taskTime.value = "30";
  els.taskStatus.value = "Pending";
  els.taskModalTitle.textContent = "Add Task";
  els.modalEyebrow.textContent = "NEW TASK";
  taskModal.show();

  setTimeout(() => els.taskName.focus(), 250);
}

function openEditModal(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task) return;

  hideMessage(els.taskMessage);
  els.taskId.value = task.id;
  els.taskName.value = task.todo || "";
  els.taskPriority.value = task.priority || "Medium";
  els.taskTime.value = String(task.minutes || 30);
  els.taskStatus.value = task.status || "Pending";
  els.taskNotes.value = task.notes || "";
  els.taskModalTitle.textContent = "Edit Task";
  els.modalEyebrow.textContent = task.id;
  taskModal.show();
}

async function saveTask(event) {
  event.preventDefault();
  hideMessage(els.taskMessage);

  const id = els.taskId.value.trim();
  const payload = {
    id,
    todo: els.taskName.value.trim(),
    priority: els.taskPriority.value,
    minutes: els.taskTime.value,
    status: els.taskStatus.value,
    notes: els.taskNotes.value.trim()
  };

  if (!payload.todo) {
    showMessage(els.taskMessage, "Enter a task.");
    return;
  }

  taskModal.hide();
  showLoading(id ? "Updating task…" : "Adding task…");

  try {
    await api(id ? "update" : "add", payload);

    // Always reload from the Sheet so the screen matches the real data.
    await loadTasks(false);

    toast(id ? "Task updated." : "New task added.");
  } catch (error) {
    taskModal.show();
    showMessage(els.taskMessage, error.message);
  } finally {
    hideLoading();
  }
}

async function changeStatus(id, status) {
  const message =
    status === "Done"
      ? "Marking as done…"
      : status === "In Progress"
        ? "Starting task…"
        : "Reopening task…";

  showLoading(message);

  try {
    await api("status", { id, status });
    await loadTasks(false);

    if (status === "Done") toast("Task completed.");
    if (status === "In Progress") toast("Task started.");
    if (status === "Pending") toast("Task reopened.");
  } catch (error) {
    alert(error.message);
  } finally {
    hideLoading();
  }
}

function askDelete(id) {
  state.deleteId = id;
  deleteModal.show();
}

async function deleteTask() {
  if (!state.deleteId) return;

  const id = state.deleteId;
  deleteModal.hide();
  showLoading("Deleting task…");

  try {
    await api("delete", { id });
    state.deleteId = null;
    await loadTasks(false);
    toast("Task deleted.");
  } catch (error) {
    alert(error.message);
  } finally {
    hideLoading();
  }
}

async function login(event) {
  event.preventDefault();
  hideMessage(els.loginMessage);

  els.loginBtn.disabled = true;
  els.loginBtn.textContent = "Signing in…";

  try {
    const data = await api("login", {
      username: els.username.value.trim(),
      password: els.password.value
    });

    state.token = data.token;
    sessionStorage.setItem("todo_token", state.token);
    setLoggedIn(true);

    showLoading("Loading tasks…");
    await loadTasks(false);
    hideLoading();
  } catch (error) {
    showMessage(els.loginMessage, error.message);
    hideLoading();
  } finally {
    els.loginBtn.disabled = false;
    els.loginBtn.textContent = "Sign in";
  }
}

function clearFilters() {
  els.searchInput.value = "";
  els.priorityFilter.value = "all";
  els.statusFilter.value = "all";
  render();
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const { action, id, status } = button.dataset;

  if (action === "edit") openEditModal(id);
  if (action === "delete") askDelete(id);
  if (action === "status") changeStatus(id, status);
});

els.loginForm.addEventListener("submit", login);
els.taskForm.addEventListener("submit", saveTask);

els.passwordToggle.addEventListener("click", () => {
  const show = els.password.type === "password";
  els.password.type = show ? "text" : "password";
  els.passwordToggle.textContent = show ? "Hide" : "Show";
});

els.logoutBtn.addEventListener("click", () => logoutModal.show());
els.confirmLogoutBtn.addEventListener("click", performLogout);
els.addTaskBtn.addEventListener("click", openAddModal);
els.confirmDeleteBtn.addEventListener("click", deleteTask);
els.clearFiltersBtn.addEventListener("click", clearFilters);

els.searchInput.addEventListener("input", render);
els.priorityFilter.addEventListener("change", render);
els.statusFilter.addEventListener("change", render);

(async function init() {
  if (!configured()) {
    setLoggedIn(false);
    showMessage(
      els.loginMessage,
      "Setup needed: paste your Google Apps Script /exec URL into js/app.js."
    );
    return;
  }

  if (!state.token) {
    setLoggedIn(false);
    return;
  }

  try {
    const data = await api("session");

    if (data.ok) {
      setLoggedIn(true);
      showLoading("Loading tasks…");
      await loadTasks(false);
      hideLoading();
    }
  } catch {
    hideLoading();
    signOutLocal();
  }
})();
