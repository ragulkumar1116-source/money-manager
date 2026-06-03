/**
 * PROJECT APPLICATION JAVASCRIPT SYSTEM ENGINE MODULE (v3.5)
 * ENTERPRISE DATA PERSISTENCE & FLOW INTERACTIVE CALCULATIONS SCRIPT
 * AUTHOR ARCHITECTURE REPOSITORY DIRECTIVE LICENSE: LIC-2026-VISH-091
 * COPYRIGHT (C) 2026 VISH INFOTECH SYSTEMS. ALL RIGHTS RESERVED.
 */

// --- 1. FIREBASE ARCHITECTURE ENVIRONMENT INITIALIZATION CONFIGURATIONS ---
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APPLICATION_ID"
};

// Initialize Instance Handles
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const rtdb = firebase.database();
const storage = firebase.firebase ? firebase.storage() : null; // Safe structural fallback checking

// Global Engine Dynamic Scope Parameters Variables
let globalFinancialRegistrySet = {};
let globalCalculatedBudgetsMap = {};
let activeTargetRecordSelectedUID = null;
let activeCalendarDateIndexPointer = new Date();
let performanceChartLineInstance = null;
let performanceChartPieInstance = null;

// --- 2. AUTH SECURITY NODE MONITOR & DYNAMIC PROFILE greet INTERFACES ---
auth.onAuthStateChanged(user => {
  if (user) {
    // Pipeline Sequence Linkage: Fetch data and sync greeting context profile fields
    streamUserCustomGreetingIdentity(user);
    initializeDataSynchronizationEngine(user.uid);
  } else {
    // If authorization payload drops, force application exit to safety gate
    window.location.href = "index.html";
  }
});

function streamUserCustomGreetingIdentity(user) {
  const dynamicGreetingLabel = document.getElementById("user-display-name");
  if (!dynamicGreetingLabel) return;

  if (user.displayName) {
    dynamicGreetingLabel.innerText = `Welcome, ${user.displayName}`;
  } else {
    // Fallback: Query Realtime Database Profile Node for Custom Registration Data
    rtdb.ref(`money_manager_v35/users/${user.uid}/profile/name`).once('value')
      .then(snap => {
        if (snap.exists() && snap.val()) {
          dynamicGreetingLabel.innerText = `Welcome, ${snap.val()}`;
        } else {
          dynamicGreetingLabel.innerText = "Welcome, Corporate Node User";
        }
      }).catch(() => {
        dynamicGreetingLabel.innerText = "Welcome, Verified Session";
      });
  }
  
  // Set the locale operational date marker on page header element
  const dateLabel = document.getElementById("system-date-lbl");
  if (dateLabel) {
    const today = new Date();
    dateLabel.innerText = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}

// --- 3. DYNAMIC TAB CONTAINER MULTI-VIEWPORT ROUTING ENGINE ---
function switchView(targetViewPanelID) {
  document.querySelectorAll('.tab-panel').forEach(panel => panel.style.display = 'none');
  document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
  
  const selectedPanel = document.getElementById(targetViewPanelID);
  if (selectedPanel) selectedPanel.style.display = 'block';
  
  // Cross-reference finding current structural click target selector
  const processingButton = Array.from(document.querySelectorAll('.tab-link'))
    .find(btn => btn.getAttribute('onclick').includes(targetViewPanelID));
  if (processingButton) processingButton.classList.add('active');

  // Specific lifecycle triggers depending on active tabs environment
  if (targetViewPanelID === 'view-calendar') renderSystemCalendarGridMatrix();
  if (targetViewPanelID === 'view-ledger') evaluateLedgerDataView();
}

// --- 4. DATA SYNCHRONIZATION STREAMS & BUSINESS CALCULATIONS ---
function initializeDataSynchronizationEngine(uid) {
  rtdb.ref(`money_manager_v35/users/${uid}`).on('value', snapshot => {
    const systemPayload = snapshot.val() || {};
    globalFinancialRegistrySet = systemPayload.records || {};
    globalCalculatedBudgetsMap = systemPayload.budgets || {};
    
    executeFinancialCalculationsMatrix();
    rebuildBusinessAnalyticsVisualCharts();
    if (document.getElementById('view-calendar').style.display !== 'none') renderSystemCalendarGridMatrix();
    if (document.getElementById('view-ledger').style.display !== 'none') evaluateLedgerDataView();
  });
}

function executeFinancialCalculationsMatrix() {
  let balanceNetWorthSum = 0;
  let monthlyInflowSum = 0;
  let monthlyOutflowSum = 0;
  let singleDayInflowSum = 0;
  let singleDayOutflowSum = 0;

  const currentAnchorTimestamp = new Date();
  const indexCurrentMonth = currentAnchorTimestamp.getMonth();
  const indexCurrentYear = currentAnchorTimestamp.getFullYear();
  const stringIsoTodayDate = currentAnchorTimestamp.toISOString().split('T')[0];

  Object.keys(globalFinancialRegistrySet).forEach(key => {
    const record = globalFinancialRegistrySet[key];
    if (record.entryType === 'transaction' || record.entryType === 'salary') {
      const recordDate = new Date(record.timestamp);
      const recordAmount = parseFloat(record.amount || 0);
      const isIncome = record.direction === 'income' || record.entryType === 'salary';
      const recordIsoDayStr = record.timestamp.split('T')[0];

      // Total structural lifetime metrics
      if (isIncome) balanceNetWorthSum += recordAmount;
      else balanceNetWorthSum -= recordAmount;

      // Filter constraints match current processing month
      if (recordDate.getMonth() === indexCurrentMonth && recordDate.getFullYear() === indexCurrentYear) {
        if (isIncome) monthlyInflowSum += recordAmount;
        else monthlyOutflowSum += recordAmount;
      }

      // Filter constraints match current processing system day
      if (recordIsoDayStr === stringIsoTodayDate) {
        if (isIncome) singleDayInflowSum += recordAmount;
        else singleDayOutflowSum += recordAmount;
      }
    }
  });

  const aggregateSavingsBalance = monthlyInflowSum - monthlyOutflowSum;
  const ratioCalculatedSavings = monthlyInflowSum > 0 ? Math.round((aggregateSavingsBalance / monthlyInflowSum) * 100) : 0;

  // DOM Interface Field Output Injections
  document.getElementById("m-net-balance").innerText = `₹${balanceNetWorthSum.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
  document.getElementById("m-month-income").innerText = `₹${monthlyInflowSum.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
  document.getElementById("m-month-expense").innerText = `₹${monthlyOutflowSum.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
  document.getElementById("m-month-savings").innerText = `₹${aggregateSavingsBalance.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
  document.getElementById("m-savings-ratio").innerText = `Ratio: ${ratioCalculatedSavings}%`;
  document.getElementById("m-today-income").innerText = `Today: ₹${singleDayInflowSum}`;
  document.getElementById("m-today-expense").innerText = `Today: ₹${singleDayOutflowSum}`;

  rebuildBudgetProgressWidgets(monthlyOutflowSum);
}

function rebuildBudgetProgressWidgets(currentOutflowTotal) {
  const containerWidgetList = document.getElementById("budget-widget-list");
  if (!containerWidgetList) return;
  containerWidgetList.innerHTML = "";

  // Segment allocations maps by matching individual categories variables
  let spentCategoryTotalsMap = {};
  Object.values(globalFinancialRegistrySet).forEach(rec => {
    if (rec.entryType === 'transaction' && rec.direction === 'expense') {
      spentCategoryTotalsMap[rec.category] = (spentCategoryTotalsMap[rec.category] || 0) + parseFloat(rec.amount || 0);
    }
  });

  if (Object.keys(globalCalculatedBudgetsMap).length === 0) {
    containerWidgetList.innerHTML = `<p style="color:var(--text-muted); font-size:13px;">No operational active thresholds bounds initialized.</p>`;
    return;
  }

  Object.keys(globalCalculatedBudgetsMap).forEach(key => {
    const budgetLimit = parseFloat(globalCalculatedBudgetsMap[key].limit || 0);
    const amountSpent = spentCategoryTotalsMap[key] || 0;
    const computePercentage = Math.min(Math.round((amountSpent / budgetLimit) * 100), 100);
    
    const blockWidgetNode = document.createElement("div");
    blockWidgetNode.style.marginBottom = "14px";
    blockWidgetNode.innerHTML = `
      <div style="display:flex; justify-content:between; font-size:13px; margin-bottom:4px;">
        <strong>${key}</strong>
        <span style="margin-left:auto; color:var(--text-muted);">${amountSpent} / ${budgetLimit} ₹ (${computePercentage}%)</span>
      </div>
      <div style="width:100%; height:8px; background:rgba(0,0,0,0.05); border-radius:4px; overflow:hidden;">
        <div style="width:${computePercentage}%; height:100%; background:${computePercentage() >= 90 ? 'var(--vector-expense)' : 'var(--primary-accent)'}; transition:width 0.4s ease;"></div>
      </div>
    `;
    containerWidgetList.appendChild(blockWidgetNode);
  });
}

// --- 5. BUSINESS ANALYTICS INTERACTIVE CHART GENERATIONS (CHART.JS) ---
function rebuildBusinessAnalyticsVisualCharts() {
  const elementLineCanvas = document.getElementById("chart-income-expense");
  const elementPieCanvas = document.getElementById("chart-categories-pie");
  if (!elementLineCanvas || !elementPieCanvas) return;

  // Process and compute chart arrays mappings
  let structuralMonthsLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let numericArrayIncomeLine = Array(12).fill(0);
  let numericArrayExpenseLine = Array(12).fill(0);
  let categoriesDistributionPieMap = {};

  Object.values(globalFinancialRegistrySet).forEach(rec => {
    if (rec.entryType === 'transaction' || rec.entryType === 'salary') {
      const date = new Date(rec.timestamp);
      const monthIndex = date.getMonth();
      const amount = parseFloat(rec.amount || 0);
      const isIncome = rec.direction === 'income' || rec.entryType === 'salary';

      if (date.getFullYear() === 2026) { // Scope verification tracking bound context year
        if (isIncome) numericArrayIncomeLine[monthIndex] += amount;
        else numericArrayExpenseLine[monthIndex] += amount;
      }

      if (!isIncome && rec.category) {
        categoriesDistributionPieMap[rec.category] = (categoriesDistributionPieMap[rec.category] || 0) + amount;
      }
    }
  });

  // Render or update Trend Line Graph Chart Instance
  if (performanceChartLineInstance) performanceChartLineInstance.destroy();
  performanceChartLineInstance = new Chart(elementLineCanvas, {
    type: 'line',
    data: {
      labels: structuralMonthsLabels,
      datasets: [
        { label: 'Inflow', data: numericArrayIncomeLine, borderColor: '#10b981', tension: 0.3, fill: false },
        { label: 'Outflow', data: numericArrayExpenseLine, borderColor: '#ef4444', tension: 0.3, fill: false }
      ]
    },
    options: { responsive: true, plugins: { legend: { display: true } } }
  });

  // Render or update Category Allocation Pie Chart Instance
  if (performanceChartPieInstance) performanceChartPieInstance.destroy();
  performanceChartPieInstance = new Chart(elementPieCanvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categoriesDistributionPieMap),
      datasets: [{
        data: Object.values(categoriesDistributionPieMap),
        backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b']
      }]
    },
    options: { responsive: true }
  });
}

// --- 6. INTERACTIVE CALENDAR ENGINE MATRIX FUNCTIONS ---
function shiftCalendarMonth(directionOffset) {
  activeCalendarDateIndexPointer.setMonth(activeCalendarDateIndexPointer.getMonth() + directionOffset);
  renderSystemCalendarGridMatrix();
}

function renderSystemCalendarGridMatrix() {
  const elementLabelMonthYear = document.getElementById("calendar-month-year");
  const containerDaysGrid = document.getElementById("calendar-days-container");
  if (!containerDaysGrid) return;

  containerDaysGrid.innerHTML = "";
  const year = activeCalendarDateIndexPointer.getFullYear();
  const month = activeCalendarDateIndexPointer.getMonth();

  elementLabelMonthYear.innerText = activeCalendarDateIndexPointer.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDayIndexOffset = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPriorMonth = new Date(year, month, 0).getDate();

  // Draw Leading Calendar Structural Offset Blocks from prior month
  for (let x = firstDayIndexOffset; x > 0; x--) {
    const nodeBlock = document.createElement("div");
    nodeBlock.className = "calendar-day-node outside-month";
    nodeBlock.innerText = totalDaysInPriorMonth - x + 1;
    containerDaysGrid.appendChild(nodeBlock);
  }

  // Map Real-time Localized Variables to Days nodes inside current runtime framework
  let structuralEventsDayAssociationMap = {};
  Object.keys(globalFinancialRegistrySet).forEach(key => {
    const entry = globalFinancialRegistrySet[key];
    const dateObj = new Date(entry.timestamp);
    if (dateObj.getMonth() === month && dateObj.getFullYear() === year) {
      const dayNum = dateObj.getDate();
      if (!structuralEventsDayAssociationMap[dayNum]) structuralEventsDayAssociationMap[dayNum] = [];
      structuralEventsDayAssociationMap[dayNum].push(entry);
    }
  });

  // Populate actual operational calendar grid days elements
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const cellNodeElement = document.createElement("div");
    cellNodeElement.className = "calendar-day-node";
    
    // Highlight today's current tracking timestamp date marker bound
    const currentCheck = new Date();
    if (day === currentCheck.getDate() && month === currentCheck.getMonth() && year === currentCheck.getFullYear()) {
      cellNodeElement.classList.add("current-day-highlight");
    }

    cellNodeElement.innerHTML = `<span>${day}</span>`;
    
    // Display dynamic miniature activity dot notifications anchors
    if (structuralEventsDayAssociationMap[day]) {
      const markerContainer = document.createElement("div");
      markerContainer.style.display = "flex";
      markerContainer.style.gap = "2px";
      
      structuralEventsDayAssociationMap[day].slice(0, 3).forEach(item => {
        const dotNode = document.createElement("span");
        dotNode.style.width = "5px";
        dotNode.style.height = "5px";
        dotNode.style.borderRadius = "50%";
        
        if (item.entryType === 'salary') dotNode.style.background = "var(--vector-salary)";
        else if (item.entryType === 'daynote') dotNode.style.background = "var(--vector-note)";
        else dotNode.style.background = item.direction === 'income' ? 'var(--vector-income)' : 'var(--vector-expense)';
        
        markerContainer.appendChild(dotNode);
      });
      cellNodeElement.appendChild(markerContainer);
    }

    cellNodeElement.onclick = () => launchCalendarDayInspectionConsole(year, month, day);
    containerDaysGrid.appendChild(cellNodeElement);
  }
}

function launchCalendarDayInspectionConsole(y, m, d) {
  const constructedDateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  document.getElementById("ledger-search-box").value = constructedDateStr;
  document.getElementById("ledger-time-filter").value = "all";
  switchView('view-ledger');
}

// --- 7. DYNAMIC FINANCIAL LEDGER DATA MANAGEMENT ENGINE ---
function evaluateLedgerDataView() {
  const containerTargetStream = document.getElementById("ledger-stream-target");
  if (!containerTargetStream) return;

  const criterionSearchText = document.getElementById("ledger-search-box").value.toLowerCase();
  const selectTimeConstraintCode = document.getElementById("ledger-time-filter").value;
  const layoutCustomDateRangeBlock = document.getElementById("custom-date-row");

  if (selectTimeConstraintCode === "custom") {
    layoutCustomDateRangeBlock.style.display = "flex";
  } else {
    layoutCustomDateRangeBlock.style.display = "none";
  }

  containerTargetStream.innerHTML = "";
  
  // High-performance structural filtering loop evaluations
  let collectedProcessingArray = Object.keys(globalFinancialRegistrySet).map(key => {
    return { uid: key, ...globalFinancialRegistrySet[key] };
  });

  // Sort chronologically descending
  collectedProcessingArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  let displayIterationCounter = 0;

  collectedProcessingArray.forEach(item => {
    // Structural constraints filters validation validations checking
    if (criterionSearchText) {
      const matchText = (item.memo || "").toLowerCase();
      const matchCategory = (item.category || "").toLowerCase();
      const matchMethod = (item.method || "").toLowerCase();
      const matchEmployer = (item.employer || "").toLowerCase();
      const matchTimestamp = (item.timestamp || "").toLowerCase();
      
      if (!matchText.includes(criterionSearchText) && 
          !matchCategory.includes(criterionSearchText) && 
          !matchMethod.includes(criterionSearchText) &&
          !matchTimestamp.includes(criterionSearchText) &&
          !matchEmployer.includes(criterionSearchText)) {
        return; 
      }
    }

    // Process list rendering injection nodes pipelines
    displayIterationCounter++;
    const rowNode = document.createElement("div");
    rowNode.className = "glass-card";
    rowNode.style.padding = "16px";
    rowNode.style.marginBottom = "12px";
    rowNode.style.display = "flex";
    rowNode.style.justifyContent = "space-between";
    rowNode.style.alignItems = "center";
    rowNode.style.cursor = "pointer";
    rowNode.onclick = () => openEditExistingRecordView(item);

    let displayTitleString = item.entryType.toUpperCase();
    let displaySubtextString = item.memo || "No comment metadata payload.";
    let displayValueString = `₹${parseFloat(item.amount || 0).toFixed(2)}`;
    let runtimeIndicatorColor = "var(--text-main)";

    if (item.entryType === 'transaction') {
      displayTitleString = `${item.category} (${item.method})`;
      runtimeIndicatorColor = item.direction === 'income' ? 'var(--vector-income)' : 'var(--vector-expense)';
      if (item.direction === 'expense') displayValueString = `-${displayValueString}`;
    } else if (item.entryType === 'salary') {
      displayTitleString = `Salary: ${item.employer}`;
      runtimeIndicatorColor = "var(--vector-salary)";
    } else if (item.entryType === 'daynote') {
      displayTitleString = `Note Log Flag`;
      displaySubtextString = item.reminderNote || item.personalLog || "";
      displayValueString = "📄";
      runtimeIndicatorColor = "var(--vector-note)";
    }

    rowNode.innerHTML = `
      <div>
        <strong style="color:${runtimeIndicatorColor}; font-size:15px;">${displayTitleString}</strong>
        <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">${displaySubtextString}</p>
        <small style="font-size:10px; color:var(--text-muted); opacity:0.7;">${item.timestamp.replace('T', ' ')}</small>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:700; font-size:16px; color:${runtimeIndicatorColor};">${displayValueString}</span>
      </div>
    `;
    containerTargetStream.appendChild(rowNode);
  });

  if (displayIterationCounter === 0) {
    containerTargetStream.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:40px 0; font-size:14px;">No matching transactional records found.</p>`;
  }
}

// --- 8. DIALOG WORKSPACE TRANSACTION MODAL CONTEXT ACTIONS MANAGER ---
function openTransactionModal() {
  activeTargetRecordSelectedUID = null;
  document.getElementById("tx-modal-title").innerText = "New Dynamic Entry Input Pipeline";
  document.getElementById("btn-modal-delete-action").style.display = "none";
  
  // Auto-populate local timestamp variables coordinates to save key clicks
