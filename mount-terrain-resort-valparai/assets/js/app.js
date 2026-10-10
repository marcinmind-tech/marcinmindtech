(() => {
"use strict";

const HOTEL = Object.freeze({
  name:"Mount Terrain Resort",
  place:"Valparai",
  phone:"09645189444",
  phoneTel:"+919645189444",
  website:"https://www.valparaimountterrain.com/",
  map:"https://maps.app.goo.gl/yQujggAZsg4QK1Bv8"
});

const PLANS = Object.freeze({
  EP:"EP — Room Only",
  CP:"CP — Breakfast Included",
  MAP:"MAP — Breakfast + One Major Meal",
  AP:"AP — Breakfast + Lunch + Dinner"
});

const app = document.getElementById("app");

app.innerHTML = `
<header class="app-header">
  <div class="container app-shell py-2">
    <div class="brand-wrap">
      <div class="brand-logo-wrap">
        <img class="brand-logo" src="assets/image/mount-terrain-logo.jpg" alt="Mount Terrain Resort Valparai">
      </div>
      <div>
        <div class="brand-name">${HOTEL.name}</div>
        <div class="brand-place">${HOTEL.place}</div>
      </div>
    </div>
  </div>
</header>

<main class="container app-shell py-3 py-lg-4">
  <div class="row g-3 g-lg-4 align-items-start">
    <div class="col-lg-7">
      <section class="panel">
        <div class="section-head">
        
          <h1>Guest booking message</h1>
          <p>Create either a quotation or an advance payment confirmation.</p>

          <div class="mode-switch" aria-label="Message type">
            <button class="mode-btn active" type="button" data-mode="quote">Quote</button>
            <button class="mode-btn" type="button" data-mode="receipt">Advance Receipt</button>
          </div>
        </div>

        <form id="bookingForm" autocomplete="off" novalidate>
          <div class="form-section">
            <h2>Guest</h2>
            <div class="row g-2">
              <div class="col-md-7">
                <label class="form-label" for="guestName">Client name</label>
                <input class="form-control" id="guestName" type="text" placeholder="Guest / company name">
              </div>
              <div class="col-md-5">
                <label class="form-label" for="phone">Phone number</label>
                <div class="input-group">
                  <span class="input-group-text">+91</span>
                  <input class="form-control" id="phone" type="tel" inputmode="numeric" maxlength="10" placeholder="10-digit number">
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Stay</h2>
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label">Check-in date & time</label>
                <button class="date-time-box" id="checkInDisplay" type="button">
                  <span id="checkInDisplayText">Choose date & time</span>
                  <span class="date-time-icon">⌄</span>
                </button>
              </div>
              <div class="col-md-6">
                <label class="form-label">Check-out date & time</label>
                <button class="date-time-box" id="checkOutDisplay" type="button">
                  <span id="checkOutDisplayText">Choose date & time</span>
                  <span class="date-time-icon">⌄</span>
                </button>
              </div>

              <div class="col-md-8">
                <label class="form-label" for="roomType">Room type</label>
                <select class="form-select" id="roomType">
                  <option>Deluxe Room</option>
                  <option>Premium Room</option>
                  <option>Family Room</option>
                  <option>Cottage</option>
                  <option>Suite</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label" for="roomCount">Room count</label>
                <input class="form-control" id="roomCount" type="number" min="1" value="1">
              </div>

              <div class="col-12 d-none" id="otherRoomWrap">
                <label class="form-label" for="otherRoomType">Room type name</label>
                <input class="form-control" id="otherRoomType" type="text" placeholder="Enter room / cottage name">
              </div>

              <div class="col-6">
                <label class="form-label" for="adults">Adults</label>
                <input class="form-control" id="adults" type="number" min="1" value="2">
              </div>
              <div class="col-6">
                <label class="form-label" for="children">Children</label>
                <input class="form-control" id="children" type="number" min="0" value="0">
              </div>

              <div class="col-12">
                <label class="form-label" for="mealPlan">Meal plan</label>
                <select class="form-select" id="mealPlan">
                  <option value="EP">EP — Room only</option>
                  <option value="CP" selected>CP — Breakfast included</option>
                  <option value="MAP">MAP — Breakfast + one major meal</option>
                  <option value="AP">AP — Breakfast + lunch + dinner</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Extra bed</h2>
            <div class="row g-2">
              <div class="col-6">
                <label class="form-label" for="extraBedCount">Count</label>
                <input class="form-control" id="extraBedCount" type="number" min="0" value="0">
              </div>
              <div class="col-6">
                <label class="form-label" for="extraBedCost">Cost / bed</label>
                <div class="input-group">
                  <span class="input-group-text">₹</span>
                  <input class="form-control" id="extraBedCost" type="number" min="0" value="0">
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Add-ons</h2>
            <div class="addon-list" id="addonList"></div>
            <button class="add-addon-btn" id="addAddonBtn" type="button">+ Add another add-on</button>
            <div class="addon-hint">Example: Campfire, Cake, Decoration, Transport, Safari, Special Meal.</div>
          </div>

          <div class="form-section">
            <h2>Payment</h2>
            <div class="row g-2">
              <div class="col-md-4">
                <label class="form-label" for="stayAmount">Stay amount</label>
                <div class="input-group">
                  <span class="input-group-text">₹</span>
                  <input class="form-control" id="stayAmount" type="number" min="0" placeholder="0">
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label" id="advanceLabel" for="advanceAmount">Advance Required to Confirm</label>
                <div class="input-group">
                  <span class="input-group-text">₹</span>
                  <input class="form-control" id="advanceAmount" type="number" min="0" placeholder="0">
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label" id="summaryAmountLabel">Total Quote</label>
                <div class="money-display" id="summaryAmount">₹0</div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>

    <div class="col-lg-5">
      <aside class="preview-panel sticky-lg-top">
        <div class="preview-head">
          <div>
            <div class="eyebrow">WHATSAPP PREVIEW</div>
            <h2 id="previewTitle">Quotation</h2>
          </div>
          <span class="status-dot">Live</span>
        </div>
        <pre id="messagePreview" class="message-preview"></pre>
        <div id="formAlert" class="alert alert-light border alert-compact d-none"></div>
        <div class="contact-card">
          <div class="contact-title">${HOTEL.name}, ${HOTEL.place}</div>
          <a href="tel:${HOTEL.phoneTel}">Contact: ${HOTEL.phone}</a>
          <a href="${HOTEL.website}" target="_blank" rel="noopener">www.valparaimountterrain.com</a>
          <a href="${HOTEL.map}" target="_blank" rel="noopener">Google Business Profile / Directions</a>
        </div>
      </aside>
    </div>
  </div>
</main>

<footer class="app-footer">
  <div class="container app-shell footer-inner">
    <div>${HOTEL.name} · ${HOTEL.place}</div>
    <div class="powered-by">
      Powered by
      <a href="https://marcinmind.in" target="_blank" rel="noopener">Marc in Mind Technologies</a>
    </div>
  </div>
</footer>

<div class="picker-overlay d-none" id="pickerOverlay" aria-hidden="true">
  <div class="picker-dialog">
    <div class="picker-head">
      <div class="eyebrow">STAY SCHEDULE</div>
      <h3 id="pickerTitle">Choose date and time</h3>
      <p>Select both fields, then tap OK to confirm.</p>
    </div>
    <div class="picker-grid">
      <div>
        <label class="form-label" for="pickerDate">Date</label>
        <input class="form-control picker-control" id="pickerDate" type="date">
      </div>
      <div>
        <label class="form-label" for="pickerTime">Time</label>
        <input class="form-control picker-control" id="pickerTime" type="time">
      </div>
    </div>
    <div class="picker-actions">
      <button class="btn picker-cancel" id="pickerCancel" type="button">Cancel</button>
      <button class="btn picker-ok" id="pickerOk" type="button">OK</button>
    </div>
  </div>
</div>

<div class="floating-actions">
  <button id="copyBtn" class="btn btn-light-action" type="button">Copy Message</button>
  <a id="whatsappBtn" class="btn btn-primary-action disabled" href="#" target="_blank" rel="noopener">Open WhatsApp</a>
</div>

<div class="toast-layer position-fixed bottom-0 end-0 p-3">
  <div class="simple-toast" id="toastBox">Message copied.</div>
</div>
`;

document.body.classList.add("protected-ui");

const $ = id => document.getElementById(id);
const state = {
  mode:"quote",
  checkIn:"",
  checkOut:"",
  pickerTarget:null,
  addonSeq:0
};

const els = {
  form:$("bookingForm"),
  guestName:$("guestName"),
  phone:$("phone"),
  checkInDisplay:$("checkInDisplay"),
  checkOutDisplay:$("checkOutDisplay"),
  checkInDisplayText:$("checkInDisplayText"),
  checkOutDisplayText:$("checkOutDisplayText"),
  roomType:$("roomType"),
  otherRoomWrap:$("otherRoomWrap"),
  otherRoomType:$("otherRoomType"),
  roomCount:$("roomCount"),
  adults:$("adults"),
  children:$("children"),
  mealPlan:$("mealPlan"),
  extraBedCount:$("extraBedCount"),
  extraBedCost:$("extraBedCost"),
  addonList:$("addonList"),
  addAddonBtn:$("addAddonBtn"),
  stayAmount:$("stayAmount"),
  advanceAmount:$("advanceAmount"),
  advanceLabel:$("advanceLabel"),
  summaryAmountLabel:$("summaryAmountLabel"),
  summaryAmount:$("summaryAmount"),
  previewTitle:$("previewTitle"),
  messagePreview:$("messagePreview"),
  formAlert:$("formAlert"),
  whatsappBtn:$("whatsappBtn"),
  copyBtn:$("copyBtn"),
  pickerOverlay:$("pickerOverlay"),
  pickerTitle:$("pickerTitle"),
  pickerDate:$("pickerDate"),
  pickerTime:$("pickerTime"),
  pickerCancel:$("pickerCancel"),
  pickerOk:$("pickerOk"),
  toastBox:$("toastBox")
};

const money = value => "₹" + Number(value || 0).toLocaleString("en-IN");

function parseDT(value){
  if(!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDT(value){
  const d = parseDT(value);
  if(!d) return "—";
  const date = d.toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
  const time = d.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit",hour12:true});
  return `${date} · ${time}`;
}

function nights(){
  const a=parseDT(state.checkIn), b=parseDT(state.checkOut);
  if(!a||!b||b<=a) return 0;
  const aa=new Date(a.getFullYear(),a.getMonth(),a.getDate());
  const bb=new Date(b.getFullYear(),b.getMonth(),b.getDate());
  return Math.max(1,Math.round((bb-aa)/86400000));
}

function datesValid(){
  const a=parseDT(state.checkIn), b=parseDT(state.checkOut);
  return !a||!b||b>a;
}

function roomName(){
  return els.roomType.value==="Other"
    ? (els.otherRoomType.value.trim()||"Other")
    : els.roomType.value;
}

function guestText(){
  const a=Number(els.adults.value||0), c=Number(els.children.value||0);
  const adults=`${a} Adult${a===1?"":"s"}`;
  return c>0 ? `${adults} + ${c} Child${c===1?"":"ren"}` : adults;
}

function addAddon(name="",qty=1,price=""){
  state.addonSeq+=1;
  const row=document.createElement("div");
  row.className="addon-row";
  row.dataset.addonId=String(state.addonSeq);
  row.innerHTML=`
    <div>
      <label class="form-label">Add-on</label>
      <input class="form-control addon-name" type="text" value="${escapeAttr(name)}" placeholder="Campfire">
    </div>
    <div>
      <label class="form-label">Qty</label>
      <input class="form-control addon-qty" type="number" min="1" value="${Number(qty)||1}">
    </div>
    <div>
      <label class="form-label">Price</label>
      <input class="form-control addon-price" type="number" min="0" value="${escapeAttr(price)}" placeholder="0">
    </div>
    <button class="addon-remove" type="button" aria-label="Remove add-on">×</button>
  `;
  els.addonList.appendChild(row);
  row.querySelector(".addon-remove").addEventListener("click",()=>{row.remove();update()});
  row.querySelectorAll("input").forEach(input=>input.addEventListener("input",update));
  update();
}

function escapeAttr(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll('"',"&quot;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function addons(){
  return [...els.addonList.querySelectorAll(".addon-row")].map(row=>{
    const name=row.querySelector(".addon-name").value.trim();
    const qty=Math.max(1,Number(row.querySelector(".addon-qty").value||1));
    const price=Math.max(0,Number(row.querySelector(".addon-price").value||0));
    return {name,qty,price,total:qty*price};
  }).filter(x=>x.name||x.price>0);
}

function totals(){
  const stay=Math.max(0,Number(els.stayAmount.value||0));
  const bedCount=Math.max(0,Number(els.extraBedCount.value||0));
  const bedRate=Math.max(0,Number(els.extraBedCost.value||0));
  const stayNights=nights();
  const bedTotal=bedCount*bedRate*stayNights;
  const addonItems=addons();
  const addonTotal=addonItems.reduce((sum,x)=>sum+x.total,0);
  const total=stay+bedTotal+addonTotal;
  const advance=Math.max(0,Number(els.advanceAmount.value||0));
  const balance=Math.max(0,total-advance);
  return {stay,bedCount,bedRate,stayNights,bedTotal,addonItems,addonTotal,total,advance,balance};
}

function terms(){
  return [
    "Valid government-issued photo ID is required for adult guests at check-in.",
    "Early check-in / late check-out is subject to availability and may be chargeable.",
    "If an e-pass or entry permit is required by the authorities for Valparai on the travel date, please obtain it before travel.",
    "Additional guests, add-ons or changes to the confirmed booking may attract additional charges.",
    "Cancellation / date changes are subject to the booking terms confirmed by the resort.",
    "Travel may be affected by weather, road conditions or government restrictions outside the resort's control."
  ];
}

function baseStayLines(){
  const t=totals();
  const n=nights();
  return [
    `• Check-in: ${formatDT(state.checkIn)}`,
    `• Check-out: ${formatDT(state.checkOut)}`,
    n ? `• Stay: ${n} Night${n===1?"":"s"}` : null,
    `• Room: ${roomName()} × ${Number(els.roomCount.value||0)||"—"}`,
    `• Guests: ${guestText()}`,
    `• Plan: ${PLANS[els.mealPlan.value]}`,
    t.bedCount>0
      ? `• Extra Bed: ${t.bedCount} Bed${t.bedCount===1?"":"s"} × ${t.stayNights} Night${t.stayNights===1?"":"s"} × ${money(t.bedRate)} = ${money(t.bedTotal)}`
      : null
  ].filter(Boolean);
}

function addonLines(){
  return addons().map(x=>`• ${x.name||"Add-on"}: ${x.qty} × ${money(x.price)} = ${money(x.total)}`);
}

function buildQuote(){
  const t=totals();
  return [
    `*${HOTEL.name.toUpperCase()} · ${HOTEL.place.toUpperCase()}*`,
    `*STAY QUOTATION*`,
    "",
    `Dear *${els.guestName.value.trim()||"Guest"}*,`,
    `Thank you for your enquiry. Please find the stay quotation and advance required to confirm the booking below.`,
    "",
    `*STAY DETAILS*`,
    ...baseStayLines(),
    "",
    ...(addonLines().length ? [`*ADD-ONS*`,...addonLines(),""] : []),
    `*PRICE SUMMARY*`,
    `• Stay: ${money(t.stay)}`,
    t.bedTotal>0 ? `• Extra Bed: ${money(t.bedTotal)}` : null,
    t.addonTotal>0 ? `• Add-ons: ${money(t.addonTotal)}` : null,
    `• *Total Quote: ${money(t.total)}*`,
    `• Advance Required to Confirm: *${money(t.advance)}*`,
    `• Balance After Advance: *${money(t.balance)}*`,
    "",
    `*IMPORTANT*`,
    `• Booking will be confirmed only after the quoted advance payment is received, subject to room availability at that time.`,
    `• Rates and inclusions apply only to the stay details mentioned above.`,
    ...terms().map(x=>`• ${x}`),
    "",
    `*CONTACT*`,
    `Phone: ${HOTEL.phone}`,
    `Website: ${HOTEL.website}`,
    `Location: ${HOTEL.map}`,
    "",
    `*${HOTEL.name}*`,
    HOTEL.place
  ].filter(Boolean).join("\n");
}

function buildReceipt(){
  const t=totals();
  return [
    `*${HOTEL.name.toUpperCase()} · ${HOTEL.place.toUpperCase()}*`,
    `*BOOKING CONFIRMED — ADVANCE RECEIVED*`,
    "",
    `Dear *${els.guestName.value.trim()||"Guest"}*,`,
    `Thank you. Your stay is confirmed against the advance payment received.`,
    "",
    `*STAY DETAILS*`,
    ...baseStayLines(),
    "",
    ...(addonLines().length ? [`*ADD-ONS*`,...addonLines(),""] : []),
    `*PAYMENT SUMMARY*`,
    `• Stay: ${money(t.stay)}`,
    t.bedTotal>0 ? `• Extra Bed: ${money(t.bedTotal)}` : null,
    t.addonTotal>0 ? `• Add-ons: ${money(t.addonTotal)}` : null,
    `• Total Booking Amount: *${money(t.total)}*`,
    `• Advance Received: *${money(t.advance)}*`,
    `• Balance Payable: *${money(t.balance)}*`,
    "",
    `*IMPORTANT*`,
    `• Balance payment is to be settled at or before check-in unless otherwise confirmed.`,
    ...terms().map(x=>`• ${x}`),
    "",
    `*CONTACT*`,
    `Phone: ${HOTEL.phone}`,
    `Website: ${HOTEL.website}`,
    `Location: ${HOTEL.map}`,
    "",
    `We look forward to welcoming you.`,
    `*${HOTEL.name}*`,
    HOTEL.place
  ].filter(Boolean).join("\n");
}

function buildMessage(){
  return state.mode==="quote" ? buildQuote() : buildReceipt();
}

function ready(){
  const phoneOK=/^\d{10}$/.test(els.phone.value.trim());
  const basics=Boolean(
    els.guestName.value.trim() &&
    phoneOK &&
    state.checkIn &&
    state.checkOut &&
    datesValid() &&
    Number(els.roomCount.value||0)>0 &&
    els.stayAmount.value!==""
  );
  return basics && els.advanceAmount.value!=="";
}

function showToast(text){
  els.toastBox.textContent=text;
  els.toastBox.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>els.toastBox.classList.remove("show"),1700);
}

function update(){
  els.phone.value=els.phone.value.replace(/\D/g,"").slice(0,10);

  els.checkInDisplayText.textContent=state.checkIn?formatDT(state.checkIn):"Choose date & time";
  els.checkOutDisplayText.textContent=state.checkOut?formatDT(state.checkOut):"Choose date & time";
  els.checkInDisplay.classList.toggle("has-value",Boolean(state.checkIn));
  els.checkOutDisplay.classList.toggle("has-value",Boolean(state.checkOut));
  els.otherRoomWrap.classList.toggle("d-none",els.roomType.value!=="Other");

  document.querySelectorAll(".receipt-only").forEach(x=>x.classList.toggle("d-none",state.mode!=="receipt"));
  els.previewTitle.textContent=state.mode==="quote"?"Quotation":"Advance Receipt";

  const t=totals();
  if(state.mode==="quote"){
    els.advanceLabel.textContent="Advance Required to Confirm";
    els.summaryAmountLabel.textContent="Balance After Advance";
    els.summaryAmount.textContent=money(t.balance);
  }else{
    els.advanceLabel.textContent="Advance Received";
    els.summaryAmountLabel.textContent="Balance";
    els.summaryAmount.textContent=money(t.balance);
  }

  els.messagePreview.textContent=buildMessage();

  els.formAlert.classList.add("d-none");
  els.formAlert.textContent="";
  if(state.checkIn&&state.checkOut&&!datesValid()){
    els.formAlert.textContent="Check-out must be later than check-in.";
    els.formAlert.classList.remove("d-none");
  }

  const canSend=ready();
  els.whatsappBtn.classList.toggle("disabled",!canSend);
  if(canSend){
    const target="91"+els.phone.value.trim();
    els.whatsappBtn.href=`https://wa.me/${target}?text=${encodeURIComponent(buildMessage())}`;
  }else{
    els.whatsappBtn.href="#";
  }
}

function setMode(mode){
  state.mode=mode;
  document.querySelectorAll(".mode-btn").forEach(btn=>btn.classList.toggle("active",btn.dataset.mode===mode));
  update();
}

function splitDT(value){
  if(!value) return {date:"",time:""};
  const parts=value.split("T");
  return {date:parts[0]||"",time:(parts[1]||"").slice(0,5)};
}

function openPicker(target){
  state.pickerTarget=target;
  const existing=target==="checkIn"?state.checkIn:state.checkOut;
  const parts=splitDT(existing);

  els.pickerTitle.textContent=target==="checkIn"
    ?"Choose check-in date and time"
    :"Choose check-out date and time";

  els.pickerDate.value=parts.date;
  els.pickerTime.value=parts.time;
  els.pickerOverlay.classList.remove("d-none");
  els.pickerOverlay.setAttribute("aria-hidden","false");

  setTimeout(()=>{
    if(typeof els.pickerDate.showPicker==="function"){
      try{els.pickerDate.showPicker()}catch(_){}
    }
  },80);
}

function closePicker(){
  els.pickerOverlay.classList.add("d-none");
  els.pickerOverlay.setAttribute("aria-hidden","true");
  state.pickerTarget=null;
}

function confirmPicker(){
  if(!els.pickerDate.value||!els.pickerTime.value){
    showToast("Select both date and time.");
    return;
  }
  const value=`${els.pickerDate.value}T${els.pickerTime.value}`;
  if(state.pickerTarget==="checkIn") state.checkIn=value;
  if(state.pickerTarget==="checkOut") state.checkOut=value;
  closePicker();
  update();
}

document.querySelectorAll(".mode-btn").forEach(btn=>btn.addEventListener("click",()=>setMode(btn.dataset.mode)));
els.form.addEventListener("input",update);
els.form.addEventListener("change",update);
els.addAddonBtn.addEventListener("click",()=>addAddon());
els.checkInDisplay.addEventListener("click",()=>openPicker("checkIn"));
els.checkOutDisplay.addEventListener("click",()=>openPicker("checkOut"));
els.pickerCancel.addEventListener("click",closePicker);
els.pickerOk.addEventListener("click",confirmPicker);
els.pickerOverlay.addEventListener("click",e=>{if(e.target===els.pickerOverlay)closePicker()});

[els.pickerDate,els.pickerTime].forEach(input=>{
  input.addEventListener("click",()=>{
    if(typeof input.showPicker==="function"){
      try{input.showPicker()}catch(_){}
    }
  });
});

els.copyBtn.addEventListener("click",async()=>{
  try{
    await navigator.clipboard.writeText(buildMessage());
  }catch(_){
    const ta=document.createElement("textarea");
    ta.value=buildMessage();
    ta.style.position="fixed";
    ta.style.opacity="0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  showToast("Message copied.");
});

document.addEventListener("contextmenu",e=>{
  if(!e.target.closest("input,textarea,select")) e.preventDefault();
});
document.addEventListener("dragstart",e=>{
  if(!e.target.closest("input,textarea,select")) e.preventDefault();
});
document.addEventListener("selectstart",e=>{
  if(!e.target.closest("input,textarea,select")) e.preventDefault();
});
document.addEventListener("keydown",e=>{
  const key=e.key.toLowerCase();
  if(e.key==="Escape"&&!els.pickerOverlay.classList.contains("d-none")) closePicker();
  if(e.key==="F12"||(e.ctrlKey&&e.shiftKey&&["i","j","c"].includes(key))||(e.ctrlKey&&key==="u")) e.preventDefault();
});

addAddon("Campfire",1,"");
update();
})();
