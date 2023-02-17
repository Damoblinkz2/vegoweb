"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal-menu");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const header = document.querySelector(".header");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const imgTargets = document.querySelectorAll("img[data-src]");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

// opening the modal
const openModal = (e) => {
  e.preventDefault();
  modal.classList.remove("hide");
  overlay.classList.remove("hide");
};

//closing the modal
const closeModal = () => {
  modal.classList.add("hide");
  overlay.classList.add("hide");
};

//selecting all modal buttons
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

//closing the modal button with the escape(esc) key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//CREATING COOKIE MESSAGE
const cookieMessage = document.createElement("div");
cookieMessage.classList.add("cookie-message");

cookieMessage.innerHTML =
  'We use cookies for improved message and analytics. <button class="btns btn--close-cookie">Got it!</button>';

header.append(cookieMessage);
//removing cookie message
document.querySelector(".btn--close-cookie").addEventListener("click", () => {
  cookieMessage.remove();
});

btnScrollTo.addEventListener("click", (e) => {
  //smooth scrolling in older way
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  //smooth scrolling in modern browsers
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////////////////////////////////////
//PAGE NAVIGATION

navLinks.addEventListener("click", (e) => {
  e.preventDefault();

  //matching strategy
  if (e.target.classList.contains("nav__link")) {
    const sectionId = e.target.getAttribute("href");
    document.querySelector(sectionId).scrollIntoView({ behavior: "smooth" });
  }
});

//TAB NAVIGATION

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  ///Guard clause
  if (!clicked) return;

  ///Remove active tabs
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((tabcontent) =>
    tabcontent.classList.remove("operations__content--active")
  );

  // //Activate tab
  clicked.classList.add("operations__tab--active");

  //Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//NAV LINKS BLUR
const navHover = (e, opacity) => {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target.closest(".nav__links").querySelectorAll(".nav__link");

    link.forEach((el) => {
      if (el != e.target) {
        el.style.opacity = opacity;
      }
    });
  }
};

navLinks.addEventListener("mouseover", (e) => {
  navHover(e, 0.5);
});

navLinks.addEventListener("mouseout", (e) => {
  navHover(e, 1);
});

//STICKY NAVIGATION USING SCROLL EVENT
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", (e) => {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

//STICKY NAVIGATION:Intersection Observer API

const navHeight = nav.getBoundingClientRect().height;

//observer callback
const stickyNav = (entries) => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

//header observer option
const headerObsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, headerObsOptions);

headerObserver.observe(header);
///////////////////////////////

//REVEAL SECTIONS
const allSections = document.querySelectorAll(".section");

const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

//header observer option
const sectionObsOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  revealSection,
  sectionObsOptions
);

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

/////////////

//LAZY LOADING

const imgObserver = new IntersectionObserver(
  (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener("load", () => {
      entry.target.classList.remove("lazy-img");
    });

    observer.unobserve(entry.target);
  },
  { root: null, threshold: 0, rootMargin: "200px" }
);

imgTargets.forEach((img) => imgObserver.observe(img));
//////////////////////////////////////////////

///SLIDER
let currentSlide = 0;
const maxSlide = slides.length;

const goToSlide = (slide) => {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - currentSlide)}%)`)
  );
};

goToSlide(0);

//Next slide
const nextSlide = () => {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

//prev slide
const prevSlide = () => {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});

//for the dots nav

const dotContainer = document.querySelector(".dots");

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class='dots__dot' data-slide='${i}'></button>`
    );
  });
};

createDots();

const activateDot = (slide) => {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add("dots__dot--active");
};

dotContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dots__dot")) {
    const { slide } = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

//copyright year
document.querySelector(".currentyear").textContent = new Date().getFullYear();

// side navigation

let clickBtn = document.querySelector(".nav-icon");
let closeBtn = document.getElementById("close-btn");

// TO OPEN SIDE NAVIGATION
clickBtn.addEventListener("click", () => {
  document.querySelector(".side-bar").style.right = "0%";
});

// TO CLOSE SIDE NAVIGATION
closeBtn.addEventListener("click", () => {
  document.querySelector(".side-bar").style.right = "-100%";
});
