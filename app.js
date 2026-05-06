const plots = [
  {
    id: "a12",
    name: "Canal Roof A12",
    city: "Antwerpen",
    area: 118,
    height: "4-14 m",
    price: 34,
    status: "Dakscan + eigendom ok",
    type: "balloon",
    fit: "Reclameballon",
    reach: "31k passanten/week",
    color: "#cf604e",
    x: 250,
    y: 255,
    w: 130,
    h: 88
  },
  {
    id: "b07",
    name: "Station Tower B07",
    city: "Gent",
    area: 76,
    height: "6-18 m",
    price: 48,
    status: "Windlast goedgekeurd",
    type: "pole",
    fit: "Lichte mast",
    reach: "44k passanten/week",
    color: "#2d5f8f",
    x: 505,
    y: 205,
    w: 100,
    h: 136
  },
  {
    id: "c31",
    name: "Ring View C31",
    city: "Brussel",
    area: 164,
    height: "5-11 m",
    price: 29,
    status: "Gemeente check loopt",
    type: "banner",
    fit: "Bannerframe",
    reach: "62k passanten/week",
    color: "#e5b84b",
    x: 690,
    y: 280,
    w: 150,
    h: 72
  },
  {
    id: "d19",
    name: "Harbor Loft D19",
    city: "Rotterdam",
    area: 92,
    height: "3-10 m",
    price: 31,
    status: "Dakscan + eigendom ok",
    type: "balloon",
    fit: "Eventballon",
    reach: "22k passanten/week",
    color: "#63b7ac",
    x: 150,
    y: 330,
    w: 110,
    h: 72
  },
  {
    id: "e03",
    name: "Market Square E03",
    city: "Leuven",
    area: 54,
    height: "4-9 m",
    price: 42,
    status: "Monumentenzone ok",
    type: "banner",
    fit: "Doekframe",
    reach: "18k passanten/week",
    color: "#166c54",
    x: 415,
    y: 360,
    w: 90,
    h: 70
  }
];

const ledger = [
  ["Station Tower B07", "Lichte mast", "Borg ontvangen", "EUR 7.420", "Na live bewijs"],
  ["Canal Roof A12", "Reclameballon", "Conceptcontract", "EUR 4.012", "Maandelijks"],
  ["Market Square E03", "Bannerframe", "Vergunning check", "EUR 2.268", "Geblokkeerd"],
  ["Ring View C31", "Doekframe", "Beschikbaar", "EUR 4.756", "Niet gestart"]
];

const canvas = document.querySelector("#cityCanvas");
const ctx = canvas.getContext("2d");
const listingGrid = document.querySelector("#listingGrid");
const selectedPlot = document.querySelector("#selectedPlot");
const toast = document.querySelector("#toast");
let currentPlot = plots[0];
let activeFilter = "all";

function euro(value) {
  return `EUR ${new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 0 }).format(value)}`;
}

function drawCity() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#b9dce5");
  sky.addColorStop(0.52, "#dceee8");
  sky.addColorStop(1, "#aeb9aa");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    ctx.ellipse(90 + i * 130, 72 + (i % 3) * 24, 58, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const buildings = [
    [40, 348, 110, 152, "#596663"],
    [165, 302, 155, 198, "#74807c"],
    [337, 256, 118, 244, "#4d5a58"],
    [472, 310, 158, 190, "#687673"],
    [650, 280, 132, 220, "#53605d"],
    [804, 334, 108, 166, "#77827f"]
  ];

  buildings.forEach(([x, y, w, h, color], index) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    for (let wx = x + 16; wx < x + w - 12; wx += 28) {
      for (let wy = y + 22; wy < y + h - 24; wy += 34) {
        ctx.fillRect(wx, wy, 12, 16);
      }
    }
    ctx.fillStyle = index % 2 ? "#3f4947" : "#87918d";
    ctx.fillRect(x - 4, y - 10, w + 8, 12);
  });

  plots.forEach((plot) => {
    const selected = plot.id === currentPlot.id;
    ctx.strokeStyle = selected ? "#182024" : "rgba(24,32,36,0.45)";
    ctx.lineWidth = selected ? 4 : 2;
    ctx.setLineDash(selected ? [] : [8, 8]);
    ctx.strokeRect(plot.x, plot.y - 112, plot.w, 96);
    ctx.setLineDash([]);

    ctx.fillStyle = selected ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.36)";
    ctx.fillRect(plot.x, plot.y - 112, plot.w, 96);

    if (plot.type === "balloon") {
      ctx.fillStyle = plot.color;
      ctx.beginPath();
      ctx.ellipse(plot.x + plot.w / 2, plot.y - 78, 27, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#182024";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(plot.x + plot.w / 2, plot.y - 44);
      ctx.lineTo(plot.x + plot.w / 2, plot.y - 16);
      ctx.stroke();
    }

    if (plot.type === "pole") {
      ctx.strokeStyle = plot.color;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(plot.x + plot.w / 2, plot.y - 104);
      ctx.lineTo(plot.x + plot.w / 2, plot.y - 16);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(plot.x + plot.w / 2 - 31, plot.y - 104, 62, 28);
    }

    if (plot.type === "banner") {
      ctx.fillStyle = plot.color;
      ctx.fillRect(plot.x + 17, plot.y - 88, plot.w - 34, 34);
      ctx.strokeStyle = "#182024";
      ctx.lineWidth = 2;
      ctx.strokeRect(plot.x + 17, plot.y - 88, plot.w - 34, 34);
    }

    ctx.fillStyle = "#182024";
    ctx.font = "700 15px system-ui";
    ctx.fillText(plot.id.toUpperCase(), plot.x + 10, plot.y - 124);
  });
}

function setPlot(plot) {
  currentPlot = plot;
  document.querySelector("#plotName").textContent = plot.name;
  document.querySelector("#plotArea").textContent = `${plot.area} m2`;
  document.querySelector("#plotHeight").textContent = plot.height;
  document.querySelector("#plotPrice").textContent = `${euro(plot.price)} / m2 / maand`;
  document.querySelector("#plotStatus").textContent = plot.status;
  selectedPlot.textContent = `${plot.name} geselecteerd`;
  drawCity();
}

function renderListings() {
  const items = plots.filter((plot) => activeFilter === "all" || plot.type === activeFilter);
  listingGrid.innerHTML = items
    .map((plot) => {
      const style = plot.type === "pole"
        ? "--x:50%;--y:18%;--w:8px;--h:72px;--r:0;--c:" + plot.color
        : "--c:" + plot.color;
      return `
        <article class="listing-card">
          <div class="listing-art" style="${style}"></div>
          <div>
            <h3>${plot.name}</h3>
            <p>${plot.city} - ${plot.fit} - ${plot.reach}</p>
          </div>
          <div class="card-meta">
            <span>${plot.area} m2</span>
            <span>${euro(plot.area * plot.price)}/mnd</span>
          </div>
          <button class="secondary" data-plot="${plot.id}">Bekijk kavel</button>
        </article>
      `;
    })
    .join("");
}

function renderLedger() {
  document.querySelector("#ledgerRows").innerHTML = ledger
    .map((row) => `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td><span class="badge">${row[2]}</span></td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
      </tr>
    `)
    .join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateClaimOutput() {
  const area = Number(document.querySelector("#roofArea").value) || 0;
  const height = Number(document.querySelector("#airHeight").value) || 0;
  const rate = height > 14 ? 42 : height > 8 ? 34 : 24;
  document.querySelector("#claimOutput").textContent = `Geschatte opbrengst: ${euro(area * rate)} per maand`;
}

function updateCampaignQuote() {
  const budget = Number(document.querySelector("#budget").value);
  const days = Number(document.querySelector("#days").value);
  const locations = Math.max(1, Math.round(budget / 1250));
  const reach = Math.min(96, Math.round(46 + budget / 420 + days / 2));
  document.querySelector("#matchScore").textContent = `${locations} locaties, ${reach}% bereik`;
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = plots.find((plot) => x >= plot.x && x <= plot.x + plot.w && y >= plot.y - 112 && y <= plot.y - 16);
  if (hit) {
    setPlot(hit);
  }
});

document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderListings();
});

listingGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-plot]");
  if (!button) return;
  const plot = plots.find((item) => item.id === button.dataset.plot);
  setPlot(plot);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#reserveBtn").addEventListener("click", () => {
  showToast(`${currentPlot.name} staat klaar in je campagne-offerte.`);
});

document.querySelector("#ownerBtn").addEventListener("click", () => {
  document.querySelector("#address").focus();
  showToast("Vul je adres in om deze daklucht te claimen.");
});

document.querySelector("#claim").addEventListener("input", updateClaimOutput);
document.querySelector("#claim").addEventListener("submit", (event) => {
  event.preventDefault();
  const address = document.querySelector("#address").value || "Nieuw dak";
  showToast(`${address} is toegevoegd aan de verificatiewachtrij.`);
});

document.querySelector("#campagne").addEventListener("input", updateCampaignQuote);
document.querySelector("#campagne").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Offerte gemaakt met escrow, vergunningstaken en installatiemoment.");
});

renderListings();
renderLedger();
setPlot(currentPlot);
updateClaimOutput();
updateCampaignQuote();
