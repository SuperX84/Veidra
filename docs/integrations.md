# Integrations

## Kvalitetskontroll

The existing MCP project is stored under:

```text
mcp/kvalitetskontroll
```

It contains tools for:

- projects;
- employees;
- time registrations;
- deviation email sending;
- hourbank/timebank handling;
- Tripletex activity mapping.

## Tripletex

MVP connector added:

- server-side test API session creation;
- live status endpoint at `GET /api/tripletex/status`;
- project basics endpoint at `GET /api/tripletex/projects`;
- browser UI status for connected / missing token / API error.

Environment variables:

```powershell
$env:TRIPLETEX_ENV="test"
$env:TRIPLETEX_CONSUMER_TOKEN="..."
$env:TRIPLETEX_EMPLOYEE_TOKEN="..."
$env:TRIPLETEX_COMPANY_ID="0"
```

Needed next:

- persist project mapping between Kvalitetskontroll IDs and Tripletex project IDs;
- product/activity mapping for `Ekstra arbeid`;
- invoice draft creation;
- sync logs and retry handling.

## SmartKalk

Needed next:

- export format or API access;
- project budget;
- estimated hours;
- margin baseline.
