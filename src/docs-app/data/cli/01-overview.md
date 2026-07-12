# Showpass CLI

Build and manage event websites that connect directly to your Showpass venue.

## Install

```bash
curl -fsSL "https://www.showpass.com/install.sh" | bash
```

The installer supports macOS and Linux on Intel/AMD and ARM64 systems. Verify
the installation with:

```bash
showpass --version
```

### Add to PATH

If `showpass` is not found after installation, add the local binary directory
to your shell configuration.

For Bash (`~/.bashrc`) or Zsh (`~/.zshrc`):

```bash
export PATH="$HOME/.local/bin:$PATH"
```

For Fish (`~/.config/fish/config.fish`):

```fish
set -gx PATH $HOME/.local/bin $PATH
```

Restart the terminal or reload your shell configuration after making this
change.

## Authentication

The CLI does not ask for your Showpass email address or password. Account login
requires reCAPTCHA, which is intentionally not reproduced in a command-line
environment. Instead, the CLI authenticates with the Private Organizer API
token issued for your venue:

```text
Authorization: Token YOUR_API_TOKEN
```

Contact Showpass support or an authorized Showpass administrator to obtain the
token for your venue. For more information about the credential, see the
[Private Organizer API overview](/api/10-private-api-overview).

Connect the CLI before creating a project, or enter the token when the `init`
wizard asks for it:

```bash
showpass login
showpass whoami
```

Token input is hidden. The CLI validates the token with Showpass, selects its
venue automatically, and then stores it in `~/.local/share/showpass/config`.
On macOS and Linux, the directory and file are restricted to the current OS
user.

Treat the token as a secret. It authenticates as the venue's Access Token User
and has the permissions assigned to that employment. Private Organizer API
tokens do not expire automatically, but Showpass can revoke them.

> `Token` is the literal authorization scheme. `Bearer` and `JWT` do not
> authenticate this credential.

### Upgrading from account login

JWT credentials saved by an earlier CLI release are no longer accepted. Run
`showpass login` and enter the Private Organizer API token. A successful login
or `showpass logout` removes the obsolete JWT fields.

## Quick Start

```bash
showpass init my-event-site
```

The interactive wizard:

- Validates your Private Organizer API token if needed
- Connects the project to the token's venue
- Generates a React and TypeScript website with the Showpass SDK configured
- Installs dependencies and starts the development server

The generated site runs at `http://localhost:8080`.

## What You Get

- React 18, TypeScript, and Vite
- Tailwind CSS and shadcn/ui components
- Showpass SDK widgets for calendars, tickets, and carts
- A hot-reload development server

## Hosted Deployment

The CLI can create and build sites locally. Showpass-hosted deployment is not
available yet because its backend deployment endpoint has not been released.

## Uninstall

```bash
rm ~/.local/bin/showpass
rm -rf ~/.local/share/showpass
```

Removing the data directory also removes the locally stored API token and
installed project templates.

## See Also

- [Commands reference](/cli/02-commands)
- [Private Organizer API overview](/api/10-private-api-overview)
