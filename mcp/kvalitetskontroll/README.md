# Kvalitetskontroll MCP

Minimal MCP server for `https://api.kvalitetskontroll.no`.

## What it can do

- Read current user: `kk_me`
- List projects: `kk_list_projects`
- List employees: `kk_list_employees`
- List time registrations: `kk_list_time_registrations`
- List time registrations for the automation with local approved/deleted filtering and timebank flags: `kk_list_time_registrations_for_auto_approval`
- Process one time registration for the automation, including safe comment update and approval refusal when timebank is unresolved: `kk_process_time_registration_for_auto_approval`
- Inspect one registration hourbank endpoint before attempting timebank correction: `kk_get_time_registration_hourbank`
- Get one time registration: `kk_get_time_registration`
- Update a time registration, including `comment`: `kk_update_time_registration`
- Approve a time registration: `kk_approve_time_registration`
- Reject approval for a time registration: `kk_reject_time_registration`
- Create or reuse an hour type from a deviation number and link it to Tripletex `Ekstra arbeid`: `kk_create_hourtype_for_deviation`
- Send a deviation email and automatically create/reuse the matching hour type plus Tripletex activity mapping: `kk_send_deviation_email`
- Link an existing hour type to a Tripletex activity: `kk_link_hourtype_to_tripletex_activity`
- Call allowlisted endpoints for discovery: `kk_raw_request`

## Setup

1. Install dependencies:

```bash
npm install
```

2. In Kvalitetskontroll, open the dashboard and create a Personal Access Token.

3. Copy `.env.example` to `.env` and add the token:

```bash
KK_API_BASE=https://api.kvalitetskontroll.no
KK_BEARER_TOKEN=...
```

4. Start the MCP server:

```bash
npm start
```

## Codex MCP config example

Add this server to the MCP configuration used by your client:

```json
{
  "mcpServers": {
    "kvalitetskontroll": {
      "command": "node",
      "args": [
        "C:/Users/karaj/Documents/Codex/2026-05-11/prisijunk-prie-kvalitetskontroll-no-per-mcp/src/server.js"
      ],
      "env": {
        "KK_API_BASE": "https://api.kvalitetskontroll.no",
        "KK_BEARER_TOKEN": "YOUR_TOKEN_HERE"
      }
    }
  }
}
```

## Important notes

The API documentation says:

- Authentication uses `Authorization: Bearer your-token`.
- Tokens are created in the dashboard as Personal Access Tokens.
- Time registration comments use the `comment` field.
- Approval uses `POST /timetracking/approve` with `{ "id": registrationId }`.
- Rejecting approval uses `POST /timetracking/reject` with `{ "id": registrationId }`.
- Deviation hour types are created through `POST /timetracking/hourtypes` with the deviation number as `title`.
- Tripletex activity mappings are updated through the web API endpoints `/api/tripletex_activities` and `/api/tripletex_hourtypes`.

When updating a comment, first fetch the registration with `kk_get_time_registration`, then send the full registration data back through `kk_update_time_registration` with the changed `comment`. Approved registrations cannot be updated before approval is rejected.

For automation, prefer `kk_list_time_registrations_for_auto_approval` and `kk_process_time_registration_for_auto_approval` instead of the raw list/update/approve sequence. This mirrors the deviation automation pattern: the MCP tool owns the fragile API details and refuses approval when a registration needs timebank handling but the safe correction endpoint is not yet confirmed.

