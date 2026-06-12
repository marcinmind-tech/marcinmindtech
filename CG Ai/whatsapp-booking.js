const WHATSAPP_NUMBER = "917639447706";

const screen = document.getElementById("screen");
const progressBar = document.getElementById("progressBar");

let currentStep = 0;

const booking = {
  destinations: "",
  pickup: "",
  drop: "",
  pickupDateTime: "",
  dropDateTime: "",
  duration: "",
  passengers: 1,
  vehicle: "",
  accommodation: "No",
  accommodationAdults: 1,
  accommodationChildren: 0,
  name: ""
};

const vehicleData = [
  { name:"Aura", seats:"4+1", min:1, max:4, img:"images/vehicles/aura1.webp" },
  { name:"Etios", seats:"4+1", min:1, max:4, img:"images/vehicles/etios1.webp" },
  { name:"Dzire", seats:"4+1", min:1, max:4, img:"images/vehicles/dzire1.webp" },
  { name:"Ciaz", seats:"4+1", min:1, max:4, img:"images/vehicles/ciaz1.webp" },

  { name:"Ertiga", seats:"6+1", min:1, max:7, img:"images/vehicles/ertiga1.webp" },
  { name:"Innova", seats:"7+1", min:1, max:7, img:"images/vehicles/innovo1.webp" },
  { name:"Innova Crysta", seats:"6+1 / 7+1", min:1, max:7, img:"images/vehicles/crysta1.webp" },
  { name:"Hycross", seats:"6+1", min:1, max:7, img:"images/vehicles/hycross1.webp" },

  { name:"Tempo Traveller 12", seats:"12 Seater", min:8, max:12, img:"images/vehicles/TT1.webp" },
  { name:"Tempo Traveller 14", seats:"14 Seater", min:8, max:14, img:"images/vehicles/TT2.webp" },

  { name:"Tempo Traveller 18", seats:"18 Seater", min:15, max:18, img:"images/vehicles/TT3.webp" },
  { name:"Urbania", seats:"18 Seater", min:15, max:18, img:"images/vehicles/Urbania.webp" },

  { name:"Coach", seats:"21 Seater", min:19, max:21, img:"images/vehicles/coach1.webp" },
  { name:"Bus", seats:"Above 21", min:22, max:100, img:"images/vehicles/bus1.webp" }
];

const totalSteps = 9;

function initChat(){
  screen.innerHTML = "";
  currentStep = 0;
  updateProgress();

  botMessage(
    "Where are you planning to go?",
    "Enter one or more places separated by comma.",
    destinationCard()
  );
}

function updateProgress(){
  progressBar.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
}

function botMessage(title, text, html){
  const wrap = document.createElement("div");
  wrap.className = "chat-row bot-row";

  wrap.innerHTML = `
    <div class="chat-bubble bot-bubble">
      <h2>${title}</h2>
      <p>${text}</p>
      ${html}
    </div>
  `;

  screen.appendChild(wrap);
  scrollBottom();
}

function userMessage(text){
  const wrap = document.createElement("div");
  wrap.className = "chat-row user-row";

  wrap.innerHTML = `
    <div class="chat-bubble user-bubble">
      ${text}
    </div>
  `;

  screen.appendChild(wrap);
  scrollBottom();
}

function disableLastBotCard(){
  const cards = screen.querySelectorAll(".bot-bubble");
  const last = cards[cards.length - 1];

  if(last){
    last.querySelectorAll("input, button").forEach(el => el.disabled = true);
    last.classList.add("completed-bot");
  }
}

/* STEP 1: DESTINATION */
function destinationCard(){
  return `
    <div class="input-box">
      <label>Destination</label>
      <input id="destinations" type="text" placeholder="Example: Ooty, Coonoor">
      <div id="error" class="error"></div>
    </div>

    <div class="quick-title">Popular Places</div>
    <div class="quick-grid">
      <button class="chip-btn" onclick="fillValue('destinations','Ooty')">Ooty</button>
      <button class="chip-btn" onclick="fillValue('destinations','Kodaikanal')">Kodaikanal</button>
      <button class="chip-btn" onclick="fillValue('destinations','Valparai')">Valparai</button>
      <button class="chip-btn" onclick="fillValue('destinations','Munnar')">Munnar</button>
      <button class="chip-btn" onclick="fillValue('destinations','Wayanad')">Wayanad</button>
      <button class="chip-btn" onclick="fillValue('destinations','Mysore')">Mysore</button>
      <button class="chip-btn" onclick="fillValue('destinations','Coorg')">Coorg</button>
      <button class="chip-btn" onclick="fillValue('destinations','Chikmagalur')">Chikmagalur</button>
      <button class="chip-btn" onclick="fillValue('destinations','Rameshwaram')">Rameshwaram</button>
    </div>


    <button class="chat-send-btn" onclick="submitDestination()">Send</button>
  `;
}

function submitDestination(){
  const input = document.getElementById("destinations");

  if(!input.value.trim()){
    return setError("Please enter destination.");
  }

  booking.destinations = input.value.trim();
  disableLastBotCard();

  userMessage(`<strong>Trip:</strong> ${booking.destinations}`);

  currentStep = 1;
  updateProgress();

  setTimeout(() => {
    botMessage(
      "Pickup location",
      "Where should we pick you up?",
      pickupCard()
    );
  }, 350);
}

/* STEP 2: PICKUP */
function pickupCard(){
  return `
    <div class="input-box">
      <label>Pickup Location</label>
      <input id="pickup" type="text" placeholder="Example: Saravanampatti, Coimbatore">
      <div id="pickupError" class="error"></div>
    </div>

    <div class="quick-title">Quick pickup options</div>
    <div class="quick-grid">
      <button class="chip-btn" onclick="fillValue('pickup','Coimbatore Railway Station')">Railway Station</button>
      <button class="chip-btn" onclick="fillValue('pickup','Coimbatore Airport')">Airport</button>
      <button class="chip-btn" onclick="fillValue('pickup','Coimbatore Bus Stand')">Bus Stand</button>
      <button class="chip-btn" onclick="fillValue('pickup','Inside Coimbatore')">Inside Coimbatore</button>
    </div>

    <button class="chat-send-btn" onclick="submitPickup()">Send</button>
  `;
}

function submitPickup(){
  const pickup = document.getElementById("pickup").value.trim();

  if(!pickup){
    document.getElementById("pickupError").textContent = "Please enter pickup location.";
    return;
  }

  booking.pickup = pickup;
  disableLastBotCard();

  userMessage(`<strong>Pickup:</strong> ${booking.pickup}`);

  currentStep = 2;
  updateProgress();

  setTimeout(() => {
    botMessage(
      "Drop location",
      "Where should we drop you? Choose same as pickup or enter another place.",
      dropCard()
    );
  }, 350);
}

/* STEP 3: DROP */
function dropCard(){
  return `
    <div class="input-box">
      <label>Drop Location</label>
      <input id="drop" type="text" placeholder="Same as pickup or enter drop location">
      <div id="dropError" class="error"></div>
    </div>

    <div class="quick-title">Drop options</div>
    <div class="quick-grid">
      <button class="chip-btn" onclick="setDropSameAsPickup()">Same as Pickup</button>
      <button class="chip-btn" onclick="fillValue('drop','Coimbatore Airport')">Coimbatore Airport</button>
      <button class="chip-btn" onclick="fillValue('drop','Coimbatore Railway Station')">Coimbatore Railway Station</button>
      <button class="chip-btn" onclick="fillValue('drop','Coimbatore Bus Stand')">Coimbatore Bus Stand</button>
    </div>

    <button class="chat-send-btn" onclick="submitDrop()">Send</button>
  `;
}

function setDropSameAsPickup(){
  const dropInput = document.getElementById("drop");
  if(dropInput){
    dropInput.value = "Same as Pickup";
  }
}

function submitDrop(){
  let drop = document.getElementById("drop").value.trim();

  if(!drop){
    drop = "Same as Pickup";
  }

  booking.drop = drop;
  disableLastBotCard();

  userMessage(`<strong>Drop:</strong> ${booking.drop}`);

  currentStep = 3;
  updateProgress();

  setTimeout(() => {
    botMessage(
      "Travel date & time",
      "Select pickup and drop / return date-time, then confirm.",
      dateCard()
    );
  }, 350);
}

/* STEP 4: DATE */
function dateCard(){
  return `
    <div class="date-confirm-card date-click-box" onclick="openDatePicker('pickupDateTime')">
      <label><i class="bi bi-calendar-event"></i> Pickup Date & Time</label>
      <input id="pickupDateTime" type="datetime-local" min="${getMinDateTime()}" readonly>
      <div id="pickupError" class="error"></div>
    </div>

    <div class="date-confirm-card date-click-box" onclick="openDatePicker('dropDateTime')">
      <label><i class="bi bi-calendar-check"></i> Drop / Return Date & Time</label>
      <input id="dropDateTime" type="datetime-local" min="${getMinDateTime()}" readonly>
      <div id="dropError" class="error"></div>
    </div>

    <div id="durationBox" class="duration-box" style="display:none;"></div>

    <button class="chat-send-btn" onclick="submitDates()">Confirm Date & Time</button>
  `;
}

function submitDates(){
  const pickupInput = document.getElementById("pickupDateTime");
  const dropInput = document.getElementById("dropDateTime");

  document.getElementById("pickupError").textContent = "";
  document.getElementById("dropError").textContent = "";

  if(!pickupInput.value){
    document.getElementById("pickupError").textContent = "Please select pickup date and time.";
    return;
  }

  if(!dropInput.value){
    document.getElementById("dropError").textContent = "Please select drop date and time.";
    return;
  }

  if(dropInput.value < pickupInput.value){
    document.getElementById("dropError").textContent = "Drop time cannot be earlier than pickup time.";
    return;
  }

  booking.pickupDateTime = pickupInput.value;
  booking.dropDateTime = dropInput.value;
  booking.duration = calculateDuration(booking.pickupDateTime, booking.dropDateTime);

  disableLastBotCard();

  userMessage(`
    <strong>Pickup:</strong> ${formatDateTime(booking.pickupDateTime)}<br>
    <strong>Drop:</strong> ${formatDateTime(booking.dropDateTime)}<br>
    <strong>${booking.duration}</strong>
  `);

  currentStep = 4;
  updateProgress();

  setTimeout(() => {
    botMessage(
      "Passenger count",
      "Use plus/minus or type the passenger count directly.",
      passengerCard()
    );
  }, 350);
}

/* STEP 5: PASSENGERS */
function passengerCard(){
  return `
    <div class="counter-card">
      <div class="counter-row">
        <h3>Total Passengers</h3>
        <div class="counter-control">
          <button onclick="changePassengers(-1)">-</button>
          <input id="passengerInput" type="number" min="1" value="${booking.passengers}" oninput="manualPassengers(this.value)">
          <button onclick="changePassengers(1)">+</button>
        </div>
      </div>
    </div>

    <div class="note">Vehicles will be recommended automatically.</div>

    <button class="chat-send-btn" onclick="submitPassengers()">Send</button>
  `;
}

function submitPassengers(){
  const input = document.getElementById("passengerInput");
  booking.passengers = Math.max(1, Number(input.value || 1));

  disableLastBotCard();

  userMessage(`<strong>Passengers:</strong> ${booking.passengers}`);

  currentStep = 5;
  updateProgress();

  setTimeout(() => {
    botMessage(
      "Recommended vehicles",
      `Based on ${booking.passengers} passenger(s), select your preferred vehicle.`,
      vehicleCard()
    );
  }, 350);
}

/* STEP 6: VEHICLE */
function vehicleCard(){
  const recommended = getRecommendedVehicles();

  if(!booking.vehicle && recommended.length){
    booking.vehicle = recommended[0].name;
  }

  return `
    <div class="vehicle-grid">
      ${recommended.map(vehicle => `
        <div class="vehicle-card ${booking.vehicle === vehicle.name ? "active" : ""}" onclick="selectVehicle('${vehicle.name}')">
          <img src="${vehicle.img}" alt="${vehicle.name}">
          <h4>${vehicle.name}</h4>
          <p>${vehicle.seats}</p>
        </div>
      `).join("")}
    </div>

    <button class="chat-send-btn" onclick="submitVehicle()">Send</button>
  `;
}

function submitVehicle(){
  disableLastBotCard();

  userMessage(`<strong>Vehicle:</strong> ${booking.vehicle}`);

  currentStep = 6;
  updateProgress();

  setTimeout(() => {
    botMessage(
      "Accommodation needed?",
      "Select whether hotel / stay arrangement is needed.",
      accommodationCard()
    );
  }, 350);
}

/* STEP 7: ACCOMMODATION */
function accommodationCard(){
  return `
    <div class="quick-grid">
      <button class="chip-btn ${booking.accommodation === 'No' ? 'active' : ''}" onclick="setAccommodation('No')">No</button>
      <button class="chip-btn ${booking.accommodation === 'Yes' ? 'active' : ''}" onclick="setAccommodation('Yes')">Yes</button>
    </div>

    <div id="accommodationDetails">
      ${accommodationDetailsHtml()}
    </div>

    <button class="chat-send-btn" onclick="submitAccommodation()">Send</button>
  `;
}

function accommodationDetailsHtml(){
  if(booking.accommodation !== "Yes"){
    return `<div class="note">Accommodation: No</div>`;
  }

  return `
    <div class="note">Children above 10 years will be considered as adults.</div>

    <div class="counter-card">
      <div class="counter-row">
        <h3>Adults</h3>
        <div class="counter-control">
          <button onclick="changeAccommodation('adults',-1)">-</button>
          <input type="number" min="1" value="${booking.accommodationAdults}" oninput="manualAccommodation('adults',this.value)">
          <button onclick="changeAccommodation('adults',1)">+</button>
        </div>
      </div>
    </div>

    <div class="counter-card">
      <div class="counter-row">
        <h3>Children Below 10</h3>
        <div class="counter-control">
          <button onclick="changeAccommodation('children',-1)">-</button>
          <input type="number" min="0" value="${booking.accommodationChildren}" oninput="manualAccommodation('children',this.value)">
          <button onclick="changeAccommodation('children',1)">+</button>
        </div>
      </div>
    </div>
  `;
}

function submitAccommodation(){
  disableLastBotCard();

  let text = `<strong>Accommodation:</strong> ${booking.accommodation}`;

  if(booking.accommodation === "Yes"){
    text += `<br><strong>Adults:</strong> ${booking.accommodationAdults}`;
    text += `<br><strong>Children Below 10:</strong> ${booking.accommodationChildren}`;
  }

  userMessage(text);

  currentStep = 7;
  updateProgress();

  setTimeout(() => {
    botMessage(
      "Almost done",
      "Please enter your name.",
      nameCard()
    );
  }, 350);
}

/* STEP 8: NAME */
function nameCard(){
  return `
    <div class="input-box">
      <label>Name</label>
      <input id="name" type="text" placeholder="Enter your name">
      <div id="error" class="error"></div>
    </div>

    <button class="chat-send-btn" onclick="submitName()">Send</button>
  `;
}

function submitName(){
  const input = document.getElementById("name");

  if(!input.value.trim()){
    return setError("Please enter your name.");
  }

  booking.name = input.value.trim();

  disableLastBotCard();

  userMessage(`<strong>Name:</strong> ${booking.name}`);

  currentStep = 8;
  updateProgress();

  setTimeout(() => {
    botMessage(
      "Preview & Submit",
      "Please check your details before sending to WhatsApp.",
      previewCard()
    );
  }, 350);
}

/* STEP 9: PREVIEW */
function previewCard(){
  return `
    <div class="preview-card">
      <h3>Booking Details</h3>

      ${previewRow("Destination", booking.destinations)}
      ${previewRow("Pickup", booking.pickup)}
      ${previewRow("Drop", booking.drop)}
      ${previewRow("Pickup Time", formatDateTime(booking.pickupDateTime))}
      ${previewRow("Drop Time", formatDateTime(booking.dropDateTime))}
      ${previewRow("Duration", booking.duration)}
      ${previewRow("Passengers", booking.passengers)}
      ${previewRow("Vehicle", booking.vehicle)}
      ${previewRow("Accommodation", booking.accommodation)}
      ${
        booking.accommodation === "Yes"
        ? `${previewRow("Adults", booking.accommodationAdults)}
           ${previewRow("Children Below 10", booking.accommodationChildren)}`
        : ""
      }
      ${previewRow("Name", booking.name)}
    </div>

    <button class="chat-send-btn whatsapp-final" onclick="sendToWhatsApp()">
      <i class="bi bi-whatsapp"></i> Submit WhatsApp
    </button>
  `;
}

/* HELPERS */
function fillValue(id, value){
  const input = document.getElementById(id);
  if(input) input.value = value;
}

function openDatePicker(id){
  const input = document.getElementById(id);
  if(!input) return;

  input.removeAttribute("readonly");
  input.focus();

  setTimeout(() => {
    try{
      if(typeof input.showPicker === "function"){
        input.showPicker();
      }else{
        input.click();
      }
    }catch(e){
      input.click();
    }
  }, 50);

  input.addEventListener("change", () => {
    if(id === "pickupDateTime"){
      const dropInput = document.getElementById("dropDateTime");

      if(dropInput){
        dropInput.min = input.value || getMinDateTime();

        if(dropInput.value && dropInput.value < input.value){
          dropInput.value = "";
        }
      }
    }

    updateDurationBox();
  }, { once:false });
}

function updateDurationBox(){
  const pickup = document.getElementById("pickupDateTime")?.value;
  const drop = document.getElementById("dropDateTime")?.value;
  const box = document.getElementById("durationBox");

  if(pickup && drop && drop >= pickup && box){
    box.style.display = "block";
    box.textContent = calculateDuration(pickup, drop);
  }
}

function changePassengers(value){
  const input = document.getElementById("passengerInput");
  const newValue = Math.max(1, Number(input.value || 1) + value);

  input.value = newValue;
  booking.passengers = newValue;
  booking.vehicle = "";
}

function manualPassengers(value){
  booking.passengers = Math.max(1, Number(value || 1));
  booking.vehicle = "";
}

function getRecommendedVehicles(){
  return vehicleData.filter(vehicle =>
    booking.passengers >= vehicle.min && booking.passengers <= vehicle.max
  );
}

function selectVehicle(name){
  booking.vehicle = name;

  document.querySelectorAll(".vehicle-card").forEach(card => {
    card.classList.remove("active");
  });

  const selected = [...document.querySelectorAll(".vehicle-card")]
    .find(card => card.innerText.includes(name));

  if(selected){
    selected.classList.add("active");
  }
}

function setAccommodation(value){
  booking.accommodation = value;

  document.querySelectorAll(".chip-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const selected = [...document.querySelectorAll(".chip-btn")]
    .find(btn => btn.textContent.trim() === value);

  if(selected){
    selected.classList.add("active");
  }

  const box = document.getElementById("accommodationDetails");
  if(box){
    box.innerHTML = accommodationDetailsHtml();
  }

  scrollBottom();
}

function changeAccommodation(type, value){
  if(type === "adults"){
    booking.accommodationAdults = Math.max(1, booking.accommodationAdults + value);
  }

  if(type === "children"){
    booking.accommodationChildren = Math.max(0, booking.accommodationChildren + value);
  }

  const box = document.getElementById("accommodationDetails");
  if(box){
    box.innerHTML = accommodationDetailsHtml();
  }
}

function manualAccommodation(type, value){
  const num = Number(value || 0);

  if(type === "adults"){
    booking.accommodationAdults = Math.max(1, num);
  }

  if(type === "children"){
    booking.accommodationChildren = Math.max(0, num);
  }
}

function previewRow(label, value){
  return `
    <div class="preview-row">
      <strong>${label}</strong>
      <span>${value || "-"}</span>
    </div>
  `;
}

function calculateDuration(pickup, drop){
  const start = new Date(pickup);
  const end = new Date(drop);

  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffDays = Math.max(0, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)));
  const days = diffDays + 1;
  const nights = Math.max(0, diffDays);

  if(nights === 0){
    return `${days} Day Trip`;
  }

  return `${days} Days / ${nights} Night${nights > 1 ? "s" : ""}`;
}

function formatDateTime(value){
  if(!value) return "-";

  const date = new Date(value);

  return date.toLocaleString("en-IN", {
    day:"2-digit",
    month:"2-digit",
    year:"numeric",
    hour:"numeric",
    minute:"2-digit",
    hour12:true
  });
}

function getMinDateTime(){
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
}

function setError(text){
  const error = document.getElementById("error");

  if(error){
    error.textContent = text;
  }
}

function sendToWhatsApp(){
  const accommodationText = booking.accommodation === "Yes"
    ? `Yes
Adults: ${booking.accommodationAdults}
Children Below 10: ${booking.accommodationChildren}
Note: Children above 10 considered as adults`
    : "No";

  const message = `✨ *COVAI GLIDE TOURS & TRAVELS*
━━━━━━━━━━━━━━━━━
📩 *NEW BOOKING ENQUIRY*

🏔️ *Destination:* ${booking.destinations}
📍 *Pickup:* ${booking.pickup}
📍 *Drop:* ${booking.drop}
🗓️ *Pickup:* ${formatDateTime(booking.pickupDateTime)}
🗓️ *Drop:* ${formatDateTime(booking.dropDateTime)}
⏱️ *Duration:* ${booking.duration}
👥 *Passengers:* ${booking.passengers}
🚘 *Vehicle:* ${booking.vehicle}
🏨 *Accommodation:* ${accommodationText}

━━━━━━━━━━━━━━━━━
👤 *CUSTOMER*
🧑 *Name:* ${booking.name}

🙏 Kindly share fare & availability.`;

  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function resetBooking(){
  booking.destinations = "";
  booking.pickup = "";
  booking.drop = "";
  booking.pickupDateTime = "";
  booking.dropDateTime = "";
  booking.duration = "";
  booking.passengers = 1;
  booking.vehicle = "";
  booking.accommodation = "No";
  booking.accommodationAdults = 1;
  booking.accommodationChildren = 0;
  booking.name = "";

  initChat();
}

function scrollBottom(){
  const body = document.querySelector(".cg-body");
  body.scrollTop = body.scrollHeight;
}

initChat();
