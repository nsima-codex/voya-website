"use strict";

/* Small helpers so we type less */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* ========== 1. WORLD CLOCKS ========== */
const clockEls = $$("[data-tz]");

function updateClocks() {
  clockEls.forEach((el) => {
    el.textContent = new Date().toLocaleTimeString("en-GB", {
      timeZone: el.dataset.tz, // reads data-tz="Asia/Dubai"
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  });
}
updateClocks();
setInterval(updateClocks, 1000); // run again every 1000 ms

/* ========== 2. NAV: scrolled style + mobile menu ========== */
const nav = $("#nav");
const burger = $("#burger");
const menu = $("#menu");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach((link) => link.addEventListener("click", () => setMenu(false)));

/* ========== 3. SCROLL REVEAL (IntersectionObserver) ========== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ========== 4. COUNT-UP NUMBER ========== */
const counter = $("[data-count]");
const counterObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  const target = Number(counter.dataset.count);
  let current = 0;
  const timer = setInterval(() => {
    current++;
    counter.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 50);
  counterObserver.disconnect();
});
counterObserver.observe(counter);

/* ========== 5. BENEFITS: hover/click swaps image ========== */
const items = $$(".benefits__list li");
const images = $$(".ph");

function showBenefit(index) {
  items.forEach((item, i) => item.classList.toggle("active", i === index));
  images.forEach((img, i) => img.classList.toggle("show", i === index));
}
items.forEach((item) => {
  const index = Number(item.dataset.img);
  item.addEventListener("mouseenter", () => showBenefit(index));
  item.addEventListener("click", () => showBenefit(index)); // for touch screens
});

/* ========== 6. MODAL ========== */
const modal = $("#modal");
const emailInput = $("#email");

function openModal() {
  modal.hidden = false;
  emailInput.focus();
}
function closeModal() {
  modal.hidden = true;
}
$$("[data-open-modal]").forEach((btn) => btn.addEventListener("click", openModal));
$("#modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal(); // click on dark backdrop
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

/* ========== 7. FORM VALIDATION (simulated) ========== */
const form = $("#form");
const message = $("#form-msg");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  message.textContent = valid
    ? "You're on the list (demo only, nothing was sent)."
    : "Please enter a valid email address.";
  if (valid) form.reset();
});

/* ========== 8. FAQ: keep only one answer open ========== */
const faqs = $$(".faq details");
faqs.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqs.forEach((other) => { if (other !== item) other.open = false; });
  });
});

/* ========== 9. MARQUEE: duplicate content for a seamless loop ========== */
const track = $(".marquee__track");
track.innerHTML += track.innerHTML;

/* ========== 10. IMAGE FALLBACK ========== */
/* If an image file is missing, hide it so the CSS gradient behind it shows instead of a broken icon. */
$$("img").forEach((img) => {
  const hide = () => { img.style.display = "none"; };
  img.addEventListener("error", hide);
  if (img.complete && img.naturalWidth === 0) hide(); // already failed before JS ran
});