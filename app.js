/**
 * Money Manager Pro v3.5 - Advanced Core Control System Engine
 * Dynamic isolated routing configuration logic.
 */

// 1. Firebase Initializer Deployment Credentials
const firebaseConfig = {
apiKey: "AIzaSyDIiBdSKMigymz8P4PooMSguP7LoLKvllg",
  authDomain: "hotel-c4382.firebaseapp.com",
  databaseURL: "https://hotel-c4382-default-rtdb.firebaseio.com",
  projectId: "hotel-c4382",
  storageBucket: "hotel-c4382.firebasestorage.app",
  messagingSenderId: "879811080075",
  appId: "1:879811080075:web:656ac50faffced4aee898e",
  measurementId: "G-EGS10RS2V4"
};

// Verify application instance status before assigning resources
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const rtdb = firebase.database();
const storage = typeof firebase.storage !== 'undefined' ? firebase.storage() : null;

// Namespace isolating identifier to prevent collision with other applications
const SYSTEM_NAMESPACE = "money_manager_v35";

// Runtime application memory engine states
let state = {
  uid: null,
  profile: {},
  transactions: {},
  salaryHistory: {},
  dailyNotes: {},
  reminders: {},
  budgets: {},
  uploadedBills: {},
  recurringRules: {},
  calendarSelectedDate: new Date().toISOString().split('T')[0],
  calendarActiveMonth: new Date().getMonth(),
  calendarActiveYear: new Date().getFullYear(),
  charts: { trend: null, categories: null },
  activeEditingKey: null,
  activeEditingContextType: null
};

// 2. Authentication Flow Listeners
auth.onAuthStateChanged(user => {
  const currentPath = window.location.pathname;
  if (user) {
    state.uid = user.uid;
    if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
      window.location.href = "dashboard.html";
    } else {
      initializeApplicationDataStreams();
      initializeThemeEngineScheme();
    }
  } else {
    state.uid = null;
    if (!currentPath.includes("index.html") && !currentPath.endsWith("/")) {
      window.location.href = "index.html";
    }
  }
});

// Authentication Interface Handlers
function toggleAuthMode(targetMode) {
  const loginForm = document.getElementById("login-form-group");
  const regForm = document.getElementById("register-form-group");
  const subtitle = document.getElementById("auth-subtitle");

  if (targetMode === "register") {
    loginForm.style.display = "none";
    regForm.style.display = "block";
    subtitle.innerText = "Register your identity parameters on the secure network cluster.";
  } else {
    loginForm.style.display = "block";
    regForm.style.display = "none";
    subtitle.innerText = "Sign in to manage your premium asset logs";
  }
}

document.getElementById("btn-login")?.addEventListener("click", () => {
  const email = document.getElementById("auth-email").value.trim();
  const pass = document.getElementById("auth-password").value;
  if (!email || !pass) return alert("Validation Failed: Identity credentials cannot be evaluated blank.");
  
  auth.signInWithEmailAndPassword(email, pass)
    .catch(err => alert(`Security Refusal: ${err.message}`));
});

document.getElementById("btn-register")?.addEventListener("click", () => {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-password").value;

  if (!name || !email || !pass) return alert("Validation Error: Please fill all credentials slots.");
  if (pass.length < 6) return alert("Security Error: Target password string fails minimum length bounds.");

  auth.createUserWithEmailAndPassword(email, pass)
    .then(cred => {
      return rtdb.ref(`${SYSTEM_NAMESPACE}/users/${cred.user.uid}/profile`).set({
        name: name,
        email: email,
        createdTimestamp: firebase.database.ServerValue.TIMESTAMP
      });
    })
    .catch(err => alert(`Registration Interruption: ${err.message}`));
});

function forgotPassword() {
  const email = document.getElementById("auth-email").value.trim();
  if (!email) return alert("Please specify the target user email address to receive reset tokens.");
  auth.sendPasswordResetEmail(email)
    .then(() => alert("Reset Vector Token successfully routed to specified mailbox destination."))
    .catch(err => alert(err.message));
}

function executeSignOutGateway() {
  auth.signOut().then(() => window.location.href = "index.html");
}

// 3. Realtime Engine Streams & Processors
function initializeApplicationDataStreams() {
  const userRootRef = rtdb.ref(`${SYSTEM_NAMESPACE}/users/${state.uid}`);
  
  // Attach single overarching listener to secure automatic execution sync across updates
  userRootRef.on("value", snapshot => {
    const data = snapshot.val() || {};
    state.profile = data.profile || {};
    state.transactions = data.transactions || {};
    state.salaryHistory = data.salaryHistory || {};
    state.dailyNotes = data.dailyNotes || {};
    state.reminders = data.reminders || {};
    state.budgets = data.budgets || {};
    state.uploadedBills = data.uploadedBills || {};
    state.recurringRules = data.recurringRules || {};

    executeAutomatedRecurringTransactions();
    evaluateDashboardMetrics();
    renderInteractiveCalendarView();
    evaluateLedgerDataView();
    evaluateSystemAlertsEngine();
    
    // Update User Info Layout
    const nameLabel = document.getElementById("user-display-name");
    if (nameLabel) nameLabel.innerText = state.profile.name || "Premium Client User";
    const systemsDateLabel = document.getElementById("system-date-lbl");
    if (systemsDateLabel) systemsDateLabel.innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });
}

// 4. Financial Analytics Evaluation Engines
function evaluateDashboardMetrics() {
  if (!document.getElementById("m-net-balance")) return;

  let totalIncome = 0, totalExpense = 0;
  let todayIncome = 0, todayExpense = 0;
  let monthIncome = 0, monthExpense = 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // "YYYY-MM"

  // Process core transaction matrices
  Object.values(state.transactions).forEach(tx => {
    const val = parseFloat(tx.amount) || 0;
    if (tx.type === "income") {
      totalIncome += val;
      if (tx.date === todayStr) todayIncome += val;
      if (tx.date.startsWith(currentMonthStr)) monthIncome += val;
    } else if (tx.type === "expense") {
      totalExpense += val;
      if (tx.date === todayStr) todayExpense += val;
      if (tx.date.startsWith(currentMonthStr)) monthExpense += val;
    }
  });

  // Include salary histories in income computations
  Object.values(state.salaryHistory).forEach(sal => {
    const grossVal = (parseFloat(sal.amount) || 0) + (parseFloat(sal.bonus) || 0);
    totalIncome += grossVal;
    if (sal.date === todayStr) todayIncome += grossVal;
    if (sal.date.startsWith(currentMonthStr)) monthIncome += grossVal;
  });

  let netWorth = totalIncome - totalExpense;
  let monthlySavings = monthIncome - monthExpense;
  let savingsRatio = monthIncome > 0 ? (monthlySavings / monthIncome) * 100 : 0;

  // Render values to target view structures
  document.getElementById("m-net-balance").innerText = `₹${netWorth.toFixed(2)}`;
  document.getElementById("m-month-income").innerText = `₹${monthIncome.toFixed(2)}`;
  document.getElementById("m-month-expense").innerText = `₹${monthExpense.toFixed(2)}`;
  document.getElementById("m-month-savings").innerText = `₹${monthlySavings.toFixed(2)}`;
  document.getElementById("m-today-income").innerText = `Today: ₹${todayIncome.toFixed(2)}`;
  document.getElementById("m-today-expense").innerText = `Today: ₹${todayExpense.toFixed(2)}`;
  document.getElementById("m-savings-ratio").innerText = `Ratio: ${savingsRatio.toFixed(0)}%`;

  renderBudgetAllocationBars(currentMonthStr);
  renderAnalyticalVisualCharts(currentMonthStr);
}

function renderBudgetAllocationBars(monthScopeStr) {
  const targetLayout = document.getElementById("budget-widget-list");
  if (!targetLayout) return;
  targetLayout.innerHTML = "";

  // Aggregate category metrics spent this month
  let spendCategories = {};
  Object.values(state.transactions).forEach(tx => {
    if (tx.type === "expense" && tx.date.startsWith(monthScopeStr)) {
      spendCategories[tx.category] = (spendCategories[tx.category] || 0) + (parseFloat(tx.amount) || 0);
    }
  });

  if (Object.keys(state.budgets).length === 0) {
    targetLayout.innerHTML = `<small style="color:var(--text-muted)">No active operational allocations configured.</small>`;
    return;
  }

  Object.entries(state.budgets).forEach(([key, budgetObj]) => {
    const category = budgetObj.category;
    const ceiling = parseFloat(budgetObj.limit) || 1;
    const spent = spendCategories[category] || 0;
    let ratio = (spent / ceiling) * 100;
    let colorHex = "var(--vector-income)";
    if (ratio > 75) colorHex = "var(--vector-reminder)";
    if (ratio > 100) colorHex = "var(--vector-expense)";

    const row = document.createElement("div");
    row.className = "progress-meter-row";
    row.innerHTML = `
      <div class="meter-labels">
        <span>${category} Budget</span>
        <span>₹${spent.toFixed(0)} / ₹${ceiling.toFixed(0)} (${ratio.toFixed(0)}%)</span>
      </div>
      <div class="meter-rail">
        <div class="meter-fill-bar" style="width: ${Math.min(ratio, 100)}%; background-color: ${colorHex}"></div>
      </div>
    `;
    targetLayout.appendChild(row);
  });
}

// 5. Chart.js Visualization Engine Lifecycle
function renderAnalyticalVisualCharts(monthScopeStr) {
  if (!document.getElementById("chart-income-expense")) return;

  // Workspace Array Processing
  let chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let incomeSeries = Array(12).fill(0);
  let expenseSeries = Array(12).fill(0);
  let categoryDistribution = {};

  Object.values(state.transactions).forEach(tx => {
    const txDate = new Date(tx.date);
    if (txDate.getFullYear() === state.calendarActiveYear) {
      const mIdx = txDate.getMonth();
      if (tx.type === "income") incomeSeries[mIdx] += parseFloat(tx.amount) || 0;
      if (tx.type === "expense") expenseSeries[mIdx] += parseFloat(tx.amount) || 0;
    }
    if (tx.type === "expense" && tx.date.startsWith(monthScopeStr)) {
      categoryDistribution[tx.category] = (categoryDistribution[tx.category] || 0) + (parseFloat(tx.amount) || 0);
    }
  });

  // Chart Engine Alpha: Line/Bar Mixed Trend
  const ctxTrend = document.getElementById("chart-income-expense").getContext("2d");
  if (state.charts.trend) state.charts.trend.destroy();
  state.charts.trend = new Chart(ctxTrend, {
    type: 'bar',
    data: {
      labels: chartMonths,
      datasets: [
        { label: 'Inflow Streams', data: incomeSeries, backgroundColor: '#10b981', borderRadius: 6 },
        { label: 'Outflow Streams', data: expenseSeries, backgroundColor: '#ef4444', borderRadius: 6 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text-main') } } } }
  });

  // Chart Engine Beta: Outflow Breakdowns Allocation Pie
  const ctxPie = document.getElementById("chart-categories-pie").getContext("2d");
  if (state.charts.categories) state.charts.categories.destroy();
  
  const pieLabels = Object.keys(categoryDistribution);
  const pieData = Object.values(categoryDistribution);

  state.charts.categories = new Chart(ctxPie, {
    type: 'doughnut',
    data: {
      labels: pieLabels.length ? pieLabels : ["No Expense Logged"],
      datasets: [{
        data: pieData.length ? pieData : [1],
        backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: getComputedStyle(document.body).getPropertyValue('--text-main') } } } }
  });
}

// 6. Interactive Calendar Structural Renderer Matrix
function renderInteractiveCalendarView() {
  const gridContainer = document.getElementById("calendar-days-container");
  if (!gridContainer) return;
  gridContainer.innerHTML = "";

  document.getElementById("calendar-month-year").innerText = new Date(state.calendarActiveYear, state.calendarActiveMonth).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(state.calendarActiveYear, state.calendarActiveMonth, 1).getDay();
  const totalDaysInMonth = new Date(state.calendarActiveYear, state.calendarActiveMonth + 1, 0).getDate();
  const totalDaysPreviousMonth = new Date(state.calendarActiveYear, state.calendarActiveMonth, 0).getDate();

  // Rendering Previous Out-of-Bounds Days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    let dayNum = totalDaysPreviousMonth - i;
    let targetDateStr = new Date(state.calendarActiveYear, state.calendarActiveMonth - 1, dayNum).toISOString().split('T')[0];
    appendCalendarDayNode(dayNum, true, targetDateStr, gridContainer);
  }

  // Rendering Active In-Bounds Target Days
  for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
    let targetDateStr = new Date(state.calendarActiveYear, state.calendarActiveMonth, dayNum + 1).toISOString().split('T')[0];
    appendCalendarDayNode(dayNum, false, targetDateStr, gridContainer);
  }
}

function appendCalendarDayNode(dayNum, isOutside, dateStr, container) {
  const node = document.createElement("div");
  node.className = `calendar-day-node ${isOutside ? 'outside-month' : ''}`;
  
  const todayStr = new Date().toISOString().split('T')[0];
  if (dateStr === todayStr) node.classList.add("current-day-highlight");

  node.innerHTML = `<span>${dayNum}</span>`;
  
  // Evaluation Dot Vector Indicator Layers
  const dotLayout = document.createElement("div");
  dotLayout.className = "indicator-dot-matrix";

  let indicators = { inc: false, exp: false, sal: false, rem: false, note: false };

  Object.values(state.transactions).forEach(tx => {
    if (tx.date === dateStr) {
      if (tx.type === "income") indicators.inc = true;
      if (tx.type === "expense") indicators.exp = true;
    }
  });
  Object.values(state.salaryHistory).forEach(s => { if (s.date === dateStr) indicators.sal = true; });
  Object.values(state.dailyNotes).forEach(n => {
    if (n.date === dateStr) {
      if (n.personalText) indicators.note = true;
      if (n.reminderText) indicators.rem = true;
    }
  });

  if (indicators.inc) dotLayout.innerHTML += `<span class="ind-dot income"></span>`;
  if (indicators.exp) dotLayout.innerHTML += `<span class="ind-dot expense"></span>`;
  if (indicators.sal) dotLayout.innerHTML += `<span class="ind-dot salary"></span>`;
  if (indicators.rem) dotLayout.innerHTML += `<span class="ind-dot reminder"></span>`;
  if (indicators.note) dotLayout.innerHTML += `<span class="ind-dot daynote"></span>`;

  node.appendChild(dotLayout);
  node.addEventListener("click", () => triggerDateTargetContext(dateStr));
  container.appendChild(node);
}

function shiftCalendarMonth(direction) {
  state.calendarActiveMonth += direction;
  if (state.calendarActiveMonth > 11) { state.calendarActiveMonth = 0; state.calendarActiveYear++; }
  if (state.calendarActiveMonth < 0) { state.calendarActiveMonth = 11; state.calendarActiveYear--; }
  renderInteractiveCalendarView();
}

// 7. Modals and Specialized Record Entry Frameworks
function openTransactionModal() {
  state.activeEditingKey = null;
  state.activeEditingContextType = null;
  document.getElementById("btn-modal-delete-action").style.display = "none";
  document.getElementById("tx-modal-title").innerText = "Add Operational Parameters";
  
  document.getElementById("form-target-date").value = state.calendarSelectedDate;
  document.getElementById("form-target-time").value = new Date().toTimeString().substring(0,5);
  document.getElementById("tx-amount").value = "";
  document.getElementById("form-universal-memo").value = "";
  
  document.getElementById("tx-modal").classList.add("active");
}

function closeTransactionModal() {
  document.getElementById("tx-modal").classList.remove("active");
}

function adjustFormFields() {
  const type = document.getElementById("form-entry-type").value;
  document.getElementById("context-transaction").style.display = type === "transaction" ? "block" : "none";
  document.getElementById("context-salary").style.display = type === "salary" ? "block" : "none";
  document.getElementById("context-daynote").style.display = type === "daynote" ? "block" : "none";
  document.getElementById("context-budget").style.display = type === "budget" ? "block" : "none";
  
  // Hide universal fields for pure configurations if needed
  document.getElementById("universal-memo-group").style.display = type === "budget" ? "none" : "block";
}

function triggerDateTargetContext(dateStr) {
  state.calendarSelectedDate = dateStr;
  
  // Scan if day entries exist to edit them, otherwise open clean creation dialog
  let existingTxKey = null;
  Object.entries(state.transactions).forEach(([key, tx]) => { if(tx.date === dateStr) existingTxKey = key; });

  if (existingTxKey) {
    loadRecordToEditForm(existingTxKey, "transaction");
  } else {
    openTransactionModal();
  }
}

function loadRecordToEditForm(key, contextType) {
  state.activeEditingKey = key;
  state.activeEditingContextType = contextType;
  openTransactionModal();
  
  document.getElementById("tx-modal-title").innerText = "Update/Modify Active Node";
  document.getElementById("btn-modal-delete-action").style.display = "block";

  if (contextType === "transaction") {
    const data = state.transactions[key];
    document.getElementById("form-entry-type").value = "transaction";
    adjustFormFields();
    document.getElementById("tx-flow-direction").value = data.type;
    document.getElementById("tx-amount").value = data.amount;
    document.getElementById("tx-category").value = data.category;
    document.getElementById("tx-method").value = data.method;
    document.getElementById("form-target-date").value = data.date;
    document.getElementById("form-target-time").value = data.time || "12:00";
    document.getElementById("form-universal-memo").value = data.note || "";
  }
}

// 8. DB Writes Execution Layer Engine
function commitModalEntryToFirebase() {
  const formType = document.getElementById("form-entry-type").value;
  const targetDate = document.getElementById("form-target-date").value;
  const targetTime = document.getElementById("form-target-time").value;
  const memoStr = document.getElementById("form-universal-memo").value.trim();

  if (!targetDate) return alert("Validation Failed: Target Anchor Date parameter mandatory.");

  const basePath = `${SYSTEM_NAMESPACE}/users/${state.uid}`;

  if (formType === "transaction") {
    const amountVal = parseFloat(document.getElementById("tx-amount").value);
    if (isNaN(amountVal) || amountVal <= 0) return alert("Validation Error: Functional Amount must evaluate positive numeric.");

    const txPayload = {
      type: document.getElementById("tx-flow-direction").value,
      amount: amountVal,
      category: document.getElementById("tx-category").value,
      method: document.getElementById("tx-method").value,
      date: targetDate,
      time: targetTime,
      note: memoStr,
      attachmentUrl: ""
    };

    const fileInput = document.getElementById("tx-file-attachment");
    if (fileInput && fileInput.files.length > 0 && storage) {
      const targetFile = fileInput.files[0];
      const storageLocationRef = storage.ref(`${SYSTEM_NAMESPACE}/users/${state.uid}/bills/${Date.now()}_${targetFile.name}`);
      
      storageLocationRef.put(targetFile).then(snapshot => snapshot.ref.getDownloadURL()).then(downloadUrl => {
        txPayload.attachmentUrl = downloadUrl;
        dispatchTxToDatabase(basePath, txPayload);
      }).catch(err => alert(`Storage Layer Processing Error: ${err.message}`));
    } else {
      dispatchTxToDatabase(basePath, txPayload);
    }
  } else if (formType === "salary") {
    const salAmt = parseFloat(document.getElementById("sal-amount").value);
    if (isNaN(salAmt)) return alert("Invalid Amount specification.");
    
    const salaryPayload = {
      amount: salAmt,
      employer: document.getElementById("sal-employer").value.trim() || "Unspecified Enterprise",
      bonus: parseFloat(document.getElementById("sal-bonus").value) || 0,
      date: targetDate,
      note: memoStr
    };
    rtdb.ref(`${basePath}/salaryHistory`).push(salaryPayload).then(() => finalizeModalCommitSuccess());
  } else if (formType === "daynote") {
    const notePayload = {
      date: targetDate,
      personalText: document.getElementById("note-personal-text").value.trim(),
      reminderText: document.getElementById("note-reminder-text").value.trim(),
      colorCode: document.getElementById("note-color-tag").value
    };
    rtdb.ref(`${basePath}/dailyNotes`).push(notePayload).then(() => finalizeModalCommitSuccess());
  } else if (formType === "budget") {
    const catKey = document.getElementById("budget-category-key").value;
    const limitVal = parseFloat(document.getElementById("budget-threshold-limit").value);
    if (isNaN(limitVal)) return alert("Limit must be parsed numerical.");

    rtdb.ref(`${basePath}/budgets/${catKey}`).set({
      category: catKey,
      limit: limitVal
    }).then(() => finalizeModalCommitSuccess());
  }
}

function dispatchTxToDatabase(basePath, payload) {
  if (state.activeEditingKey) {
    rtdb.ref(`${basePath}/transactions/${state.activeEditingKey}`).set(payload).then(() => finalizeModalCommitSuccess());
  } else {
    rtdb.ref(`${basePath}/transactions`).push(payload).then(() => finalizeModalCommitSuccess());
  }
}

function finalizeModalCommitSuccess() {
  closeTransactionModal();
  alert("Database Operational Architecture Synchronized Cleanly.");
}

function deleteActiveRecord() {
  if (!state.activeEditingKey || !state.activeEditingContextType) return;
  if (!confirm("Confirm data node destruction protocol sequence?")) return;

  const targetPath = `${SYSTEM_NAMESPACE}/users/${state.uid}/transactions/${state.activeEditingKey}`;
  rtdb.ref(targetPath).remove().then(() => {
    closeTransactionModal();
    alert("Node Destructured and Removed from Cluster.");
  });
}

// 9. Ledger Matrix Filters & Data Rendering Streams
function evaluateLedgerDataView() {
  const streamTarget = document.getElementById("ledger-stream-target");
  if (!streamTarget) return;
  streamTarget.innerHTML = "";

  const queryTerm = document.getElementById("ledger-search-box").value.toLowerCase();
  const rangeSelection = document.getElementById("ledger-time-filter").value;
  
  const customDateRow = document.getElementById("custom-date-row");
  if(customDateRow) customDateRow.style.display = rangeSelection === "custom" ? "flex" : "none";

  let filteredCollection = [];

  // Match operational transactions items against active rule bounds
  Object.entries(state.transactions).forEach(([key, tx]) => {
    if (evaluateTemporalBounds(tx.date, rangeSelection) && evaluateSearchMatch(tx, queryTerm)) {
      filteredCollection.push({ key, ...tx, context: "transaction" });
    }
  });

  if (filteredCollection.length === 0) {
    streamTarget.innerHTML = `<p style="padding:20px; text-align:center; color:var(--text-muted);">No records cleared current system parameter filters.</p>`;
    return;
  }

  // Sort Descending Chronological Date Ordering
  filteredCollection.sort((x, y) => new Date(y.date) - new Date(x.date));

  filteredCollection.forEach(item => {
    const element = document.createElement("div");
    element.className = "ledger-row-node";
    element.onclick = () => loadRecordToEditForm(item.key, item.context);

    element.innerHTML = `
      <div class="ledger-meta-left">
        <h5>${item.category}</h5>
        <small>${item.date} • ${item.method} ${item.note ? '• ' + item.note : ''}</small>
      </div>
      <div class="ledger-value-right ${item.type === 'income' ? 'inc' : 'exp'}">
        ${item.type === 'income' ? '+' : '-'} ₹${parseFloat(item.amount).toFixed(2)}
      </div>
    `;
    streamTarget.appendChild(element);
  });
}

function evaluateTemporalBounds(dateStr, boundaryRule) {
  const inputTimestamp = new Date(dateStr).getTime();
  const currentAnchor = new Date();
  
  const computeStartOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  switch (boundaryRule) {
    case "all": return true;
    case "today":
      return computeStartOfDay(currentAnchor) === computeStartOfDay(new Date(dateStr));
    case "yesterday":
      let yest = new Date(); yest.setDate(yest.getDate() - 1);
      return computeStartOfDay(yest) === computeStartOfDay(new Date(dateStr));
    case "7days":
      let limit7 = new Date(); limit7.setDate(limit7.getDate() - 7);
      return inputTimestamp >= computeStartOfDay(limit7);
    case "thismonth":
      return new Date(dateStr).getMonth() === currentAnchor.getMonth() && new Date(dateStr).getFullYear() === currentAnchor.getFullYear();
    case "lastmonth":
      let lm = currentAnchor.getMonth() - 1;
      let ly = currentAnchor.getFullYear();
      if(lm < 0) { lm = 11; ly--; }
      return new Date(dateStr).getMonth() === lm && new Date(dateStr).getFullYear() === ly;
    case "thisyear":
      return new Date(dateStr).getFullYear() === currentAnchor.getFullYear();
    case "custom":
      const customStart = document.getElementById("filter-start-date").value;
      const customEnd = document.getElementById("filter-end-date").value;
      if(!customStart || !customEnd) return true;
      return inputTimestamp >= new Date(customStart).getTime() && inputTimestamp <= new Date(customEnd).getTime();
    default: return true;
  }
}

function evaluateSearchMatch(tx, keyword) {
  if (!keyword) return true;
  return tx.category.toLowerCase().includes(keyword) || 
         (tx.note && tx.note.toLowerCase().includes(keyword)) || 
         tx.method.toLowerCase().includes(keyword) ||
         tx.amount.toString().includes(keyword);
}

// 10. Automated Recurring Scheduler Task Processor Engine
function injectRecurringRuleTemplate() {
  const category = document.getElementById("recur-template-label").value;
  const amountVal = parseFloat(document.getElementById("recur-template-amount").value);

  if (isNaN(amountVal) || amountVal <= 0) return alert("Please clarify numeric rule amounts.");

  rtdb.ref(`${SYSTEM_NAMESPACE}/users/${state.uid}/recurringRules`).push({
    category,
    amount: amountVal,
    lastExecutedMonth: "" // Formatted "YYYY-MM" to track system injection history safety bounds
  }).then(() => {
    alert("Automation Routine Authorized Successfully.");
  });
}

function executeAutomatedRecurringTransactions() {
  const currentMonthToken = new Date().toISOString().substring(0,7); // "YYYY-MM"

  Object.entries(state.recurringRules).forEach(([key, rule]) => {
    if (rule.lastExecutedMonth !== currentMonthToken) {
      // Direct pipeline execution inject to generate transactional matching logs tracking
      rtdb.ref(`${SYSTEM_NAMESPACE}/users/${state.uid}/transactions`).push({
        type: "expense",
        amount: rule.amount,
        category: rule.category,
        method: "Bank Transfer",
        date: new Date().toISOString().split('T')[0],
        time: "08:00",
        note: "System Automated Recurring Trigger Protocol Execution",
        attachmentUrl: ""
      }).then(() => {
        // Update stamp to prevent loop recursion overhead execution cycles
        rtdb.ref(`${SYSTEM_NAMESPACE}/users/${state.uid}/recurringRules/${key}/lastExecutedMonth`).set(currentMonthToken);
      });
    }
  });
}

// 11. Alerts Diagnostics Processor Engine
function toggleAlertModal() {
  const overlay = document.getElementById("alert-modal");
  if(overlay) overlay.classList.toggle("active");
}

function evaluateSystemAlertsEngine() {
  const alertBadgeCounter = document.getElementById("alert-counter");
  const modalStreamTarget = document.getElementById("alert-modal-stream-body");
  if (!alertBadgeCounter) return;

  let computedActiveAlertsList = [];
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  // Parameter Evaluation Check A: Category Allocations Budget Exceeded Overflows
  let spendCategories = {};
  Object.values(state.transactions).forEach(tx => {
    if (tx.type === "expense" && tx.date.startsWith(currentMonthStr)) {
      spendCategories[tx.category] = (spendCategories[tx.category] || 0) + (parseFloat(tx.amount) || 0);
    }
  });

  Object.values(state.budgets).forEach(b => {
    let spent = spendCategories[b.category] || 0;
    if (spent > parseFloat(b.limit)) {
      computedActiveAlertsList.push(`Budget Core Breach: Category [${b.category}] has overrun allocation bounds by ₹${(spent - b.limit).toFixed(2)}`);
    }
  });

  // Parameter Evaluation Check B: Reminders Registered for Active Days
  const todayStr = new Date().toISOString().split('T')[0];
  Object.values(state.dailyNotes).forEach(note => {
    if (note.date === todayStr && note.reminderText) {
      computedActiveAlertsList.push(`Action Item Active: ${note.reminderText}`);
    }
  });

  // UI Updates Injection
  alertBadgeCounter.innerText = computedActiveAlertsList.length;
  if(modalStreamTarget) {
    modalStreamTarget.innerHTML = "";
    if (computedActiveAlertsList.length === 0) {
      modalStreamTarget.innerHTML = `<div class="alert-item-node success-alert">All systems clear. Hardware diagnostics and allocation tracks operate within optimal parameters.</div>`;
    } else {
      computedActiveAlertsList.forEach(txt => {
        modalStreamTarget.innerHTML += `<div class="alert-item-node">${txt}</div>`;
      });
    }
  }
}

// 12. SheetJS & jsPDF Documents Compilation System Wrapper
function exportDataSuite(formatType) {
  const dataExportMatrix = Object.values(state.transactions);
  if(dataExportMatrix.length === 0) return alert("System state lacks operational transaction logs tracking history to compile.");

  if (formatType === 'xlsx') {
    const dynamicWorksheet = XLSX.utils.json_to_sheet(dataExportMatrix);
    const dynamicWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(dynamicWorkbook, dynamicWorksheet, "Ledger Log Record Summary");
    XLSX.writeFile(dynamicWorkbook, `Financial_System_Logs_${Date.now()}.xlsx`);
  } else if (formatType === 'pdf') {
    const { jsPDF } = window.jspdf;
    const documentAsset = new jsPDF();
    documentAsset.setFont("Helvetica", "bold");
    documentAsset.text("MONEY MANAGER PRO v3.5 - SYSTEM TRANSCRIPT LOGS", 14, 20);
    documentAsset.setFont("Helvetica", "normal");
    documentAsset.setFontSize(10);
    
    let verticalCursor = 30;
    dataExportMatrix.forEach((tx, index) => {
      if(verticalCursor > 280) { documentAsset.addPage(); verticalCursor = 20; }
      let itemLineString = `${index+1}. [${tx.date}] Class: ${tx.category} | Direction Vector: ${tx.type.toUpperCase()} | Magnitude: Rs.${tx.amount} | Via: ${tx.method}`;
      documentAsset.text(itemLineString, 14, verticalCursor);
      verticalCursor += 8;
    });
    
    documentAsset.save(`Financial_System_Transcript_${Date.now()}.pdf`);
  }
}

// 13. Dynamic System Frame Theme Schemes Variables Routing Setup
function initializeThemeEngineScheme() {
  const storedTheme = localStorage.getItem("money-manager-pro-theme-engine") || "auto";
  const selector = document.getElementById("theme-engine-selector");
  if(selector) selector.value = storedTheme;
  applySystemThemeEngineSetting(storedTheme);
}

function applySystemThemeEngineSetting(explicitTheme) {
  let activeThemeValue = explicitTheme || document.getElementById("theme-engine-selector").value;
  localStorage.setItem("money-manager-pro-theme-engine", activeThemeValue);

  if (activeThemeValue === "auto") {
    const systemMatchesDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", systemMatchesDark ? "dark" : "light");
  } else {
    document.documentElement.setAttribute("data-theme", activeThemeValue);
  }
}

// Navigation Tab Switching Manager Layout View Helpers
function switchView(targetPanelId) {
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab-link").forEach(l => l.classList.remove("active"));
  
  const targetPanel = document.getElementById(targetPanelId);
  if(targetPanel) targetPanel.classList.add("active");
  
  // Find matching nav trigger elements
  const matchBtn = Array.from(document.querySelectorAll(".tab-link")).find(btn => btn.getAttribute("onclick").includes(targetPanelId));
  if(matchBtn) matchBtn.classList.add("active");
}

// Capture contextual parameters passed natively via query limits
window.addEventListener("DOMContentLoaded", () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const selectedTabId = queryParameters.get("tab");
  if(selectedTabId) switchView(selectedTabId);
});