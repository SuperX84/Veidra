import 'dotenv/config';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const API_BASE = process.env.KK_API_BASE || 'https://api.kvalitetskontroll.no';
const WEB_BASE = process.env.KK_WEB_BASE || 'https://ks.kvalitetskontroll.no';
const WEB_API_BASE = process.env.KK_WEB_API_BASE || 'https://ks.kvalitetskontroll.no/api';
const DEVIATION_STATE_PATH =
  process.env.KK_DEVIATION_STATE_PATH ||
  path.join(os.homedir(), '.codex', 'kvalitetskontroll-deviation-state.json');

const endpoints = {
  index: '/index',
  me: '/me',
  owner: '/owner',
  projects: '/projects',
  employees: '/employees',
  contacts: '/contacts',
  countries: '/countries',
  vattypes: '/vattypes',
  products: '/products',
  productcategories: '/productcategories',
  productunits: '/productunits',
  hourtypes: '/timetracking/hourtypes',
  overtimetypes: '/timetracking/overtimetypes',
  additiontypes: '/timetracking/additiontypes',
  machinetypes: '/timetracking/machinetypes',
  registrations: '/timetracking/registrations',
  approveRegistration: '/timetracking/approve',
  rejectRegistration: '/timetracking/reject',
  departments: '/departments'
};

function authHeaders() {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  if (process.env.KK_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${process.env.KK_BEARER_TOKEN}`;
  }

  return headers;
}

function webAuthHeaders() {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  if (process.env.KK_WEB_COOKIE) {
    headers.Cookie = process.env.KK_WEB_COOKIE;
  }

  const cookieValues = parseCookie(process.env.KK_WEB_COOKIE || '');
  const webBearerToken = process.env.KK_WEB_BEARER_TOKEN || cookieValues.kk_api_access_token;
  if (webBearerToken) {
    headers.Authorization = `Bearer ${decodeURIComponent(webBearerToken)}`;
  }

  const xsrfToken = cookieValues['XSRF-TOKEN'] || process.env.KK_WEB_XSRF_TOKEN;
  if (xsrfToken) {
    headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }

  return headers;
}

function parseCookie(cookieHeader) {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf('=');
        if (separator === -1) return [part, ''];
        return [part.slice(0, separator), part.slice(separator + 1)];
      })
  );
}

function buildUrl(path, query = {}) {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE}${path}`);
  for (const [key, value] of Object.entries(query || {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}
function buildWebUrl(pathname, query = {}) {
  const url = new URL(pathname.startsWith('http') ? pathname : `${WEB_API_BASE}${pathname}`);
  for (const [key, value] of Object.entries(query || {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

function buildSiteUrl(pathname, query = {}) {
  const url = new URL(pathname.startsWith('http') ? pathname : `${WEB_BASE}${pathname}`);
  for (const [key, value] of Object.entries(query || {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

function setCookieHeaders(response) {
  if (typeof response.headers.getSetCookie === 'function') {
    return response.headers.getSetCookie();
  }

  const combined = response.headers.get('set-cookie');
  return combined ? combined.split(/,(?=[^;,]+=)/) : [];
}

function mergeCookies(cookieHeader, setCookies) {
  const cookies = parseCookie(cookieHeader || '');
  for (const setCookie of setCookies) {
    const firstPart = setCookie.split(';')[0];
    const separator = firstPart.indexOf('=');
    if (separator === -1) continue;
    cookies[firstPart.slice(0, separator).trim()] = firstPart.slice(separator + 1).trim();
  }

  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}

async function addFreshCsrfHeader(headers) {
  const response = await fetch(buildSiteUrl('/'), {
    method: 'GET',
    headers
  });
  const text = await response.text();
  const updatedCookieHeader = mergeCookies(headers.Cookie || '', setCookieHeaders(response));
  if (updatedCookieHeader) {
    headers.Cookie = updatedCookieHeader;
  }

  const cookieValues = parseCookie(headers.Cookie || '');
  const xsrfToken = cookieValues['XSRF-TOKEN'];
  if (xsrfToken) {
    headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }

  const csrfMatch = text.match(/<meta\s+name=["']csrf-token["']\s+content=["']([^"']+)["']/i);
  if (csrfMatch?.[1]) {
    headers['X-CSRF-TOKEN'] = csrfMatch[1];
  }
  return headers;
}

async function kkRequest(method, path, { query, body } = {}) {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: authHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  const payload = text ? parseJson(text) : null;

  if (!response.ok) {
    throw new Error(`Kvalitetskontroll API error ${response.status}: ${text}`);
  }

  return payload;
}

async function kkWebRequest(method, pathname, { query, body } = {}) {
  const headers = webAuthHeaders();
  if (!['GET', 'HEAD'].includes(method)) {
    await addFreshCsrfHeader(headers);
  }
  const response = await fetch(buildWebUrl(pathname, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  const payload = text ? parseJson(text) : null;

  if (!response.ok) {
    throw new Error(`Kvalitetskontroll web API error ${response.status}: ${text}${webAuthDebugSuffix(headers)}`);
  }

  return payload;
}

async function kkSiteRequest(method, pathname, { query, body } = {}) {
  const headers = webAuthHeaders();
  if (!['GET', 'HEAD'].includes(method)) {
    await addFreshCsrfHeader(headers);
  }
  const response = await fetch(buildSiteUrl(pathname, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  const payload = text ? parseJson(text) : null;

  if (!response.ok) {
    throw new Error(`Kvalitetskontroll site API error ${response.status}: ${text}${webAuthDebugSuffix(headers)}`);
  }

  return payload;
}

async function kkApiWithWebTokenRequest(method, path, { query, body } = {}) {
  const tokenPayload = await kkSiteRequest('GET', '/kkApi/token');
  const accessToken = tokenPayload?.access_token;
  if (!accessToken) {
    throw new Error('Could not fetch Kvalitetskontroll API token from web session.');
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };
  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  const payload = text ? parseJson(text) : null;

  if (!response.ok) {
    throw new Error(`Kvalitetskontroll API via web token error ${response.status}: ${text}`);
  }

  return payload;
}

function webAuthDebugSuffix(headers) {
  const cookieValues = parseCookie(process.env.KK_WEB_COOKIE || '');
  const diagnostics = {
    hasWebCookieEnv: Boolean(process.env.KK_WEB_COOKIE),
    webCookieLength: (process.env.KK_WEB_COOKIE || '').length,
    hasWebXsrfEnv: Boolean(process.env.KK_WEB_XSRF_TOKEN),
    webXsrfLength: (process.env.KK_WEB_XSRF_TOKEN || '').length,
    cookieNames: Object.keys(cookieValues),
    hasCookieAccessToken: Boolean(cookieValues.kk_api_access_token),
    cookieAccessTokenLength: (cookieValues.kk_api_access_token || '').length,
    hasCookieXsrf: Boolean(cookieValues['XSRF-TOKEN']),
    cookieXsrfLength: (cookieValues['XSRF-TOKEN'] || '').length,
    requestHeaderNames: Object.keys(headers)
  };
  return `\nAuth diagnostics: ${JSON.stringify(diagnostics)}`;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function jsonContent(value) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(value, null, 2)
      }
    ]
  };
}

async function readDeviationState() {
  try {
    return JSON.parse(await fs.readFile(DEVIATION_STATE_PATH, 'utf8'));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return { sentDeviationIds: [], skippedDeviationIds: [], lastRunAt: null };
    }
    throw error;
  }
}

async function writeDeviationState(state) {
  await fs.mkdir(path.dirname(DEVIATION_STATE_PATH), { recursive: true });
  await fs.writeFile(DEVIATION_STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.deviations)) return value.deviations;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

function normalizeId(value) {
  if (value === undefined || value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function deviationId(deviation) {
  return normalizeId(deviation?.id ?? deviation?.deviation_id);
}

function deviationProjectId(deviation) {
  return normalizeId(deviation?.project_id ?? deviation?.projectId ?? deviation?.project?.id);
}

function deviationProjectName(deviation) {
  return deviation?.project?.name ?? deviation?.project_name ?? deviation?.projectName ?? '';
}

function deviationNumber(deviation) {
  return (
    deviation?.number ??
    deviation?.deviation_no ??
    deviation?.deviationNo ??
    deviation?.case_no ??
    deviation?.caseNo ??
    deviationId(deviation)
  );
}

function deviationTitle(deviation) {
  return (
    deviation?.name ??
    deviation?.title ??
    deviation?.subject ??
    deviation?.description ??
    deviation?.comment ??
    `Avvik ${deviationNumber(deviation)}`
  );
}

function deviationCategories(deviation) {
  return asArray(deviation?.categories ?? deviation?.selected_categories ?? deviation?.selectedCategories)
    .map((category) => {
      if (typeof category === 'string') return { id: null, name: category };
      return {
        id: category?.id ?? category?.value ?? null,
        name: category?.name ?? category?.title ?? category?.label ?? String(category?.id ?? '').trim()
      };
    })
    .filter((category) => category.name);
}

const LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE =
  'Translate Lithuanian to Norwegian preserving the exact structure, line breaks, bullet points, numbering, meaning, scope, and all billing/invoicing/payment details. Do not summarize, omit, reinterpret, soften, or add content.';

function linePrefixes(text) {
  return String(text ?? '')
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*(?:[-*•]|\d+[.)]|[a-zA-Z][.)])\s+/)?.[0] ?? '')
    .filter(Boolean);
}

function hasBillingMeaning(text) {
  return /fakt[uū]r|s[aą]skait|apmok|mok[eė]j|betaling|faktur|regning/i.test(String(text ?? ''));
}

function validateNorwegianTranslationStructure(source, translated, fieldName) {
  if (!source || !translated) return;

  const sourceText = String(source);
  const translatedText = String(translated);
  const sourceLines = sourceText.split(/\r?\n/);
  const translatedLines = translatedText.split(/\r?\n/);
  if (sourceLines.length !== translatedLines.length) {
    throw new Error(
      `${fieldName} translation changed line structure. ${LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE}`
    );
  }

  const sourcePrefixes = linePrefixes(sourceText);
  const translatedPrefixes = linePrefixes(translatedText);
  if (sourcePrefixes.length !== translatedPrefixes.length) {
    throw new Error(
      `${fieldName} translation changed bullet or numbering structure. ${LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE}`
    );
  }

  if (hasBillingMeaning(sourceText) && !hasBillingMeaning(translatedText)) {
    throw new Error(
      `${fieldName} translation appears to remove billing/invoicing/payment meaning. ${LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE}`
    );
  }
}

function validateDeviationTranslation(deviation, { norwegianTitle, norwegianDescription }) {
  validateNorwegianTranslationStructure(deviation?.title, norwegianTitle, 'title');
  validateNorwegianTranslationStructure(deviation?.description, norwegianDescription, 'description');
}

function normalizeHourTypeTitle(value) {
  return String(value ?? '').trim();
}

async function listHourTypes() {
  return asArray(await kkRequest('GET', endpoints.hourtypes));
}

async function findHourTypeByTitle(title) {
  const normalizedTitle = normalizeHourTypeTitle(title);
  if (!normalizedTitle) return null;

  const hourTypes = await listHourTypes();
  return (
    hourTypes.find(
      (hourType) => !hourType?.deleted_at && normalizeHourTypeTitle(hourType?.title) === normalizedTitle
    ) ?? null
  );
}

async function ensureHourTypeForDeviationNumber(title, { isGlobal = true } = {}) {
  const normalizedTitle = normalizeHourTypeTitle(title);
  if (!normalizedTitle) {
    throw new Error('Cannot create hour type without a deviation number.');
  }

  const existingHourType = await findHourTypeByTitle(normalizedTitle);
  if (existingHourType) {
    return { created: false, hourType: existingHourType };
  }

  const hourType = await kkRequest('POST', endpoints.hourtypes, {
    body: {
      title: normalizedTitle,
      is_additions_disabled: false,
      is_billable: false,
      is_global: isGlobal
    }
  });

  return { created: true, hourType };
}

function normalizeTripletexName(value) {
  return String(value ?? '').trim().toLowerCase();
}

async function listTripletexActivities() {
  return asArray(await kkApiWithWebTokenRequest('GET', '/tripletex_activities'));
}

async function findTripletexActivityByName(activityName) {
  const normalizedName = normalizeTripletexName(activityName);
  if (!normalizedName) return null;

  const activities = await listTripletexActivities();
  return activities.find((activity) => normalizeTripletexName(activity?.name) === normalizedName) ?? null;
}

async function listTripletexHourTypes() {
  return asArray(await kkApiWithWebTokenRequest('GET', '/tripletex_hourtypes'));
}

async function findTripletexHourType(hourType) {
  const hourTypeId = normalizeId(hourType?.id);
  const title = normalizeHourTypeTitle(hourType?.title);
  const tripletexHourTypes = await listTripletexHourTypes();

  return (
    tripletexHourTypes.find((item) => normalizeId(item?.id) === hourTypeId) ??
    tripletexHourTypes.find((item) => normalizeHourTypeTitle(item?.title) === title) ??
    null
  );
}

async function linkHourTypeToTripletexActivity(hourType, activityName = 'Ekstra arbeid') {
  const tripletexHourType = await findTripletexHourType(hourType);
  if (!tripletexHourType) {
    throw new Error(`Hour type ${hourType?.title ?? hourType?.id} was not found in Tripletex hour type mapping list.`);
  }

  const activity = await findTripletexActivityByName(activityName);
  if (!activity) {
    throw new Error(`Tripletex activity '${activityName}' was not found.`);
  }

  if (normalizeId(tripletexHourType?.tripletex_activity?.id) === normalizeId(activity.id)) {
    return { linked: false, hourType: tripletexHourType, activity };
  }

  const payload = [
    {
      ...tripletexHourType,
      tripletex_activity: activity
    }
  ];
  const updatedHourTypes = asArray(await kkApiWithWebTokenRequest('PUT', '/tripletex_hourtypes', { body: payload }));
  const updatedHourType =
    updatedHourTypes.find((item) => normalizeId(item?.id) === normalizeId(tripletexHourType.id)) ??
    updatedHourTypes.find((item) => normalizeHourTypeTitle(item?.title) === normalizeHourTypeTitle(tripletexHourType.title)) ??
    {
      ...tripletexHourType,
      tripletex_activity: activity
    };

  return { linked: true, hourType: updatedHourType, activity };
}

function contactRecipientsByProject(contactsPayload) {
  const map = new Map();

  for (const contact of asArray(contactsPayload)) {
    const persons = asArray(contact?.persons).filter((person) => person?.email);
    if (!persons.length) continue;

    for (const project of asArray(contact?.projects)) {
      const projectId = normalizeId(project?.id ?? project?.project_id);
      if (!projectId) continue;

      const existing = map.get(projectId) || [];
      for (const person of persons) {
        if (!existing.some((entry) => entry.email === person.email)) {
          existing.push({
            id: person.id ?? null,
            name: person.full_name ?? [person.first_name, person.last_name].filter(Boolean).join(' '),
            email: person.email,
            position: person.position ?? null,
            contactId: contact.id ?? null,
            contactName: contact.name ?? contact.full_name ?? null,
            projectNumber: project.number ?? project.external_id ?? null,
            projectName: project.name ?? null
          });
        }
      }
      map.set(projectId, existing);
    }
  }

  return map;
}

function recipientsToString(recipients) {
  return [...new Set(recipients.map((recipient) => recipient.email).filter(Boolean))].join(', ');
}

// PAKEITIMAS 1: getDeviationById naudoja kkWebRequest su /deviations/${id}
async function getDeviationById(id) {
  const payload = await kkWebRequest('GET', `/deviations/${id}`);
  const deviation = payload?.deviation ?? payload?.data ?? payload;
  if (!deviation || deviationId(deviation) !== Number(id)) {
    throw new Error(`Deviation ${id} was not found in Kvalitetskontroll response.`);
  }
  return deviation;
}

async function updateDeviationText(deviationId, { norwegianTitle, norwegianDescription }) {
  const deviation = await getDeviationById(deviationId);
  validateDeviationTranslation(deviation, { norwegianTitle, norwegianDescription });
  const projectId = deviationProjectId(deviation);
  const startDate = String(deviation.date || deviation.created_at || new Date().toISOString()).slice(0, 10);

  const listPayload = await kkWebRequest('GET', `/projects/${projectId ?? -1}/deviations`, {
    query: {
      showAll: 1,
      startDate
    }
  });

  const listDeviation = asArray(listPayload).find((item) => Number(item.id) === Number(deviationId));
  const selectedCategories = asArray(listDeviation?.categories)
    .map((category) => category.id)
    .filter(Boolean);

  if (!selectedCategories.length) {
    throw new Error(`Deviation ${deviationId} has no selected categories in list response.`);
  }

  const body = {
    ...deviation,
    title: norwegianTitle ?? deviation.title,
    description: norwegianDescription ?? deviation.description,
    selected_categories: selectedCategories
  };

  // Existing image/file metadata from GET cannot be sent back as upload fields in PUT.
  // Kvalitetskontroll validates these keys as new file uploads and rejects object values.
  for (const fileField of ['images', 'files', 'attachments', 'documents']) {
    delete body[fileField];
  }

  const payload = await kkWebRequest('PUT', `/deviations/${deviationId}`, {
    body
  });

  return payload?.deviation ?? payload?.data ?? payload;
}

async function getRecipientsByProject() {
  const contactsPayload = await kkWebRequest('GET', '/contacts', {
    query: {
      display: 0,
      include: 'addresses,countries,persons,projects,categories'
    }
  });

  return contactRecipientsByProject(contactsPayload);
}

async function getProjectById(projectId) {
  return kkWebRequest('GET', `/projects/${projectId}`);
}

function projectRecipients(project) {
  const recipients = [];

  const addRecipient = (person) => {
    if (!person?.email) return;
    if (recipients.some((recipient) => recipient.email === person.email)) return;

    recipients.push({
      id: person.id ?? null,
      name: person.name ?? person.full_name ?? [person.first_name, person.last_name].filter(Boolean).join(' '),
      email: person.email,
      phone: person.phone ?? null,
      mobile: person.mobile ?? null,
      projectId: project.id ?? null,
      projectName: project.name ?? null,
      projectNumber: project.number ?? project.external_id ?? null
    });
  };

  addRecipient(project.contact_person);

  for (const person of asArray(project.contact_persons)) {
    addRecipient(person);
  }

  for (const person of asArray(project.persons)) {
    addRecipient(person);
  }

  return recipients;
}

async function listDeviationCandidates({ includeSent = false, includeSkipped = false, projectId, maxAgeDays = 14 } = {}) {
  const state = await readDeviationState();
  const since = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [deviationsPayload, contactsPayload] = await Promise.all([
    // PAKEITIMAS 2: naudoja kkWebRequest su /projects/${projectId ?? -1}/deviations
    kkWebRequest('GET', `/projects/${projectId ?? -1}/deviations`, {
      query: {
        showAll: 1,
        startDate: since
      }
    }),
    kkWebRequest('GET', '/contacts', {
      query: {
        display: 0,
        include: 'addresses,countries,persons,projects,categories'
      }
    })
  ]);

  const recipientsByProject = contactRecipientsByProject(contactsPayload);
  const sentIds = new Set(asArray(state.sentDeviationIds).map(Number));
  const skippedIds = new Set(asArray(state.skippedDeviationIds).map(Number));

  const candidates = asArray(deviationsPayload)
    .map((deviation) => {
      const id = deviationId(deviation);
      const itemProjectId = deviationProjectId(deviation);
      const recipients = recipientsByProject.get(itemProjectId) || [];
      return {
        id,
        number: deviationNumber(deviation),
        title: deviationTitle(deviation),
        description: deviation.description ?? deviation.deviation ?? deviation.comment ?? '',
        projectId: itemProjectId,
        projectName: deviationProjectName(deviation) || recipients[0]?.projectName || '',
        categories: deviationCategories(deviation),
        recipients,
        alreadySent: sentIds.has(id),
        previouslySkipped: skippedIds.has(id),
        raw: deviation
      };
    })
    .filter((candidate) => candidate.id && candidate.projectId)
    .filter((candidate) => !projectId || candidate.projectId === projectId)
    .filter((candidate) => includeSent || !candidate.alreadySent)
    .filter((candidate) => includeSkipped || !candidate.previouslySkipped);

  return { state, candidates };
}

async function markDeviationSent(id) {
  const state = await readDeviationState();
  const sentIds = new Set(asArray(state.sentDeviationIds).map(Number));
  sentIds.add(Number(id));
  state.sentDeviationIds = [...sentIds].sort((a, b) => a - b);
  state.lastRunAt = new Date().toISOString();
  await writeDeviationState(state);
  return state;
}

async function markDeviationSkipped(id, reason) {
  const state = await readDeviationState();
  const skippedIds = new Set(asArray(state.skippedDeviationIds).map(Number));
  skippedIds.add(Number(id));
  state.skippedDeviationIds = [...skippedIds].sort((a, b) => a - b);
  state.lastRunAt = new Date().toISOString();
  state.lastSkipReasons = {
    ...(state.lastSkipReasons || {}),
    [id]: reason
  };
  await writeDeviationState(state);
  return state;
}

const STANDARD_WORKDAY_MINUTES = 7.5 * 60;

function registrationId(registration) {
  return normalizeId(registration?.id ?? registration?.registration_id ?? registration?.registrationId);
}

function registrationDurationMinutes(registration) {
  const value = registration?.duration ?? registration?.minutes ?? registration?.work_minutes;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function registrationDateValue(registration) {
  return registration?.time_from ?? registration?.registration_date ?? registration?.date ?? registration?.created_at;
}

function isSaturdayRegistration(registration) {
  const dateValue = registrationDateValue(registration);
  if (!dateValue) return false;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  return date.getUTCDay() === 6;
}

function registrationNeedsTimebank(registration, standardDayMinutes = STANDARD_WORKDAY_MINUTES) {
  const duration = registrationDurationMinutes(registration);
  return isSaturdayRegistration(registration) || duration > standardDayMinutes;
}

function timebankMinutesForRegistration(registration, standardDayMinutes = STANDARD_WORKDAY_MINUTES) {
  const duration = registrationDurationMinutes(registration);
  if (isSaturdayRegistration(registration)) return duration;
  return Math.max(0, duration - standardDayMinutes);
}

function looksLithuanian(text) {
  if (!text) return false;
  return /[Ä…ÄÄ™Ä—Ä¯Å¡Å³Å«Å¾]/i.test(text) || /\b(laikinu|duru|dezes|voniu|dejimas|dÄ—jimas|aukstas|aukÅ¡tis|auksti|antras|sienu|sienos|montazas|montavimas|stalazu|akmenu|blokeliu|skardu|krovimas|stogo|ardimas|arbimas|pleveles|lektos|ciarpiu|plokstes|perdangos|klojimas|statymas|isklijuota|isauginimas|iÅ¡suginimas|svilius|stoikes)\b/i.test(text);
}

function osloDateParts(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Oslo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function osloDate(value) {
  const parts = osloDateParts(value);
  return parts ? `${parts.year}-${parts.month}-${parts.day}` : value;
}

function osloDateTime(value) {
  const parts = osloDateParts(value);
  return parts ? `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}` : value;
}

function timeRegistrationPutBody(registration, { comment } = {}) {
  return {
    id: registrationId(registration),
    user: { id: normalizeId(registration?.user?.id ?? registration?.user_id) },
    project: { id: normalizeId(registration?.project?.id ?? registration?.project_id) },
    temp_project_label: registration?.temp_project_label ?? '',
    registration_date: osloDate(registration?.time_from ?? registration?.registration_date),
    hour_type_id: normalizeId(registration?.hour_type?.id ?? registration?.hour_type_id),
    time_from: osloDateTime(registration?.time_from),
    time_to: osloDateTime(registration?.time_to),
    break: registration?.break ?? 0,
    duration: registrationDurationMinutes(registration),
    comment: comment ?? registration?.comment ?? '',
    department_id: normalizeId(registration?.department?.id ?? registration?.department_id),
    user_efficiency_factor: registration?.user_efficiency_factor ?? '1.00000',
    salary_export_id: registration?.salary_export_id ?? null,
    project_node_external_id: registration?.project_node_external_id ?? null,
    project_node_id: registration?.project_node_id ?? null
  };
}

function compactRegistration(registration, standardDayMinutes = STANDARD_WORKDAY_MINUTES) {
  const duration = registrationDurationMinutes(registration);
  const timebankMinutes = timebankMinutesForRegistration(registration, standardDayMinutes);
  return {
    id: registrationId(registration),
    userId: normalizeId(registration?.user?.id ?? registration?.user_id),
    projectId: normalizeId(registration?.project?.id ?? registration?.project_id),
    registrationDate: registration?.registration_date ?? null,
    timeFrom: registration?.time_from ?? null,
    timeTo: registration?.time_to ?? null,
    break: registration?.break ?? null,
    duration,
    comment: registration?.comment ?? '',
    isApproved: Boolean(registration?.is_approved),
    isDeleted: Boolean(registration?.deleted_at),
    isSaturday: isSaturdayRegistration(registration),
    requiresTimebank: registrationNeedsTimebank(registration, standardDayMinutes),
    timebankMinutes,
    hasHourbankUrl: Boolean(registration?.hourbank),
    hourbank: registration?.hourbank ?? null,
    hourTypeId: normalizeId(registration?.hour_type?.id ?? registration?.hour_type_id),
    needsNorwegianComment: looksLithuanian(registration?.comment ?? '')
  };
}

async function listTimeRegistrationsRaw({ fromDate, toDate, updatedFrom, updatedTo, offset = 0, limit = 100, projectIds, userIds } = {}) {
  return kkRequest('GET', endpoints.registrations, {
    query: {
      project_ids: projectIds,
      user_ids: userIds,
      from_date: fromDate,
      to_date: toDate,
      updated_from: updatedFrom,
      updated_to: updatedTo,
      offset,
      limit
    }
  });
}

async function processTimeRegistrationForAutomation({ registrationId: id, norwegianComment, approve = true, standardDayMinutes = STANDARD_WORKDAY_MINUTES }) {
  let registration = await kkRequest('GET', `${endpoints.registrations}/${id}`);
  const original = compactRegistration(registration, standardDayMinutes);

  if (original.isDeleted) {
    return { processed: false, approved: false, skipped: true, reason: 'Registration is deleted.', registration: original };
  }
  if (original.isApproved) {
    return { processed: false, approved: true, skipped: true, reason: 'Registration is already approved.', registration: original };
  }

  const oldComment = registration?.comment ?? '';
  let commentUpdated = false;
  if (norwegianComment !== undefined && norwegianComment !== null && norwegianComment !== oldComment) {
    validateNorwegianTranslationStructure(oldComment, norwegianComment, 'comment');
    registration = await kkRequest('PUT', `${endpoints.registrations}/${id}`, {
      body: timeRegistrationPutBody(registration, { comment: norwegianComment })
    });
    commentUpdated = true;
  }

  const updated = compactRegistration(registration, standardDayMinutes);
  if (updated.requiresTimebank) {
    let hourbank = null;
    if (!updated.hasHourbankUrl) {
      hourbank = await kkRequest('POST', `${endpoints.registrations}/${id}/hourbank`, {
        body: { duration: updated.timebankMinutes }
      });
      updated.hourbankStatus = 'created';
    } else {
      hourbank = await kkRequest('GET', `${endpoints.registrations}/${id}/hourbank`);
      updated.hourbankStatus = 'matched';
    }

    const hourbankDuration = Number(hourbank?.duration);
    if (!Number.isFinite(hourbankDuration) || hourbankDuration !== updated.timebankMinutes) {
      return {
        processed: commentUpdated,
        approved: false,
        skipped: true,
        reason: `Registration requires ${updated.timebankMinutes} timebank minutes, but hourbank endpoint returned ${hourbank?.duration ?? 'no duration'}.`,
        registration: updated,
        hourbank
      };
    }

    updated.hourbankId = normalizeId(hourbank?.id);
  }

  if (looksLithuanian(oldComment) && !norwegianComment) {
    return {
      processed: false,
      approved: false,
      skipped: true,
      reason: 'Registration comment appears Lithuanian; provide norwegianComment before approval.',
      registration: updated
    };
  }

  const approvalResponse = approve
    ? await kkRequest('POST', endpoints.approveRegistration, { body: { id } })
    : null;

  return {
    processed: true,
    approved: Boolean(approve),
    skipped: false,
    commentUpdated,
    registration: updated,
    approvalResponse
  };
}

const server = new McpServer({
  name: 'kvalitetskontroll',
  version: '0.1.0'
});

server.tool('kk_me', 'Fetch the authenticated Kvalitetskontroll user.', {}, async () => {
  return jsonContent(await kkRequest('GET', endpoints.me));
});

server.tool('kk_list_projects', 'List projects from Kvalitetskontroll.', {}, async () => {
  return jsonContent(await kkRequest('GET', endpoints.projects));
});

server.tool('kk_list_employees', 'List employees from Kvalitetskontroll.', {}, async () => {
  return jsonContent(await kkRequest('GET', endpoints.employees));
});

server.tool(
  'kk_list_time_registrations',
  'List time registrations from Kvalitetskontroll.',
  {
    projectIds: z.array(z.number()).optional(),
    userIds: z.array(z.number()).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    updatedFrom: z.string().optional(),
    updatedTo: z.string().optional(),
    isApproved: z.boolean().optional(),
    includeDeleted: z.boolean().optional(),
    offset: z.number().optional(),
    limit: z.number().optional()
  },
  async ({ projectIds, userIds, fromDate, toDate, updatedFrom, updatedTo, isApproved, includeDeleted, offset, limit }) => {
    return jsonContent(
      await kkRequest('GET', endpoints.registrations, {
        query: {
          project_ids: projectIds,
          user_ids: userIds,
          from_date: fromDate,
          to_date: toDate,
          updated_from: updatedFrom,
          updated_to: updatedTo,
          is_approved: isApproved === undefined ? undefined : Number(isApproved),
          include_deleted: includeDeleted === undefined ? undefined : Number(includeDeleted),
          offset,
          limit
        }
      })
    );
  }
);

server.tool(
  'kk_list_time_registrations_for_auto_approval',
  'List Kvalitetskontroll time registrations for the hours automation. The tool filters deleted/approved items locally and marks which registrations require timebank handling before approval.',
  {
    projectIds: z.array(z.number()).optional(),
    userIds: z.array(z.number()).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    updatedFrom: z.string().optional(),
    updatedTo: z.string().optional(),
    offset: z.number().default(0),
    limit: z.number().default(100),
    standardDayMinutes: z.number().default(STANDARD_WORKDAY_MINUTES)
  },
  async ({ projectIds, userIds, fromDate, toDate, updatedFrom, updatedTo, offset, limit, standardDayMinutes }) => {
    const payload = await listTimeRegistrationsRaw({
      projectIds,
      userIds,
      fromDate,
      toDate,
      updatedFrom,
      updatedTo,
      offset,
      limit
    });
    const registrations = asArray(payload);
    const candidates = registrations
      .map((registration) => compactRegistration(registration, standardDayMinutes))
      .filter((registration) => !registration.isDeleted)
      .filter((registration) => !registration.isApproved);

    return jsonContent({
      count: candidates.length,
      totalReturned: registrations.length,
      offset,
      limit,
      standardDayMinutes,
      registrations: candidates
    });
  }
);

server.tool(
  'kk_process_time_registration_for_auto_approval',
  `Update and approve one Kvalitetskontroll time registration for the hours automation. The tool fetches the full registration first, updates the comment with a Norwegian translation when provided, refuses approval when timebank correction is required but not safely available, and only approves safe registrations. Translation rule: ${LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE}`,
  {
    registrationId: z.number(),
    norwegianComment: z.string().describe(LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE).optional(),
    approve: z.boolean().default(true),
    standardDayMinutes: z.number().default(STANDARD_WORKDAY_MINUTES)
  },
  async ({ registrationId, norwegianComment, approve, standardDayMinutes }) => {
    return jsonContent(
      await processTimeRegistrationForAutomation({
        registrationId,
        norwegianComment,
        approve,
        standardDayMinutes
      })
    );
  }
);

server.tool(
  'kk_get_time_registration_hourbank',
  'Fetch the hourbank endpoint for one time registration. Use this to discover whether Kvalitetskontroll exposes a safe timebank correction payload before approving overtime or Saturday registrations.',
  {
    registrationId: z.number()
  },
  async ({ registrationId }) => {
    return jsonContent(await kkRequest('GET', `${endpoints.registrations}/${registrationId}/hourbank`));
  }
);

server.tool(
  'kk_get_time_registration',
  'Get one time registration by ID.',
  {
    registrationId: z.number()
  },
  async ({ registrationId }) => {
    return jsonContent(await kkRequest('GET', `${endpoints.registrations}/${registrationId}`));
  }
);

server.tool(
  'kk_update_time_registration',
  'Update one time registration. The API uses PUT, so send the complete registration payload you want to keep, including comment.',
  {
    registrationId: z.number(),
    registration: z.record(z.unknown())
  },
  async ({ registrationId, registration }) => {
    return jsonContent(
      await kkRequest('PUT', `${endpoints.registrations}/${registrationId}`, {
        body: registration
      })
    );
  }
);

server.tool(
  'kk_approve_time_registration',
  'Approve one time registration.',
  {
    registrationId: z.number()
  },
  async ({ registrationId }) => {
    return jsonContent(
      await kkRequest('POST', endpoints.approveRegistration, {
        body: { id: registrationId }
      })
    );
  }
);

server.tool(
  'kk_reject_time_registration',
  'Reject approval for one time registration.',
  {
    registrationId: z.number()
  },
  async ({ registrationId }) => {
    return jsonContent(
      await kkRequest('POST', endpoints.rejectRegistration, {
        body: { id: registrationId }
      })
    );
  }
);

server.tool(
  'kk_list_deviations_for_auto_email',
  'List new Kvalitetskontroll avvik/deviations that have not yet been sent by the automation, including project contact recipients.',
  {
    includeSent: z.boolean().default(false),
    includeSkipped: z.boolean().default(false),
    projectId: z.number().optional(),
    maxAgeDays: z.number().default(14)
  },
  async ({ includeSent, includeSkipped, projectId, maxAgeDays }) => {
    const { candidates } = await listDeviationCandidates({ includeSent, includeSkipped, projectId, maxAgeDays });
    return jsonContent({
      statePath: DEVIATION_STATE_PATH,
      count: candidates.length,
      deviations: candidates.map(({ raw, ...candidate }) => candidate)
    });
  }
);

server.tool(
  'kk_send_deviation_email',
  `Send one existing Kvalitetskontroll avvik/deviation by email through /api/deviations/send-email, create an hour type from the deviation number, and mark it sent in the automation state. The tool fetches the deviation first and uses the deviation project, so callers cannot accidentally send it under the wrong project. Translation rule: ${LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE}`,
  {
    deviationId: z.number(),
    projectId: z.number().optional(),
    projectName: z.string().optional(),
    deviationNumber: z.union([z.string(), z.number()]).optional(),
    norwegianTitle: z.string().describe(LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE).optional(),
    norwegianDescription: z.string().describe(LITHUANIAN_TO_NORWEGIAN_TRANSLATION_RULE).optional(),
    to: z.string().optional(),
    copyToMe: z.boolean().default(true),
    markSent: z.boolean().default(true),
    createHourType: z.boolean().default(true),
    hourTypeIsGlobal: z.boolean().default(true),
    linkTripletexActivity: z.boolean().default(true),
    tripletexActivityName: z.string().default('Ekstra arbeid')
  },
  async ({
    deviationId,
    norwegianTitle,
    norwegianDescription,
    to,
    copyToMe,
    markSent,
    createHourType,
    hourTypeIsGlobal,
    linkTripletexActivity,
    tripletexActivityName
  }) => {
    let deviation = await getDeviationById(deviationId);

    if (norwegianTitle || norwegianDescription) {
      deviation = await updateDeviationText(deviationId, {
        norwegianTitle,
        norwegianDescription
      });
    }
    const actualProjectId = deviationProjectId(deviation);
    if (!actualProjectId) {
      throw new Error(`Deviation ${deviationId} does not contain a project_id.`);
    }

    const project = await getProjectById(actualProjectId);
    const recipients = projectRecipients(project);
    const resolvedTo = to || recipientsToString(recipients);
    if (!resolvedTo) {
      throw new Error(`No project contact with email found for deviation ${deviationId}, project ${actualProjectId}.`);
    }

    const actualProjectName = project.name || deviationProjectName(deviation) || recipients[0]?.projectName || `Prosjekt ${actualProjectId}`;
    // PAKEITIMAS 3: naudoja deviationId(deviation) vietoj deviationNumber(deviation)
    const actualDeviationNumber = [project.number ?? project.external_id, deviation.number ?? deviationNumber(deviation)]
      .filter(Boolean)
      .join('.');
    const hourTypeResult = createHourType
      ? await ensureHourTypeForDeviationNumber(actualDeviationNumber, { isGlobal: hourTypeIsGlobal })
      : null;
    const tripletexLinkResult = hourTypeResult && linkTripletexActivity
      ? await linkHourTypeToTripletexActivity(hourTypeResult.hourType, tripletexActivityName)
      : null;
    const title = norwegianTitle || deviationTitle(deviation);
    const subject = `${actualProjectName}: Avvik ${actualDeviationNumber}`;
    const text = `Vedlagt denne e-posten ligger følgende avvik:\n- ${title}`;
    const body = {
      projectId: actualProjectId,
      copy: copyToMe,
      ids: [deviationId],
      merge: false,
      print: 1,
      subject,
      text,
      to: resolvedTo
    };

    const response = await kkWebRequest('POST', '/deviations/send-email', { body });
    if (markSent) {
      await markDeviationSent(deviationId);
    }

    return jsonContent({
      sent: true,
      deviation: {
        id: deviationId,
        projectId: actualProjectId,
        projectName: actualProjectName,
        number: actualDeviationNumber,
        title
      },
      hourType: hourTypeResult
        ? {
            created: hourTypeResult.created,
            id: hourTypeResult.hourType?.id ?? null,
            title: hourTypeResult.hourType?.title ?? actualDeviationNumber,
            isGlobal: hourTypeResult.hourType?.is_global ?? hourTypeIsGlobal
          }
        : null,
      tripletexActivity: tripletexLinkResult
        ? {
            linked: tripletexLinkResult.linked,
            hourTypeId: tripletexLinkResult.hourType?.id ?? hourTypeResult?.hourType?.id ?? null,
            hourTypeTitle: tripletexLinkResult.hourType?.title ?? hourTypeResult?.hourType?.title ?? actualDeviationNumber,
            activityId: tripletexLinkResult.activity?.id ?? null,
            activityName: tripletexLinkResult.activity?.name ?? tripletexActivityName
          }
        : null,
      recipients,
      request: body,
      response
    });
  }
);

server.tool(
  'kk_create_hourtype_for_deviation',
  'Create a Kvalitetskontroll time tracking hour type using the real project deviation number, for example 293.1. If an active hour type with the same title already exists, it is reused.',
  {
    deviationId: z.number(),
    isGlobal: z.boolean().default(true),
    linkTripletexActivity: z.boolean().default(true),
    tripletexActivityName: z.string().default('Ekstra arbeid')
  },
  async ({ deviationId, isGlobal, linkTripletexActivity, tripletexActivityName }) => {
    const deviation = await getDeviationById(deviationId);
    const actualProjectId = deviationProjectId(deviation);
    if (!actualProjectId) {
      throw new Error(`Deviation ${deviationId} does not contain a project_id.`);
    }

    const project = await getProjectById(actualProjectId);
    const actualDeviationNumber = [project.number ?? project.external_id, deviation.number ?? deviationNumber(deviation)]
      .filter(Boolean)
      .join('.');
    const hourTypeResult = await ensureHourTypeForDeviationNumber(actualDeviationNumber, { isGlobal });
    const tripletexLinkResult = linkTripletexActivity
      ? await linkHourTypeToTripletexActivity(hourTypeResult.hourType, tripletexActivityName)
      : null;

    return jsonContent({
      created: hourTypeResult.created,
      deviation: {
        id: deviationId,
        projectId: actualProjectId,
        projectName: project.name || deviationProjectName(deviation) || `Prosjekt ${actualProjectId}`,
        number: actualDeviationNumber
      },
      hourType: hourTypeResult.hourType,
      tripletexActivity: tripletexLinkResult
        ? {
            linked: tripletexLinkResult.linked,
            hourTypeId: tripletexLinkResult.hourType?.id ?? hourTypeResult.hourType?.id ?? null,
            hourTypeTitle: tripletexLinkResult.hourType?.title ?? hourTypeResult.hourType?.title ?? actualDeviationNumber,
            activityId: tripletexLinkResult.activity?.id ?? null,
            activityName: tripletexLinkResult.activity?.name ?? tripletexActivityName
          }
        : null
    });
  }
);

server.tool(
  'kk_link_hourtype_to_tripletex_activity',
  'Link an existing Kvalitetskontroll hour type to a Tripletex activity in the Tripletex integration mapping.',
  {
    hourTypeId: z.number().optional(),
    hourTypeTitle: z.string().optional(),
    tripletexActivityName: z.string().default('Ekstra arbeid')
  },
  async ({ hourTypeId, hourTypeTitle, tripletexActivityName }) => {
    if (!hourTypeId && !hourTypeTitle) {
      throw new Error('Provide hourTypeId or hourTypeTitle.');
    }

    const hourType = hourTypeId
      ? await kkRequest('GET', `${endpoints.hourtypes}/${hourTypeId}`)
      : await findHourTypeByTitle(hourTypeTitle);
    if (!hourType) {
      throw new Error(`Hour type ${hourTypeTitle ?? hourTypeId} was not found.`);
    }

    const tripletexLinkResult = await linkHourTypeToTripletexActivity(hourType, tripletexActivityName);

    return jsonContent({
      linked: tripletexLinkResult.linked,
      hourType: tripletexLinkResult.hourType,
      activity: tripletexLinkResult.activity
    });
  }
);

server.tool(
  'kk_mark_deviation_email_skipped',
  'Mark one deviation as skipped by the automation so it is not retried until state is edited.',
  {
    deviationId: z.number(),
    reason: z.string()
  },
  async ({ deviationId, reason }) => {
    const state = await markDeviationSkipped(deviationId, reason);
    return jsonContent({ skipped: true, deviationId, reason, statePath: DEVIATION_STATE_PATH, state });
  }
);

server.tool(
  'kk_debug_web_auth',
  'Debug Kvalitetskontroll web API auth without exposing secrets.',
  {},
  async () => {
    const cookieValues = parseCookie(process.env.KK_WEB_COOKIE || '');
    const headers = webAuthHeaders();
    const checks = {};

    for (const pathname of ['/user', '/auth', '/deviations']) {
      try {
        const response = await fetch(buildWebUrl(pathname, pathname === '/deviations' ? { showAll: 1 } : {}), {
          method: 'GET',
          headers
        });
        const text = await response.text();
        checks[pathname] = {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
          sample: text.slice(0, 120)
        };
      } catch (error) {
        checks[pathname] = {
          error: String(error?.message || error)
        };
      }
    }

    return jsonContent({
      webApiBase: WEB_API_BASE,
      env: {
        hasCookie: Boolean(process.env.KK_WEB_COOKIE),
        cookieLength: (process.env.KK_WEB_COOKIE || '').length,
        hasExplicitXsrf: Boolean(process.env.KK_WEB_XSRF_TOKEN),
        explicitXsrfLength: (process.env.KK_WEB_XSRF_TOKEN || '').length,
        hasExplicitWebBearer: Boolean(process.env.KK_WEB_BEARER_TOKEN)
      },
      cookieNames: Object.keys(cookieValues),
      derived: {
        hasCookieAccessToken: Boolean(cookieValues.kk_api_access_token),
        cookieAccessTokenLength: (cookieValues.kk_api_access_token || '').length,
        hasCookieXsrf: Boolean(cookieValues['XSRF-TOKEN']),
        cookieXsrfLength: (cookieValues['XSRF-TOKEN'] || '').length,
        requestHeaderNames: Object.keys(headers)
      },
      checks
    });
  }
);

server.tool(
  'kk_raw_request',
  'Call an allowlisted Kvalitetskontroll API path for discovery and debugging.',
  {
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).default('GET'),
    endpoint: z.enum(Object.keys(endpoints)),
    id: z.string().optional(),
    query: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
    body: z.record(z.unknown()).optional()
  },
  async ({ method, endpoint, id, query, body }) => {
    const path = id ? `${endpoints[endpoint]}/${id}` : endpoints[endpoint];
    return jsonContent(await kkRequest(method, path, { query, body }));
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
















