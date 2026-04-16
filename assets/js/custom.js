document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".fitment-toggle").forEach(btn => {

    btn.addEventListener("click", function () {

      const alertBar = this.closest(".fitment-alert");
      const dropdown = alertBar.nextElementSibling;

      if (!dropdown || !dropdown.classList.contains("fitment-dropdown")) return;

      const isOpen = dropdown.classList.contains("is-open");

      if (isOpen) {
        // CLOSE
        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
        requestAnimationFrame(() => {
          dropdown.style.maxHeight = "0px";
        });
        dropdown.classList.remove("is-open");
        this.textContent = "Show";
      } else {
        // OPEN
        dropdown.classList.add("is-open");
        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
        this.textContent = "Hide";
      }

    });

  });

});
// Search Drop down header 
document.addEventListener('DOMContentLoaded', function () {

  const wrapper  = document.querySelector('.search-wrapper');
  const dropdown = document.querySelector('.search-dropdown');
  const input    = document.querySelector('.search-input');

  function updateDropdownWidth() {
    const rect = wrapper.getBoundingClientRect();
    const leftOffset = rect.left;

    dropdown.style.setProperty(
      '--dropdown-left',
      leftOffset + 'px'
    );
  }

  input.addEventListener('focus', () => {
    updateDropdownWidth();
    dropdown.classList.remove('d-none');
    document.body.classList.add('overflow-hidden');
  });

  window.addEventListener('resize', updateDropdownWidth);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      dropdown.classList.add('d-none');
      document.body.classList.remove('overflow-hidden');
    }
  });

});

document.addEventListener('click', function (e) {

  const trigger = e.target.closest('.js-garage-open');
  if (!trigger) return;

  e.preventDefault();

  const garageWrapper = document.querySelector('.garage-wrapper');
  if (!garageWrapper) return;

  /* 1️⃣ Scroll page to header */
  garageWrapper.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  /* 2️⃣ Small delay so header is visible */
  setTimeout(() => {

    // close others
    document
      .querySelectorAll('.garage-wrapper, .account-wrapper')
      .forEach(w => w.classList.remove('is-open'));

    // open garage
    garageWrapper.classList.add('is-open');

    // 🔒 lock state (important for hover script)
    window.activeWrapper = garageWrapper;
    window.isLocked = true;

  }, 400); // scroll settle time

});


// 🔹 1️⃣ GLOBAL HEADER CONTROLLER (Garage + Account)
(function () {

  const wrappers = document.querySelectorAll('.garage-wrapper, .account-wrapper');
  let activeWrapper = null;
  let isLocked = false;

  wrappers.forEach(wrapper => {

    /* CLICK = LOCK TOGGLE */
    wrapper.addEventListener('click', e => {
      e.stopPropagation();

      if (activeWrapper === wrapper && isLocked) {
        wrapper.classList.remove('is-open');
        activeWrapper = null;
        isLocked = false;
        return;
      }

      wrappers.forEach(w => w.classList.remove('is-open'));

      wrapper.classList.add('is-open');
      activeWrapper = wrapper;
      isLocked = true; // 🔒 lock
    });

    /* HOVER = SWITCH ONLY (NO LOCK) */
    wrapper.addEventListener('mouseenter', () => {
      if (isLocked) return;
      if (activeWrapper === wrapper) return;

      wrappers.forEach(w => w.classList.remove('is-open'));

      wrapper.classList.add('is-open');
      activeWrapper = wrapper;
    });

  });

  /* OUTSIDE CLICK */
  document.addEventListener('click', () => {
    if (isLocked) return;

    wrappers.forEach(w => w.classList.remove('is-open'));
    activeWrapper = null;
  });

})();

// 🔹 2️⃣ GARAGE PANEL SWITCH (NO OPEN/CLOSE HERE)
document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     ELEMENTS
  =============================== */
  const garageWrapper  = document.querySelector(".garage-wrapper");
  if (!garageWrapper) return;

  const garageBtn      = garageWrapper.querySelector(".garage-btn");
  const garageDropdown = garageWrapper.querySelector(".garage-dropdown");

  const panelDefault = garageWrapper.querySelector(
    ".garage-panel:not(.garage-panel--list):not(.garage-panel--add)"
  );
  const panelList = garageWrapper.querySelector(".garage-panel--list");
  const panelAdd  = garageWrapper.querySelector(".garage-panel--add");

  /* ===============================
     HELPERS
  =============================== */
  function hideAllPanels() {
    panelDefault?.classList.add("d-none");
    panelList?.classList.add("d-none");
    panelAdd?.classList.add("d-none");
  }

  function showPanel(panel) {
    hideAllPanels();
    panel?.classList.remove("d-none");
  }

  /* ===============================
     OPEN / CLOSE DROPDOWN
  =============================== */
  garageBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const isOpen = garageWrapper.classList.contains("is-open");

    document
      .querySelectorAll(".garage-wrapper.is-open")
      .forEach(w => w.classList.remove("is-open"));

    if (!isOpen) {
      garageWrapper.classList.add("is-open");
      showPanel(panelDefault);
    }
  });

  document.addEventListener("click", function () {
    garageWrapper.classList.remove("is-open");
  });

  garageDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  /* ===============================
     BUTTON ACTIONS (EVENT DELEGATION)
  =============================== */
  garageDropdown.addEventListener("click", function (e) {

    /* + Add a Vehicle (TOP PANEL) */
    if (e.target.closest(".add-vehicle-btn")) {
      e.preventDefault();
      showPanel(panelAdd);
      return;
    }

    /* + Add a Vehicle (MY GARAGE LIST) 🔥 */
    if (e.target.closest(".garage-panel--list .btn-outline.full")) {
      e.preventDefault();
      showPanel(panelAdd);
      return;
    }

    /* My Garage button */
    if (e.target.closest(".btn.primary-btn")) {
      e.preventDefault();
      showPanel(panelList);
      return;
    }

    /* Close icon */
    if (e.target.closest(".mobile-nav-close")) {
      e.preventDefault();
      garageWrapper.classList.remove("is-open");
      return;
    }

  });

});

// 🔹 3️⃣ VEHICLE STEPS (IMPORTANT FIX 🔥)
document.addEventListener("DOMContentLoaded", () => {

  const selects     = document.querySelectorAll(".usp-step-select");
  const garageAdd   = document.querySelector(".garage-panel--add");
  const garageList  = document.querySelector(".garage-panel--list");

  function closeOthers(current) {
    selects.forEach(sel => {
      if (sel !== current) {
        sel.setAttribute("aria-expanded", "false");
        const dd = sel.querySelector(".select__dropdown");
        if (dd) dd.style.display = "none";
      }
    });
  }

  selects.forEach((select, index) => {

    const dropdown = select.querySelector(".select__dropdown");
    const display  = select.querySelector(".select__display");

    select.addEventListener("click", e => {
      e.stopPropagation();
      if (select.classList.contains("usp-step-select--disabled")) return;

      const open = select.getAttribute("aria-expanded") === "true";
      closeOthers(select);

      if (!open) {
        select.setAttribute("aria-expanded", "true");
        dropdown.style.display = "block";
      }
    });

    dropdown.addEventListener("click", e => {
      e.stopPropagation();

      const option = e.target.closest(".select-option");
      if (!option) return;

      display.textContent = option.textContent;

      select.setAttribute("aria-expanded", "false");
      dropdown.style.display = "none";

      const next = selects[index + 1];
      if (next) {
        next.classList.remove("usp-step-select--disabled");
      }

      /* ✅ LAST STEP → PANEL SWITCH (NO CLOSE) */
    if (select.dataset.step === "6") {
  document.dispatchEvent(new Event("vehicle:completed"));
}
    });

  });

});
 document.addEventListener("mousedown", function (e) {
    selects.forEach(select => {
      if (!select.contains(e.target)) {
        select.setAttribute("aria-expanded", "false");
        const dd = select.querySelector(".select__dropdown");
        if (dd) dd.style.display = "none";
      }
    });
  });

  /* =========================================
   🔥 GLOBAL VEHICLE STATE CONTROLLER
   (NO HTML CHANGE REQUIRED)
========================================= */
(function () {

  function hideAllHeaderPanels() {
    document
      .querySelectorAll(".garage-wrapper .garage-panel")
      .forEach(p => p.classList.add("d-none"));
  }

  function hideHeroStates() {
    document
      .querySelectorAll("#heroChooser, #heroResult")
      .forEach(el => el.classList.add("d-none"));
  }

  function openHeaderGarageList() {
    const wrapper = document.querySelector(".garage-wrapper");
    const list = wrapper?.querySelector(".garage-panel--list");

    if (!wrapper || !list) return;

    wrapper.classList.add("is-open");
    list.classList.remove("d-none");
  }

  function openHeroResult() {
    const heroResult = document.getElementById("heroResult");
    heroResult?.classList.remove("d-none");
  }

  /* 🔥 GLOBAL EVENT LISTENER */
  document.addEventListener("vehicle:completed", () => {
    hideAllHeaderPanels();
    hideHeroStates();

    openHeaderGarageList();
    openHeroResult();
  });

})();
/* =====================================================
   🔥 MOBILE GARAGE – FINAL CONTROLLER
===================================================== */
/* =====================================================
   🚗 MOBILE GARAGE – FINAL & PERSISTENT
===================================================== */

const STORAGE_KEY = "mobileGarageVehicle";

/* ---------- HELPERS ---------- */

function setMobileGarageButton(text) {
  const btn = document.querySelector(".mobile-plus");
  if (!btn) return;

  btn.classList.add("has-vehicle");
  btn.removeAttribute("data-bs-toggle");
  btn.removeAttribute("data-bs-target");

  btn.innerHTML = `<span class="mobile-garage-text">${text}</span>`;
}

function showGarageList(modal) {
  modal.querySelector("#mobileGarageForm")?.classList.add("d-none");
  modal.querySelector("#mobileGarageList")?.classList.remove("d-none");
  modal.querySelector(".modal-content.garage-modal")
    ?.classList.add("show-garage-list");
}

function showGarageForm(modal) {
  modal.querySelector("#mobileGarageList")?.classList.add("d-none");
  modal.querySelector("#mobileGarageForm")?.classList.remove("d-none");
  modal.querySelector(".modal-content.garage-modal")
    ?.classList.remove("show-garage-list");
}

/* ---------- FORM COMPLETE ---------- */
document.addEventListener("vehicle:completed", function () {

  const scroll = document.querySelector(".garage-scroll");
  if (!scroll) return;

  const modal = scroll.closest(".modal");
  if (!modal) return;

  const values = Array.from(
    scroll.querySelectorAll(".usp-step-select .select__display")
  ).map(el => el.textContent.trim());

  const vehicleText = `${values[0]}  ${values[2]}`;

  /* save permanently */
  localStorage.setItem(STORAGE_KEY, vehicleText);

  /* update button */
  setMobileGarageButton(vehicleText);

  /* close modal */
  bootstrap.Modal.getInstance(modal)?.hide();
});

/* ---------- BUTTON CLICK ---------- */
document.addEventListener("click", function (e) {

  const btn = e.target.closest(".mobile-plus");
  if (!btn) return;

  const modal = document.getElementById("garageModal");
  if (!modal) return;

  const savedVehicle = localStorage.getItem(STORAGE_KEY);

  if (savedVehicle) {
    e.preventDefault(); // prevent default modal toggle

    /* pre-set list (no flash) */
    showGarageList(modal);

    new bootstrap.Modal(modal).show();
  }
});

/* ---------- + ADD A VEHICLE ---------- */
document.addEventListener("click", function (e) {

  if (!e.target.closest("#mobileGarageList .btn-outline.full")) return;

  const modal = document.getElementById("garageModal");
  if (!modal) return;

  /* clear saved vehicle */
  localStorage.removeItem(STORAGE_KEY);

  /* reset button */
  const btn = document.querySelector(".mobile-plus");
  if (btn) {
    btn.classList.remove("has-vehicle");
    btn.setAttribute("data-bs-toggle", "modal");
    btn.setAttribute("data-bs-target", "#garageModal");
    btn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
  }

  showGarageForm(modal);
});

/* ---------- RESTORE ON PAGE LOAD ---------- */
document.addEventListener("DOMContentLoaded", function () {

  const savedVehicle = localStorage.getItem(STORAGE_KEY);
  if (!savedVehicle) return;

  setMobileGarageButton(savedVehicle);
});

/* ===============================
   RESET ON PAGE REFRESH
================================ */
document.addEventListener("DOMContentLoaded", function () {
  localStorage.removeItem(STORAGE_KEY);
  resetMobileGarageButton();
});




 
// Accout dropdown (login / create account)
document.addEventListener("DOMContentLoaded", () => {

  const wrapper  = document.querySelector(".account-wrapper");
  const dropdown = document.querySelector(".account-dropdown");

  const loginPanel  = wrapper.querySelector(".account-panel:not(.account-panel--create)");
  const createPanel = wrapper.querySelector(".account-panel--create");

  // 🟢 Hover = open (lock state)
  wrapper.addEventListener("mouseenter", () => {
    wrapper.classList.add("is-open");
  });

  // 🔥 Click inside dropdown → band NA ho
  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // 🔴 Outside click → close
  document.addEventListener("click", () => {
    wrapper.classList.remove("is-open");
  });

  // 🔁 Create Account / Sign up
  document.querySelectorAll(".create-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      wrapper.classList.add("is-open"); // force open

      loginPanel.classList.add("d-none");
      createPanel.classList.remove("d-none");
    });
  });

  // 🔁 Back to login
  wrapper.querySelector(".back-btn").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    createPanel.classList.add("d-none");
    loginPanel.classList.remove("d-none");
  });

});


// signup passowrd show hide
document.addEventListener("click", function (e) {

  const toggleBtn = e.target.closest(".pw-toggle");
  if (!toggleBtn) return;

  const wrapper = toggleBtn.closest(".position-relative");
  const passwordInput = wrapper.querySelector(".password-field");
  const icon = toggleBtn.querySelector("i");

  if (!passwordInput) return;

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordInput.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }

});

// prdouct details Sign in / create account modal toggle
document.addEventListener("DOMContentLoaded", function () {
  const signInSection = document.getElementById("signInSection");
  const createAccountSection = document.getElementById("createAccountSection");
  const openCreateAccount = document.getElementById("openCreateAccount");
  const openSignIn = document.getElementById("openSignIn");
  const modalDialog = document.querySelector(".auth-modal");

  // Open Create Account
  openCreateAccount.addEventListener("click", function () {
    signInSection.classList.add("d-none");
    createAccountSection.classList.remove("d-none");
    modalDialog.classList.add("is-signup");
  });

  // Back to Sign In
  openSignIn.addEventListener("click", function () {
    createAccountSection.classList.add("d-none");
    signInSection.classList.remove("d-none");
    modalDialog.classList.remove("is-signup");
  });
});

// Account information
document.addEventListener("DOMContentLoaded", function () {

  const toggleBtn = document.getElementById("togglePasswordForm");
  const passwordSection = document.getElementById("passwordSection");

  toggleBtn.addEventListener("click", function () {
    passwordSection.classList.toggle("d-none");

    // Optional: button text change
    if (passwordSection.classList.contains("d-none")) {
      toggleBtn.textContent = "Update Password";
    } else {
      toggleBtn.textContent = "Update Password";
    }
  });

  // Password show / hide + color change
  document.querySelectorAll(".password-toggle").forEach(toggle => {
    toggle.addEventListener("click", function () {
      const input = this.previousElementSibling;

      if (input.type === "password") {
        input.type = "text";
        this.textContent = "Hide";
        this.style.color = "#000";
      } else {
        input.type = "password";
        this.textContent = "Show";
        this.style.color = "#c4c4c4";
      }
    });
  });

});



// My accouunt addrress page 
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".addAddressBtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = btn.getAttribute("data-target");
      const section = document.querySelector(
        '.newShippingSection[data-section="' + target + '"]'
      );

      if (!section) return;

      section.classList.toggle("d-none");

     
    });
  });
});
// my account order table load more
document.addEventListener("DOMContentLoaded", function () {
  const rows = document.querySelectorAll("#recentOrdersTable tbody tr");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  const rowsToShow = 10;
  let visibleRows = rowsToShow;

  // Hide all rows after 10
  rows.forEach((row, index) => {
    if (index >= rowsToShow) {
      row.style.display = "none";
    }
  });

  // Hide button if rows <= 10
  if (rows.length <= rowsToShow) {
    loadMoreBtn.style.display = "none";
  }

  loadMoreBtn.addEventListener("click", function () {
    rows.forEach((row, index) => {
      if (index < visibleRows + rowsToShow) {
        row.style.display = "";
      }
    });

    visibleRows += rowsToShow;

    // Hide button when all rows visible
    if (visibleRows >= rows.length) {
      loadMoreBtn.style.display = "none";
    }
  });
});



// For login menu open in Product detail page
 
document.addEventListener("DOMContentLoaded", function () {
  const accountWrapper = document.querySelector(".account-wrapper");
  const accountBtn = document.querySelector(".account-btn");

  if (!accountWrapper || !accountBtn) return;

  // 🔹 OPEN DROPDOWN FUNCTION
  function openAccountDropdown() {
    accountWrapper.classList.add("is-open");
    accountBtn.setAttribute("aria-expanded", "true");

    // Email input focus (optional but good UX)
    const emailInput = accountWrapper.querySelector('input[type="email"]');
    if (emailInput) {
      setTimeout(() => emailInput.focus(), 300);
    }
  }

  // 🔹 ACCOUNT BUTTON NORMAL TOGGLE
  accountBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = accountWrapper.classList.toggle("is-open");
    accountBtn.setAttribute("aria-expanded", isOpen);
  });

  // 🔹 LOGIN BUTTON → SCROLL TO HEADER + OPEN
  document.addEventListener("click", function (e) {
    const loginBtn = e.target.closest(".js-open-account");
    if (!loginBtn) return;

    e.preventDefault();

    // 1️⃣ Scroll to account button
    accountBtn.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    
 

    // 2️⃣ Open dropdown AFTER scroll
    setTimeout(openAccountDropdown, 500);
  });

  // 🔹 CLOSE ON OUTSIDE CLICK
  document.addEventListener("click", function (e) {
    if (!accountWrapper.contains(e.target)) {
      accountWrapper.classList.remove("is-open");
      accountBtn.setAttribute("aria-expanded", "false");
    }
  });

  // 🔹 ESC KEY CLOSE
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      accountWrapper.classList.remove("is-open");
      accountBtn.setAttribute("aria-expanded", "false");
    }
  });
});

// shipping 
  document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".shipping__addresses").forEach(container => {

    const primaryCard = container.children[0];
    let isAnimating = false;

    container.addEventListener("change", e => {
      const radio = e.target;
      if (!radio.matches('input[type="radio"]')) return;
      if (isAnimating) return;

      const selectedCard = radio.closest(".address-tile");
      isAnimating = true;

      const cardsBefore = [...container.children];
      const firstRects = new Map();
      cardsBefore.forEach(card =>
        firstRects.set(card, card.getBoundingClientRect())
      );

      let newOrder;

      if (selectedCard === primaryCard) {
        newOrder = [primaryCard, ...cardsBefore.filter(c => c !== primaryCard)];
      } else {
        newOrder = [
          selectedCard,
          primaryCard,
          ...cardsBefore.filter(c => c !== selectedCard && c !== primaryCard)
        ];
      }

      newOrder.forEach(card => container.appendChild(card));
      container.offsetHeight;

      newOrder.forEach(card => {
        const first = firstRects.get(card);
        const last = card.getBoundingClientRect();
        card.style.transition = "none";
        card.style.transform =
          `translate(${first.left - last.left}px, ${first.top - last.top}px)`;
      });

      requestAnimationFrame(() => {
        newOrder.forEach(card => {
          card.style.transition = "transform 350ms cubic-bezier(.4,0,.2,1)";
          card.style.transform = "";
        });
      });

      setTimeout(() => {
        newOrder.forEach(card => {
          card.style.transition = "";
          card.style.transform = "";
        });
        isAnimating = false;
      }, 400);
    });

  });

});

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addAddressBtn");
  const newCustomerSection = document.getElementById("newCustomerSection");
  const addressContainer = document.querySelector(".shipping__addresses");

  addBtn.addEventListener("click", () => {

    /* TOGGLE SECTION */
    newCustomerSection.classList.toggle("d-none");

    const isVisible = !newCustomerSection.classList.contains("d-none");

    /* 🔁 BUTTON TEXT TOGGLE */
    addBtn.textContent = isVisible ? "Cancel" : "Add address";

    if (isVisible) {
      // 🔴 Add address OPEN
      addressContainer.querySelectorAll(".address-tile").forEach(tile => {
        tile.classList.add("inactive-default");
        const radio = tile.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
      });
    } else {
      // 🟢 Add address CLOSED
      const firstTile = addressContainer.querySelector(".address-tile");
      if (firstTile) {
        firstTile.classList.remove("inactive-default");
        const radio = firstTile.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      }
    }

  });

});


// script use for prouct filter and qty value pick 
 document.querySelectorAll('.sort-select-wrapper .dropdown-item').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const selectedValue = this.textContent.trim();
      const wrapper = this.closest('.sort-select-wrapper');
      const valueSpan = wrapper.querySelector('.sort-value');

      valueSpan.textContent = selectedValue;
    });
  });  
  
  function loadHTML(id, file) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
      });
  }
 
  loadHTML("header", "header.html");
  loadHTML("footer", "footer.html");


  
         // Footer accordion toggle for mobile/tablet
        document.querySelectorAll('.footer-link-title').forEach(title => {
            title.addEventListener('click', function() {
                const section = this.closest('.footer-link-section');
                const list = section.querySelector('.footer-link-list');
                const isOpen = section.classList.contains('active');
                
                // Only toggle on mobile/tablet (below 992px)
                if (window.innerWidth < 992) {
                    if (isOpen) {
                        section.classList.remove('active');
                        list.style.maxHeight = '0';
                    } else {
                        // Close other sections
                        document.querySelectorAll('.footer-link-section').forEach(s => {
                            s.classList.remove('active');
                            s.querySelector('.footer-link-list').style.maxHeight = '0';
                        });
                        // Open this section
                        section.classList.add('active');
                        list.style.maxHeight = list.scrollHeight + 'px';
                    }
                }
            });
        });

        // Keep first section open on page load for mobile/tablet
        window.addEventListener('load', function() {
            if (window.innerWidth < 992) {
                const firstSection = document.querySelector('.footer-link-section');
                const firstList = firstSection.querySelector('.footer-link-list');
                // firstSection.classList.add('active');
                // firstList.style.maxHeight = firstList.scrollHeight + 'px';
            }
        });




document.addEventListener("DOMContentLoaded", function () {

  const normalize = url =>
    url.replace(/\/$/, '').replace('.html','');

  const current = normalize(window.location.pathname);

  document.querySelectorAll(".sidebar-menu a").forEach(link => {

    if (!link.getAttribute("href") || link.getAttribute("href") === "#") return;

    const linkPath = normalize(new URL(link.href).pathname);

    if (current === linkPath) {
      link.classList.add("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {

  const wrapper = document.querySelector(".garage-wrapper");
  if (!wrapper) return;

  /* CLOSE ONLY ON OUTSIDE CLICK (WHEN LOCKED) */
  document.addEventListener("click", function (e) {
    if (
      wrapper.classList.contains("is-locked") &&
      !wrapper.contains(e.target)
    ) {
      wrapper.classList.remove("is-locked");
    }
  });

});





// Promo carousel initialization (1 / 2 / 3 slides per view)
var promoSwiper = null;

function initPromoSwiper() {
    if (window.innerWidth >= 992) {
        if (!promoSwiper) {
            promoSwiper = new Swiper(".promoSwiper", {
                slidesPerView: 3,
                spaceBetween: 14,
                navigation: {
                    nextEl: ".promo-next",
                    prevEl: ".promo-prev",
                }
            });
        }
    } else {
        // destroy slider below 992px
        if (promoSwiper) {
            promoSwiper.destroy(true, true);
            promoSwiper = null;
        }
    }
}

// Initialize on load
initPromoSwiper();

// Re-check on resize
window.addEventListener("resize", function () {
    initPromoSwiper();
});



var dealsSwiper = null;

function initDealsSwiper() {
    if (window.innerWidth >= 992) {
        if (!dealsSwiper) {
            dealsSwiper = new Swiper(".dealsSwiper", {
                slidesPerView: 4,
                spaceBetween: 10,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                breakpoints: {
                    1320: { slidesPerView: 6 }
                }
            });
        }
    } else {
        // Destroy swiper below 992px
        if (dealsSwiper) {
            dealsSwiper.destroy(true, true);
            dealsSwiper = null;
        }
    }
}

// Run on load
initDealsSwiper();

// Run on resize
window.addEventListener("resize", initDealsSwiper);

// trending swiper control (init / destroy based on width)
var trendingSwiperInstance = null;

function initTrendingSwiper() {
  if (window.innerWidth >= 992) {
    if (!trendingSwiperInstance) {
      trendingSwiperInstance = new Swiper('.trendingSwiper', {
        slidesPerView: 4,    // default at >=992
        spaceBetween: 16,
        navigation: {
          nextEl: '.trending-next',
          prevEl: '.trending-prev'
        },
        breakpoints: {
          1320: { slidesPerView: 5 }
        }
      });
    }
  } else {
    if (trendingSwiperInstance) {
      trendingSwiperInstance.destroy(true, true);
      trendingSwiperInstance = null;
    }
  }
}



// init on load
document.addEventListener('DOMContentLoaded', initTrendingSwiper);
// re-check on resize (debounce optional)
window.addEventListener('resize', initTrendingSwiper);



// trending swiper control (init / destroy based on width)
var RecentlySwiperInstance = null;

function initRecentlySwiper() {
  if (window.innerWidth >= 992) {
    if (!RecentlySwiperInstance) {
      RecentlySwiperInstance = new Swiper('.RecentlySwiper', {
        slidesPerView: 4,    // default at >=992
        spaceBetween: 16,
        navigation: {
          nextEl: '.Recently-next',
          prevEl: '.Recently-prev'
        },
        breakpoints: {
          1320: { slidesPerView: 5 }
        }
      });
    }
  } else {
    if (RecentlySwiperInstance) {
      RecentlySwiperInstance.destroy(true, true);
      RecentlySwiperInstance = null;
    }
  }
}

// init on load
document.addEventListener('DOMContentLoaded', initRecentlySwiper);
// re-check on resize (debounce optional)
window.addEventListener('resize', initRecentlySwiper);


// BUILD LIST (init / destroy based on width)
var BuildListSwiperInstance = null;

function initBuildListSwiper() {
  if (window.innerWidth >= 992) {
    if (!BuildListSwiperInstance) {
      BuildListSwiperInstance = new Swiper('.BuildListSwiper', {
        slidesPerView: 3,    // default at >=992
        spaceBetween: 16,
        navigation: {
          nextEl: '.Recently-next',
          prevEl: '.Recently-prev'
        },
        breakpoints: {
          1320: { slidesPerView: 4 }
        }
      });
    }
  } else {
    if (BuildListSwiperInstance) {
      BuildListSwiperInstance.destroy(true, true);
      BuildListSwiperInstance = null;
    }
  }
}

// init on load
document.addEventListener('DOMContentLoaded', initBuildListSwiper);
// re-check on resize (debounce optional)
window.addEventListener('resize', initBuildListSwiper);


          document.addEventListener('DOMContentLoaded', function() {
            const mainCategories = document.getElementById('main-categories');
            const subCatContents = document.querySelectorAll('.sub-cat-content');

            // Function to handle category changes on desktop hover/click
            function showSubCategories(targetId) {
                // Remove active state from all main categories
                mainCategories.querySelectorAll('li').forEach(li => li.classList.remove('active'));

                // Set active state on the clicked/hovered main category
                mainCategories.querySelector(`li[data-target="${targetId}"]`).classList.add('active');

                // Hide all sub-category content
                subCatContents.forEach(content => content.style.display = 'none');

                // Show the target sub-category content
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            }

            // Desktop Interaction (Click/Hover)
            mainCategories.querySelectorAll('li').forEach(item => {
                item.addEventListener('click', function() {
                    if (window.innerWidth >= 992) {
                        showSubCategories(this.getAttribute('data-target'));
                    }
                });
                item.addEventListener('mouseenter', function() {
                    if (window.innerWidth >= 992) {
                        showSubCategories(this.getAttribute('data-target'));
                    }
                });
            });

            // Mobile/Tablet Handling (Mega Menu Hidden)
            // The Mega Menu is hidden completely via CSS media queries on screens < 992px
            // For a full mobile solution, you would typically replace this with a standard Bootstrap
            // collapsible off-canvas menu or dropdown that appears when the hamburger is clicked.
        });

   // Top Promo Slider
        new Swiper('.promoTopSlider', {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            speed: 800,
            direction: 'horizontal',
            slidesPerView: 1
        });

 

        /* Convert "What's Leading the Pack" tab grid into accordion on mobile/tablet (same HTML) */
        (function(){
            function initLeadingTabsAccordion(){
                const container = document.querySelector('.whats-leading');
                if(!container) return;
                const nav = container.querySelector('.leading-tabs');
                const tabContent = container.querySelector('#leadingTabsContent');
                let headers = [];

                function enableAccordion(){
                    if(container.classList.contains('accordion-mode')) return;
                    container.classList.add('accordion-mode');
                    if(nav) nav.style.display = 'none';

                    const cards = tabContent.querySelectorAll('.category-card');
                    cards.forEach(card => {
                       
                        if(card.dataset.accordionInit) return;
                        const info = card.querySelector('.category-info');
                        const img = card.querySelector('.category-image');
                        const titleEl = info ? (info.querySelector('h3') || info.querySelector('h5')) : null;
                        const titleText = titleEl ? titleEl.textContent.trim() : 'Item';

                        // build header
                        const header = document.createElement('div');
                        header.className = 'category-accordion-header';
                        const thumbHtml = img ? img.innerHTML : '';
                        header.innerHTML = '<div class="category-thumb">'+thumbHtml+'</div>' +
                                           '<div class="cat-right"><div class="cat-title">'+titleText+'</div><div class="cat-toggle"></div></div>';

                        // hide original image and title to avoid duplicates
                        if(img) img.style.display = 'none';
                        if(titleEl) titleEl.style.display = 'none';

                        // prepare info collapse
                        if(info){ info.style.maxHeight = '0'; info.style.overflow = 'hidden'; info.style.transition = 'max-height 0.28s ease'; }

                        header.addEventListener('click', function(){
                            const isOpen = card.classList.contains('active');
                            // close other open
                            tabContent.querySelectorAll('.category-card.active').forEach(s=>{
                                s.classList.remove('active');
                                const sInfo = s.querySelector('.category-info');
                                if(sInfo) sInfo.style.maxHeight = '0';
                            });
                            if(isOpen){
                                card.classList.remove('active');
                                if(info) info.style.maxHeight = '0';
                            } else {
                                card.classList.add('active');
                                if(info) info.style.maxHeight = info.scrollHeight + 'px';
                            }
                        });



                        // insert header before info
                        if(info) card.insertBefore(header, info);
                        card.dataset.accordionInit = '1';
                        headers.push(header);
                    });
                }

                function disableAccordion(){
                    if(!container.classList.contains('accordion-mode')) return;
                    container.classList.remove('accordion-mode');
                    if(nav) nav.style.display = '';
                    headers.forEach(header=>{
                        const card = header.closest('.category-card');
                        const info = card.querySelector('.category-info');
                        const img = card.querySelector('.category-image');
                        // remove header
                        header.remove();
                        // restore image and title visibility
                        if(img) img.style.display = '';
                        const titleEl = info ? (info.querySelector('h4') || info.querySelector('h5')) : null;
                        if(titleEl) titleEl.style.display = '';
                        if(info){ info.style.maxHeight = ''; info.style.overflow = ''; info.style.transition = ''; }
                        delete card.dataset.accordionInit;
                    });
                    headers = [];
                }

                function checkMode(){
                    if(window.innerWidth < 992) enableAccordion(); else disableAccordion();
                }

                window.addEventListener('load', checkMode);
                let _t;
                window.addEventListener('resize', function(){ clearTimeout(_t); _t = setTimeout(checkMode, 150); });
            }
            initLeadingTabsAccordion();
        })();

    /* Mobile nav: robust open/close (direct + capture-phase handlers) */
    (function(){
    const openBtn = document.querySelector('.mobile-hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavInner = mobileNav ? mobileNav.querySelector('.mobile-nav-inner') : null;
    if(!mobileNav || !mobileNavInner) return;

    function openMobileNav(){
      mobileNav.classList.add('open');
      document.body.classList.add('mobile-nav-open');
      mobileNav.setAttribute('aria-hidden','false');
    }

    function closeMobileNav(){
      mobileNav.classList.remove('open');
      document.body.classList.remove('mobile-nav-open');
      mobileNav.setAttribute('aria-hidden','true');
    }

    // Open handlers
    if(openBtn){
      openBtn.addEventListener('click', function(e){ e.preventDefault(); openMobileNav(); });
      openBtn.addEventListener('touchstart', function(e){ e.preventDefault(); openMobileNav(); }, {passive:false});
    }

    // Direct listeners on close buttons (ensure they always run)
    mobileNav.querySelectorAll('.mobile-nav-close').forEach(btn => {
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        closeMobileNav();
      });
      btn.addEventListener('touchstart', function(e){
        e.preventDefault();
        e.stopPropagation();
        closeMobileNav();
      }, {passive:false});
    });

    // Capture-phase fallback so close works even if other handlers stop propagation
    function captureCloseHandler(e){
      const closeBtn = e.target.closest('.mobile-nav-close');
      if(closeBtn){
        if(typeof e.preventDefault === 'function') e.preventDefault();
        // stop other listeners from interfering
        if(typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        closeMobileNav();
      }
    }
    document.addEventListener('pointerdown', captureCloseHandler, true);
    document.addEventListener('touchstart', captureCloseHandler, true);
    document.addEventListener('click', captureCloseHandler, true);

    // Close when clicking/tapping the overlay wrapper itself (outside inner panel)
    mobileNav.addEventListener('pointerdown', function(e){
      if(e.target === mobileNav) closeMobileNav();
    });
    mobileNav.addEventListener('click', function(e){
      if(e.target === mobileNav) closeMobileNav();
    });

    // Prevent accidental close when interacting inside the inner panel (but allow close-button)
    mobileNavInner.addEventListener('pointerdown', function(e){
      if(e.target.closest('.mobile-nav-close')) return; // let close-button handlers run
      e.stopPropagation();
    });
    // Escape to close
    window.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMobileNav();
    });
  })();
    // mobile accordion toggles (submenu open/close)
  (function(){
    const mobileNav = document.querySelector('.mobile-navigation');
    if(!mobileNav) return;

    mobileNav.addEventListener('click', function(e){
      const btn = e.target.closest('.accordion-toggle');
      if(!btn) return;
      e.preventDefault();

      const item = btn.closest('.accordion-item');
      const subId = btn.getAttribute('aria-controls');
      const sub = subId ? document.getElementById(subId) : null;
      const isOpen = item.classList.toggle('open');

      // update aria on the item
      item.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // animate maxHeight for submenu (if present)
      if(sub){
        if(isOpen){
          sub.style.maxHeight = sub.scrollHeight + 'px';
        } else {
          sub.style.maxHeight = '0';
        }
      }

      // swap the icon class (Font Awesome) plus <-> minus and update aria-label
      const icon = btn.querySelector('i');
      if(icon){
        if(isOpen){
          icon.classList.remove('fa-plus');
          icon.classList.add('fa-minus');
          btn.setAttribute('aria-label', (btn.getAttribute('aria-label') || '').replace('Expand','Collapse'));
        } else {
          icon.classList.remove('fa-minus');
          icon.classList.add('fa-plus');
          btn.setAttribute('aria-label', (btn.getAttribute('aria-label') || '').replace('Collapse','Expand'));
        }
      }
    });

    // Close all submenus initially to ensure correct maxHeight
    document.querySelectorAll('.mobile-navigation .sub-menu').forEach(sm=>{
      sm.style.maxHeight = '0';
    });

    // Also ensure toggles show plus on initial load
    document.querySelectorAll('.mobile-navigation .accordion-toggle i').forEach(i=>{
      i.classList.remove('fa-minus');
      if(!i.classList.contains('fa-plus')) i.classList.add('fa-plus');
    });
  })();


document.addEventListener('DOMContentLoaded', () => {
  // const addTocart = document.querySelector('.addToCart-sticky');
  const header = document.getElementById('productStickyHeader');
  const trigger = document.getElementById('stickyTrigger');

  const observer = new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-sticky', !entry.isIntersecting);
    // addTocart.classList.toggle('is-sticky', !entry.isIntersecting);
  });

  observer.observe(trigger);
});






document.querySelectorAll('.fb-check input').forEach(cb => {
  cb.addEventListener('change', function () {
    const item = this.closest('.fb-item');
    const status = item.querySelector('.status');

    if (this.checked) {
      item.classList.remove('inactive');
      status.textContent = 'Added';
    } else {
      item.classList.add('inactive');
      status.textContent = 'Unselected';
    }

    updateTotal();
  });
});

function updateTotal() {
  let total = 0;
  document.querySelectorAll('.fb-item').forEach(item => {
    if (!item.classList.contains('inactive')) {
      total += parseFloat(item.dataset.price);
    }
  });
  document.getElementById('totalPrice').textContent = '$' + total.toFixed(2);
}




document.addEventListener('click', function (e) {

  // OPEN CART
  if (e.target.closest('.open-cart-sidebar')) {
    document.querySelector('.cart-sidebar').classList.add('active');
    document.querySelector('.cart-overlay').classList.add('active');
  }

  // CLOSE CART
  if (
    e.target.closest('.close-cart') ||
    e.target.classList.contains('cart-overlay')
  ) {
    document.querySelector('.cart-sidebar').classList.remove('active');
    document.querySelector('.cart-overlay').classList.remove('active');
  }

});


document.querySelectorAll('.product-gallery').forEach(gallery => {

  const mainEl  = gallery.querySelector('.product-main-slider');
  const thumbEl = gallery.querySelector('.thumb-swiper');
  const thumbWrapper = thumbEl.querySelector('.swiper-wrapper');

  thumbWrapper.innerHTML = '';

  // 🔹 CREATE THUMB SLIDES
  mainEl.querySelectorAll('.swiper-slide img').forEach(img => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <img src="${img.src.replace('/800/600/', '/90/60/')}" />
    `;
    thumbWrapper.appendChild(slide);
  });

  // 🔹 THUMB SWIPER
  const thumbSwiper = new Swiper(thumbEl, {
    slidesPerView: 'auto',
    spaceBetween: 10,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    slideToClickedSlide: true,
  });

  // 🔹 MAIN SWIPER (CONNECTED PROPERLY)
  const mainSwiper = new Swiper(mainEl, {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: gallery.querySelector('.swiper-button-next'),
      prevEl: gallery.querySelector('.swiper-button-prev'),
    },
    thumbs: {
      swiper: thumbSwiper
    }
  });

});

  const buttons = document.querySelectorAll('.toggle-btn');
  const wrapper = document.getElementById('productsWrapper');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      wrapper.classList.toggle('grid-view', btn.dataset.view === 'grid');
      wrapper.classList.toggle('list-view', btn.dataset.view === 'list');
    });
  });


  document.querySelector('.sort-trigger').onclick = () => {
  document.querySelector('.sort-select').classList.toggle('open');
};


