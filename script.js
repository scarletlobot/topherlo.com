const terminal = document.querySelector("#terminal-output");
const bubble = document.querySelector("#scarlet-bubble");
const scarletPet = document.querySelector(".scarlet-pet");
const emailCopyButton = document.querySelector("#email-copy-button");
const emailCopyWrap = document.querySelector(".email-copy-wrap");
const introVideo = document.querySelector("#intro-video");
const brandBadge = document.querySelector("#brand-badge");
const tombstone = document.querySelector("#tombstone");
const easterItems = document.querySelectorAll("[data-easter]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let speechTimer;
let emailTimer;

const responses = {
  verify: {
    bubble: "Domain verified. Human exists. Technical competence appears suspiciously high.",
    lines: [
      "> verify chris@topherlo.com",
      "> domain: topherlo.com",
      "> human_status: real enough",
      "> recommendation: reply if the email was useful"
    ]
  },
  stats: {
    bubble: "Technical loadout looks useful. PM and BA levels fluctuate with caffeine and scope clarity.",
    lines: [
      "> load technical_expertise",
      "> ai_automation: 85",
      "> cryptocurrency: 96",
      "> stocks_ta: 91",
      "> personal_finance: 92",
      "> missions_fieldwork: 90",
      "> pm_range: 85-95",
      "> ba_range: 90-99"
    ]
  },
  trust: {
    bubble: "He can be trusted with a domain. I am still evaluating the browser tabs.",
    lines: [
      "> run trust_assessment",
      "> email_professionalism: improving",
      "> idea_velocity: high",
      "> tabs_open: classified",
      "> scarlet_verdict: promising, supervised"
    ]
  },
  reply: {
    bubble: "Replying is safe. He probably rewrote the message three times.",
    lines: [
      "> draft email_guidance",
      "> tone: thoughtful",
      "> hidden_risk: follow-up enthusiasm",
      "> suggested_action: reply"
    ]
  }
};

function renderTerminal(lines) {
  terminal.innerHTML = lines.map((line) => `<p>${line}</p>`).join("");
}

function appendTerminalLine(line) {
  if (!terminal || !line) return;
  const nextLine = document.createElement("p");
  nextLine.textContent = line;
  terminal.append(nextLine);
  while (terminal.children.length > 6) {
    terminal.firstElementChild.remove();
  }
}

function speakScarlet(message, timeout = 3200) {
  if (!bubble || !scarletPet || !message) return;
  bubble.textContent = message;
  scarletPet.classList.add("speaking");
  window.clearTimeout(speechTimer);
  speechTimer = window.setTimeout(() => scarletPet.classList.remove("speaking"), timeout);
}

document.querySelectorAll("[data-command]").forEach((control) => {
  control.addEventListener("click", () => {
    const response = responses[control.dataset.command];
    if (!response) return;
    speakScarlet(response.bubble, 5200);
    renderTerminal(response.lines);
  });
});

if (introVideo) {
  introVideo.addEventListener("click", () => {
    try {
      introVideo.currentTime = 0;
    } catch {
      // If metadata is still loading, the next loop will still handle playback.
    }
    introVideo.play().catch(() => {
      // Muted autoplay should work, but browsers can still block play calls
      // in stricter modes. The rewind is the important part.
    });
    introVideo.classList.remove("restarting");
    introVideo.getBoundingClientRect();
    introVideo.classList.add("restarting");
    appendTerminalLine("> scarlet_intro.restart: manual replay");
    speakScarlet("Replaying the intro. I was awake anyway.", 3000);
  });

  introVideo.addEventListener("animationend", () => {
    introVideo.classList.remove("restarting");
  });

  // Save battery and bandwidth: only run the loop while it is on screen.
  if ("IntersectionObserver" in window) {
    const videoWatcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          introVideo.play().catch(() => {});
        } else {
          introVideo.pause();
        }
      },
      { threshold: 0.2 }
    );
    videoWatcher.observe(introVideo);
  }
}

easterItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = Math.max(0, Math.min(1, x / rect.width));
    const py = Math.max(0, Math.min(1, y / rect.height));
    item.style.setProperty("--mx", `${px * 100}%`);
    item.style.setProperty("--my", `${py * 100}%`);
    item.style.setProperty("--ry", `${(px - 0.5) * 5}deg`);
    item.style.setProperty("--rx", `${(0.5 - py) * 5}deg`);
  });

  item.addEventListener("pointerenter", () => {
    appendTerminalLine(item.dataset.terminal);
    speakScarlet(item.dataset.bubble, 3000);
  });

  item.addEventListener("pointerleave", () => {
    item.style.setProperty("--rx", "0deg");
    item.style.setProperty("--ry", "0deg");
  });
});

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the selection-based copy path for browsers that block
      // Clipboard API writes during local preview or stricter privacy modes.
    }
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.append(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

if (emailCopyButton) {
  emailCopyButton.addEventListener("click", async () => {
    const email = emailCopyButton.dataset.email || "chris@topherlo.com";
    try {
      await copyText(email);
    } catch {
      // Keep the public interaction playful even if a browser blocks clipboard
      // access; the email is still shown plainly for manual copy.
    }
    emailCopyButton.textContent = "Copied";
    emailCopyButton.classList.add("copied");
    emailCopyWrap.classList.add("copied");
    speakScarlet("Chris says: email copied. Scarlet says: reply responsibly.", 5200);
    window.clearTimeout(emailTimer);
    emailTimer = window.setTimeout(() => {
      emailCopyButton.textContent = "Email Chris";
      emailCopyButton.classList.remove("copied");
      emailCopyWrap.classList.remove("copied");
    }, 2400);
  });
}

/* ---------------------------------------------------------------------------
 * Hidden routes. Scarlet asked for these to stay undocumented on the page.
 * ------------------------------------------------------------------------- */

function summonGhost() {
  appendTerminalLine("> ghost_protocol: engaged");
  speakScarlet("You found the ghost protocol. I was never really gone.", 5200);
  if (prefersReducedMotion.matches) return;
  const ghost = document.createElement("img");
  ghost.src = "assets/generated/scarlet-tombstone-ghost.webp";
  ghost.alt = "";
  ghost.className = "ghost-flyby";
  ghost.setAttribute("aria-hidden", "true");
  document.body.append(ghost);
  ghost.addEventListener("animationend", () => ghost.remove());
}

function pawRain() {
  appendTerminalLine("> name_invoked: scarlet.exe wags");
  speakScarlet("You said my name. Good human. Have some paws.", 4200);
  if (prefersReducedMotion.matches) return;
  for (let i = 0; i < 16; i += 1) {
    const paw = document.createElement("span");
    paw.textContent = "🐾";
    paw.className = "paw-drop";
    paw.setAttribute("aria-hidden", "true");
    paw.style.left = `${Math.random() * 96}vw`;
    paw.style.setProperty("--paw-size", `${1 + Math.random() * 1.3}rem`);
    paw.style.setProperty("--paw-duration", `${2.1 + Math.random() * 1.8}s`);
    paw.style.setProperty("--paw-delay", `${Math.random() * 0.9}s`);
    document.body.append(paw);
    paw.addEventListener("animationend", () => paw.remove());
  }
}

const konamiCode = [
  "arrowup", "arrowup", "arrowdown", "arrowdown",
  "arrowleft", "arrowright", "arrowleft", "arrowright",
  "b", "a"
];
let konamiIndex = 0;
let typedBuffer = "";

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const key = event.key.toLowerCase();

  konamiIndex = key === konamiCode[konamiIndex] ? konamiIndex + 1 : key === konamiCode[0] ? 1 : 0;
  if (konamiIndex === konamiCode.length) {
    konamiIndex = 0;
    summonGhost();
    return;
  }

  if (key.length === 1) {
    typedBuffer = (typedBuffer + key).slice(-12);
    if (typedBuffer.endsWith("scarlet")) {
      typedBuffer = "";
      pawRain();
    } else if (typedBuffer.endsWith("treat")) {
      typedBuffer = "";
      appendTerminalLine("> treat_request: logged, pending");
      speakScarlet("Treat? I am literally a ghost. ...Leave it on the desk anyway.", 4200);
    }
  }
});

if (tombstone) {
  tombstone.addEventListener("click", summonGhost);
}

if (brandBadge) {
  let brandClicks = 0;
  let brandClickTimer;
  brandBadge.addEventListener("click", () => {
    brandClicks += 1;
    window.clearTimeout(brandClickTimer);
    brandClickTimer = window.setTimeout(() => {
      brandClicks = 0;
    }, 1800);
    if (brandClicks >= 5) {
      brandClicks = 0;
      const crtOn = document.body.classList.toggle("crt");
      appendTerminalLine(`> crt_mode: ${crtOn ? "engaged, year unclear" : "disengaged"}`);
      speakScarlet(
        crtOn
          ? "CRT mode on. This is what the internet felt like when I was a puppy."
          : "CRT mode off. Back to the present, where I am software.",
        4200
      );
    }
  });
}

const hour = new Date().getHours();
if (bubble && (hour >= 23 || hour < 5)) {
  bubble.textContent = "It is very late. I am a ghost — what is your excuse?";
}

console.log(
  "%c🐾 Scarlet OS 1.1 — topherlo.com",
  "color:#92f4d6;background:#071113;padding:6px 10px;border-radius:4px;font-weight:bold;"
);
console.log(
  "There are at least four hidden routes on this page.\nThe tombstone in the footer knows one. Old gamers know another.\nSaying her name out loud does nothing. Typing it is a different story."
);
