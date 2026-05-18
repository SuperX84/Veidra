# Veidra deploy

## Recommended MVP hosting

Use Render as a small Node web service first. It supports this app without changing the server architecture.

## Required environment variables

Set these in the hosting dashboard, not in source code:

```text
TRIPLETEX_ENV=test
TRIPLETEX_CONSUMER_TOKEN=...
TRIPLETEX_EMPLOYEE_TOKEN=...
TRIPLETEX_COMPANY_ID=0
```

Optional:

```text
KVALITETSKONTROLL_API_TOKEN=...
```

## Render setup

1. Create a GitHub repository for this folder.
2. Push the project without `.env`.
3. In Render, create a new Blueprint or Web Service from the repo.
4. Use `render.yaml`.
5. Add the secret environment variables in Render.
6. After deploy, open `/healthz`.

## Domain

After the service works on Render's temporary URL, add `veidra.app` as a custom domain in Render and update DNS at the domain registrar.

Typical DNS:

```text
CNAME www -> Render target
ALIAS/A/ANAME @ -> Render target, depending on registrar support
```

## Notes

The local `.env` file is intentionally ignored and must never be uploaded.
