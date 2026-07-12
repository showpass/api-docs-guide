# Showpass CLI Commands

## login

Securely prompt for, validate, and save a Private Organizer API token:

```bash
showpass login
```

Input is hidden. The token is checked against Showpass before it is persisted,
and the venue is selected automatically from the Access Token User's
employment.

If a token is already stored, use `showpass logout` before entering a different
token interactively.

## init

Create a Showpass website project with the interactive wizard:

```bash
showpass init my-event-site
```

Without a name, one is generated automatically:

```bash
showpass init
```

If no valid token is stored, the wizard asks for the venue's Private Organizer
API token. It then generates the project, installs dependencies, and starts the
development server.

## dev

Start the local development server with hot reload:

```bash
showpass dev
```

Generated projects run on `http://localhost:8080` by default.

## build

Create a production-optimized build:

```bash
showpass build
```

Output is written to the project's `dist/` directory.

## whoami

Revalidate the stored token and display its connected venue:

```bash
showpass whoami
```

If Showpass has revoked the token, or its Access Token User no longer has a
venue employment, the CLI removes the unusable local authentication state.

## logout

Remove the locally stored API token and venue selection:

```bash
showpass logout
```

This does not revoke the token in Showpass. Contact Showpass support if the
credential itself needs to be rotated or revoked.

## config

Inspect CLI configuration without exposing the full API token:

```bash
showpass config list
showpass config path
```

Sensitive values are masked in command output. Avoid setting authentication
values manually because `showpass login` performs remote validation first.

## deploy

```bash
showpass deploy
```

Showpass-hosted deployment is not available yet because the required backend
deployment endpoint has not been released. Use `showpass build` to produce a
local production bundle in the meantime.

## help

Show all commands:

```bash
showpass --help
```

Show help for one command:

```bash
showpass init --help
```

## See Also

- [CLI overview and installation](/cli/01-overview)
- [Private Organizer API overview](/api/10-private-api-overview)
