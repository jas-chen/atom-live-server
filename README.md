# atom-live-server package

Launch a simple development http server with live reload capability.

![Demo](https://raw.githubusercontent.com/jas-chen/atom-live-server/master/doc/demo.gif)

This package is based on awesome [Live Server](https://github.com/tapio/live-server) project.

## Usage

| Command | Keybinding | Description |
| ------- | ---------- | ----------- |
| `atom-live-server:start-server` | `ctrl-alt-l` | Launch live server on default port, by default 3000. |
| `atom-live-server:stop-server` | `ctrl-alt-q` | Stops currently running instance of live server. |
| `atom-live-server:start-3000` | `ctrl-alt-3` | Launch live server on port 3000. |
| `atom-live-server:start-4000` | `ctrl-alt-4` | Launch live server on port 4000. |
| `atom-live-server:start-5000` | `ctrl-alt-5` | Launch live server on port 5000. |
| `atom-live-server:start-8000` | `ctrl-alt-8` | Launch live server on port 8000. |
| `atom-live-server:start-9000` | `ctrl-alt-9` | Launch live server on port 9000. |


## Options

If a file `.atom-live-server.json` exists in project root it will be loaded and used as options.

The keys of `.atom-live-server.json` should match **Command line parameters** in [live-server](https://github.com/tapio/live-server).

#### Example: Launch specific browser
```json
{
  "browser": "safari"
}
```

#### Example: Start server without browser opened
```json
{
  "no-browser": true
}
```

#### Example: Serve this file for every 404 (useful for single-page applications)
```json
{
  "entry-file": "index.html"
}
```

#### Example: Serve this directory as root path
```json
{
  "root": "public"
}
```
