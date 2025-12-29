/* REVEAL */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>e.isIntersecting && e.target.classList.add("active"))
},{threshold:.15});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

/* NAV + FLOAT BAR - SCROLL BEHAVIOR */
let lastScroll=0;
const nav=document.querySelector(".navbar");
const bar=document.getElementById("actionBar");

window.addEventListener("scroll",()=>{
  const current=window.scrollY;

  // Hide when scrolling down, show when scrolling up
  if(current > lastScroll && current > 100){
    // Scrolling down
    nav.classList.add("nav-hide");
    bar.classList.add("hide");
  } else if(current < lastScroll){
    // Scrolling up
    nav.classList.remove("nav-hide");
    bar.classList.remove("hide");
  }

  // Always show at very top
  if(current < 10){
    nav.classList.remove("nav-hide");
    bar.classList.remove("hide");
  }

  lastScroll=current;
});
