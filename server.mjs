import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
await loadLocalEnv();
const port = Number(process.env.PORT || 4173);
const tripletexBaseUrls = {
  test: 'https://api-test.tripletex.tech',
  production: 'https://tripletex.no'
};
const tripletexSession = {
  token: null,
  expiresOn: null
};

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};

async function loadLocalEnv() {
  try {
    const text = await readFile(join(root, '.env'), 'utf8');
    text.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const separator = trimmed.indexOf('=');
      if (separator === -1) return;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
      if (key && process.env[key] === undefined) process.env[key] = value;
    });
  } catch {
    // Local .env is optional. Production should inject environment variables.
  }
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    if (url.pathname === '/healthz') {
      sendJson(res, 200, { ok: true, app: 'veidra', time: new Date().toISOString() });
      return;
    }

    if (url.pathname === '/api/weather') {
      await weatherForecast(res, url);
      return;
    }

    if (url.pathname.startsWith('/api/tripletex')) {
      await handleTripletexApi(req, res, url);
      return;
    }

    if (url.pathname === '/api/kvalitetskontroll/status') {
      await kvalitetskontrollStatus(res);
      return;
    }

    if (url.pathname === '/api/kvalitetskontroll/hours/resolve-mismatch') {
      await resolveKvalitetskontrollHours(req, res);
      return;
    }

    const requestedPath = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const cleanPath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = join(root, cleanPath);
    const file = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' });
    res.end(file);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => {
  console.log(`Veidra is running at http://localhost:${port}`);
});

async function weatherForecast(res, url) {
  const latitude = Number(url.searchParams.get('lat'));
  const longitude = Number(url.searchParams.get('lon'));
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    sendJson(res, 400, { ok: false, message: 'Missing lat/lon' });
    return;
  }

  try {
    const forecastUrl = new URL('https://api.met.no/weatherapi/locationforecast/2.0/compact');
    forecastUrl.searchParams.set('lat', latitude.toFixed(4));
    forecastUrl.searchParams.set('lon', longitude.toFixed(4));
    const response = await fetch(forecastUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Veidra/0.1 https://veidra.app'
      }
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      sendJson(res, response.status, { ok: false, message: data.error?.message || data.message || `MET Norway svarte ${response.status}` });
      return;
    }

    const forecast = mapMetForecast(data);
    sendJson(res, 200, { ok: true, source: 'MET Norway / Yr', ...forecast });
  } catch (error) {
    sendJson(res, 502, { ok: false, message: error.message });
  }
}

function mapMetForecast(data) {
  const series = data.properties?.timeseries || [];
  const current = series[0]?.data?.instant?.details || {};
  const next = series.find((item) => item.data?.next_1_hours || item.data?.next_6_hours)?.data || {};
  const symbol = next.next_1_hours?.summary?.symbol_code || next.next_6_hours?.summary?.symbol_code || 'unknown';
  const today = new Date().toISOString().slice(0, 10);
  const todayTemps = series
    .filter((item) => String(item.time || '').startsWith(today))
    .map((item) => item.data?.instant?.details?.air_temperature)
    .filter(Number.isFinite);

  return {
    temperature: current.air_temperature,
    minTemperature: todayTemps.length ? Math.min(...todayTemps) : current.air_temperature,
    maxTemperature: todayTemps.length ? Math.max(...todayTemps) : current.air_temperature,
    symbol,
    summary: weatherSymbolLabel(symbol),
    updatedAt: data.properties?.meta?.updated_at || null
  };
}

function weatherSymbolLabel(symbol) {
  const value = String(symbol || '').replace(/_(day|night|polartwilight)$/i, '');
  if (value.includes('clearsky')) return 'klart';
  if (value.includes('fair')) return 'lettskyet';
  if (value.includes('partlycloudy')) return 'delvis skyet';
  if (value.includes('cloudy')) return 'skyet';
  if (value.includes('fog')) return 'tåke';
  if (value.includes('sleet')) return 'sludd';
  if (value.includes('snow')) return 'snø';
  if (value.includes('rain')) return 'regn';
  if (value.includes('thunder')) return 'torden';
  return 'varsel';
}

async function handleTripletexApi(req, res, url) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { ok: false, message: 'Method not allowed' });
    return;
  }

  if (url.pathname === '/api/tripletex/status') {
    await tripletexStatus(res);
    return;
  }

  if (url.pathname === '/api/tripletex/projects') {
    await tripletexProjects(res);
    return;
  }

  if (url.pathname === '/api/tripletex/sync') {
    await tripletexSync(res);
    return;
  }

  sendJson(res, 404, { ok: false, message: 'Tripletex endpoint not found' });
}

async function tripletexStatus(res) {
  const config = getTripletexConfig();
  if (!config.ready) {
    sendJson(res, 200, {
      ok: false,
      state: 'missing_config',
      environment: config.environment,
      baseUrl: config.baseUrl,
      message: 'Missing TRIPLETEX_CONSUMER_TOKEN or TRIPLETEX_EMPLOYEE_TOKEN'
    });
    return;
  }

  try {
    const whoAmI = await tripletexRequest(config, '/token/session/%3EwhoAmI');
    sendJson(res, 200, {
      ok: true,
      state: 'connected',
      environment: config.environment,
      companyId: config.companyId,
      baseUrl: config.baseUrl,
      message: 'Tripletex API responded',
      value: whoAmI.value || whoAmI
    });
  } catch (error) {
    sendJson(res, 502, {
      ok: false,
      state: 'error',
      environment: config.environment,
      baseUrl: config.baseUrl,
      message: error.message
    });
  }
}

async function tripletexProjects(res) {
  const config = getTripletexConfig();
  if (!config.ready) {
    sendJson(res, 200, { ok: false, state: 'missing_config', value: [] });
    return;
  }

  try {
    const data = await tripletexRequest(
      config,
      '/project?fields=id,number,name,customer(id,name),startDate,endDate&count=1000'
    );
    sendJson(res, 200, {
      ok: true,
      state: 'connected',
      value: data.values || data.value || []
    });
  } catch (error) {
    sendJson(res, 502, { ok: false, state: 'error', message: error.message, value: [] });
  }
}

async function tripletexSync(res) {
  const config = getTripletexConfig();
  if (!config.ready) {
    sendJson(res, 200, { ok: false, state: 'missing_config', projects: [], economy: {}, syncedAt: null });
    return;
  }

  try {
    const projectsData = await tripletexRequest(
      config,
      '/project?fields=id,number,name,customer(id,name),startDate,endDate,isClosed,isReadyForInvoicing,isInternal,isFixedPrice,fixedprice,invoiceReserveTotalAmountCurrency&count=1000'
    );
    const ordersData = await tripletexRequest(
      config,
      '/order?orderDateFrom=2020-01-01&orderDateTo=2027-12-31&fields=id,number,orderDate,project(id),orderLines(description,amountExcludingVatCurrency,amountIncludingVatCurrency,isCharged)&count=1000'
    );
    const projects = (projectsData.values || projectsData.value || []).map(mapTripletexProject);
    const economy = mapProjectEconomy(ordersData.values || ordersData.value || []);

    sendJson(res, 200, {
      ok: true,
      state: 'connected',
      environment: config.environment,
      syncedAt: new Date().toISOString(),
      projects,
      economy,
      counts: {
        projects: projects.length,
        orders: (ordersData.values || ordersData.value || []).length
      }
    });
  } catch (error) {
    sendJson(res, 502, {
      ok: false,
      state: 'error',
      message: error.message,
      projects: [],
      economy: {},
      syncedAt: null
    });
  }
}

function mapTripletexProject(project) {
  return {
    id: project.id,
    projectNo: project.number || String(project.id),
    name: project.name || 'Uten navn',
    customer: project.customer?.name || (project.isInternal ? 'Intern' : ''),
    address: '',
    city: '',
    source: 'Tripletex test',
    startDate: project.startDate || new Date().toISOString().slice(0, 10),
    endDate: project.endDate || null,
    completedAt: project.isClosed ? project.endDate || new Date().toISOString().slice(0, 10) : null,
    tripletexId: project.id,
    status: project.isClosed ? 'Uždarytas' : 'Aktyvus',
    openDeviations: 0,
    isReadyForInvoicing: Boolean(project.isReadyForInvoicing),
    isFixedPrice: Boolean(project.isFixedPrice),
    contractValue: Number(project.fixedprice || project.invoiceReserveTotalAmountCurrency || 0)
  };
}

function mapProjectEconomy(orders) {
  return orders.reduce((acc, order) => {
    const projectId = order.project?.id;
    if (!projectId) return acc;

    const lines = order.orderLines || [];
    const contract = lines.reduce((sum, line) => sum + Number(line.amountExcludingVatCurrency || 0), 0);
    const invoiced = lines
      .filter((line) => line.isCharged)
      .reduce((sum, line) => sum + Number(line.amountExcludingVatCurrency || 0), 0);

    if (!acc[projectId]) {
      acc[projectId] = { contract: 0, invoiced: 0, source: 'Tripletex test order lines', orders: 0 };
    }
    acc[projectId].contract += contract;
    acc[projectId].invoiced += invoiced;
    acc[projectId].orders += 1;
    return acc;
  }, {});
}

function getTripletexConfig() {
  const environment = (process.env.TRIPLETEX_ENV || 'test').trim().toLowerCase();
  const baseUrl = (process.env.TRIPLETEX_BASE_URL || tripletexBaseUrls[environment] || tripletexBaseUrls.test).trim().replace(/\/$/, '');
  const consumerToken = (process.env.TRIPLETEX_CONSUMER_TOKEN || '').trim();
  const employeeToken = (process.env.TRIPLETEX_EMPLOYEE_TOKEN || '').trim();
  const companyId = (process.env.TRIPLETEX_COMPANY_ID || '0').trim();

  return {
    environment,
    baseUrl,
    consumerToken,
    employeeToken,
    companyId,
    ready: Boolean(consumerToken && employeeToken)
  };
}

async function kvalitetskontrollStatus(res) {
  try {
    const automation = await getKvalitetskontrollAutomationStatus();
    if (automation.updatedAt) {
      sendJson(res, 200, {
        ok: true,
        state: 'connected',
        source: 'Kvalitetskontroll automation logs',
        updatedAt: automation.updatedAt,
        hoursUpdatedAt: automation.hoursUpdatedAt,
        deviationsUpdatedAt: automation.deviationsUpdatedAt,
        message: 'Kvalitetskontroll automation logs are available'
      });
      return;
    }

    const snapshotPath = join(root, 'docs', 'kvalitetskontroll-snapshot.md');
    const file = await stat(snapshotPath);
    sendJson(res, 200, {
      ok: true,
      state: 'connected',
      source: 'Kvalitetskontroll snapshot',
      updatedAt: file.mtime.toISOString(),
      message: 'Kvalitetskontroll snapshot is available'
    });
  } catch (error) {
    sendJson(res, 200, {
      ok: false,
      state: 'missing_snapshot',
      source: 'Kvalitetskontroll snapshot',
      updatedAt: null,
      message: error.message
    });
  }
}

async function getKvalitetskontrollAutomationStatus() {
  const logsDirectories = [
    join(root, 'logs'),
    join(root, '..', 'New project', 'logs')
  ];
  const files = [];
  for (const directory of logsDirectories) {
    files.push(...(await listFilesIfExists(directory)));
  }

  const hours = latestMatchingFile(files, /^kvalitetskontroll-hours-.+\.(out\.log|err\.log|cmd)$/i);
  const deviations = latestMatchingFile(files, /^send-nye-avvik-.+\.(out\.log|err\.log|prompt\.txt)$/i);
  const latest = [hours, deviations].filter(Boolean).sort((a, b) => b.mtime - a.mtime)[0];

  return {
    updatedAt: latest?.mtime.toISOString() || null,
    hoursUpdatedAt: hours?.mtime.toISOString() || null,
    deviationsUpdatedAt: deviations?.mtime.toISOString() || null
  };
}

async function listFilesIfExists(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const filePath = join(directory, entry.name);
      const fileStat = await stat(filePath);
      files.push({ name: entry.name, path: filePath, mtime: fileStat.mtime });
    }
    return files;
  } catch {
    return [];
  }
}

function latestMatchingFile(files, pattern) {
  return files
    .filter((file) => pattern.test(file.name))
    .sort((a, b) => b.mtime - a.mtime)[0] || null;
}

async function resolveKvalitetskontrollHours(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, message: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const projectNo = String(body.projectNo || '');
    const correctMinutes = Number(body.correctMinutes);
    const mismatch = hourMismatchByProjectNo()[projectNo];

    if (!mismatch || !mismatch.allowedMinutes.includes(correctMinutes)) {
      sendJson(res, 400, { ok: false, message: 'Ugyldig timevalg for prosjektet.' });
      return;
    }

    const config = getKvalitetskontrollConfig();
    if (!config.ready) {
      sendJson(res, 200, {
        ok: false,
        state: 'missing_config',
        message: 'Kvalitetskontroll API token mangler. Valget er registrert i UI, men ikke sendt.'
      });
      return;
    }

    const results = [];
    for (const registrationId of mismatch.registrationIds) {
      const registration = await kvalitetskontrollRequest(config, 'GET', `/timetracking/registrations/${registrationId}`);
      const updatedRegistration = {
        ...registration,
        duration: correctMinutes
      };
      const updated = await kvalitetskontrollRequest(config, 'PUT', `/timetracking/registrations/${registrationId}`, updatedRegistration);
      let approval = null;
      if (!updated?.is_approved) {
        approval = await kvalitetskontrollRequest(config, 'POST', '/timetracking/approve', { id: registrationId });
      }
      results.push({ registrationId, duration: correctMinutes, approved: Boolean(updated?.is_approved || approval), updated });
    }

    sendJson(res, 200, {
      ok: true,
      state: 'updated',
      message: `${mismatch.projectNo} oppdatert til ${formatServerHours(correctMinutes)} i Kvalitetskontroll.`,
      results
    });
  } catch (error) {
    sendJson(res, 502, { ok: false, state: 'error', message: error.message });
  }
}

function hourMismatchByProjectNo() {
  return {
    270: {
      projectNo: '270',
      allowedMinutes: [420, 570],
      registrationIds: [14009502, 14009736, 14009762, 14010153]
    },
    293: {
      projectNo: '293',
      allowedMinutes: [570, 600],
      registrationIds: [13992202, 13992314, 13992663]
    },
    360: {
      projectNo: '360',
      allowedMinutes: [270, 300],
      registrationIds: [14011141, 14011907]
    }
  };
}

function getKvalitetskontrollConfig() {
  return {
    baseUrl: (process.env.KK_API_BASE || 'https://api.kvalitetskontroll.no').replace(/\/$/, ''),
    bearerToken: process.env.KK_BEARER_TOKEN || '',
    ready: Boolean(process.env.KK_BEARER_TOKEN)
  };
}

async function kvalitetskontrollRequest(config, method, path, body) {
  const response = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.bearerToken}`
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || `Kvalitetskontroll svarte ${response.status}`);
  }
  return data;
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

function formatServerHours(minutes) {
  return `${String(minutes / 60).replace('.', ',')} t`;
}

async function tripletexRequest(config, path) {
  const sessionToken = await getTripletexSessionToken(config);
  const response = await fetch(`${config.baseUrl}/v2${path}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${config.companyId}:${sessionToken}`).toString('base64')}`
    }
  });

  return readTripletexResponse(response);
}

async function getTripletexSessionToken(config) {
  const expiresOn = tomorrowDate();
  if (tripletexSession.token && tripletexSession.expiresOn === expiresOn) {
    return tripletexSession.token;
  }

  const params = new URLSearchParams({
    consumerToken: config.consumerToken,
    employeeToken: config.employeeToken,
    expirationDate: expiresOn
  });
  const response = await fetch(`${config.baseUrl}/v2/token/session/:create?${params}`, {
    method: 'PUT',
    headers: { Accept: 'application/json' }
  });
  const data = await readTripletexResponse(response);
  const token = data.value?.token || data.token;

  if (!token) {
    throw new Error('Tripletex did not return a session token');
  }

  tripletexSession.token = token;
  tripletexSession.expiresOn = expiresOn;
  return token;
}

async function readTripletexResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const validation = Array.isArray(data.validationMessages)
      ? data.validationMessages.map((item) => item.message || item.field || JSON.stringify(item)).join('; ')
      : '';
    const details = [data.message, data.developerMessage, validation]
      .filter(Boolean)
      .join(' ');
    const message = details || data.error || `Tripletex request failed with ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function tomorrowDate() {
  const osloDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Oslo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
  const date = new Date(`${osloDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}
