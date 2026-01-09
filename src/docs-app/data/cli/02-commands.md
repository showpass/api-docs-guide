# Commands

## init

Create a new Showpass project. Opens an interactive wizard.

```bash
showpass init my-event-site
```

Without a name, one is generated for you:

```bash
showpass init
```

## dev

Start the local development server with hot reload.

```bash
showpass dev
```

Runs on `http://localhost:8080` by default.

## build

Create a production-optimized build.

```bash
showpass build
```

Output is written to `dist/`.

## whoami

Display current authentication status.

```bash
showpass whoami
```

## logout

Clear saved credentials and venue selection.

```bash
showpass logout
```

## help

Show available commands:

```bash
showpass --help
```

Get help for a specific command:

```bash
showpass init --help
```
