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

  { name:"Ertiga", seats:"6+1", min:5, max:7, img:"images/vehicles/ertiga1.webp" },
  { name:"Innova", seats:"7+1", min:5, max:7, img:"images/vehicles/innovo1.webp" },
  { name:"Innova Crysta", seats:"6+1 / 7+1", min:5, max:7, img:"images/vehicles/crysta1.webp" },
  { name:"Hycross", seats:"6+1", min:5, max:7, img:"images/vehicles/hycross1.webp" },

  { name:"Tempo Traveller 12", seats:"12 Seater", min:8, max:18, img:"images/vehicles/TT1.webp" },
  { name:"Tempo Traveller 14", seats:"14 Seater", min:8, max:18, img:"images/vehicles/TT2.webp" },
  { name:"Tempo Traveller 18", seats:"18 Seater", min:8, max:18, img:"images/vehicles/TT3.webp" },
  { name:"Urbania", seats:"12 / 18 Seater", min:8, max:18, img:"images/vehicles/Urbania.webp" },

  { name:"Coach", seats:"21 Seater", min:19, max:21, img:"images/vehicles/coach1.webp" },
  { name:"Bus", seats:"Above 21", min:22, max:100, img:"images/vehicles/bus1.webp" }
];

const totalSteps = 8;

function render(){
  updateProgress();

  if(currentStep === 0) renderDestination();
  if(currentStep === 1) renderPickupDrop();
  if(currentStep === 2) renderTravelDates();
  if(currentStep === 3) renderPassengers();
  if(currentStep === 4) renderVehicles();
  if(currentStep === 5) renderAccommodation();
  if(currentStep === 6) renderName();
  if(currentStep === 7) renderPreview();
}

function updateProgress(){
  progressBar.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
}

function shell(title, text, content, actions = true){
  screen.innerHTML = `
    <div class="screen">
      <div class="ai-bubble">
        <h2>${title}</h2>
        <p>${text}</p>
      </div>

      ${content}

      ${
        actions
        ? `<div class="nav-actions ${currentStep === 0 ? "single" : ""}">
            ${currentStep > 0 ? `<button class="btn btn-back" onclick="back()">Back</button>` : ""}
            <button class="btn btn-next" onclick="next()">Send</button>
          </div>`
        : ""
      }
    </div>
  `;
}

function renderDestination(){
  shell(
    "Where are you planning to go?",
    "Enter one or more places separated by comma.",
    `
      <div class="input-box">
        <label>Destination</label>
        <input id="destinations" type="text" value="${booking.destinations}" placeholder="Example: Ooty, Coonoor">
        <div id="error" class="error"></div>
      </div>

      <div class="quick-title">Popular plans</div>
      <div class="quick-grid">
        <button class="chip-btn" onclick="setDestination('Ooty')">Ooty</button>
        <button class="chip-btn" onclick="setDestination('Ooty, Coonoor')">Ooty, Coonoor</button>
        <button class="chip-btn" onclick="setDestination('Kodaikanal')">Kodaikanal</button>
        <button class="chip-btn" onclick="setDestination('Munnar')">Munnar</button>
        <button class="chip-btn" onclick="setDestination('Mysore')">Mysore</button>
        <button class="chip-btn" onclick="setDestination('Coorg')">Coorg</button>
      </div>
    `
  );
}

function renderPickupDrop(){
  shell(
    "Pickup & drop location",
    "Enter pickup location. For drop, choose same as pickup or enter another city/place.",
    `
      <div class="input-box">
        <label>Pickup Location</label>
        <input id="pickup" type="text" value="${booking.pickup}" placeholder="Example: Saravanampatti, Coimbatore">
        <div id="pickupError" class="error"></div>
      </div>

      <div class="quick-title">Quick pickup options</div>
      <div class="quick-grid">
        <button class="chip-btn" onclick="setPickup('Coimbatore Railway Station')">Railway Station</button>
        <button class="chip-btn" onclick="setPickup('Coimbatore Airport')">Airport</button>
        <button class="chip-btn" onclick="setPickup('Coimbatore Bus Stand')">Bus Stand</button>
        <button class="chip-btn" onclick="setPickup('Inside Coimbatore')">Inside Coimbatore</button>
      </div>

      <div class="input-box">
        <label>Drop Location</label>
        <input id="drop" type="text" value="${booking.drop}" placeholder="Same as pickup or enter drop location">
        <div id="dropError" class="error"></div>
      </div>

      <div class="quick-title">Drop options</div>
      <div class="quick-grid">
        <button class="chip-btn" onclick="sameAsPickup()">Same as Pickup</button>
        <button class="chip-btn" onclick="setDrop('Coimbatore')">Coimbatore</button>
        <button class="chip-btn" onclick="setDrop('Bangalore')">Bangalore</button>
        <button class="chip-btn" onclick="setDrop('Chennai')">Chennai</button>
      </div>
    `
  );
}

function renderTravelDates(){
  shell(
    "Travel date & time",
    "Select pickup and drop / return date-time, then confirm.",
    `
      <div class="date-confirm-card date-click-box" onclick="openDatePicker('pickupDateTime')">
        <label><i class="bi bi-calendar-event"></i> Pickup Date & Time</label>
        <input
          id="pickupDateTime"
          type="datetime-local"
          value="${booking.pickupDateTime}"
          min="${getMinDateTime()}"
          readonly
        >
        <div id="pickupError" class="error"></div>
      </div>

      <div class="date-confirm-card date-click-box" onclick="openDatePicker('dropDateTime')">
        <label><i class="bi bi-calendar-check"></i> Drop / Return Date & Time</label>
        <input
          id="dropDateTime"
          type="datetime-local"
          value="${booking.dropDateTime}"
          min="${booking.pickupDateTime || getMinDateTime()}"
          readonly
        >
        <div id="dropError" class="error"></div>
      </div>

      ${booking.duration ? `<div class="duration-box">${booking.duration}</div>` : ""}

      <button class="confirm-date-btn" onclick="confirmTravelDates()">
        Confirm Date & Time
      </button>

      <div class="nav-actions">
        <button class="btn btn-back" onclick="back()">Back</button>
      </div>
    `,
    false
  );

  const pickupInput = document.getElementById("pickupDateTime");
  const dropInput = document.getElementById("dropDateTime");

  pickupInput.addEventListener("change", () => {
    booking.pickupDateTime = pickupInput.value;
    dropInput.min = pickupInput.value || getMinDateTime();

    if(dropInput.value && dropInput.value < pickupInput.value){
      dropInput.value = "";
      booking.dropDateTime = "";
    }
  });

  dropInput.addEventListener("change", () => {
    booking.dropDateTime = dropInput.value;
  });
}

function renderPassengers(){
  shell(
    "Passenger count",
    "Use plus/minus or type the passenger count directly.",
    `
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
    `
  );
}

function renderVehicles(){
  const recommended = getRecommendedVehicles();

  if(!booking.vehicle && recommended.length){
    booking.vehicle = recommended[0].name;
  }

  shell(
    "Recommended vehicles",
    `Based on ${booking.passengers} passenger(s), select your preferred vehicle.`,
    `
      <div class="vehicle-grid">
        ${recommended.map(vehicle => `
          <div class="vehicle-card ${booking.vehicle === vehicle.name ? "active" : ""}" onclick="selectVehicle('${vehicle.name}')">
            <img src="${vehicle.img}" alt="${vehicle.name}">
            <h4>${vehicle.name}</h4>
            <p>${vehicle.seats}</p>
          </div>
        `).join("")}
      </div>
    `
  );
}

function renderAccommodation(){
  shell(
    "Accommodation needed?",
    "Select whether hotel/stay arrangement is needed.",
    `
      <div class="quick-grid">
        <button class="chip-btn ${booking.accommodation === 'No' ? 'active' : ''}" onclick="setAccommodation('No')">No</button>
        <button class="chip-btn ${booking.accommodation === 'Yes' ? 'active' : ''}" onclick="setAccommodation('Yes')">Yes</button>
      </div>

      ${
        booking.accommodation === "Yes"
        ? `
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
        `
        : `<div class="note">Accommodation: No</div>`
      }
    `
  );
}

function renderName(){
  shell(
    "Almost done",
    "Please enter your name.",
    `
      <div class="input-box">
        <label>Name</label>
        <input id="name" type="text" value="${booking.name}" placeholder="Enter your name">
        <div id="error" class="error"></div>
      </div>
    `
  );
}

function renderPreview(){
  screen.innerHTML = `
    <div class="screen">
      <div class="ai-bubble">
        <h2>Preview & Submit</h2>
        <p>Please check your details before sending to WhatsApp.</p>
      </div>

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

        <div class="nav-actions">
          <button class="btn btn-back" onclick="back()">Edit</button>
          <button class="btn btn-wa" onclick="sendToWhatsApp()">
            <i class="bi bi-whatsapp"></i> Submit WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;
}

function next(){
  if(currentStep === 0){
    const input = document.getElementById("destinations");

    if(!input.value.trim()){
      return showError("Please enter destination.");
    }

    booking.destinations = input.value.trim();
  }

  if(currentStep === 1){
    const pickup = document.getElementById("pickup").value.trim();
    let drop = document.getElementById("drop").value.trim();

    if(!pickup){
      document.getElementById("pickupError").textContent = "Please enter pickup location.";
      return;
    }

    if(!drop){
      drop = "Same as Pickup";
    }

    booking.pickup = pickup;
    booking.drop = drop;
  }

  if(currentStep === 6){
    const input = document.getElementById("name");

    if(!input.value.trim()){
      return showError("Please enter your name.");
    }

    booking.name = input.value.trim();
  }

  currentStep++;
  render();
}

function back(){
  if(currentStep > 0){
    currentStep--;
    render();
  }
}

function setDestination(value){
  const input = document.getElementById("destinations");
  input.value = value;
  booking.destinations = value;
}

function setPickup(value){
  const input = document.getElementById("pickup");
  input.value = value;
  booking.pickup = value;
}

function setDrop(value){
  const input = document.getElementById("drop");
  input.value = value;
  booking.drop = value;
}

function sameAsPickup(){
  const pickupInput = document.getElementById("pickup");
  const dropInput = document.getElementById("drop");

  const pickupValue = pickupInput.value.trim();

  if(pickupValue){
    dropInput.value = pickupValue;
    booking.drop = pickupValue;
  }else{
    dropInput.value = "Same as Pickup";
    booking.drop = "Same as Pickup";
  }
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
    }catch(error){
      input.click();
    }
  }, 50);
}

function confirmTravelDates(){
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

  currentStep = 3;
  render();
}

function changePassengers(value){
  booking.passengers = Math.max(1, Number(booking.passengers) + value);
  booking.vehicle = "";
  renderPassengers();
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
  renderVehicles();
}

function setAccommodation(value){
  booking.accommodation = value;
  renderAccommodation();
}

function changeAccommodation(type, value){
  if(type === "adults"){
    booking.accommodationAdults = Math.max(1, booking.accommodationAdults + value);
  }

  if(type === "children"){
    booking.accommodationChildren = Math.max(0, booking.accommodationChildren + value);
  }

  renderAccommodation();
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

function showError(text){
  const error = document.getElementById("error");

  if(error){
    error.textContent = text;
  }
}

function getMinDateTime(){
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
}

function formatDateTime(value){
  if(!value){
    return "-";
  }

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

function resetBooking(){
  currentStep = 0;

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

  render();
}

render();
