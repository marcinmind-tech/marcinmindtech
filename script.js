/* ================= WHATSAPP FORM ================= */
document.getElementById("bookingForm").addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;

  const msg = `Hello,
Name: ${name}
Phone: ${phone}
Service Needed: ${service}`;

  window.open(
    "https://wa.me/9150769598?text=" + encodeURIComponent(msg),
    "_blank"
  );
});
