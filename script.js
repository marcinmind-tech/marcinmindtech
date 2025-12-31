document.getElementById("callbackForm").addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("cbName").value.trim();
  const phone = document.getElementById("cbPhone").value.trim();
  const service = document.getElementById("cbService").value;

  // Validation
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!nameRegex.test(name)) {
    alert("Name should contain only letters and spaces");
    return;
  }

  if (!phoneRegex.test(phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  if (!service) {
    alert("Please select a service");
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbzFItfa_t1ugwANfw9u3cJev8z_j78i4HE15CqOhWXqK_yzG6mREkr4L4kuWUmZPLnEJQ/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body:
      "name=" + encodeURIComponent(name) +
      "&phone=" + encodeURIComponent(phone) +
      "&service=" + encodeURIComponent(service) +
      "&page=" + encodeURIComponent(window.location.href)
  });

  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      alert("Thank you! We will contact you shortly.");
      document.getElementById("callbackForm").reset();
    } else {
      alert("Submission failed. Please try again.");
    }
  })
  .catch(() => {
    alert("Network error. Please try again.");
  });
});


// Scroll
document.querySelectorAll('.reveal').forEach(el => {
el.classList.add('hidden');
});

function revealOnScroll() {
document.querySelectorAll('.reveal').forEach(el => {
  const top = el.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;
  if (top < windowHeight - 100) {
    el.classList.remove('hidden');
  }
});
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
