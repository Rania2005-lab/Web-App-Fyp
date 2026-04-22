// // MobileBank Prototype
// // Client-side demo only: login, dashboard, transfers, analytics,
// // card freeze, profile, safety insights, and savings suggestions.

// MobileBank Prototype
// Client-side demo only: login, dashboard, transfers, analytics,
// card freeze, profile, safety insights, savings suggestions,
// top-up cards, and scan bill prototype.

// MobileBank Prototype
// Client-side demo only: login, dashboard, transfers, analytics,
// card freeze, profile, safety insights, savings suggestions,
// top-up cards, and scan bill prototype.

const STORAGE_KEY = "mb_prototype_state_v2";

const DEMO_USER = {
  email: "demo@mobilebank.test",
  password: "Demo1234",
  profile: {
    fullName: "Rania Fadiel",
    phone: "+44 7700 900000",
    address: "London, United Kingdom",
    occupancy: "Student",
    dob: "1960-05-14",
    trustedContact: "Sarah Daughter",
    contactMethod: "WhatsApp",
  },
};

const initialState = () => ({
  session: { isAuthed: false, email: "" },

  profile: { ...DEMO_USER.profile },

  accounts: [
    { id: "acc-001", name: "Everyday Current", number: "••• 1024", balance: 1280.55, currency: "GBP" },
    { id: "acc-002", name: "Savings", number: "••• 7788", balance: 4120.0, currency: "GBP" },
  ],

  topUpCards: [
    { id: "tesco", name: "Tesco", tag: "Clubcard", icon: "🛒", brand: "brand-tesco", points: 1248, mode: "points" },
    { id: "nectar", name: "Sainsbury's", tag: "Nectar", icon: "🍇", brand: "brand-nectar", points: 3420, mode: "points" },
    { id: "oyster", name: "Oyster", tag: "TfL Travel", icon: "🚇", brand: "brand-oyster", balance: 8.5, mode: "balance" },
    { id: "boots", name: "Boots", tag: "Advantage Card", icon: "💊", brand: "brand-boots", points: 875, mode: "points" },
    { id: "costa", name: "Costa Coffee", tag: "Costa Club", icon: "☕", brand: "brand-costa", points: 6, mode: "beans" },
    { id: "superdrug", name: "Superdrug", tag: "Health & Beautycard", icon: "💄", brand: "brand-superdrug", points: 540, mode: "points" },
  ],

  card: { frozen: false },
  safetyCallLogs: [],
  autoSaveEnabled: false,
  billsProtectionAmount: 800,

  transactions: [
    { id: "tx-1001", date: "2026-01-28", type: "salary", title: "Salary", note: "Monthly pay", amount: 2100.0 },
    { id: "tx-1002", date: "2026-01-29", type: "card", title: "Tesco", note: "Groceries", amount: -32.45 },
    { id: "tx-1003", date: "2026-01-29", type: "card", title: "TfL", note: "Transport", amount: -4.8 },
    { id: "tx-1004", date: "2026-01-30", type: "transfer", title: "Transfer to Sarah", note: "Dinner split", amount: -18.0 },
    { id: "tx-1005", date: "2026-01-31", type: "card", title: "Amazon", note: "Order", amount: -24.99 },
    { id: "tx-1006", date: "2026-01-31", type: "card", title: "Boots", note: "Pharmacy", amount: -9.5 },
    { id: "tx-1007", date: "2026-02-01", type: "card", title: "Costa", note: "Coffee", amount: -3.65 },
    { id: "tx-1008", date: "2026-02-01", type: "transfer", title: "Transfer from Mom", note: "Support", amount: 50.0 },
    { id: "tx-1009", date: "2026-02-01", type: "card", title: "ASOS", note: "Clothing", amount: -45.0 },
    { id: "tx-1010", date: "2026-02-02", type: "card", title: "Uber", note: "Ride", amount: -11.2 },
  ],
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();

    const parsed = JSON.parse(raw);

    if (!parsed?.session || !parsed?.profile || !parsed?.accounts || !parsed?.transactions) {
      return initialState();
    }

    if (!parsed.topUpCards) parsed.topUpCards = initialState().topUpCards;
    if (!parsed.safetyCallLogs) parsed.safetyCallLogs = [];
    if (typeof parsed.autoSaveEnabled !== "boolean") parsed.autoSaveEnabled = false;
    if (typeof parsed.billsProtectionAmount !== "number") parsed.billsProtectionAmount = 800;

    return parsed;
  } catch {
    return initialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

/* =========================
   UTILITIES
   ========================= */

const gbp = (n) => {
  const sign = n < 0 ? "-" : "";
  const val = Math.abs(Number(n) || 0);
  return `${sign}£${val.toFixed(2)}`;
};

const uid = () => "tx-" + Math.random().toString(16).slice(2, 10);

function byId(id) {
  return document.getElementById(id);
}

function setVisible(el, visible) {
  if (!el) return;
  el.classList.toggle("hidden", !visible);
}

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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getCurrentAccount() {
  return state.accounts.find((a) => a.id === "acc-001") || state.accounts[0] || null;
}

function getSavingsAccount() {
  return state.accounts.find((a) => a.id === "acc-002") || state.accounts[1] || null;
}

function addSafetyCallLog(title, method = "WhatsApp call", status = "Connected") {
  if (!state.safetyCallLogs) state.safetyCallLogs = [];

  state.safetyCallLogs.push({
    title,
    method,
    status,
    time: new Date().toLocaleString(),
  });

  saveState();
}

/* =========================
   DOM REFERENCES
   ========================= */

const authView = byId("authView");
const appView = byId("appView");
const topbar = byId("topbar");

const loginForm = byId("loginForm");
const authError = byId("authError");

const greetingText = byId("greetingText");
const userName = byId("userName");
const avatarCircle = byId("avatarCircle");

const cardHolderName = byId("cardHolderName");
const cardExpiry = byId("cardExpiry");
const cardLast4 = byId("cardLast4");

const incomeTotal = byId("incomeTotal");
const spendTotal = byId("spendTotal");
const incomeHint = byId("incomeHint");
const spendHint = byId("spendHint");

const viewAllTx = byId("viewAllTx");
const qaSend = byId("qaSend");
const qaRequest = byId("qaRequest");
const qaTopUp = byId("qaTopUp");
const qaScan = byId("qaScan");

const sessionUser = byId("sessionUser");
const logoutBtn = byId("logoutBtn");

const navButtons = Array.from(document.querySelectorAll(".nav-item"));
const routes = Array.from(document.querySelectorAll(".route"));

const accountsList = byId("accountsList");
const recentTransactions = byId("recentTransactions");
const totalBalance = byId("totalBalance");

const txList = byId("txList");
const txSearch = byId("txSearch");
const txType = byId("txType");
const spendSummary = byId("spendSummary");

const transferForm = byId("transferForm");
const fromAccount = byId("fromAccount");
const recipientName = byId("recipientName");
const sortCode = byId("sortCode");
const accountNumber = byId("accountNumber");
const amount = byId("amount");
const reference = byId("reference");
const transferMsg = byId("transferMsg");
const transferErr = byId("transferErr");

const confirmBox = byId("transferConfirm");
const confirmAmount = byId("confirmAmount");
const confirmRecipient = byId("confirmRecipient");
const confirmDoneBtn = byId("confirmDoneBtn");

const freezeToggle = byId("freezeToggle");
const freezeState = byId("freezeState");

const profileForm = byId("profileForm");
const fullName = byId("fullName");
const phone = byId("phone");
const address = byId("address");
const profileMsg = byId("profileMsg");
const occupancy = byId("occupancy");
const dob = byId("dob");
const trustedContact = byId("trustedContact");
const contactMethod = byId("contactMethod");

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

const safetyAlerts = byId("safetyAlerts");
const safetyMsg = byId("safetyMsg");
const callLogSection = byId("callLogSection");
const callLogList = byId("callLogList");
const aiSafetyBtn = byId("aiSafetyBtn");
const callSarahBtn = byId("callSarahBtn");

const savingsSuggestions = byId("savingsSuggestions");
const totalSavedValue = byId("totalSavedValue");
const couldSaveValue = byId("couldSaveValue");
const savingsMsg = byId("savingsMsg");
const safeToSpendCard = byId("safeToSpendCard");

const topUpCardsList = byId("topUpCardsList");
const topUpMsg = byId("topUpMsg");

/* ---------- SCAN MODAL DOM ---------- */
const scanModal = byId("scanModal");
const scanCloseBtn = byId("scanCloseBtn");
const simulateScanBtn = byId("simulateScanBtn");
const payNowBtn = byId("payNowBtn");
const rescanBtn = byId("rescanBtn");
const scanStep1 = byId("scanStep1");
const scanStep2 = byId("scanStep2");
const billCompanyEl = byId("billCompany");
const billAmountEl = byId("billAmount");
const billRefEl = byId("billRef");
const payStatusEl = byId("payStatus");

/* =========================
   ROUTING
   ========================= */

function setRoute(route) {
  routes.forEach((r) => setVisible(r, r.id === `route-${route}`));
  navButtons.forEach((b) => b.classList.toggle("active", b.dataset.route === route));
}

/* =========================
   SCAN BILL / INVOICE
   ========================= */

const FAKE_BILLS = [
  { company: "British Gas", amount: 78.4, ref: "BG-2026-0412" },
  { company: "Thames Water", amount: 42.15, ref: "TW-9823-AA" },
  { company: "EE Mobile", amount: 25.0, ref: "EE-MOB-7711" },
  { company: "Octopus Energy", amount: 96.3, ref: "OE-INV-5520" },
  { company: "Council Tax", amount: 142.0, ref: "LBC-2026-04" },
];

let currentBill = null;

function openScanModal() {
  if (!scanModal) return;
  resetScanModal();
  scanModal.hidden = false;
  scanModal.setAttribute("aria-hidden", "false");
}

function closeScanModal() {
  if (!scanModal) return;
  scanModal.hidden = true;
  scanModal.setAttribute("aria-hidden", "true");
}

function resetScanModal() {
  if (scanStep1) scanStep1.hidden = false;
  if (scanStep2) scanStep2.hidden = true;

  if (payStatusEl) {
    payStatusEl.hidden = true;
    payStatusEl.textContent = "";
    payStatusEl.className = "pay-status";
  }

  if (payNowBtn) payNowBtn.disabled = false;

  currentBill = null;
}

function simulateScan() {
  if (!simulateScanBtn) return;

  simulateScanBtn.disabled = true;
  simulateScanBtn.textContent = "Scanning...";

  setTimeout(() => {
    currentBill = FAKE_BILLS[Math.floor(Math.random() * FAKE_BILLS.length)];

    if (billCompanyEl) billCompanyEl.textContent = currentBill.company;
    if (billAmountEl) billAmountEl.textContent = "£" + currentBill.amount.toFixed(2);
    if (billRefEl) billRefEl.textContent = currentBill.ref;

    if (scanStep1) scanStep1.hidden = true;
    if (scanStep2) scanStep2.hidden = false;

    simulateScanBtn.disabled = false;
    simulateScanBtn.textContent = "Scan now";
  }, 1600);
}

function showPayStatus(msg, type) {
  if (!payStatusEl) return;
  payStatusEl.hidden = false;
  payStatusEl.textContent = msg;
  payStatusEl.className = `pay-status ${type}`;
}

function payBill() {
  if (!currentBill) return;

  const account = getCurrentAccount();
  if (!account) {
    showPayStatus("No account found.", "error");
    return;
  }

  if (account.balance < currentBill.amount) {
    showPayStatus("Insufficient balance to pay this bill.", "error");
    return;
  }

  account.balance = Number((account.balance - currentBill.amount).toFixed(2));

  state.transactions.unshift({
    id: uid(),
    date: new Date().toISOString().slice(0, 10),
    type: "bill",
    title: currentBill.company,
    note: `Bill payment • Ref: ${currentBill.ref}`,
    amount: -currentBill.amount,
  });

  saveState();
  render();

  showPayStatus(`✓ Paid £${currentBill.amount.toFixed(2)} to ${currentBill.company}`, "success");

  if (payNowBtn) payNowBtn.disabled = true;

  setTimeout(() => {
    closeScanModal();
    setRoute("dashboard");
  }, 1800);
}

/* =========================
   RENDERING
   ========================= */

function render() {
  const authed = state.session.isAuthed;

  setVisible(authView, !authed);
  setVisible(appView, authed);
  setVisible(topbar, authed);

  if (sessionUser) {
    setVisible(sessionUser, authed);
    if (authed) sessionUser.textContent = state.session.email;
  }

  if (logoutBtn) setVisible(logoutBtn, authed);

  if (!authed) return;

  if (greetingText) greetingText.textContent = getGreeting();
  if (userName) userName.textContent = (state.profile.fullName || "User").split(" ")[0];
  if (avatarCircle) avatarCircle.textContent = (state.profile.fullName || "U").trim().slice(0, 1).toUpperCase();

  if (cardHolderName) cardHolderName.textContent = (state.profile.fullName || "USER").toUpperCase();
  if (cardExpiry) cardExpiry.textContent = "12/28";
  if (cardLast4) cardLast4.textContent = "5678";

  renderDashboard();
  renderTransactions();
  renderTransfer();
  renderCards();
  renderProfile();
  renderPopover();
  renderSafety();
  renderSavings();
  renderTopUpCards();
}

/* ---------- DASHBOARD ---------- */
function renderDashboard() {
  const total = state.accounts.reduce((sum, a) => sum + a.balance, 0);
  if (totalBalance) totalBalance.textContent = gbp(total);

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

  if (recentTransactions) {
    recentTransactions.innerHTML = "";
    state.transactions
      .slice()
      .sort((x, y) => (y.date + y.id).localeCompare(x.date + x.id))
      .slice(0, 5)
      .forEach((tx) => recentTransactions.appendChild(txRow(tx)));
  }

  const income = state.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const spending = state.transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  if (incomeTotal) incomeTotal.textContent = gbp(income);
  if (spendTotal) spendTotal.textContent = gbp(spending);

  if (incomeHint) incomeHint.textContent = "+12.5% from last month";
  if (spendHint) spendHint.textContent = "-8.2% from last month";
}

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

/* ---------- ANALYTICS ---------- */
function renderTransactions() {
  if (!txList || !txSearch || !txType) return;

  const q = (txSearch.value || "").trim().toLowerCase();
  const type = txType.value;

  const filtered = state.transactions
    .slice()
    .sort((x, y) => (y.date + y.id).localeCompare(x.date + x.id))
    .filter((tx) => {
      const matchesType = type === "all" ? true : tx.type === type;
      const blob = `${tx.title} ${tx.note || ""} ${tx.type}`.toLowerCase();
      const matchesQuery = q ? blob.includes(q) : true;
      return matchesType && matchesQuery;
    });

  txList.innerHTML = "";
  filtered.forEach((tx) => txList.appendChild(txRow(tx)));

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

/* ---------- TRANSFER ---------- */
function renderTransfer() {
  if (!fromAccount || !sortCode) return;

  fromAccount.innerHTML = "";
  state.accounts.forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = `${a.name} (${a.number}) • ${gbp(a.balance)}`;
    fromAccount.appendChild(opt);
  });

  sortCode.value = normalizeSortCode(sortCode.value);
}

/* ---------- CARDS ---------- */
function renderCards() {
  if (!freezeToggle || !freezeState) return;
  freezeToggle.checked = !!state.card.frozen;
  freezeState.textContent = state.card.frozen ? "Card is FROZEN" : "Card is ACTIVE";
}

/* ---------- PROFILE ---------- */
function renderProfile() {
  if (!fullName || !phone || !address) return;

  fullName.value = state.profile.fullName || "";
  phone.value = state.profile.phone || "";
  address.value = state.profile.address || "";

  if (occupancy) occupancy.value = state.profile.occupancy || "";
  if (dob) dob.value = state.profile.dob || "";
  if (trustedContact) trustedContact.value = state.profile.trustedContact || "";
  if (contactMethod) contactMethod.value = state.profile.contactMethod || "Phone";
}

/* ---------- POPOVER ---------- */
function renderPopover() {
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

/* ---------- SAFETY ---------- */
function renderSafety() {
  if (!safetyAlerts) return;

  safetyAlerts.innerHTML = "";

  const sorted = state.transactions
    .slice()
    .sort((x, y) => (y.date + y.id).localeCompare(x.date + x.id));

  const suspicious = sorted.filter((tx) => tx.amount < -100);
  const normal = sorted.filter((tx) => tx.amount < 0 && tx.amount >= -100).slice(0, 1);

  if (callLogList && callLogSection) {
    const logs = state.safetyCallLogs || [];
    callLogList.innerHTML = "";

    if (logs.length) {
      setVisible(callLogSection, true);
      logs
        .slice()
        .reverse()
        .forEach((log) => {
          const el = document.createElement("div");
          el.className = "item";
          el.innerHTML = `
            <div class="meta">
              <div class="title">📞 ${log.title}</div>
              <div class="sub">${log.time} • ${log.method}</div>
            </div>
            <div class="amt in">${log.status}</div>
          `;
          callLogList.appendChild(el);
        });
    } else {
      setVisible(callLogSection, false);
    }
  }

  if (!suspicious.length && !normal.length) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "No recent alerts. Your recent activity looks normal.";
    safetyAlerts.appendChild(empty);
  }

  suspicious.forEach((tx, index) => {
    const el = document.createElement("div");
    el.className = "safety-card danger";
    el.innerHTML = `
      <div class="safety-card-head">
        <div>
          <div class="safety-card-title">🚨 Large Transaction Detected</div>
          <div class="safety-time">${index === 0 ? "Recent" : "Flagged"}</div>
        </div>
        <button class="close-x" type="button">×</button>
      </div>

      <p class="safety-desc">
        This payment may need checking because:
        <br>• the amount is high
        <br>• it is unusual compared with your normal spending
        <br>• it may be worth confirming before doing anything
      </p>

      <div class="amount-box">Amount: <strong>${gbp(tx.amount)}</strong></div>

      <div class="safety-actions">
        <button class="danger-btn" type="button" data-action="lock-card">Lock My Card</button>
        <button class="light-btn" type="button" data-action="confirm-safe">It Was Me</button>
      </div>

      <div class="safety-extra-actions">
        <button class="save-action-btn" type="button" data-action="trusted-contact">
          Ask Sarah to Check This
        </button>
        <button class="save-action-btn secondary-safety-btn" type="button" data-action="delay-payment">
          Wait 10 Minutes
        </button>
        <button class="save-action-btn secondary-safety-btn" type="button" data-action="voice-check">
          Read Safety Advice Out Loud
        </button>
      </div>
    `;
    safetyAlerts.appendChild(el);

    const lockBtn = el.querySelector('[data-action="lock-card"]');
    const safeBtn = el.querySelector('[data-action="confirm-safe"]');
    const trustedBtn = el.querySelector('[data-action="trusted-contact"]');
    const delayBtn = el.querySelector('[data-action="delay-payment"]');
    const voiceBtn = el.querySelector('[data-action="voice-check"]');
    const closeBtn = el.querySelector(".close-x");

    if (lockBtn) {
      lockBtn.addEventListener("click", () => {
        state.card.frozen = true;
        saveState();
        render();
        setRoute("safety");
        showMsg(safetyMsg, "Your card has been locked for safety.");
      });
    }

    if (safeBtn) {
      safeBtn.addEventListener("click", () => {
        showMsg(safetyMsg, "Marked as safe. No action is needed.");
      });
    }

    if (trustedBtn) {
      trustedBtn.addEventListener("click", () => {
        addSafetyCallLog("Calling Sarah", "WhatsApp call", "Connected");
        renderSafety();
        showMsg(safetyMsg, "Calling Sarah with WhatsApp...");
      });
    }

    if (delayBtn) {
      delayBtn.addEventListener("click", () => {
        showMsg(safetyMsg, "Okay — this payment has been paused for 10 minutes so you have time to think.");
      });
    }

    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => {
        const text =
          "Please stop and check carefully. Your bank will never ask you to move money for safety. If someone is pressuring you, do not continue. Contact someone you trust first.";
        showMsg(safetyMsg, "Safety advice has been read out loud.");
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        el.remove();
      });
    }
  });

  normal.forEach((tx) => {
    const el = document.createElement("div");
    el.className = "safety-card success";
    el.innerHTML = `
      <div class="safety-card-head">
        <div>
          <div class="safety-card-title">✅ Normal Payment Activity</div>
          <div class="safety-time">Recent</div>
        </div>
      </div>

      <p class="safety-desc">
        This payment looks normal for your account and does not currently appear risky.
      </p>

      <div class="amount-box">Amount: <strong>${gbp(tx.amount)}</strong></div>
    `;
    safetyAlerts.appendChild(el);
  });

  if (aiSafetyBtn) {
    aiSafetyBtn.onclick = () => {
      showMsg(
        safetyMsg,
        "AI Safety Assistant: This page helps you spot unusual payments, contact someone you trust, and avoid scam pressure before sending money."
      );
    };
  }
}

/* ---------- SAVINGS ---------- */
function renderSavings() {
  const current = getCurrentAccount();
  const savings = getSavingsAccount();

  const currentBalance = current ? current.balance : 0;
  const savingsBalance = savings ? savings.balance : 0;

  const outgoing = state.transactions.filter((t) => t.amount < 0);
  const totalSpent = outgoing.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const yearlyPotential = totalSpent * 0.1 * 12;

  const protectedBillsAmount = state.billsProtectionAmount ?? 800;
  const safeToSpend = Math.max(0, currentBalance - protectedBillsAmount);

  if (totalSavedValue) totalSavedValue.textContent = gbp(savingsBalance);
  if (couldSaveValue) couldSaveValue.textContent = `${gbp(yearlyPotential)}/yr`;

  if (safeToSpendCard) {
    safeToSpendCard.innerHTML = `
      <div class="suggestion-card">
        <div class="suggestion-title">💷 Safe-to-Spend This Week</div>
        <p class="suggestion-desc">
          After keeping <strong>${gbp(protectedBillsAmount)}</strong> aside for bills,
          you can safely spend about <strong>${gbp(safeToSpend)}</strong>.
        </p>
        <div class="save-badge">↗ Clear weekly spending guide</div>
      </div>
    `;
  }

  if (!savingsSuggestions) return;
  savingsSuggestions.innerHTML = "";

  const moveAmount = Math.min(500, Math.max(0, currentBalance - 200));
  const moveCard = document.createElement("div");
  moveCard.className = "suggestion-card";
  moveCard.innerHTML = `
    <div class="suggestion-title">💡 Move Idle Money to Savings</div>
    <p class="suggestion-desc">
      You currently have ${gbp(currentBalance)} in your current account.
      ${
        moveAmount >= 500
          ? `Moving £500.00 to savings could improve your money management.`
          : `You do not currently have enough spare balance to move more into savings.`
      }
    </p>
    <div class="save-badge">↗ Build savings faster</div>
    <button class="save-action-btn" type="button" id="moveSavingsBtn" ${moveAmount < 500 ? "disabled" : ""}>
      ${moveAmount >= 500 ? "Move £500.00 to Savings →" : "No spare balance available"}
    </button>
  `;
  savingsSuggestions.appendChild(moveCard);

  const autoSaveAmount = 5;
  const autoSaveCard = document.createElement("div");
  autoSaveCard.className = "suggestion-card";
  autoSaveCard.innerHTML = `
    <div class="suggestion-title">🔁 Automatic Small Savings</div>
    <p class="suggestion-desc">
      Save a small amount automatically every time you spend.
      This keeps saving simple and stress-free.
    </p>
    <div class="save-badge">↗ Save ${gbp(autoSaveAmount)} on each spend</div>
    <button class="save-action-btn" type="button" id="toggleAutoSaveBtn">
      ${state.autoSaveEnabled ? "Turn Off Auto Saving" : "Turn On Auto Saving"}
    </button>
  `;
  savingsSuggestions.appendChild(autoSaveCard);

  const billsCard = document.createElement("div");
  billsCard.className = "suggestion-card";
  billsCard.innerHTML = `
    <div class="suggestion-title">🧾 Bills Protection Mode</div>
    <p class="suggestion-desc">
      Keep <strong>${gbp(protectedBillsAmount)}</strong> untouched for important bills
      so it is easier not to overspend.
    </p>
    <div class="save-badge">↗ Protected for essentials</div>
    <button class="save-action-btn" type="button" id="billsProtectionBtn">
      Bills Protection Active
    </button>
  `;
  savingsSuggestions.appendChild(billsCard);

  const weeklyAverage = 300;
  const weeklyCheckText =
    totalSpent > weeklyAverage
      ? `You spent ${gbp(totalSpent)} recently. That is slightly higher than usual.`
      : `You spent ${gbp(totalSpent)} recently. You are staying within your usual pattern.`;

  const weeklyCard = document.createElement("div");
  weeklyCard.className = "suggestion-card";
  weeklyCard.innerHTML = `
    <div class="suggestion-title">📅 Weekly Check-in</div>
    <p class="suggestion-desc">${weeklyCheckText}</p>
    <div class="save-badge">↗ Simple spending update</div>
    <button class="save-action-btn" type="button" id="weeklyCheckBtn">
      Okay, I Understand
    </button>
  `;
  savingsSuggestions.appendChild(weeklyCard);

  const moveSavingsBtn = byId("moveSavingsBtn");
  if (moveSavingsBtn && moveAmount >= 500) {
    moveSavingsBtn.addEventListener("click", () => {
      const currentAcc = getCurrentAccount();
      const savingsAcc = getSavingsAccount();
      const amountToMove = 500;

      if (!currentAcc || !savingsAcc) return;
      if (currentAcc.balance < amountToMove + 200) return;

      currentAcc.balance = Number((currentAcc.balance - amountToMove).toFixed(2));
      savingsAcc.balance = Number((savingsAcc.balance + amountToMove).toFixed(2));

      saveState();
      render();
      setRoute("savings");
      showMsg(savingsMsg, "£500.00 has been successfully added to your savings account.");
    });
  }

  const toggleAutoSaveBtn = byId("toggleAutoSaveBtn");
  if (toggleAutoSaveBtn) {
    toggleAutoSaveBtn.addEventListener("click", () => {
      state.autoSaveEnabled = !state.autoSaveEnabled;
      saveState();
      renderSavings();
      showMsg(
        savingsMsg,
        state.autoSaveEnabled
          ? "Automatic saving is now on. £5.00 will be saved when you spend."
          : "Automatic saving has been turned off."
      );
    });
  }

  const billsProtectionBtn = byId("billsProtectionBtn");
  if (billsProtectionBtn) {
    billsProtectionBtn.addEventListener("click", () => {
      showMsg(savingsMsg, `Bills Protection Mode is active. ${gbp(protectedBillsAmount)} is being kept aside.`);
    });
  }

  const weeklyCheckBtn = byId("weeklyCheckBtn");
  if (weeklyCheckBtn) {
    weeklyCheckBtn.addEventListener("click", () => {
      showMsg(savingsMsg, "Weekly check-in noted.");
    });
  }
}

/* ---------- TOP UP CARDS ---------- */
function renderTopUpCards() {
  if (!topUpCardsList) return;

  if (!state.topUpCards || !state.topUpCards.length) {
    state.topUpCards = initialState().topUpCards;
    saveState();
  }

  topUpCardsList.innerHTML = "";

  let totalPts = 0;

  state.topUpCards.forEach((card) => {
    const el = document.createElement("div");
    el.className = "topup-card";
    el.dataset.card = card.id;

    let valueHtml = "";
    if (card.mode === "balance") {
      valueHtml = `
        <div class="topup-points">
          <span class="num">£${(card.balance || 0).toFixed(2)}</span>
          <span class="unit">balance</span>
        </div>
        <div class="topup-worth">Pay as you go</div>
      `;
    } else if (card.mode === "beans") {
      valueHtml = `
        <div class="topup-points">
          <span class="num">${card.points}</span>
          <span class="unit">beans</span>
        </div>
        <div class="topup-worth">Free drink at <strong>8</strong></div>
      `;
      totalPts += card.points;
    } else {
      valueHtml = `
        <div class="topup-points">
          <span class="num">${card.points.toLocaleString()}</span>
          <span class="unit">points</span>
        </div>
        <div class="topup-worth">Worth <strong>£${(card.points / 100).toFixed(2)}</strong></div>
      `;
      totalPts += card.points;
    }

    el.innerHTML = `
      <span class="glow ${card.brand}"></span>
      <div class="topup-head">
        <div class="topup-logo ${card.brand}">${card.icon}</div>
        <span class="topup-tag">${card.tag}</span>
      </div>
      <div>
        <h3 class="topup-name">${card.name}</h3>
        ${valueHtml}
      </div>
      <button class="topup-btn" type="button">+ Top up</button>
    `;

    el.querySelector(".topup-btn").addEventListener("click", () => {
      const currentAccount = getCurrentAccount();
      const cost = 10;

      if (!currentAccount || currentAccount.balance < cost) {
        showMsg(topUpMsg, "Not enough balance in your current account.");
        return;
      }

      currentAccount.balance = Number((currentAccount.balance - cost).toFixed(2));

      if (card.mode === "balance") {
        card.balance = Number(((card.balance || 0) + cost).toFixed(2));
        showMsg(topUpMsg, `£${cost.toFixed(2)} added to your ${card.name} card.`);
      } else {
        card.points = (card.points || 0) + 100;
        showMsg(topUpMsg, `100 ${card.mode} added to your ${card.name} card.`);
      }

      saveState();
      render();
      setRoute("topup");
    });

    topUpCardsList.appendChild(el);
  });

  const totalEl = byId("topupTotalPoints");
  if (totalEl) totalEl.textContent = totalPts.toLocaleString();
}

/* =========================
   EVENT HANDLERS
   ========================= */

if (callSarahBtn) {
  callSarahBtn.addEventListener("click", () => {
    addSafetyCallLog("Calling Sarah", "WhatsApp call", "Connected");
    renderSafety();
    showMsg(safetyMsg, "Calling Sarah with WhatsApp...");
  });
}

if (qaScan) qaScan.addEventListener("click", openScanModal);
if (scanCloseBtn) scanCloseBtn.addEventListener("click", closeScanModal);
if (simulateScanBtn) simulateScanBtn.addEventListener("click", simulateScan);
if (payNowBtn) payNowBtn.addEventListener("click", payBill);
if (rescanBtn) rescanBtn.addEventListener("click", resetScanModal);

if (scanModal) {
  scanModal.addEventListener("click", (e) => {
    if (e.target === scanModal) closeScanModal();
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideMsg(authError);

    const email = (byId("email")?.value || "").trim().toLowerCase();
    const password = byId("password")?.value || "";

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

if (avatarCircle) {
  avatarCircle.style.cursor = "pointer";
  avatarCircle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.session?.isAuthed) return;
    setRoute("more");
  });
}

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
    state = initialState();
    saveState();
    render();
    setRoute("dashboard");
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    state = initialState();
    saveState();
    render();
    setRoute("dashboard");
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => setRoute(btn.dataset.route));
});

if (txSearch) txSearch.addEventListener("input", renderTransactions);
if (txType) txType.addEventListener("change", renderTransactions);

if (sortCode) {
  sortCode.addEventListener("input", () => {
    sortCode.value = normalizeSortCode(sortCode.value);
  });
}

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

    if (!name) return showMsg(transferErr, "Recipient name is required.");
    if (!isValidSortCode(sc)) return showMsg(transferErr, "Sort code must be in format 12-34-56.");
    if (!isValidAccountNumber(accNo)) return showMsg(transferErr, "Account number must be 8 digits.");
    if (!Number.isFinite(amt) || amt <= 0) return showMsg(transferErr, "Enter a valid amount.");

    const account = state.accounts.find((a) => a.id === fromId);
    if (!account) return showMsg(transferErr, "Invalid source account.");
    if (account.balance < amt) return showMsg(transferErr, "Insufficient funds (prototype check).");

    account.balance = Number((account.balance - amt).toFixed(2));

    state.transactions.push({
      id: uid(),
      date: new Date().toISOString().slice(0, 10),
      type: "transfer",
      title: `Transfer to ${name}`,
      note: ref ? `Ref: ${ref}` : `Sort: ${sc}, Acc: ${accNo}`,
      amount: -amt,
    });

    if (state.autoSaveEnabled) {
      const savingsAcc = getSavingsAccount();
      const autoSaveAmount = 5;

      if (savingsAcc && account.balance >= autoSaveAmount) {
        account.balance = Number((account.balance - autoSaveAmount).toFixed(2));
        savingsAcc.balance = Number((savingsAcc.balance + autoSaveAmount).toFixed(2));
      }
    }

    saveState();

    if (confirmBox && confirmAmount && confirmRecipient) {
      confirmAmount.textContent = gbp(amt);
      confirmRecipient.textContent = name;

      const transferCard = transferForm.closest(".transfer-card");
      if (transferCard) setVisible(transferCard, false);
      setVisible(confirmBox, true);
    }

    transferForm.reset();
    if (sortCode) sortCode.value = "";

    render();
    setRoute("dashboard");
  });
}

if (confirmDoneBtn) {
  confirmDoneBtn.addEventListener("click", () => {
    setVisible(confirmBox, false);
    const transferCard = document.querySelector(".transfer-card");
    if (transferCard) setVisible(transferCard, true);
    setRoute("dashboard");
  });
}

if (freezeToggle) {
  freezeToggle.addEventListener("change", () => {
    state.card.frozen = freezeToggle.checked;
    saveState();
    renderCards();
    renderPopover();
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    state.profile.fullName = fullName.value.trim();
    state.profile.phone = phone.value.trim();
    state.profile.address = address.value.trim();
    state.profile.occupancy = occupancy ? occupancy.value.trim() : "";
    state.profile.dob = dob ? dob.value : "";
    state.profile.trustedContact = trustedContact ? trustedContact.value.trim() : "";
    state.profile.contactMethod = contactMethod ? contactMethod.value : "Phone";

    saveState();
    showMsg(profileMsg, "Profile saved (prototype).");
    render();
  });
}

if (viewAllTx) viewAllTx.addEventListener("click", () => setRoute("analytics"));
if (qaSend) qaSend.addEventListener("click", () => setRoute("transfer"));
if (qaRequest) qaRequest.addEventListener("click", () => setRoute("transfer"));
if (qaTopUp) qaTopUp.addEventListener("click", () => setRoute("topup"));

/* =========================
   APP STARTUP
   ========================= */

if (scanModal) {
  scanModal.hidden = true;
  scanModal.setAttribute("aria-hidden", "true");
}

render();
setRoute("dashboard");
// const STORAGE_KEY = "mb_prototype_state_v2";

// const DEMO_USER = {
//   email: "demo@mobilebank.test",
//   password: "Demo1234",
//   profile: {
//     fullName: "Rania Fadiel",
//     phone: "+44 7700 900000",
//     address: "London, United Kingdom",
//     occupancy: "Student",
//     dob: "1960-05-14",
//     trustedContact: "Sarah Daughter",
//     contactMethod: "WhatsApp",
//   },
// };

// const initialState = () => ({
//   session: { isAuthed: false, email: "" },

//   profile: { ...DEMO_USER.profile },

//   accounts: [
//     { id: "acc-001", name: "Everyday Current", number: "••• 1024", balance: 1280.55, currency: "GBP" },
//     { id: "acc-002", name: "Savings", number: "••• 7788", balance: 4120.0, currency: "GBP" },
//   ],
//   topUpCards: [
//   { id: "card-001", name: "Oyster Card", balance: 18.5 },
//   { id: "card-002", name: "Boots Card", balance: 12.0 },
//   { id: "card-003", name: "Tesco Clubcard", balance: 24.75 },
// ],
//   card: { frozen: false },
//   safetyCallLogs: [],
//   autoSaveEnabled: false,
//   billsProtectionAmount: 800,

//   transactions: [
//     { id: "tx-1001", date: "2026-01-28", type: "salary", title: "Salary", note: "Monthly pay", amount: 2100.0 },
//     { id: "tx-1002", date: "2026-01-29", type: "card", title: "Tesco", note: "Groceries", amount: -32.45 },
//     { id: "tx-1003", date: "2026-01-29", type: "card", title: "TfL", note: "Transport", amount: -4.8 },
//     { id: "tx-1004", date: "2026-01-30", type: "transfer", title: "Transfer to Sarah", note: "Dinner split", amount: -18.0 },
//     { id: "tx-1005", date: "2026-01-31", type: "card", title: "Amazon", note: "Order", amount: -24.99 },
//     { id: "tx-1006", date: "2026-01-31", type: "card", title: "Boots", note: "Pharmacy", amount: -9.5 },
//     { id: "tx-1007", date: "2026-02-01", type: "card", title: "Costa", note: "Coffee", amount: -3.65 },
//     { id: "tx-1008", date: "2026-02-01", type: "transfer", title: "Transfer from Mom", note: "Support", amount: 50.0 },
//     { id: "tx-1009", date: "2026-02-01", type: "card", title: "ASOS", note: "Clothing", amount: -45.0 },
//     { id: "tx-1010", date: "2026-02-02", type: "card", title: "Uber", note: "Ride", amount: -11.2 },
//   ],
// });

// function loadState() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return initialState();

//     const parsed = JSON.parse(raw);

//     if (!parsed?.session || !parsed?.profile || !parsed?.accounts || !parsed?.transactions) {
//       return initialState();
//     }

//     return parsed;
//   } catch {
//     return initialState();
//   }
// }

// function saveState() {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
// }

// let state = loadState();

// /* =========================
//    UTILITIES
//    ========================= */

// const gbp = (n) => {
//   const sign = n < 0 ? "-" : "";
//   const val = Math.abs(Number(n) || 0);
//   return `${sign}£${val.toFixed(2)}`;
// };

// const uid = () => "tx-" + Math.random().toString(16).slice(2, 10);

// function byId(id) {
//   return document.getElementById(id);
// }

// function setVisible(el, visible) {
//   if (!el) return;
//   el.classList.toggle("hidden", !visible);
// }

// function showMsg(el, msg) {
//   if (!el) return;
//   el.textContent = msg;
//   setVisible(el, true);
// }

// function hideMsg(el) {
//   if (!el) return;
//   el.textContent = "";
//   setVisible(el, false);
// }

// function normalizeSortCode(v) {
//   const digits = (v || "").replace(/\D/g, "").slice(0, 6);
//   const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)].filter(Boolean);
//   return parts.join("-");
// }

// function isValidSortCode(v) {
//   return /^\d{2}-\d{2}-\d{2}$/.test(v);
// }

// function isValidAccountNumber(v) {
//   return /^\d{8}$/.test((v || "").replace(/\D/g, ""));
// }

// function getGreeting() {
//   const h = new Date().getHours();
//   if (h < 12) return "Good morning";
//   if (h < 18) return "Good afternoon";
//   return "Good evening";
// }

// function getCurrentAccount() {
//   return state.accounts.find((a) => a.id === "acc-001") || state.accounts[0] || null;
// }

// function getSavingsAccount() {
//   return state.accounts.find((a) => a.id === "acc-002") || state.accounts[1] || null;
// }

// function addSafetyCallLog(title, method = "WhatsApp call", status = "Connected") {
//   if (!state.safetyCallLogs) state.safetyCallLogs = [];

//   state.safetyCallLogs.push({
//     title,
//     method,
//     status,
//     time: new Date().toLocaleString(),
//   });

//   saveState();
// }




// /* =========================
//    DOM REFERENCES
//    ========================= */

// const authView = byId("authView");
// const appView = byId("appView");
// const topbar = byId("topbar");

// const loginForm = byId("loginForm");
// const authError = byId("authError");

// const greetingText = byId("greetingText");
// const userName = byId("userName");
// const avatarCircle = byId("avatarCircle");

// const cardHolderName = byId("cardHolderName");
// const cardExpiry = byId("cardExpiry");
// const cardLast4 = byId("cardLast4");

// const incomeTotal = byId("incomeTotal");
// const spendTotal = byId("spendTotal");
// const incomeHint = byId("incomeHint");
// const spendHint = byId("spendHint");

// const viewAllTx = byId("viewAllTx");
// const qaSend = byId("qaSend");
// const qaRequest = byId("qaRequest");
// const qaTopUp = byId("qaTopUp");
// const qaScan = byId("qaScan");

// const sessionUser = byId("sessionUser");
// const logoutBtn = byId("logoutBtn");

// const navButtons = Array.from(document.querySelectorAll(".nav-item"));
// const routes = Array.from(document.querySelectorAll(".route"));

// const accountsList = byId("accountsList");
// const recentTransactions = byId("recentTransactions");
// const totalBalance = byId("totalBalance");

// const txList = byId("txList");
// const txSearch = byId("txSearch");
// const txType = byId("txType");
// const spendSummary = byId("spendSummary");

// const transferForm = byId("transferForm");
// const fromAccount = byId("fromAccount");
// const recipientName = byId("recipientName");
// const sortCode = byId("sortCode");
// const accountNumber = byId("accountNumber");
// const amount = byId("amount");
// const reference = byId("reference");
// const transferMsg = byId("transferMsg");
// const transferErr = byId("transferErr");

// const confirmBox = byId("transferConfirm");
// const confirmAmount = byId("confirmAmount");
// const confirmRecipient = byId("confirmRecipient");
// const confirmDoneBtn = byId("confirmDoneBtn");

// const freezeToggle = byId("freezeToggle");
// const freezeState = byId("freezeState");

// const profileForm = byId("profileForm");
// const fullName = byId("fullName");
// const phone = byId("phone");
// const address = byId("address");
// const profileMsg = byId("profileMsg");
// const occupancy = byId("occupancy");
// const dob = byId("dob");
// const trustedContact = byId("trustedContact");
// const contactMethod = byId("contactMethod");

// const profilePopover = byId("profilePopover");
// const popAvatar = byId("popAvatar");
// const popName = byId("popName");
// const popEmail = byId("popEmail");
// const popPhone = byId("popPhone");
// const popAddress = byId("popAddress");
// const popCardStatus = byId("popCardStatus");
// const popSession = byId("popSession");
// const popGoProfile = byId("popGoProfile");
// const popLogout = byId("popLogout");

// const safetyAlerts = byId("safetyAlerts");
// const safetyMsg = byId("safetyMsg");
// const callLogSection = byId("callLogSection");
// const callLogList = byId("callLogList");
// const aiSafetyBtn = byId("aiSafetyBtn");
// const callSarahBtn = byId("callSarahBtn");

// const savingsSuggestions = byId("savingsSuggestions");
// const totalSavedValue = byId("totalSavedValue");
// const couldSaveValue = byId("couldSaveValue");
// const savingsMsg = byId("savingsMsg");
// const safeToSpendCard = byId("safeToSpendCard");
// const topUpCardsList = byId("topUpCardsList");
// const topUpMsg = byId("topUpMsg");

// /* =========================
//    ROUTING
//    ========================= */

// function setRoute(route) {
//   routes.forEach((r) => setVisible(r, r.id === `route-${route}`));
//   navButtons.forEach((b) => b.classList.toggle("active", b.dataset.route === route));
// }

// /* =========================
//    RENDERING
//    ========================= */

// function render() {
//   const authed = state.session.isAuthed;

//   setVisible(authView, !authed);
//   setVisible(appView, authed);
//   setVisible(topbar, authed);

//   if (sessionUser) {
//     setVisible(sessionUser, authed);
//     if (authed) sessionUser.textContent = state.session.email;
//   }

//   if (logoutBtn) setVisible(logoutBtn, authed);

//   if (!authed) return;

//   if (greetingText) greetingText.textContent = getGreeting();
//   if (userName) userName.textContent = (state.profile.fullName || "User").split(" ")[0];
//   if (avatarCircle) avatarCircle.textContent = (state.profile.fullName || "U").trim().slice(0, 1).toUpperCase();

//   if (cardHolderName) cardHolderName.textContent = (state.profile.fullName || "USER").toUpperCase();
//   if (cardExpiry) cardExpiry.textContent = "12/28";
//   if (cardLast4) cardLast4.textContent = "5678";

//   renderDashboard();
//   renderTransactions();
//   renderTransfer();
//   renderCards();
//   renderProfile();
//   renderPopover();
//   renderSafety();
//   renderSavings();
//   renderTopUpCards();
// }

// /* ---------- DASHBOARD ---------- */
// function renderDashboard() {
//   const total = state.accounts.reduce((sum, a) => sum + a.balance, 0);
//   if (totalBalance) totalBalance.textContent = gbp(total);

//   if (accountsList) {
//     accountsList.innerHTML = "";
//     state.accounts.forEach((a) => {
//       const el = document.createElement("div");
//       el.className = "item";
//       el.innerHTML = `
//         <div class="meta">
//           <div class="title">${a.name}</div>
//           <div class="sub">${a.number}</div>
//         </div>
//         <div class="amt">${gbp(a.balance)}</div>
//       `;
//       accountsList.appendChild(el);
//     });
//   }

//   if (recentTransactions) {
//     recentTransactions.innerHTML = "";
//     state.transactions
//       .slice()
//       .sort((x, y) => (y.date + y.id).localeCompare(x.date + x.id))
//       .slice(0, 5)
//       .forEach((tx) => recentTransactions.appendChild(txRow(tx)));
//   }

//   const income = state.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
//   const spending = state.transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

//   if (incomeTotal) incomeTotal.textContent = gbp(income);
//   if (spendTotal) spendTotal.textContent = gbp(spending);

//   if (incomeHint) incomeHint.textContent = "+12.5% from last month";
//   if (spendHint) spendHint.textContent = "-8.2% from last month";
// }

// function txRow(tx) {
//   const el = document.createElement("div");
//   el.className = "item";

//   const cls = tx.amount < 0 ? "out" : "in";
//   el.innerHTML = `
//     <div class="meta">
//       <div class="title">${tx.title}</div>
//       <div class="sub">${tx.date} • ${tx.type}${tx.note ? " • " + tx.note : ""}</div>
//     </div>
//     <div class="amt ${cls}">${gbp(tx.amount)}</div>
//   `;
//   return el;
// }

// /* ---------- ANALYTICS ---------- */
// function renderTransactions() {
//   if (!txList || !txSearch || !txType) return;

//   const q = (txSearch.value || "").trim().toLowerCase();
//   const type = txType.value;

//   const filtered = state.transactions
//     .slice()
//     .sort((x, y) => (y.date + y.id).localeCompare(x.date + x.id))
//     .filter((tx) => {
//       const matchesType = type === "all" ? true : tx.type === type;
//       const blob = `${tx.title} ${tx.note || ""} ${tx.type}`.toLowerCase();
//       const matchesQuery = q ? blob.includes(q) : true;
//       return matchesType && matchesQuery;
//     });

//   txList.innerHTML = "";
//   filtered.forEach((tx) => txList.appendChild(txRow(tx)));

//   if (!spendSummary) return;

//   const out = filtered.filter((tx) => tx.amount < 0);
//   const sums = out.reduce((acc, tx) => {
//     acc[tx.type] = (acc[tx.type] || 0) + Math.abs(tx.amount);
//     return acc;
//   }, {});

//   spendSummary.innerHTML = "";

//   Object.entries(sums)
//     .sort((a, b) => b[1] - a[1])
//     .forEach(([k, v]) => {
//       const el = document.createElement("div");
//       el.className = "item";
//       el.innerHTML = `
//         <div class="meta">
//           <div class="title">${k.toUpperCase()}</div>
//           <div class="sub">Outgoing total</div>
//         </div>
//         <div class="amt">${gbp(v)}</div>
//       `;
//       spendSummary.appendChild(el);
//     });

//   if (!Object.keys(sums).length) {
//     const el = document.createElement("div");
//     el.className = "muted small";
//     el.textContent = "No outgoing transactions match your current filters.";
//     spendSummary.appendChild(el);
//   }
// }

// /* ---------- TRANSFER ---------- */
// function renderTransfer() {
//   if (!fromAccount || !sortCode) return;

//   fromAccount.innerHTML = "";
//   state.accounts.forEach((a) => {
//     const opt = document.createElement("option");
//     opt.value = a.id;
//     opt.textContent = `${a.name} (${a.number}) • ${gbp(a.balance)}`;
//     fromAccount.appendChild(opt);
//   });

//   sortCode.value = normalizeSortCode(sortCode.value);
// }

// /* ---------- CARDS ---------- */
// function renderCards() {
//   if (!freezeToggle || !freezeState) return;
//   freezeToggle.checked = !!state.card.frozen;
//   freezeState.textContent = state.card.frozen ? "Card is FROZEN" : "Card is ACTIVE";
// }

// /* ---------- PROFILE ---------- */
// function renderProfile() {
//   if (!fullName || !phone || !address) return;

//   fullName.value = state.profile.fullName || "";
//   phone.value = state.profile.phone || "";
//   address.value = state.profile.address || "";

//   if (occupancy) occupancy.value = state.profile.occupancy || "";
//   if (dob) dob.value = state.profile.dob || "";
//   if (trustedContact) trustedContact.value = state.profile.trustedContact || "";
//   if (contactMethod) contactMethod.value = state.profile.contactMethod || "Phone";
// }
// /* ---------- POPOVER ---------- */
// function renderPopover() {
//   const name = (state.profile?.fullName || "User").trim();
//   const initial = name ? name[0].toUpperCase() : "U";

//   if (popAvatar) popAvatar.textContent = initial;
//   if (popName) popName.textContent = name || "User";
//   if (popEmail) popEmail.textContent = state.session?.email || "—";
//   if (popPhone) popPhone.textContent = state.profile?.phone || "—";
//   if (popAddress) popAddress.textContent = state.profile?.address || "—";
//   if (popCardStatus) popCardStatus.textContent = state.card?.frozen ? "FROZEN" : "ACTIVE";
//   if (popSession) popSession.textContent = state.session?.isAuthed ? "Signed in" : "Signed out";
// }

// function openPopover() {
//   if (!profilePopover) return;
//   renderPopover();
//   setVisible(profilePopover, true);
//   profilePopover.setAttribute("aria-hidden", "false");
// }

// function closePopover() {
//   if (!profilePopover) return;
//   setVisible(profilePopover, false);
//   profilePopover.setAttribute("aria-hidden", "true");
// }

// /* ---------- SAFETY ---------- */
// function renderSafety() {
//   if (!safetyAlerts) return;

//   safetyAlerts.innerHTML = "";

//   const sorted = state.transactions
//     .slice()
//     .sort((x, y) => (y.date + y.id).localeCompare(x.date + x.id));

//   const suspicious = sorted.filter((tx) => tx.amount < -100);
//   const normal = sorted.filter((tx) => tx.amount < 0 && tx.amount >= -100).slice(0, 1);

//   if (callLogList && callLogSection) {
//     const logs = state.safetyCallLogs || [];
//     callLogList.innerHTML = "";

//     if (logs.length) {
//       setVisible(callLogSection, true);
//       logs
//         .slice()
//         .reverse()
//         .forEach((log) => {
//           const el = document.createElement("div");
//           el.className = "item";
//           el.innerHTML = `
//             <div class="meta">
//               <div class="title">📞 ${log.title}</div>
//               <div class="sub">${log.time} • ${log.method}</div>
//             </div>
//             <div class="amt in">${log.status}</div>
//           `;
//           callLogList.appendChild(el);
//         });
//     } else {
//       setVisible(callLogSection, false);
//     }
//   }

//   if (!suspicious.length && !normal.length) {
//     const empty = document.createElement("div");
//     empty.className = "muted";
//     empty.textContent = "No recent alerts. Your recent activity looks normal.";
//     safetyAlerts.appendChild(empty);
//   }

//   suspicious.forEach((tx, index) => {
//     const el = document.createElement("div");
//     el.className = "safety-card danger";
//     el.innerHTML = `
//       <div class="safety-card-head">
//         <div>
//           <div class="safety-card-title">🚨 Large Transaction Detected</div>
//           <div class="safety-time">${index === 0 ? "Recent" : "Flagged"}</div>
//         </div>
//         <button class="close-x" type="button">×</button>
//       </div>

//       <p class="safety-desc">
//         This payment may need checking because:
//         <br>• the amount is high
//         <br>• it is unusual compared with your normal spending
//         <br>• it may be worth confirming before doing anything
//       </p>

//       <div class="amount-box">Amount: <strong>${gbp(tx.amount)}</strong></div>

//       <div class="safety-actions">
//         <button class="danger-btn" type="button" data-action="lock-card">Lock My Card</button>
//         <button class="light-btn" type="button" data-action="confirm-safe">It Was Me</button>
//       </div>

//       <div class="safety-extra-actions">
//         <button class="save-action-btn" type="button" data-action="trusted-contact">
//           Ask Sarah to Check This
//         </button>
//         <button class="save-action-btn secondary-safety-btn" type="button" data-action="delay-payment">
//           Wait 10 Minutes
//         </button>
//         <button class="save-action-btn secondary-safety-btn" type="button" data-action="voice-check">
//           Read Safety Advice Out Loud
//         </button>
//       </div>
//     `;
//     safetyAlerts.appendChild(el);

//     const lockBtn = el.querySelector('[data-action="lock-card"]');
//     const safeBtn = el.querySelector('[data-action="confirm-safe"]');
//     const trustedBtn = el.querySelector('[data-action="trusted-contact"]');
//     const delayBtn = el.querySelector('[data-action="delay-payment"]');
//     const voiceBtn = el.querySelector('[data-action="voice-check"]');
//     const closeBtn = el.querySelector(".close-x");

//     if (lockBtn) {
//       lockBtn.addEventListener("click", () => {
//         state.card.frozen = true;
//         saveState();
//         render();
//         setRoute("safety");
//         showMsg(safetyMsg, "Your card has been locked for safety.");
//       });
//     }

//     if (safeBtn) {
//       safeBtn.addEventListener("click", () => {
//         showMsg(safetyMsg, "Marked as safe. No action is needed.");
//       });
//     }

//     if (trustedBtn) {
//       trustedBtn.addEventListener("click", () => {
//         addSafetyCallLog("Calling Sarah", "WhatsApp call", "Connected");
//         renderSafety();
//         showMsg(safetyMsg, "Calling Sarah with WhatsApp...");
//       });
//     }

//     if (delayBtn) {
//       delayBtn.addEventListener("click", () => {
//         showMsg(safetyMsg, "Okay — this payment has been paused for 10 minutes so you have time to think.");
//       });
//     }

//     if (voiceBtn) {
//       voiceBtn.addEventListener("click", () => {
//         const text =
//           "Please stop and check carefully. Your bank will never ask you to move money for safety. If someone is pressuring you, do not continue. Contact someone you trust first.";
//         showMsg(safetyMsg, "Safety advice has been read out loud.");
//         if ("speechSynthesis" in window) {
//           window.speechSynthesis.cancel();
//           window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
//         }
//       });
//     }

//     if (closeBtn) {
//       closeBtn.addEventListener("click", () => {
//         el.remove();
//       });
//     }
//   });

//   normal.forEach((tx) => {
//     const el = document.createElement("div");
//     el.className = "safety-card success";
//     el.innerHTML = `
//       <div class="safety-card-head">
//         <div>
//           <div class="safety-card-title">✅ Normal Payment Activity</div>
//           <div class="safety-time">Recent</div>
//         </div>
//       </div>

//       <p class="safety-desc">
//         This payment looks normal for your account and does not currently appear risky.
//       </p>

//       <div class="amount-box">Amount: <strong>${gbp(tx.amount)}</strong></div>
//     `;
//     safetyAlerts.appendChild(el);
//   });

//   if (aiSafetyBtn) {
//     aiSafetyBtn.onclick = () => {
//       showMsg(
//         safetyMsg,
//         "AI Safety Assistant: This page helps you spot unusual payments, contact someone you trust, and avoid scam pressure before sending money."
//       );
//     };
//   }
// }

// /* ---------- SAVINGS ---------- */
// function renderSavings(){
//   const current = getCurrentAccount();
//   const savings = getSavingsAccount();

//   const currentBalance = current ? current.balance : 0;
//   const savingsBalance = savings ? savings.balance : 0;

//   const outgoing = state.transactions.filter((t) => t.amount < 0);
//   const totalSpent = outgoing.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
//   const yearlyPotential = totalSpent * 0.1 * 12;

//   const protectedBillsAmount = state.billsProtectionAmount ?? 800;
//   const safeToSpend = Math.max(0, currentBalance - protectedBillsAmount);

//   if (totalSavedValue) totalSavedValue.textContent = gbp(savingsBalance);
//   if (couldSaveValue) couldSaveValue.textContent = `${gbp(yearlyPotential)}/yr`;

//   if (safeToSpendCard) {
//     safeToSpendCard.innerHTML = `
//       <div class="suggestion-card">
//         <div class="suggestion-title">💷 Safe-to-Spend This Week</div>
//         <p class="suggestion-desc">
//           After keeping <strong>${gbp(protectedBillsAmount)}</strong> aside for bills,
//           you can safely spend about <strong>${gbp(safeToSpend)}</strong>.
//         </p>
//         <div class="save-badge">↗ Clear weekly spending guide</div>
//       </div>
//     `;
//   }

//   if (!savingsSuggestions) return;
//   savingsSuggestions.innerHTML = "";

//   const moveAmount = Math.min(500, Math.max(0, currentBalance - 200));
//   const moveCard = document.createElement("div");
//   moveCard.className = "suggestion-card";
//   moveCard.innerHTML = `
//     <div class="suggestion-title">💡 Move Idle Money to Savings</div>
//     <p class="suggestion-desc">
//       You currently have ${gbp(currentBalance)} in your current account.
//       ${
//         moveAmount >= 500
//           ? `Moving £500.00 to savings could improve your money management.`
//           : `You do not currently have enough spare balance to move more into savings.`
//       }
//     </p>
//     <div class="save-badge">↗ Build savings faster</div>
//     <button class="save-action-btn" type="button" id="moveSavingsBtn" ${moveAmount < 500 ? "disabled" : ""}>
//       ${moveAmount >= 500 ? "Move £500.00 to Savings →" : "No spare balance available"}
//     </button>
//   `;
//   savingsSuggestions.appendChild(moveCard);

//   const autoSaveAmount = 5;
//   const autoSaveCard = document.createElement("div");
//   autoSaveCard.className = "suggestion-card";
//   autoSaveCard.innerHTML = `
//     <div class="suggestion-title">🔁 Automatic Small Savings</div>
//     <p class="suggestion-desc">
//       Save a small amount automatically every time you spend.
//       This keeps saving simple and stress-free.
//     </p>
//     <div class="save-badge">↗ Save ${gbp(autoSaveAmount)} on each spend</div>
//     <button class="save-action-btn" type="button" id="toggleAutoSaveBtn">
//       ${state.autoSaveEnabled ? "Turn Off Auto Saving" : "Turn On Auto Saving"}
//     </button>
//   `;
//   savingsSuggestions.appendChild(autoSaveCard);

//   const billsCard = document.createElement("div");
//   billsCard.className = "suggestion-card";
//   billsCard.innerHTML = `
//     <div class="suggestion-title">🧾 Bills Protection Mode</div>
//     <p class="suggestion-desc">
//       Keep <strong>${gbp(protectedBillsAmount)}</strong> untouched for important bills
//       so it is easier not to overspend.
//     </p>
//     <div class="save-badge">↗ Protected for essentials</div>
//     <button class="save-action-btn" type="button" id="billsProtectionBtn">
//       Bills Protection Active
//     </button>
//   `;
//   savingsSuggestions.appendChild(billsCard);

//   const weeklyAverage = 300;
//   const weeklyCheckText =
//     totalSpent > weeklyAverage
//       ? `You spent ${gbp(totalSpent)} recently. That is slightly higher than usual.`
//       : `You spent ${gbp(totalSpent)} recently. You are staying within your usual pattern.`;

//   const weeklyCard = document.createElement("div");
//   weeklyCard.className = "suggestion-card";
//   weeklyCard.innerHTML = `
//     <div class="suggestion-title">📅 Weekly Check-in</div>
//     <p class="suggestion-desc">${weeklyCheckText}</p>
//     <div class="save-badge">↗ Simple spending update</div>
//     <button class="save-action-btn" type="button" id="weeklyCheckBtn">
//       Okay, I Understand
//     </button>
//   `;
//   savingsSuggestions.appendChild(weeklyCard);

//   const moveSavingsBtn = byId("moveSavingsBtn");
//   if (moveSavingsBtn && moveAmount >= 500) {
//     moveSavingsBtn.addEventListener("click", () => {
//       const currentAcc = getCurrentAccount();
//       const savingsAcc = getSavingsAccount();
//       const amountToMove = 500;

//       if (!currentAcc || !savingsAcc) return;
//       if (currentAcc.balance < amountToMove + 200) return;

//       currentAcc.balance = Number((currentAcc.balance - amountToMove).toFixed(2));
//       savingsAcc.balance = Number((savingsAcc.balance + amountToMove).toFixed(2));

//       saveState();
//       render();
//       setRoute("savings");
//       showMsg(savingsMsg, "£500.00 has been successfully added to your savings account.");
//     });
//   }

//   const toggleAutoSaveBtn = byId("toggleAutoSaveBtn");
//   if (toggleAutoSaveBtn) {
//     toggleAutoSaveBtn.addEventListener("click", () => {
//       state.autoSaveEnabled = !state.autoSaveEnabled;
//       saveState();
//       renderSavings();
//       showMsg(
//         savingsMsg,
//         state.autoSaveEnabled
//           ? "Automatic saving is now on. £5.00 will be saved when you spend."
//           : "Automatic saving has been turned off."
//       );
//     });
//   }

//   const billsProtectionBtn = byId("billsProtectionBtn");
//   if (billsProtectionBtn) {
//     billsProtectionBtn.addEventListener("click", () => {
//       showMsg(savingsMsg, `Bills Protection Mode is active. ${gbp(protectedBillsAmount)} is being kept aside.`);
//     });
//   }

//   const weeklyCheckBtn = byId("weeklyCheckBtn");
//   if (weeklyCheckBtn) {
//     weeklyCheckBtn.addEventListener("click", () => {
//       showMsg(savingsMsg, "Weekly check-in noted.");
//     });
//   }
// }
// function renderTopUpCards() {
//   if (!topUpCardsList) return;

//   // Seed default cards once
//   if (!state.topUpCards || state.topUpCards.length < 6) {
//     state.topUpCards = [
//       { id: "tesco",     name: "Tesco",        tag: "Clubcard",            icon: "🛒", brand: "brand-tesco",     points: 1248, mode: "points" },
//       { id: "nectar",    name: "Sainsbury's",  tag: "Nectar",              icon: "🍇", brand: "brand-nectar",    points: 3420, mode: "points" },
//       { id: "oyster",    name: "Oyster",       tag: "TfL Travel",          icon: "🚇", brand: "brand-oyster",    balance: 8.50, mode: "balance" },
//       { id: "boots",     name: "Boots",        tag: "Advantage Card",      icon: "💊", brand: "brand-boots",     points: 875,  mode: "points" },
//       { id: "costa",     name: "Costa Coffee", tag: "Costa Club",          icon: "☕", brand: "brand-costa",     points: 6,    mode: "beans" },
//       { id: "superdrug", name: "Superdrug",    tag: "Health & Beautycard", icon: "💄", brand: "brand-superdrug", points: 540,  mode: "points" },
//     ];
//     saveState();
//   }

//   topUpCardsList.innerHTML = "";

//   let totalPts = 0;

//   state.topUpCards.forEach((card) => {
//     const el = document.createElement("div");
//     el.className = "topup-card";
//     el.dataset.card = card.id;

//     let valueHtml = "";
//     if (card.mode === "balance") {
//       valueHtml = `
//         <div class="topup-points">
//           <span class="num">£${(card.balance || 0).toFixed(2)}</span>
//           <span class="unit">balance</span>
//         </div>
//         <div class="topup-worth">Pay as you go</div>
//       `;
//     } else if (card.mode === "beans") {
//       valueHtml = `
//         <div class="topup-points">
//           <span class="num">${card.points}</span>
//           <span class="unit">beans</span>
//         </div>
//         <div class="topup-worth">Free drink at <strong>8</strong></div>
//       `;
//       totalPts += card.points;
//     } else {
//       valueHtml = `
//         <div class="topup-points">
//           <span class="num">${card.points.toLocaleString()}</span>
//           <span class="unit">points</span>
//         </div>
//         <div class="topup-worth">Worth <strong>£${(card.points / 100).toFixed(2)}</strong></div>
//       `;
//       totalPts += card.points;
//     }

//     el.innerHTML = `
//       <span class="glow ${card.brand}"></span>
//       <div class="topup-head">
//         <div class="topup-logo ${card.brand}">${card.icon}</div>
//         <span class="topup-tag">${card.tag}</span>
//       </div>
//       <div>
//         <h3 class="topup-name">${card.name}</h3>
//         ${valueHtml}
//       </div>
//       <button class="topup-btn" type="button">+ Top up</button>
//     `;

//     el.querySelector(".topup-btn").addEventListener("click", () => {
//       const currentAccount = getCurrentAccount();
//       const cost = 10;

//       if (!currentAccount || currentAccount.balance < cost) {
//         showMsg(topUpMsg, "Not enough balance in your current account.");
//         return;
//       }

//       currentAccount.balance = Number((currentAccount.balance - cost).toFixed(2));

//       if (card.mode === "balance") {
//         card.balance = Number(((card.balance || 0) + cost).toFixed(2));
//         showMsg(topUpMsg, `£${cost.toFixed(2)} added to your ${card.name} card.`);
//       } else {
//         card.points = (card.points || 0) + 100;
//         showMsg(topUpMsg, `100 ${card.mode} added to your ${card.name} card.`);
//       }

//       saveState();
//       render();
//       setRoute("topup");
//     });

//     topUpCardsList.appendChild(el);
//   });

//   // Update header summary
//   const totalEl = byId("topupTotalPoints");
//   if (totalEl) totalEl.textContent = totalPts.toLocaleString();
// }

// /* =========================
//    EVENT HANDLERS
//    ========================= */

// if (callSarahBtn) {
//   callSarahBtn.addEventListener("click", () => {
//     addSafetyCallLog("Calling Sarah", "WhatsApp call", "Connected");
//     renderSafety();
//     showMsg(safetyMsg, "Calling Sarah with WhatsApp...");
//   });
// }

// if (loginForm) {
//   loginForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     hideMsg(authError);

//     const email = (byId("email")?.value || "").trim().toLowerCase();
//     const password = byId("password")?.value || "";

//     if (email === DEMO_USER.email && password === DEMO_USER.password) {
//       state.session.isAuthed = true;
//       state.session.email = email;
//       saveState();
//       render();
//       setRoute("dashboard");
//     } else {
//       showMsg(authError, "Invalid credentials. Use demo@mobilebank.test / Demo1234");
//     }
//   });
// }

// if (avatarCircle) {
//   avatarCircle.style.cursor = "pointer";
//   avatarCircle.addEventListener("click", (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!state.session?.isAuthed) return;
//     setRoute("more");
//   });
// }

// if (profilePopover) {
//   profilePopover.addEventListener("click", (e) => {
//     if (e.target === profilePopover) closePopover();
//   });
// }

// if (popGoProfile) {
//   popGoProfile.addEventListener("click", (e) => {
//     e.preventDefault();
//     closePopover();
//     setRoute("more");
//   });
// }

// if (popLogout) {
//   popLogout.addEventListener("click", () => {
//     closePopover();
//     state = initialState();
//     saveState();
//     render();
//     setRoute("dashboard");
//   });
// }

// if (logoutBtn) {
//   logoutBtn.addEventListener("click", () => {
//     state = initialState();
//     saveState();
//     render();
//     setRoute("dashboard");
//   });
// }

// navButtons.forEach((btn) => {
//   btn.addEventListener("click", () => setRoute(btn.dataset.route));
// });

// if (txSearch) txSearch.addEventListener("input", renderTransactions);
// if (txType) txType.addEventListener("change", renderTransactions);

// if (sortCode) {
//   sortCode.addEventListener("input", () => {
//     sortCode.value = normalizeSortCode(sortCode.value);
//   });
// }

// if (transferForm) {
//   transferForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     hideMsg(transferMsg);
//     hideMsg(transferErr);

//     const fromId = fromAccount?.value || "";
//     const name = recipientName?.value?.trim() || "";
//     const sc = normalizeSortCode(sortCode?.value || "");
//     const accNo = (accountNumber?.value || "").replace(/\D/g, "");
//     const amt = Number(amount?.value);
//     const ref = reference?.value?.trim() || "";

//     if (!name) return showMsg(transferErr, "Recipient name is required.");
//     if (!isValidSortCode(sc)) return showMsg(transferErr, "Sort code must be in format 12-34-56.");
//     if (!isValidAccountNumber(accNo)) return showMsg(transferErr, "Account number must be 8 digits.");
//     if (!Number.isFinite(amt) || amt <= 0) return showMsg(transferErr, "Enter a valid amount.");

//     const account = state.accounts.find((a) => a.id === fromId);
//     if (!account) return showMsg(transferErr, "Invalid source account.");
//     if (account.balance < amt) return showMsg(transferErr, "Insufficient funds (prototype check).");

//     account.balance = Number((account.balance - amt).toFixed(2));

//     state.transactions.push({
//       id: uid(),
//       date: new Date().toISOString().slice(0, 10),
//       type: "transfer",
//       title: `Transfer to ${name}`,
//       note: ref ? `Ref: ${ref}` : `Sort: ${sc}, Acc: ${accNo}`,
//       amount: -amt,
//     });

//     if (state.autoSaveEnabled) {
//       const savingsAcc = getSavingsAccount();
//       const autoSaveAmount = 5;

//       if (savingsAcc && account.balance >= autoSaveAmount) {
//         account.balance = Number((account.balance - autoSaveAmount).toFixed(2));
//         savingsAcc.balance = Number((savingsAcc.balance + autoSaveAmount).toFixed(2));
//       }
//     }

//     saveState();

//     if (confirmBox && confirmAmount && confirmRecipient) {
//       confirmAmount.textContent = gbp(amt);
//       confirmRecipient.textContent = name;

//       const transferCard = transferForm.closest(".transfer-card");
//       if (transferCard) setVisible(transferCard, false);
//       setVisible(confirmBox, true);
//     }

//     transferForm.reset();
//     if (sortCode) sortCode.value = "";

//     render();
//     setRoute("dashboard");
//   });
// }

// if (confirmDoneBtn) {
//   confirmDoneBtn.addEventListener("click", () => {
//     setVisible(confirmBox, false);
//     const transferCard = document.querySelector(".transfer-card");
//     if (transferCard) setVisible(transferCard, true);
//     setRoute("dashboard");
//   });
// }

// if (freezeToggle) {
//   freezeToggle.addEventListener("change", () => {
//     state.card.frozen = freezeToggle.checked;
//     saveState();
//     renderCards();
//     renderPopover();
//   });
// }

// if (profileForm) {
//   profileForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     state.profile.fullName = fullName.value.trim();
//     state.profile.phone = phone.value.trim();
//     state.profile.address = address.value.trim();
//     state.profile.occupancy = occupancy ? occupancy.value.trim() : "";
//     state.profile.dob = dob ? dob.value : "";
//     state.profile.trustedContact = trustedContact ? trustedContact.value.trim() : "";
//     state.profile.contactMethod = contactMethod ? contactMethod.value : "Phone";

//     saveState();
//     showMsg(profileMsg, "Profile saved (prototype).");
//     render();
//   });
// }

// if (viewAllTx) viewAllTx.addEventListener("click", () => setRoute("analytics"));
// if (qaSend) qaSend.addEventListener("click", () => setRoute("transfer"));
// if (qaRequest) qaRequest.addEventListener("click", () => setRoute("transfer"));
// if (qaTopUp) qaTopUp.addEventListener("click", () => setRoute("topup"));
// if (qaScan) qaScan.addEventListener("click", () => alert("Scan is a prototype placeholder."));

// /* =========================
//    APP STARTUP
//    ========================= */

// render();
// setRoute("dashboard");

