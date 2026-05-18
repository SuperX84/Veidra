# Veidra

Veidra is the first MVP shell for a construction operations dashboard.

The product direction is focused on turning deviations, hours and extra work into invoice-ready project control.

## Run

```powershell
npm start
```

Then open:

```text
http://localhost:4173
```

## Tripletex test API

The MVP now includes a small server-side Tripletex test connector. Keep tokens out of the browser and start the app with environment variables:

```powershell
$env:TRIPLETEX_ENV="test"
$env:TRIPLETEX_CONSUMER_TOKEN="your-test-consumer-token"
$env:TRIPLETEX_EMPLOYEE_TOKEN="your-test-employee-token"
$env:TRIPLETEX_COMPANY_ID="0"
npm start
```

For local development, the server also reads a git-ignored `.env` file in the project root.

Available MVP endpoints:

- `GET /api/tripletex/status` checks token/session authentication.
- `GET /api/tripletex/projects` fetches project basics for the next sync step.
- `GET /api/tripletex/sync` syncs test Tripletex projects and order-line economy into the Veidra dashboard.

## Included

- Web app dashboard with demo login
- Project profitability overview
- Avvik workflow view
- Hours and timebank workflow view
- Invoice preparation view
- Integration overview for Tripletex, Kvalitetskontroll and SmartKalk
- Tripletex test API status connector
- Kvalitetskontroll MCP project under `mcp/kvalitetskontroll`

## Not included yet

- Real login
- Database
- Live API tokens
- Windows Task Scheduler registration
- Production deployment
