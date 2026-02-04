
// MobileBank Prototype 

//  Demonstrates common mobile banking flows (login, dashboard, transfers,
//   transaction filtering, card freeze toggle, profile editing)
// Uses in-memory state + localStorage persistence (no backend)
// -ncludes basic user friendly  validation and UI routing
// Security note (real systems):
// - Real banking apps use secure backend APIs, MFA, encryption, fraud checks,
//   rate-limits, audit logs, and never store sensitive data in localStorage.



   // DATA + PERSISTENCE

const STORAGE_KEY = "mb_prototype_state_v2";

const DEMO_USER = {
  email: "demo@mobilebank.test",
  password: "Demo1234",
  profile: {
    fullName: "Rania Fadiel",
    phone: "+44 7700 900000",
    address: "London, United Kingdom",
  },
};

const initialState = () => ({
  // Session state for prototype authentication
  session: { isAuthed: false, email: "" },

  // User profile details (editable)
  profile: { ...DEMO_USER.profile },

  // Accounts (mock data)
  accounts: [
    { id: "acc-001", name: "Everyday Current", number: "••• 1024", balance: 1280.55, currency: "GBP" },
    { id: "acc-002", name: "Savings",          number: "••• 7788", balance: 4120.0,  currency: "GBP" },
  ],

  // Card management (prototype toggle)
  card: { frozen: false },

  // Transaction list (mock data)
  transactions: [
    { id: "tx-1001", date: "2026-01-28", type: "salary",   title: "Salary",            note: "Monthly pay",  amount: +2100.0 },
    { id: "tx-1002", date: "2026-01-29", type: "card",     title: "Tesco",             note: "Groceries",    amount: -32.45 },
    { id: "tx-1003", date: "2026-01-29", type: "card",     title: "TfL",               note: "Transport",    amount: -4.8 },
    { id: "tx-1004", date: "2026-01-30", type: "transfer", title: "Transfer to Sarah", note: "Dinner split", amount: -18.0 },
    { id: "tx-1005", date: "2026-01-31", type: "card",     title: "Amazon",            note: "Order",        amount: -24.99 },
    { id: "tx-1006", date: "2026-01-31", type: "card",     title: "Boots",             note: "Pharmacy",     amount: -9.5 },
    { id: "tx-1007", date: "2026-02-01", type: "card",     title: "Costa",             note: "Coffee",       amount: -3.65 },
    { id: "tx-1008", date: "2026-02-01", type: "transfer", title: "Transfer from Mom", note: "Support",      amount: +50.0 },
    { id: "tx-1009", date: "2026-02-01", type: "card",     title: "ASOS",              note: "Clothing",     amount: -45.0 },
    { id: "tx-1010", date: "2026-02-02", type: "card",     title: "Uber",              note: "Ride",         amount: -11.2 },
  ],
});

/**
 * Loads app state from localStorage if available.
 * Falls back to initialState if storage is empty/corrupt.
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();

    const parsed = JSON.parse(raw);

    // minimal shape validation (avoid runtime crashes)
    if (!parsed?.session || !parsed?.profile || !parsed?.accounts) {
      return initialState();
    }

    return parsed;
  } catch {
    return initialState();
  }
}

/**
 * Persists current in-memory state to localStorage.
 */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();


   // UTILITIES
   

/** Format number as GBP currency string (prototype formatting). */
const gbp = (n) => {
  const sign = n < 0 ? "-" : "";
  const val = Math.abs(Number(n) || 0);
  return `${sign}£${val.toFixed(2)}`;
};

/** Simple unique id generator for new transactions (prototype only). */
const uid = () => "tx-" + Math.random().toString(16).slice(2, 10);

function byId(id) {
  return document.getElementById(id);
}

/** Toggle a node visibility using the `.hidden` utility class. */
function setVisible(el, visible) {
  if (!el) return;
  el.classList.toggle("hidden", !visible);
}

/** Show/hide inline UI messages (errors, confirmations). */
function showMsg(el, msg) {
  if (!el) return;
  el.textContent = msg;
  setVisible(el, true);
}
function hideMsg(el) {
  if (!el) return;
  el.textContent = "";
  setVisible(el, false);
}

/** Transfer form helpers for UK-style input validation. */
function normalizeSortCode(v) {
  const digits = (v || "").replace(/\D/g, "").slice(0, 6);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)].filter(Boolean);
  return parts.join("-");
}
function isValidSortCode(v) {
  return /^\d{2}-\d{2}-\d{2}$/.test(v);
}
function isValidAccountNumber(v) {
  return /^\d{8}$/.test((v || "").replace(/\D/g, ""));
}

/** Greeting shown in the top bar. */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* =========================
   3) DOM REFERENCES
   ========================= */

// Authentication vs App shell
const authView = byId("authView");
const appView = byId("appView");
const topbar = byId("topbar");

// Auth form
const loginForm = byId("loginForm");
const authError = byId("authError");

// Top bar UI
const greetingText = byId("greetingText");
const userName = byId("userName");
const avatarCircle = byId("avatarCircle");

// Card visual (dashboard)
const cardHolderName = byId("cardHolderName");
const cardExpiry = byId("cardExpiry");
const cardLast4 = byId("cardLast4");

// Home stats
const incomeTotal = byId("incomeTotal");
const spendTotal = byId("spendTotal");
const incomeHint = byId("incomeHint");
const spendHint = byId("spendHint");

// Home actions
const viewAllTx = byId("viewAllTx");
const qaSend = byId("qaSend");
const qaRequest = byId("qaRequest");
const qaTopUp = byId("qaTopUp");
const qaScan = byId("qaScan");

// Session indicators / logout
const sessionUser = byId("sessionUser");
const logoutBtn = byId("logoutBtn");

// Routing (single page app sections)
const navButtons = Array.from(document.querySelectorAll(".nav-item"));
const routes = Array.from(document.querySelectorAll(".route"));

// Dashboard / Home
const accountsList = byId("accountsList"); // optional (kept for extensibility)
const recentTransactions = byId("recentTransactions");
const totalBalance = byId("totalBalance");

// Analytics / Transactions
const txList = byId("txList");
const txSearch = byId("txSearch");
const txType = byId("txType");
const spendSummary = byId("spendSummary");

// Transfer form
const transferForm = byId("transferForm");
const fromAccount = byId("fromAccount");
const recipientName = byId("recipientName");
const sortCode = byId("sortCode");
const accountNumber = byId("accountNumber");
const amount = byId("amount");
const reference = byId("reference");
const transferMsg = byId("transferMsg");
const transferErr = byId("transferErr");

// Transfer confirmation box (optional section)
const confirmBox = byId("transferConfirm");
const confirmAmount = byId("confirmAmount");
const confirmRecipient = byId("confirmRecipient");
const confirmDoneBtn = byId("confirmDoneBtn");

// Cards
const freezeToggle = byId("freezeToggle");
const freezeState = byId("freezeState");

// Profile
const profileForm = byId("profileForm");
const fullName = byId("fullName");
const phone = byId("phone");
const address = byId("address");
const profileMsg = byId("profileMsg");

// Popover references (kept to show “profile summary” if used)
const profilePopover = byId("profilePopover");
const popAvatar = byId("popAvatar");
const popName = byId("popName");
const popEmail = byId("popEmail");
const popPhone = byId("popPhone");
const popAddress = byId("popAddress");
const popCardStatus = byId("popCardStatus");
const popSession = byId("popSession");
const popGoProfile = byId("popGoProfile");
const popLogout = byId("popLogout");

/* =========================
   4) ROUTING (SPA SECTIONS)
   ========================= */

/**
 * Shows one route section and updates nav active state.
 * Routes are HTML sections with ids like: route-dashboard, route-transfer, etc.
 */
function setRoute(route) {
  routes.forEach((r) => setVisible(r, r.id === `route-${route}`));
  navButtons.forEach((b) => b.classList.toggle("active", b.dataset.route === route));
}

/* =========================
   5) RENDERING (UI UPDATES)
   ========================= */

/**
 * Main render: controls auth/app visibility and refreshes each feature section.
 * Called after login, logout, transfer, profile save, etc.
 */
function render() {
  const authed = state.session.isAuthed;

  // Main shell visibility
  setVisible(authView, !authed);
  setVisible(appView, authed);
  setVisible(topbar, authed);

  // Session text in the profile route
  if (sessionUser) {
    setVisible(sessionUser, authed);
    if (authed) sessionUser.textContent = state.session.email;
  }
  if (logoutBtn) setVisible(logoutBtn, authed);

  // Stop here if not authenticated
  if (!authed) return;

  // Top bar
  if (greetingText) greetingText.textContent = getGreeting();
  if (userName) userName.textContent = (state.profile.fullName || "User").split(" ")[0];
  if (avatarCircle) avatarCircle.textContent = (state.profile.fullName || "U").trim().slice(0, 1).toUpperCase();

  // Dashboard card visual (static expiry/last4 for prototype)
  if (cardHolderName) cardHolderName.textContent = (state.profile.fullName || "USER").toUpperCase();
  if (cardExpiry) cardExpiry.textContent = "12/28";
  if (cardLast4) cardLast4.textContent = "5678";

  // Feature sections
  renderDashboard();
  renderTransactions();
  renderTransfer();
  renderCards();
  renderProfile();
  renderPopover();
}

/* ---------- 5A) DASHBOARD (HOME) ---------- */
function renderDashboard() {
  // Total balance across accounts
  const total = state.accounts.reduce((sum, a) => sum + a.balance, 0);
  if (totalBalance) totalBalance.textContent = gbp(total);

  // Optional accounts list (not shown by default)
  if (accountsList) {
    accountsList.innerHTML = "";
    state.accounts.forEach((a) => {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <div class="meta">
          <div class="title">${a.name}</div>
          <div class="sub">${a.number}</div>
        </div>
        <div class="amt">${gbp(a.balance)}</div>
      `;
      accountsList.appendChild(el);
    });
  }

  // Recent 5 transactions
  if (recentTransactions) {
    recentTransactions.innerHTML = "";
    state.transactions
      .slice()
      .sort((x, y) => (y.date + y.id).localeCompare(x.date + x.id))
      .slice(0, 5)
      .forEach((tx) => recentTransactions.appendChild(txRow(tx)));
  }

  // Income & spending totals (simple prototype calculation)
  const income = state.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const spending = state.transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  if (incomeTotal) incomeTotal.textContent = gbp(income);
  if (spendTotal) spendTotal.textContent = gbp(spending);

  // Static hints (prototype placeholder)
  if (incomeHint) incomeHint.textContent = "+12.5% from last month";
  if (spendHint) spendHint.textContent = "-8.2% from last month";
}

/** Creates a single transaction row element. */
function txRow(tx) {
  const el = document.createElement("div");
  el.className = "item";

  const cls = tx.amount < 0 ? "out" : "in";
  el.innerHTML = `
    <div class="meta">
      <div class="title">${tx.title}</div>
      <div class="sub">${tx.date} • ${tx.type}${tx.note ? " • " + tx.note : ""}</div>
    </div>
    <div class="amt ${cls}">${gbp(tx.amount)}</div>
  `;
  return el;
}

/* ---------- 5B) ANALYTICS / TRANSACTIONS ---------- */
function renderTransactions() {
  if (!txList || !txSearch || !txType) return;

  const q = (txSearch.value || "").trim().toLowerCase();
  const type = txType.value;

  // Filter + sort transactions based on the UI controls
  const filtered = state.transactions
    .slice()
    .sort((x, y) => (y.date + y.id).localeCompare(x.date + x.id))
    .filter((tx) => {
      const matchesType = type === "all" ? true : tx.type === type;
      const blob = `${tx.title} ${tx.note || ""} ${tx.type}`.toLowerCase();
      const matchesQuery = q ? blob.includes(q) : true;
      return matchesType && matchesQuery;
    });

  // Render list
  txList.innerHTML = "";
  filtered.forEach((tx) => txList.appendChild(txRow(tx)));

  // Spending summary: outgoing totals by transaction type
  if (!spendSummary) return;

  const out = filtered.filter((tx) => tx.amount < 0);
  const sums = out.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + Math.abs(tx.amount);
    return acc;
  }, {});

  spendSummary.innerHTML = "";
  Object.entries(sums)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <div class="meta">
          <div class="title">${k.toUpperCase()}</div>
          <div class="sub">Outgoing total</div>
        </div>
        <div class="amt">${gbp(v)}</div>
      `;
      spendSummary.appendChild(el);
    });

  if (!Object.keys(sums).length) {
    const el = document.createElement("div");
    el.className = "muted small";
    el.textContent = "No outgoing transactions match your current filters.";
    spendSummary.appendChild(el);
  }
}

/* ---------- 5C) TRANSFER ---------- */
function renderTransfer() {
  if (!fromAccount || !sortCode) return;

  // Populate "From account" dropdown
  fromAccount.innerHTML = "";
  state.accounts.forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = `${a.name} (${a.number}) • ${gbp(a.balance)}`;
    fromAccount.appendChild(opt);
  });

  // Keep sort code formatting consistent as user types
  sortCode.value = normalizeSortCode(sortCode.value);
}

/* ---------- 5D) CARDS ---------- */
function renderCards() {
  if (!freezeToggle || !freezeState) return;
  freezeToggle.checked = !!state.card.frozen;
  freezeState.textContent = state.card.frozen ? "Card is FROZEN" : "Card is ACTIVE";
}

/* ---------- 5E) PROFILE ---------- */
function renderProfile() {
  if (!fullName || !phone || !address) return;
  fullName.value = state.profile.fullName || "";
  phone.value = state.profile.phone || "";
  address.value = state.profile.address || "";
}

/* ---------- 5F) POPOVER (optional UI) ---------- */
function renderPopover() {
  // This is safe even if popover is hidden/not used.
  const name = (state.profile?.fullName || "User").trim();
  const initial = name ? name[0].toUpperCase() : "U";

  if (popAvatar) popAvatar.textContent = initial;
  if (popName) popName.textContent = name || "User";
  if (popEmail) popEmail.textContent = state.session?.email || "—";
  if (popPhone) popPhone.textContent = state.profile?.phone || "—";
  if (popAddress) popAddress.textContent = state.profile?.address || "—";
  if (popCardStatus) popCardStatus.textContent = state.card?.frozen ? "FROZEN" : "ACTIVE";
  if (popSession) popSession.textContent = state.session?.isAuthed ? "Signed in" : "Signed out";
}

function openPopover() {
  if (!profilePopover) return;
  renderPopover();
  setVisible(profilePopover, true);
  profilePopover.setAttribute("aria-hidden", "false");
}

function closePopover() {
  if (!profilePopover) return;
  setVisible(profilePopover, false);
  profilePopover.setAttribute("aria-hidden", "true");
}

/* =========================
   6) EVENT HANDLERS (UI)
   ========================= */

/* --- Auth (Login) --- */
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideMsg(authError);

    const email = (byId("email")?.value || "").trim().toLowerCase();
    const password = byId("password")?.value || "";

    // Prototype auth check against DEMO_USER
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      state.session.isAuthed = true;
      state.session.email = email;
      saveState();
      render();
      setRoute("dashboard");
    } else {
      showMsg(authError, "Invalid credentials. Use demo@mobilebank.test / Demo1234");
    }
  });
}

/* --- Topbar avatar (R icon) --- */
// Behaviour requested: clicking avatar goes directly to Profile route ("more")
if (avatarCircle) {
  avatarCircle.style.cursor = "pointer";
  avatarCircle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.session?.isAuthed) return;
    setRoute("more");
  });
}

/* --- Popover behaviour (optional) --- */
if (profilePopover) {
  profilePopover.addEventListener("click", (e) => {
    if (e.target === profilePopover) closePopover();
  });
}

if (popGoProfile) {
  popGoProfile.addEventListener("click", (e) => {
    e.preventDefault();
    closePopover();
    setRoute("more");
  });
}

if (popLogout) {
  popLogout.addEventListener("click", () => {
    closePopover();
    state.session.isAuthed = false;
    state.session.email = "";
    saveState();
    render();
    setRoute("dashboard");
  });
}

/* --- Logout button on Profile page --- */
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    state.session.isAuthed = false;
    state.session.email = "";
    saveState();
    render();
    setRoute("dashboard");
  });
}

/* --- Bottom navigation --- */
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => setRoute(btn.dataset.route));
});

/* --- Analytics controls --- */
if (txSearch) txSearch.addEventListener("input", renderTransactions);
if (txType) txType.addEventListener("change", renderTransactions);

/* --- Transfer input formatting (Sort code) --- */
if (sortCode) {
  sortCode.addEventListener("input", () => {
    sortCode.value = normalizeSortCode(sortCode.value);
  });
}

/* --- Transfer submit --- */
if (transferForm) {
  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideMsg(transferMsg);
    hideMsg(transferErr);

    const fromId = fromAccount?.value || "";
    const name = recipientName?.value?.trim() || "";
    const sc = normalizeSortCode(sortCode?.value || "");
    const accNo = (accountNumber?.value || "").replace(/\D/g, "");
    const amt = Number(amount?.value);
    const ref = reference?.value?.trim() || "";

    // Validation (client-side only)
    if (!name) return showMsg(transferErr, "Recipient name is required.");
    if (!isValidSortCode(sc)) return showMsg(transferErr, "Sort code must be in format 12-34-56.");
    if (!isValidAccountNumber(accNo)) return showMsg(transferErr, "Account number must be 8 digits.");
    if (!Number.isFinite(amt) || amt <= 0) return showMsg(transferErr, "Enter a valid amount.");

    const account = state.accounts.find((a) => a.id === fromId);
    if (!account) return showMsg(transferErr, "Invalid source account.");
    if (account.balance < amt) return showMsg(transferErr, "Insufficient funds (prototype check).");

    // State update: deduct funds + add a new transaction record
    account.balance = Number((account.balance - amt).toFixed(2));
    state.transactions.push({
      id: uid(),
      date: new Date().toISOString().slice(0, 10),
      type: "transfer",
      title: `Transfer to ${name}`,
      note: ref ? `Ref: ${ref}` : `Sort: ${sc}, Acc: ${accNo}`,
      amount: -amt,
    });

    saveState();

    // Optional confirmation screen (if present in HTML)
    if (confirmBox && confirmAmount && confirmRecipient) {
      confirmAmount.textContent = `£${amt.toFixed(2)}`;
      confirmRecipient.textContent = name;

      setVisible(transferForm.closest(".transfer-card"), false);
      setVisible(confirmBox, true);
    }

    transferForm.reset();
    if (sortCode) sortCode.value = "";
    render();
    setRoute("dashboard");
  });
}

/* --- Transfer confirmation “Done” button --- */
if (confirmDoneBtn) {
  confirmDoneBtn.addEventListener("click", () => {
    setVisible(confirmBox, false);
    setVisible(document.querySelector(".transfer-card"), true);
    setRoute("dashboard");
  });
}

/* --- Card freeze toggle --- */
if (freezeToggle) {
  freezeToggle.addEventListener("change", () => {
    state.card.frozen = freezeToggle.checked;
    saveState();
    renderCards();
  });
}

/* --- Profile save --- */
if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    state.profile.fullName = fullName.value.trim();
    state.profile.phone = phone.value.trim();
    state.profile.address = address.value.trim();
    saveState();
    showMsg(profileMsg, "Profile saved (prototype).");
    render();
  });
}

/* --- Dashboard shortcuts --- */
if (viewAllTx) viewAllTx.addEventListener("click", () => setRoute("analytics"));
if (qaSend)     qaSend.addEventListener("click", () => setRoute("transfer"));
if (qaRequest)  qaRequest.addEventListener("click", () => setRoute("transfer"));
if (qaTopUp)    qaTopUp.addEventListener("click", () => setRoute("transfer"));
if (qaScan)     qaScan.addEventListener("click", () => alert("Scan is a prototype placeholder."));

/* =========================
   7) APP STARTUP
   ========================= */

// Initial paint, then default route
render();
setRoute("dashboard");
