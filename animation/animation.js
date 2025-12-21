const finalX = {
  triLeft: -50,
  triRight: 50,
  boxLeft: -78,
  boxRight: 78
};

/* Initial states */
gsap.set("#triLeft", { x: -420, rotation: -120 });
gsap.set("#triRight", { x: 420, rotation: 120 });
gsap.set("#boxLeft", { x: -520 });
gsap.set("#boxRight", { x: 520 });

const tl = gsap.timeline();

/* Assemble logo */
tl.to("#triLeft", {
  x: finalX.triLeft,
  rotation: 0,
  duration: 0.95,
  ease: "expo.out"
}, 0)

.to("#triRight", {
  x: finalX.triRight,
  rotation: 0,
  duration: 0.95,
  ease: "expo.out"
}, 0)

.to("#boxLeft", {
  x: finalX.boxLeft,
  duration: 0.95,
  ease: "expo.out"
}, 0)

.to("#boxRight", {
  x: finalX.boxRight,
  duration: 0.95,
  ease: "expo.out"
}, 0)

/* Micro pause */
.to({}, { duration: 0.12 })

/* Shutter up */
.to("#glow", { opacity: 1, duration: 0.12 })
.to("#intro", {
  y: "-100%",
  duration: 0.75,
  ease: "power4.in"
}, "<")
.to("#glow", { opacity: 0, duration: 0.25 }, "-=0.4")

/* Release scroll */
.set("body", { overflow: "auto" });
