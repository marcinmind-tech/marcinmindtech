/*
  Marc in Mind - Simple To-Do Google Apps Script
  ------------------------------------------------
  Google Sheet:
  https://docs.google.com/spreadsheets/d/19aaUwTSeQFh3yFg6WGP_SnHFskbUPEh3uocEVLsPkWM/

  SETUP
  1. Open the Google Sheet.
  2. Extensions > Apps Script.
  3. Paste this whole file into Code.gs.
  4. Run setupTodoApp() ONCE and approve permissions.
  5. Deploy > New deployment > Web app.
  6. Execute as: Me
  7. Who has access: Anyone
  8. Copy the /exec URL into js/app.js.

  IMPORTANT
  - The credentials below are stored in Script Properties after setupTodoApp().
  - After running setupTodoApp(), you may remove the password text from this function
    if you do not want it visible in your Apps Script source editor.
*/

const SPREADSHEET_ID = "19aaUwTSeQFh3yFg6WGP_SnHFskbUPEh3uocEVLsPkWM";

const HEADERS = [
  "ID",
  "To Do",
  "Priority",
  "Time Needed",
  "Minutes",
  "Status",
  "Notes",
  "Created",
  "Updated"
];

const TIME_LABELS = {
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

function setupTodoApp() {
  const props = PropertiesService.getScriptProperties();

  // Your login details are stored in Script Properties, not in website JS.
  props.setProperties({
    TODO_USERNAME: "Vignesh",
    TODO_PASSWORD: "Glide@1998"
  });

  ensureSheet_();
  Logger.log("Setup complete. Now deploy this script as a Web App.");
}

function doGet() {
  return json_({
    ok: true,
    message: "Marc in Mind To-Do Apps Script is running."
  });
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    const action = String(p.action || "").trim();

    if (!action) {
      return json_({ ok: false, message: "Missing action." });
    }

    if (action === "login") return login_(p);
    if (action === "session") return session_(p);
    if (action === "logout") return logout_(p);

    const auth = requireSession_(p.token);
    if (!auth.ok) return json_(auth);

    if (action === "list") return listTasks_();
    if (action === "add") return addTask_(p);
    if (action === "update") return updateTask_(p);
    if (action === "delete") return deleteTask_(p);
    if (action === "status") return updateStatus_(p);

    return json_({ ok: false, message: "Unknown action." });

  } catch (error) {
    return json_({
      ok: false,
      message: error && error.message ? error.message : "Unexpected Apps Script error."
    });
  }
}

function login_(p) {
  const props = PropertiesService.getScriptProperties();
  const expectedUser = props.getProperty("TODO_USERNAME");
  const expectedPass = props.getProperty("TODO_PASSWORD");

  if (!expectedUser || !expectedPass) {
    return json_({
      ok: false,
      message: "Login is not configured. Run setupTodoApp() once in Apps Script."
    });
  }

  const username = String(p.username || "");
  const password = String(p.password || "");

  if (username !== expectedUser || password !== expectedPass) {
    return json_({
      ok: false,
      message: "Incorrect username or password."
    });
  }

  const token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  CacheService.getScriptCache().put("session_" + token, username, 21600); // 6 hours

  return json_({
    ok: true,
    token: token
  });
}

function session_(p) {
  const auth = requireSession_(p.token);
  return json_(auth.ok ? { ok: true } : auth);
}

function logout_(p) {
  const token = String(p.token || "");
  if (token) {
    CacheService.getScriptCache().remove("session_" + token);
  }
  return json_({ ok: true });
}

function requireSession_(token) {
  token = String(token || "");
  if (!token) {
    return {
      ok: false,
      code: "AUTH_REQUIRED",
      message: "Please sign in again."
    };
  }

  const user = CacheService.getScriptCache().get("session_" + token);

  if (!user) {
    return {
      ok: false,
      code: "AUTH_REQUIRED",
      message: "Your session expired. Please sign in again."
    };
  }

  // Refresh the session while the app is being actively used.
  CacheService.getScriptCache().put("session_" + token, user, 21600);

  return { ok: true, user: user };
}

function listTasks_() {
  const sheet = ensureSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return json_({ ok: true, tasks: [] });
  }

  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();

  const tasks = values
    .filter(row => String(row[0] || "").trim())
    .map(row => ({
      id: String(row[0] || ""),
      todo: String(row[1] || ""),
      priority: String(row[2] || "Medium"),
      timeNeeded: String(row[3] || ""),
      minutes: Number(row[4] || 0),
      status: String(row[5] || "Pending"),
      notes: String(row[6] || ""),
      created: dateValue_(row[7]),
      updated: dateValue_(row[8])
    }));

  return json_({ ok: true, tasks: tasks });
}

function addTask_(p) {
  const sheet = ensureSheet_();

  const todo = cleanText_(p.todo, 250);
  if (!todo) return json_({ ok: false, message: "Task is required." });

  const priority = validPriority_(p.priority);
  const minutes = validMinutes_(p.minutes);
  const status = validStatus_(p.status);
  const notes = cleanText_(p.notes, 1000);

  const now = new Date();
  const id = Utilities.getUuid();

  sheet.appendRow([
    id,
    todo,
    priority,
    TIME_LABELS[minutes],
    minutes,
    status,
    notes,
    now,
    now
  ]);

  return json_({ ok: true, id: id });
}

function updateTask_(p) {
  const sheet = ensureSheet_();
  const row = findRowById_(sheet, p.id);

  if (!row) return json_({ ok: false, message: "Task not found." });

  const todo = cleanText_(p.todo, 250);
  if (!todo) return json_({ ok: false, message: "Task is required." });

  const priority = validPriority_(p.priority);
  const minutes = validMinutes_(p.minutes);
  const status = validStatus_(p.status);
  const notes = cleanText_(p.notes, 1000);

  const created = sheet.getRange(row, 8).getValue() || new Date();

  sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
    String(p.id),
    todo,
    priority,
    TIME_LABELS[minutes],
    minutes,
    status,
    notes,
    created,
    new Date()
  ]]);

  return json_({ ok: true });
}

function deleteTask_(p) {
  const sheet = ensureSheet_();
  const row = findRowById_(sheet, p.id);

  if (!row) return json_({ ok: false, message: "Task not found." });

  sheet.deleteRow(row);
  return json_({ ok: true });
}

function updateStatus_(p) {
  const sheet = ensureSheet_();
  const row = findRowById_(sheet, p.id);

  if (!row) return json_({ ok: false, message: "Task not found." });

  const status = validStatus_(p.status);
  sheet.getRange(row, 6).setValue(status);
  sheet.getRange(row, 9).setValue(new Date());

  return json_({ ok: true });
}

function ensureSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow === 0 || (lastRow === 1 && lastCol === 1 && String(sheet.getRange("A1").getValue()).trim() === "")) {
    sheet.clear();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

    sheet.getRange(1, 1, 1, HEADERS.length)
      .setBackground("#111111")
      .setFontColor("#ffffff")
      .setFontWeight("bold");

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);

    sheet.setColumnWidth(2, 360);
    sheet.setColumnWidth(7, 360);
    return sheet;
  }

  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];

  const matches = HEADERS.every((header, index) =>
    String(existing[index] || "").trim() === header
  );

  if (!matches) {
    throw new Error(
      "Google Sheet row 1 already contains different data. " +
      "Use an empty first sheet or change the headers to: " + HEADERS.join(" | ")
    );
  }

  return sheet;
}

function findRowById_(sheet, id) {
  id = String(id || "").trim();
  if (!id) return 0;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();

  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) {
      return i + 2;
    }
  }

  return 0;
}

function validPriority_(value) {
  value = String(value || "");
  return ["High", "Medium", "Low"].includes(value) ? value : "Medium";
}

function validStatus_(value) {
  value = String(value || "");
  return ["Pending", "In Progress", "Done"].includes(value) ? value : "Pending";
}

function validMinutes_(value) {
  const number = Number(value);
  const allowed = [5, 10, 15, 30, 45, 60, 90, 120, 180, 240, 480];
  return allowed.includes(number) ? number : 30;
}

function cleanText_(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function dateValue_(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone() || "Asia/Kolkata",
      "yyyy-MM-dd'T'HH:mm:ss"
    );
  }
  return String(value);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
