const terminal = document.querySelector("#terminal-output");
const bubble = document.querySelector("#scarlet-bubble");
const scarletPet = document.querySelector(".scarlet-pet");
const emailCopyButton = document.querySelector("#email-copy-button");
const emailCopyWrap = document.querySelector(".email-copy-wrap");
const introVideo = document.querySelector("#intro-video");
const easterItems = document.querySelectorAll("[data-easter]");
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
      "> ai_automation: 94",
      "> cryptocurrency: 88",
      "> stocks_ta: 91",
      "> missions_fieldwork: 90",
      "> pm_ba_range: 80-99"
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
