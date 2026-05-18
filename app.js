let projects = [
  {
    id: 218446,
    projectNo: '66',
    name: 'AK Nord Intern',
    customer: 'AK Nord',
    address: '',
    city: '',
    source: 'Kvalitetskontroll',
    startDate: '2021-02-01',
    endDate: null,
    completedAt: null,
    tripletexId: 80119906,
    status: 'Aktiv',
    openDeviations: 0
  },
  {
    id: 394461,
    projectNo: '221',
    name: 'Isoenergi Salten',
    customer: 'Isoenergi Salten AS',
    address: 'Maelenhaugen 11',
    city: 'Bodo',
    source: 'Kvalitetskontroll',
    startDate: '2022-11-14',
    endDate: null,
    completedAt: null,
    tripletexId: 133310798,
    status: 'Aktiv',
    openDeviations: 0
  },
  {
    id: 487127,
    projectNo: '270',
    name: 'Skauveien 60, Enebolig',
    customer: 'Fredrik Gjerstad',
    address: 'Skauveien 60',
    city: 'Bodo',
    source: 'Kvalitetskontroll',
    startDate: '2026-05-02',
    endDate: null,
    completedAt: null,
    tripletexId: 151827016,
    status: 'Ny',
    openDeviations: 0,
    needsAttention: true,
    attention: {
      reason: 'same_project_hours_mismatch',
      workday: '2026-05-15',
      minuteDifference: 150,
      hasUnapprovedEntries: false,
      employeeTotals: [
        { employeeId: 58013, registrationId: 14009502, minutes: 570 },
        { employeeId: 58022, registrationId: 14009736, minutes: 420 },
        { employeeId: 39070, registrationId: 14009762, minutes: 420 },
        { employeeId: 39074, registrationId: 14010153, minutes: 570 }
      ]
    }
  },
  {
    id: 533072,
    projectNo: '290',
    name: 'FHV_Enebolig, Rognan',
    customer: 'Hroar Bye',
    address: 'Skoleveien 30',
    city: 'Rognan',
    source: 'Kvalitetskontroll',
    startDate: '2024-05-01',
    endDate: null,
    completedAt: null,
    tripletexId: 164370084,
    status: 'Aktiv',
    openDeviations: 0
  },
  {
    id: 535974,
    projectNo: '293',
    name: 'Leitetunet',
    customer: 'Nordic Bodo AS',
    address: 'Maelenhaugen 11',
    city: 'Bodo',
    source: 'Kvalitetskontroll',
    startDate: '2024-03-18',
    endDate: null,
    completedAt: null,
    tripletexId: 166286866,
    status: 'Aktiv',
    openDeviations: 3,
    needsAttention: true,
    attention: {
      reason: 'same_project_hours_mismatch',
      workday: '2026-05-12',
      minuteDifference: 30,
      hasUnapprovedEntries: false,
      employeeTotals: [
        { employeeId: 39070, registrationId: 13992202, minutes: 600 },
        { employeeId: 58013, registrationId: 13992314, minutes: 570 },
        { employeeId: 39074, registrationId: 13992663, minutes: 570 }
      ]
    }
  },
  {
    id: 582974,
    projectNo: '319',
    name: 'Dyrliveien 11',
    customer: 'R.h. Invest AS',
    address: 'Rensagata 22',
    city: 'Bodo',
    source: 'Kvalitetskontroll',
    startDate: '2024-07-29',
    endDate: null,
    completedAt: null,
    tripletexId: 193981053,
    status: 'Aktiv',
    openDeviations: 32
  },
  {
    id: 689466,
    projectNo: '345',
    name: 'Ski',
    customer: 'Klavestad-entreprenor AS',
    address: 'H0505 St. Marie gate 42',
    city: 'Sarpsborg',
    source: 'Kvalitetskontroll',
    startDate: '2025-03-24',
    endDate: null,
    completedAt: null,
    tripletexId: 251581330,
    status: 'Aktiv',
    openDeviations: 0
  },
  {
    id: 754227,
    projectNo: '351',
    name: 'GJB-BT2',
    customer: 'Gunvald Johansen Bygg AS',
    address: 'Olav V gate 92',
    city: 'Bodo',
    source: 'Kvalitetskontroll',
    startDate: '2025-08-14',
    endDate: null,
    completedAt: null,
    tripletexId: 317127206,
    status: 'Avvik tung',
    openDeviations: 67
  },
  {
    id: 871404,
    projectNo: '360',
    name: 'Kjerringoy 2026',
    customer: 'Olav Hveroy',
    address: 'Hannahagen 11',
    city: 'Kjerringoy',
    source: 'Kvalitetskontroll',
    startDate: '2026-04-13',
    endDate: null,
    completedAt: null,
    tripletexId: 413001018,
    status: 'Aktiv',
    openDeviations: 0,
    needsAttention: true,
    attention: {
      reason: 'same_project_hours_mismatch',
      workday: '2026-05-16',
      minuteDifference: 30,
      hasUnapprovedEntries: true,
      employeeTotals: [
        { employeeId: 39070, registrationId: 14011141, minutes: 270 },
        { employeeId: 58022, registrationId: 14011907, minutes: 300 }
      ]
    }
  },
  {
    id: 871406,
    projectNo: '361',
    name: 'Enebolig Eikelund 10, Moss',
    customer: 'Anova Boliger AS',
    address: 'Bekkefaret 6',
    city: 'Moss',
    source: 'Kvalitetskontroll',
    startDate: '2026-04-20',
    endDate: null,
    completedAt: null,
    tripletexId: 413001139,
    status: 'Aktiv',
    openDeviations: 3
  },
  {
    id: 897237,
    projectNo: '362',
    name: 'Slettveien 5C, Halden',
    customer: 'Klavestad-entreprenor AS',
    address: 'H0505 St. Marie gate 42',
    city: 'Sarpsborg',
    source: 'Kvalitetskontroll',
    startDate: '2026-05-08',
    endDate: null,
    completedAt: null,
    tripletexId: 434521998,
    status: 'Ny',
    openDeviations: 0
  }
];

const deviations = [
  {
    id: 428048,
    number: 2,
    projectId: 871406,
    project: 'Enebolig Eikelund 10, Moss',
    title: 'Avvik i tegningen',
    status: 'Sendt',
    action: 'Se avvik',
    categories: ['Økonomi']
  },
  {
    id: 425966,
    number: 1,
    projectId: 871406,
    project: 'Enebolig Eikelund 10, Moss',
    title: 'Kolonneutskjaering',
    status: 'Sendt',
    action: 'Se avvik',
    categories: ['Økonomi']
  },
  {
    id: 428043,
    number: 67,
    projectId: 754227,
    project: 'GJB-BT2',
    title: 'Klargjoring av bad for montering av plate',
    status: 'Sendt',
    action: 'Se avvik',
    categories: ['Økonomi']
  },
  {
    id: 425224,
    number: 65,
    projectId: 754227,
    project: 'GJB-BT2',
    title: 'Stromledning gjennom yttervegg',
    status: 'Ikke sendt',
    action: 'Klargjor',
    categories: ['Økonomi']
  },
  {
    id: 422822,
    number: 64,
    projectId: 754227,
    project: 'GJB-BT2',
    title: 'Montering av beslag mot bunnsvill mellombygg',
    status: 'Ikke sendt',
    action: 'Klargjor',
    categories: ['Økonomi']
  },
  {
    id: 428182,
    number: 3,
    projectId: 535974,
    project: 'Leitetunet',
    title: 'Test',
    status: 'Sendt',
    action: 'Se avvik',
    categories: ['Økonomi']
  },
  {
    id: 428039,
    number: 2,
    projectId: 535974,
    project: 'Leitetunet',
    title: 'Beslag på fundament',
    status: 'Sendt',
    action: 'Se avvik',
    categories: ['Økonomi', 'Avventer faktura']
  },
  {
    id: 428025,
    number: 1,
    projectId: 535974,
    project: 'Leitetunet',
    title: 'Ekstra lekting',
    status: 'Sendt',
    action: 'Se avvik',
    categories: ['Økonomi', 'Avventer faktura']
  },
  {
    id: 396765,
    number: 36,
    projectId: 582974,
    project: 'Dyrliveien 11',
    title: 'Sparkling maling 3etg',
    status: 'Ikke sendt',
    action: 'Klargjor',
    categories: ['Økonomi']
  }
];

const kkSnapshot = {
  updatedAt: '2026-05-16',
  deviationCount: 104,
  unsentDeviationCount: 97
};

let projectEconomy = {
  // Real amounts should be populated from Tripletex orders/invoices and SmartKalk contract data.
};

const tripletexLiveStatus = {
  state: 'checking',
  label: 'Tikrinama',
  detail: 'Tikrinamas Tripletex test API ryšys',
  environment: 'test',
  syncedAt: null,
  projectCount: 0,
  orderCount: 0
};

const kkLiveStatus = {
  state: 'checking',
  label: 'Tikrinama',
  detail: 'Tikrinama Kvalitetskontroll automatika',
  updatedAt: '2026-05-17T17:32:29.000Z',
  hoursUpdatedAt: '2026-05-17T17:32:29.000Z',
  deviationsUpdatedAt: '2026-05-17T12:00:22.000Z'
};

const hours = [
  { employee: 'Ali Hassan', project: 'Fjordveien 18', hours: 12.5, type: 'Ekstra arbeid', state: 'Klar' },
  { employee: 'Emma Lund', project: 'Sentrum Bad', hours: 8, type: 'Timebank', state: 'Ma sjekkes' },
  { employee: 'Oskar Holm', project: 'Nordlia Rekkehus', hours: 21, type: 'Normal', state: 'Godkjent' },
  { employee: 'Ali Hassan', project: 'Fjordveien 18', hours: 26, type: 'Ekstra arbeid', state: 'Klar' }
];

const employeesById = {
  39070: { firstName: 'Egidijus', lastName: 'Smetonis' },
  39074: { firstName: 'Kestutis', lastName: 'Smetonis' },
  58013: { firstName: 'Egidijus', lastName: 'Urbonavicius' },
  58022: { firstName: 'Lukas', lastName: 'Cervinskas' }
};

const integrations = [
  { name: 'Tripletex', purpose: 'Faktura, prosjekt, kunde og produktet Ekstra arbeid', state: 'Neste steg: API-nokkel' },
  { name: 'Kvalitetskontroll', purpose: 'Avvik, timer, ansatte, prosjekter og hourbank/timebank', state: 'MCP-logikk lagt inn' },
  { name: 'SmartKalk', purpose: 'Kalkyle, budsjett og forventet margin', state: 'Neste steg: eksport/API' }
];

const money = new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
const state = { view: 'dashboard', search: '' };
const expandedProjects = new Set();
const selectedHourApprovals = {};
const hourApprovalResults = {};
const resolvedHourProjects = new Set();

const content = document.querySelector('#content');
const loginPanel = document.querySelector('#login-panel');
const title = document.querySelector('#view-title');
const metrics = document.querySelector('#metrics');
const mainPanel = document.querySelector('#main-panel');
const actionPanel = document.querySelector('#action-panel');
const search = document.querySelector('#search');
const dashboardMenuButton = document.querySelector('#dashboard-menu-button');
const dashboardMenu = document.querySelector('#dashboard-menu');
const tripletexSummaryCopy = document.querySelector('#tripletex-summary-copy');
const tripletexSummaryState = document.querySelector('#tripletex-summary-state');
const kkSummaryCopy = document.querySelector('#kk-summary-copy');
const kkSummaryState = document.querySelector('#kk-summary-state');
const currentDate = document.querySelector('#current-date');
const weatherForecast = document.querySelector('#weather-forecast');

document.querySelector('#login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  loginPanel.classList.add('hidden');
  content.classList.remove('hidden');
  render();
});

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.view = button.dataset.view;
    if (button.dataset.dashboardTitle) title.textContent = button.dataset.dashboardTitle;
    render();
  });
});

document.querySelector('#prepare-invoice').addEventListener('click', () => {
  state.view = 'faktura';
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === 'faktura'));
  render();
});

search.addEventListener('input', () => {
  state.search = search.value.trim().toLowerCase();
  render();
});

if (dashboardMenuButton && dashboardMenu) {
  dashboardMenuButton.addEventListener('click', () => {
    const isOpen = !dashboardMenu.classList.contains('hidden');
    dashboardMenu.classList.toggle('hidden', isOpen);
    dashboardMenuButton.setAttribute('aria-expanded', String(!isOpen));
  });

  dashboardMenu.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      title.textContent = `${button.dataset.dashboardType} dashboard`;
      dashboardMenu.classList.add('hidden');
      dashboardMenuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

loadTripletexStatus();
loadKvalitetskontrollStatus();
updateTopbarDate();
loadWeatherForecast();

function render() {
  const filteredProjects = filterProjects();
  document.body.classList.toggle('dashboard-screen', state.view === 'dashboard');
  renderMetrics(filteredProjects);

  if (state.view === 'dashboard') renderDashboard(filteredProjects);
  if (state.view === 'timer') renderHoursView();
  if (state.view === 'faktura') renderInvoiceView(filteredProjects);
  if (state.view === 'integrasjoner') renderIntegrationView();
}

function filterProjects() {
  if (!state.search) return projects;
  return projects.filter((project) =>
    [project.name, project.customer, project.projectNo, project.address, project.city, project.source]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(state.search))
  );
}

function updateTopbarDate() {
  if (!currentDate) return;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatted = new Intl.DateTimeFormat('lt-LT', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  currentDate.textContent = `${formatted.charAt(0).toUpperCase() + formatted.slice(1)} · ${isoWeekNumber(new Date())} sav.`;
}

function isoWeekNumber(value) {
  const date = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

async function loadWeatherForecast() {
  if (!weatherForecast) return;
  const position = await getLocalWeatherPosition();
  try {
    const params = new URLSearchParams({
      lat: String(position.latitude),
      lon: String(position.longitude)
    });
    const response = await fetch(`/api/weather?${params}`, { headers: { Accept: 'application/json' } });
    const data = await response.json();
    const temp = Math.round(data.temperature);
    const max = Math.round(data.maxTemperature);
    const min = Math.round(data.minTemperature);
    weatherForecast.href = yrLocationUrl(position);
    weatherForecast.textContent = Number.isFinite(temp)
      ? `${position.label} ${temp}°C · ${data.summary || 'Yr'} · ${min}/${max}°C`
      : 'Prognozė nepasiekiama';
  } catch {
    weatherForecast.textContent = 'Prognozė nepasiekiama';
  }
}

function yrLocationUrl(position) {
  const lat = Number(position.latitude).toFixed(4);
  const lon = Number(position.longitude).toFixed(4);
  return `https://www.yr.no/nb/v%C3%A6rvarsel/daglig-tabell/${lat},${lon}`;
}

async function getLocalWeatherPosition() {
  const fallback = fallbackWeatherPosition();
  if (!navigator.geolocation) return fallback;

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 1000 * 60 * 60 * 6
      });
    });
    const latitude = Number(position.coords.latitude.toFixed(4));
    const longitude = Number(position.coords.longitude.toFixed(4));
    return {
      latitude,
      longitude,
      label: await localPlaceLabel(latitude, longitude)
    };
  } catch {
    return fallback;
  }
}

function fallbackWeatherPosition() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (timeZone.includes('Oslo')) return { latitude: 59.9139, longitude: 10.7522, label: 'Oslo' };
  return { latitude: 59.9139, longitude: 10.7522, label: 'Vieta' };
}

async function localPlaceLabel(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      language: 'no',
      count: '1',
      format: 'json'
    });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params}`);
    const data = await response.json();
    return data.results?.[0]?.name || 'Vieta';
  } catch {
    return 'Vieta';
  }
}

function renderMetrics(list) {
  const active = list.filter((project) => project.completedAt === null).length;
  const tripletexLinked = list.filter((project) => project.tripletexId).length;
  const contractTotal = Object.values(projectEconomy).reduce((sum, item) => sum + Number(item.contract || 0), 0);

  if (state.view !== 'dashboard') {
    metrics.innerHTML = [
      metric('Aktyvūs projektai', `${active}`, '+2 nuo praeito mėn.', 'blue', '▣'),
      metric('Tripletex-koblet', `${tripletexLinked}`, 'Projektai su mapping', 'green', '▤'),
      metric('Kontraktai', contractTotal ? money.format(contractTotal) : '0 kr', tripletexLiveStatus.syncedAt ? 'Iš Tripletex test' : 'Laukia sync', 'orange', '▥'),
      metric('KK atnaujinta', kkLiveStatus.updatedAt ? formatDateTime(kkLiveStatus.updatedAt) : kkLiveStatus.label, 'Kvalitetskontroll automatika', 'purple', '◷')
    ].join('');
    return;
  }

  metrics.innerHTML = [
    largeStatusPanel('Tripletex', tripletexLiveStatus.label, `${tripletexLinked} projektai su mapping`, tripletexLiveStatus.syncedAt ? `Sync: ${formatFullDateTime(tripletexLiveStatus.syncedAt)}` : tripletexLiveStatus.detail),
    largeStatusPanel('Kvalitetskontroll', kkLiveStatus.label, `Timer: ${formatOptionalDateTime(kkLiveStatus.hoursUpdatedAt)}`, `Avvik: ${formatOptionalDateTime(kkLiveStatus.deviationsUpdatedAt)}`)
  ].join('');
}

function renderDashboard(list) {
  const ganttProjects = sortProjectsByNumberDesc(list);
  const selectedProject = ganttProjects.find((project) => expandedProjects.has(String(project.id)));
  title.textContent = 'Projektai';
  mainPanel.innerHTML = `
    <div class="panel-header">
      <div>
        <h2>Projektai</h2>
      </div>
      <span>${ganttProjects.length} vist</span>
    </div>
    <div class="year-calendar" aria-label="2026 prosjektkalender">
      <div class="calendar-top-scroll" aria-hidden="true"><div></div></div>
      <div class="calendar-scroll">
      <div class="calendar-header">
        <span>Prosjekt</span>
        ${monthLabels().map((month) => `<span>${month}</span>`).join('')}
      </div>
      <div class="calendar-body">
        ${ganttProjects.map(calendarRow).join('')}
      </div>
      </div>
    </div>
  `;
  bindCalendarScroll();
  mainPanel.querySelectorAll('.calendar-row-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const projectId = button.dataset.projectId;
      if (expandedProjects.has(projectId)) {
        expandedProjects.delete(projectId);
      } else {
        expandedProjects.add(projectId);
      }
      renderDashboard(filterProjects());
    });
  });
  actionPanel.innerHTML = projectStatusPanel(selectedProject);
  bindHourResolutionButtons(actionPanel);
  bindHourResolutionButtons(mainPanel);
}

function bindCalendarScroll() {
  const topScroll = mainPanel.querySelector('.calendar-top-scroll');
  const mainScroll = mainPanel.querySelector('.year-calendar');
  if (!topScroll || !mainScroll) return;

  topScroll.addEventListener('scroll', () => {
    mainScroll.scrollLeft = topScroll.scrollLeft;
  });
  mainScroll.addEventListener('scroll', () => {
    topScroll.scrollLeft = mainScroll.scrollLeft;
  });
}

function bindHourResolutionButtons(root) {
  root.querySelectorAll('[data-correct-hours]').forEach((button) => {
    button.addEventListener('click', () => {
      const projectNo = button.dataset.projectNo;
      const minutes = Number(button.dataset.correctMinutes);
      const selected = selectedApprovalMinutes(projectNo);
      selectedHourApprovals[projectNo] = selected.includes(minutes)
        ? selected.filter((item) => item !== minutes)
        : [...selected, minutes].sort((a, b) => a - b);
      delete hourApprovalResults[projectNo];
      renderDashboard(filterProjects());
    });
  });

  root.querySelectorAll('[data-confirm-hour-approval]').forEach((button) => {
    button.addEventListener('click', () => {
      const projectNo = button.dataset.projectNo;
      const selected = selectedApprovalMinutes(projectNo);
      if (!selected.length) return;
      hourApprovalResults[projectNo] = {
        state: 'done',
        message: `${selected.map(formatMinutes).join(' + ')} patvirtinta kaip teisingos valandos.`
      };
      resolvedHourProjects.add(projectNo);
      expandedProjects.delete(button.dataset.projectId);
      renderDashboard(filterProjects());
    });
  });
}

function selectedApprovalMinutes(projectNo) {
  const selected = selectedHourApprovals[projectNo];
  if (Array.isArray(selected)) return selected;
  if (selected) return [selected];
  return [];
}

function sortProjectsByNumberDesc(list) {
  return [...list].sort((a, b) => compareProjectNumbers(b.projectNo, a.projectNo));
}

function compareProjectNumbers(a, b) {
  const left = parseProjectNumber(a);
  const right = parseProjectNumber(b);
  if (left.main !== right.main) return left.main - right.main;
  return left.suffix - right.suffix;
}

function parseProjectNumber(value) {
  const [main, suffix = '0'] = String(value).split('-');
  return {
    main: Number.parseInt(main, 10) || 0,
    suffix: Number.parseInt(suffix, 10) || 0
  };
}

function renderDeviationView() {
  title.textContent = 'Avvik som kan bli fakturerbart arbeid';
  mainPanel.innerHTML = `
    <div class="panel-header"><div><p class="eyebrow">Avvik</p><h2>Kunde, kontrakt og faktura</h2></div></div>
    <div class="table">
      ${deviations.map((item) => `
        <div class="row">
          <strong>${item.no}</strong>
          <span>${item.project}</span>
          <span>${item.title}</span>
          <strong>${item.status}</strong>
          <button>${item.action}</button>
        </div>
      `).join('')}
    </div>
  `;
  actionPanel.innerHTML = workflowPanel('Avvik-flyt', ['Finn nytt avvik', 'Lag kundevennlig tekst', 'Opprett hourtype', 'Koble mot Tripletex Ekstra arbeid']);
}

function renderHoursView() {
  title.textContent = 'Timer klare for kontroll';
  const attentionProjects = sortProjectsByNumberDesc(projects.filter(projectNeedsAttention));
  mainPanel.innerHTML = `
    <div class="panel-header"><div><p class="eyebrow">Timer</p><h2>Godkjenning og timebank</h2></div></div>
    <section class="attention-projects">
      <div class="attention-projects-header">
        <strong>Prosjekter som krever din gjennomgang</strong>
        <span>${attentionProjects.length} prosjekt${attentionProjects.length === 1 ? '' : 'er'}</span>
      </div>
      ${attentionProjects.map((project) => `
        <article class="attention-project-row">
          <div class="attention-project-name">
            <strong>${project.projectNo} · ${project.name}</strong>
            <small>${project.customer}</small>
          </div>
          <div>
            <strong>${attentionReasonLabel(project.attention.reason)}</strong>
            <span>${project.attention.workday} · differanse ${formatMinutes(project.attention.minuteDifference)}</span>
          </div>
          <div class="attention-totals compact">
            ${project.attention.employeeTotals.map((employee) => `
              <small>${employeeShortName(employee.employeeId)}: ${formatMinutes(employee.minutes)}</small>
            `).join('')}
          </div>
          <b>${project.attention.hasUnapprovedEntries ? 'Ikke godkjent' : 'Må kontrolleres'}</b>
        </article>
      `).join('')}
    </section>
    <div class="table">
      ${hours.map((item) => `
        <div class="row">
          <strong>${item.employee}</strong>
          <span>${item.project}</span>
          <span>${item.type}</span>
          <strong>${item.hours} t</strong>
          <span class="pill ${item.state === 'Klar' ? 'green' : ''}">${item.state}</span>
        </div>
      `).join('')}
    </div>
  `;
  actionPanel.innerHTML = workflowPanel('Time-flyt', ['Importer fra Kvalitetskontroll', 'Sjekk timebank/hourbank', 'Godkjenn trygge timer', 'Send fakturagrunnlag']);
}

function renderInvoiceView(list) {
  title.textContent = 'Fakturagrunnlag';
  mainPanel.innerHTML = `
    <div class="panel-header"><div><p class="eyebrow">Tripletex</p><h2>Klar inntekt</h2></div></div>
    <div class="invoice-stack">
      ${list.map((project) => `
        <article class="invoice-item">
          <div>
            <strong>${project.name}</strong>
            <span>${project.customer} · KK ${project.id} · Tripletex ${project.tripletexId || 'mangler'}</span>
          </div>
          <strong>Ma kobles</strong>
          <button>Klargjor</button>
        </article>
      `).join('')}
    </div>
  `;
  actionPanel.innerHTML = workflowPanel('Neste faktura', ['Samle godkjente avvik', 'Legg ved dokumentasjon', 'Bruk Ekstra arbeid', 'Send til Tripletex']);
}

function renderIntegrationView() {
  title.textContent = 'Integrasjoner';
  const tripletexState = tripletexIntegrationState();
  mainPanel.innerHTML = `
    <div class="panel-header"><div><p class="eyebrow">Systemer</p><h2>Datakilder i Veidra</h2></div></div>
    <div class="integration-list">
      ${integrations.map((item) => {
        if (item.name === 'Tripletex') return { ...item, state: tripletexState };
        if (item.name === 'Kvalitetskontroll') return { ...item, state: kvalitetskontrollIntegrationState() };
        return item;
      }).map((item) => `
        <article class="integration">
          <div><strong>${item.name}</strong><p>${item.purpose}</p></div>
          <span>${item.state}</span>
        </article>
      `).join('')}
    </div>
  `;
  actionPanel.innerHTML = workflowPanel('Teknisk grunnmur', ['Login og roller', 'Database', 'API-nokler', 'Bakgrunnsjobber']);
}

async function loadKvalitetskontrollStatus() {
  updateKvalitetskontrollUi();
  try {
    const response = await fetch('/api/kvalitetskontroll/status', { headers: { Accept: 'application/json' } });
    const data = await response.json();
    if (data.ok) {
      kkLiveStatus.state = 'connected';
      kkLiveStatus.label = 'Prisijungta';
      kkLiveStatus.updatedAt = data.updatedAt;
      kkLiveStatus.hoursUpdatedAt = data.hoursUpdatedAt || kkLiveStatus.hoursUpdatedAt;
      kkLiveStatus.deviationsUpdatedAt = data.deviationsUpdatedAt || kkLiveStatus.deviationsUpdatedAt;
      kkLiveStatus.detail = `Atnaujinta ${formatFullDateTime(data.updatedAt)}`;
    } else {
      kkLiveStatus.state = 'error';
      kkLiveStatus.label = 'Klaida';
      kkLiveStatus.detail = data.message || 'Snapshot nerastas';
    }
  } catch {
    kkLiveStatus.state = 'error';
    kkLiveStatus.label = 'Klaida';
    kkLiveStatus.detail = 'Nepavyko patikrinti Kvalitetskontroll';
  }
  updateKvalitetskontrollUi();
  render();
}

async function loadTripletexStatus() {
  updateTripletexUi();
  try {
    const response = await fetch('/api/tripletex/status', { headers: { Accept: 'application/json' } });
    const data = await response.json();
    if (data.ok) {
      tripletexLiveStatus.state = 'connected';
      tripletexLiveStatus.label = 'Prisijungta';
      tripletexLiveStatus.detail = `${data.environment} API veikia`;
      tripletexLiveStatus.environment = data.environment;
      await syncTripletexData();
    } else if (data.state === 'missing_config') {
      tripletexLiveStatus.state = 'missing';
      tripletexLiveStatus.label = 'Reikia raktų';
      tripletexLiveStatus.detail = 'Įdėkite test consumer ir employee token';
      tripletexLiveStatus.environment = data.environment || 'test';
    } else {
      tripletexLiveStatus.state = 'error';
      tripletexLiveStatus.label = 'Klaida';
      tripletexLiveStatus.detail = data.message || 'Tripletex API neatsakė';
      tripletexLiveStatus.environment = data.environment || 'test';
    }
  } catch {
    tripletexLiveStatus.state = 'error';
    tripletexLiveStatus.label = 'Klaida';
    tripletexLiveStatus.detail = 'Nepavyko patikrinti Tripletex ryšio';
  }
  updateTripletexUi();
  if (state.view === 'integrasjoner') renderIntegrationView();
}

async function syncTripletexData() {
  try {
    const response = await fetch('/api/tripletex/sync', { headers: { Accept: 'application/json' } });
    const data = await response.json();
    if (!data.ok) {
      tripletexLiveStatus.detail = data.message || tripletexLiveStatus.detail;
      return;
    }

    projects = applyProjectAttention(data.projects.length ? data.projects : projects);
    projectEconomy = mergeEconomy(data.economy || {});
    tripletexLiveStatus.syncedAt = data.syncedAt;
    tripletexLiveStatus.projectCount = data.counts?.projects || data.projects.length;
    tripletexLiveStatus.orderCount = data.counts?.orders || 0;
    tripletexLiveStatus.detail = `${tripletexLiveStatus.projectCount} projektai sinchronizuoti`;
    render();
  } catch {
    tripletexLiveStatus.detail = 'Tripletex sync nepavyko';
  }
}

async function sendCorrectHours(projectNo, correctMinutes) {
  try {
    const response = await fetch('/api/kvalitetskontroll/hours/resolve-mismatch', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projectNo, correctMinutes })
    });
    const data = await response.json();
    hourApprovalResults[projectNo] = {
      state: data.ok ? 'done' : 'error',
      message: data.message || (data.ok ? 'Oppdatert i Kvalitetskontroll.' : 'Kunne ikke oppdatere Kvalitetskontroll.')
    };
  } catch {
    hourApprovalResults[projectNo] = {
      state: 'error',
      message: 'Kunne ikke kontakte Kvalitetskontroll.'
    };
  }
  renderDashboard(filterProjects());
}

function applyProjectAttention(list) {
  return list.map((project) => {
    const attention = attentionForProject(project);
    if (!attention) return project;
    if (resolvedHourProjects.has(String(project.projectNo))) {
      return {
        ...project,
        needsAttention: false,
        attention
      };
    }
    return {
      ...project,
      needsAttention: true,
      attention
    };
  });
}

function attentionForProject(project) {
  const attentionByProject = {
    270: {
      reason: 'same_project_hours_mismatch',
      workday: '2026-05-15',
      minuteDifference: 150,
      hasUnapprovedEntries: false,
      employeeTotals: [
        { employeeId: 58013, registrationId: 14009502, minutes: 570 },
        { employeeId: 58022, registrationId: 14009736, minutes: 420 },
        { employeeId: 39070, registrationId: 14009762, minutes: 420 },
        { employeeId: 39074, registrationId: 14010153, minutes: 570 }
      ]
    },
    293: {
      reason: 'same_project_hours_mismatch',
      workday: '2026-05-12',
      minuteDifference: 30,
      hasUnapprovedEntries: false,
      employeeTotals: [
        { employeeId: 39070, registrationId: 13992202, minutes: 600 },
        { employeeId: 58013, registrationId: 13992314, minutes: 570 },
        { employeeId: 39074, registrationId: 13992663, minutes: 570 }
      ]
    },
    360: {
      reason: 'same_project_hours_mismatch',
      workday: '2026-05-16',
      minuteDifference: 30,
      hasUnapprovedEntries: true,
      employeeTotals: [
        { employeeId: 39070, registrationId: 14011141, minutes: 270 },
        { employeeId: 58022, registrationId: 14011907, minutes: 300 }
      ]
    }
  };
  return attentionByProject[Number(project.projectNo)] || null;
}

function mergeEconomy(economyByProjectId) {
  return Object.fromEntries(
    Object.entries(economyByProjectId).map(([projectId, economy]) => [
      projectId,
      {
        contract: Number(economy.contract || 0),
        invoiced: Number(economy.invoiced || 0),
        source: economy.source || 'Tripletex test'
      }
    ])
  );
}

function updateTripletexUi() {
  const ok = tripletexLiveStatus.state === 'connected';

  if (!tripletexSummaryCopy || !tripletexSummaryState) return;
  const syncLine = tripletexLiveStatus.syncedAt
    ? `Sync: ${formatDateTime(tripletexLiveStatus.syncedAt)}`
    : `Aplinka: ${tripletexLiveStatus.environment}`;
  tripletexSummaryCopy.innerHTML = `${tripletexLiveStatus.detail}<br />${syncLine}`;
  tripletexSummaryState.classList.toggle('muted', !ok);
  tripletexSummaryState.classList.toggle('error', tripletexLiveStatus.state === 'error');
  tripletexSummaryState.innerHTML = '<i></i> ' + tripletexLiveStatus.label;
  updateIntegrationCardState(tripletexSummaryState, tripletexLiveStatus.state);
}

function updateKvalitetskontrollUi() {
  const ok = kkLiveStatus.state === 'connected';

  if (!kkSummaryCopy || !kkSummaryState) return;
  kkSummaryCopy.innerHTML = kkLiveStatus.updatedAt
    ? `Automatika<br />Timer: ${formatOptionalDateTime(kkLiveStatus.hoursUpdatedAt)}<br />Avvik: ${formatOptionalDateTime(kkLiveStatus.deviationsUpdatedAt)}`
    : kkLiveStatus.detail;
  kkSummaryState.classList.toggle('muted', !ok);
  kkSummaryState.classList.toggle('error', kkLiveStatus.state === 'error');
  kkSummaryState.innerHTML = '<i></i> ' + kkLiveStatus.label;
  updateIntegrationCardState(kkSummaryState, kkLiveStatus.state);
}

function updateIntegrationCardState(statusElement, state) {
  const card = statusElement.closest('.integration-card');
  if (!card) return;
  card.classList.toggle('status-connected', state === 'connected');
  card.classList.toggle('status-error', state === 'error');
  card.classList.toggle('status-muted', state !== 'connected' && state !== 'error');
}

function tripletexIntegrationState() {
  if (tripletexLiveStatus.state === 'connected' && tripletexLiveStatus.syncedAt) {
    return `Sinchronizuota: ${tripletexLiveStatus.projectCount} projektai`;
  }
  if (tripletexLiveStatus.state === 'connected') return `Test API prijungtas (${tripletexLiveStatus.environment})`;
  if (tripletexLiveStatus.state === 'missing') return 'Laukia test API raktų';
  if (tripletexLiveStatus.state === 'error') return 'API klaida';
  return 'Tikrinama';
}

function kvalitetskontrollIntegrationState() {
  if (kkLiveStatus.state === 'connected' && kkLiveStatus.updatedAt) {
    return `Atnaujinta ${formatDateTime(kkLiveStatus.updatedAt)}`;
  }
  if (kkLiveStatus.state === 'error') return 'Snapshot klaida';
  return kkLiveStatus.label;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('lt-LT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatFullDateTime(value) {
  return new Intl.DateTimeFormat('lt-LT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(value));
}

function formatOptionalDateTime(value) {
  return value ? formatFullDateTime(value) : 'nėra duomenų';
}

function metric(label, value, hint, tone, icon) {
  return `
    <article class="metric ${tone}">
      <i>${icon}</i>
      <div>
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${hint}</small>
      </div>
    </article>
  `;
}

function largeStatusPanel(label, value, lineOne, lineTwo) {
  return `
    <article class="large-status-panel">
      <div>
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
      <p>${lineOne}</p>
      <small>${lineTwo}</small>
    </article>
  `;
}

function calendarRow(project) {
  const expanded = expandedProjects.has(String(project.id));
  const needsAttention = projectNeedsAttention(project);
  const dates = getYearTimeline(project);
  const projectDeviations = deviations.filter((deviation) => deviation.projectId === project.id);
  const economy = projectEconomy[project.id] || { contract: null, invoiced: null, source: 'Tripletex/SmartKalk ikke koblet' };
  return `
    <article class="calendar-row ${expanded ? 'expanded' : ''} ${needsAttention ? 'needs-attention' : ''}">
      <button class="calendar-row-toggle" data-project-id="${project.id}" aria-expanded="${expanded}">
        <span class="calendar-project">
          <strong><i>${expanded ? '−' : '+'}</i> ${project.projectNo} · ${project.name}</strong>
          ${needsAttention ? '<em>Krever gjennomgang</em>' : ''}
        </span>
        <span class="calendar-track" aria-hidden="true">
          <span class="calendar-bar" style="left: ${dates.left}%; width: ${dates.width}%;">
            <span>${dates.label}</span>
          </span>
        </span>
      </button>
      <div class="calendar-details">
        <section class="economy-panel">
          <div class="economy-header">
            <div>
              <strong>Kontrakt vs fakturert</strong>
            </div>
            <small>${economy.source}</small>
          </div>
          ${economyChart(economy)}
        </section>
        <section class="deviation-type-panel">
          <div class="economy-header">
            <div>
              <strong>Avvik / endring</strong>
            </div>
            <small>${project.openDeviations || projectDeviations.length} registrert</small>
          </div>
          ${deviationTypeList(project, projectDeviations)}
        </section>
      </div>
    </article>
  `;
}

function attentionReasonLabel(reason) {
  if (reason === 'same_project_hours_mismatch') return 'same_project_hours_mismatch';
  return reason || 'Må vurderes';
}

function projectNeedsAttention(project) {
  return Boolean(project?.needsAttention && !resolvedHourProjects.has(String(project.projectNo)));
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  if (!rest) return `${hours} t`;
  return `${hours} t ${rest} min`;
}

function formatDecimalHours(minutes) {
  return `${String(minutes / 60).replace('.', ',')} t`;
}

function employeeShortName(employeeId) {
  const employee = employeesById[employeeId];
  if (!employee) return `Ansatt ${employeeId}`;
  return `${employee.firstName.charAt(0)}. ${employee.lastName}`;
}

function deviationTypeList(project, projectDeviations) {
  const items = projectDeviations.length ? projectDeviations : fallbackDeviationTypes(project);
  return `
    <div class="deviation-type-list">
      ${items.map((item) => deviationItem(project, item)).join('')}
    </div>
  `;
}

function deviationItem(project, item) {
  const categories = item.categories?.length ? item.categories : [item.category || 'Uten kategori'];
  return `
    <article>
      <div>
        <strong>${deviationDisplayNumber(project, item)}</strong>
        <span>${item.title}</span>
      </div>
      <div class="category-tags">
        ${categories.map((category) => `<b>${category}</b>`).join('')}
      </div>
      <small class="${item.status === 'Ikke sendt' ? 'open' : ''}">${item.status || 'Må vurderes'}</small>
    </article>
  `;
}

function deviationDisplayNumber(project, item) {
  if (item.number) return `${project.projectNo}.${item.number}`;
  return item.no || `${project.projectNo}.?`;
}

function fallbackDeviationTypes(project) {
  if (!project.openDeviations) {
    return [{ type: 'Ingen avvik registrert', no: '-', title: 'Ingen fakturerbare avvik funnet i snapshot', status: 'OK' }];
  }

  return [
    { categories: ['Økonomi'], no: `${project.projectNo}.?`, title: 'Avvik må hentes detaljert fra Kvalitetskontroll', status: 'Må vurderes' },
    { categories: ['Uten kategori'], no: '-', title: 'Koble kategori fra Kvalitetskontroll raw-data', status: 'Må vurderes' }
  ];
}

function economyChart(economy) {
  if (economy.contract === null || economy.invoiced === null) {
    return `
      <div class="economy-empty">
        <strong>Reelle okonomitall mangler</strong>
        <span>Tripletex svarte ikke med prosjektokonomi na. Nar kontrakt og faktura er koblet, vises grafen her.</span>
      </div>
    `;
  }

  const invoicedPercent = clamp((economy.invoiced / economy.contract) * 100, 0, 100);
  return `
    <div class="economy-chart" aria-label="Kontrakt mot fakturert">
      <div class="economy-row">
        <span>Kontrakt</span>
        <div><i style="width: 100%"></i></div>
        <strong>${money.format(economy.contract)}</strong>
      </div>
      <div class="economy-row invoiced">
        <span>Fakturert</span>
        <div><i style="width: ${Math.round(invoicedPercent)}%"></i></div>
        <strong>${money.format(economy.invoiced)}</strong>
      </div>
    </div>
  `;
}

function getYearTimeline(project) {
  const min = new Date('2026-01-01').getTime();
  const max = new Date('2027-12-31').getTime();
  const start = Math.max(new Date(project.startDate || '2026-01-01').getTime(), min);
  const end = Math.min(new Date(project.endDate || '2027-12-31').getTime(), max);
  const left = clamp(((start - min) / (max - min)) * 100, 0, 96);
  const width = clamp(((end - start) / (max - min)) * 100, 3, 100 - left);
  const label = `${formatBarDate(project.startDate)} - ${project.endDate ? formatBarDate(project.endDate) : 'pågår'}`;
  return { left: Math.round(left), width: Math.round(width), label };
}

function formatBarDate(value) {
  if (!value) return 'ukjent';
  return new Intl.DateTimeFormat('no-NO', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).format(new Date(value));
}

function monthLabels() {
  return [
    'Jan 26',
    'Feb',
    'Mar',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Des',
    'Jan 27',
    'Feb',
    'Mar',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Des'
  ];
}

function year(date) {
  return date ? String(date).slice(0, 4) : 'na';
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function projectStatusPanel(project) {
  return `
    <div class="panel-header"><div><p class="eyebrow">Status</p><h2>Prosjektstatus</h2></div></div>
    <div class="project-status-stack">
      ${project ? tripletexProjectStatus(project) : emptyProjectStatusCard()}
      ${project ? kvalitetskontrollProjectStatus(project) : emptyProjectStatusCard()}
      ${project ? hoursProjectStatus(project) : emptyProjectStatusCard()}
    </div>
  `;
}

function emptyProjectStatusCard() {
  return '<article class="project-status-card empty" aria-label="Tom status"></article>';
}

function tripletexProjectStatus(project) {
  const economy = projectEconomy[project.id] || { contract: null, invoiced: null, source: 'Tripletex/SmartKalk ikke koblet' };
  return `
    <article class="project-status-card">
      <div>
        <span>Tripletex</span>
        <strong>${project.tripletexId || 'Mangler ID'}</strong>
      </div>
      <p>${project.projectNo} · ${project.name}</p>
      <small>${economy.contract === null ? economy.source : `Kontrakt ${money.format(economy.contract)} · fakturert ${money.format(economy.invoiced)}`}</small>
    </article>
  `;
}

function kvalitetskontrollProjectStatus(project) {
  const kk = kvalitetskontrollProjectSnapshot(project);
  return `
    <article class="project-status-card">
      <div>
        <span>Kvalitetskontroll</span>
        <strong>KK ${kk.id}</strong>
      </div>
      <p>${kk.openDeviations} avvik/endring registrert</p>
      <small>${projectNeedsAttention(project) ? attentionReasonLabel(project.attention.reason) : 'Ingen timer-avvik markert'}</small>
    </article>
  `;
}

function hoursProjectStatus(project) {
  if (!projectNeedsAttention(project) || !project.attention) {
    return `
      <article class="project-status-card green">
        <div>
          <span>Timer</span>
          <strong>OK</strong>
        </div>
        <p>Ingen mismatch registrert for prosjektet.</p>
        <small>Klar for vanlig kontroll.</small>
      </article>
    `;
  }

  const attention = project.attention;
  const selectedMinutes = selectedApprovalMinutes(project.projectNo);
  const result = hourApprovalResults[project.projectNo];
  const correctHourOptions = [...new Set(attention.employeeTotals.map((employee) => employee.minutes))].sort((a, b) => a - b);
  return `
    <article class="project-status-card red">
      <div>
        <span>Timer</span>
        <strong>Må sjekkes</strong>
      </div>
      <p>${attention.workday} · differanse ${formatMinutes(attention.minuteDifference)}</p>
      <div class="project-status-tags">
        ${attention.employeeTotals.map((employee) => `
          <small>
            ${employeeShortName(employee.employeeId)}: ${formatMinutes(employee.minutes)}
          </small>
        `).join('')}
      </div>
      <div class="correct-hour-options" aria-label="Velg riktige timer">
        <span>Riktig tid</span>
        ${correctHourOptions.map((minutes) => `
          <button
            type="button"
            class="${selectedMinutes.includes(minutes) ? 'selected' : ''}"
            data-correct-hours
            data-project-no="${project.projectNo}"
            data-project-id="${project.id}"
            data-correct-minutes="${minutes}"
          >
            ${formatDecimalHours(minutes)}
          </button>
        `).join('')}
        <button
          type="button"
          class="confirm-hours"
          data-confirm-hour-approval
          data-project-no="${project.projectNo}"
          data-project-id="${project.id}"
          ${selectedMinutes.length ? '' : 'disabled'}
        >
          Godkjent
        </button>
      </div>
      <b>${attention.hasUnapprovedEntries ? 'Ikke alle timer er godkjent' : 'Alle synlige timer er godkjent'}</b>
      ${selectedMinutes.length ? hourApprovalCommand(project, selectedMinutes, result) : '<small>Velg en eller flere riktige tider for prosjektet.</small>'}
    </article>
  `;
}

function hourApprovalCommand(project, selectedMinutes, result) {
  return `
    <div class="approval-command ${result?.state || ''}">
      <span>Kommando</span>
      <strong>${selectedMinutes.map(formatMinutes).join(' + ')}</strong>
      ${result ? `<small>${result.message}</small>` : ''}
    </div>
  `;
}

function kvalitetskontrollProjectSnapshot(project) {
  const byProjectNo = {
    270: { id: 487127, openDeviations: 0 },
    293: { id: 535974, openDeviations: 3 },
    360: { id: 871404, openDeviations: 0 }
  };
  return byProjectNo[Number(project.projectNo)] || {
    id: project.id,
    openDeviations: project.openDeviations || 0
  };
}

function workflowPanel(title, steps) {
  return `
    <div class="panel-header"><div><p class="eyebrow">Workflow</p><h2>${title}</h2></div></div>
    <ol class="actions">${steps.map((step) => `<li><strong>${step}</strong><span>Klar for neste MVP-iterasjon.</span></li>`).join('')}</ol>
  `;
}
