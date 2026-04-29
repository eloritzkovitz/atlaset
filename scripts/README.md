# Scripts

This folder contains utility scripts for data processing, build tasks, and project automation. Scripts are grouped by purpose for easier maintenance.

## Categories

| Category | Description                        | Example Scripts                           |
| -------- | ---------------------------------- | ----------------------------------------- |
| assets   | Asset management                   | `add-country-field.js`, `remove-flags.js` |
| build    | Build, compile, and prepare assets | `prebuild.js`, `compress-json.cjs`        |
| data     | Data fetching and import           | `fetch-country-data.js`, `fetch-flags.js` |
| lib      | Utility functions and helpers      | `utils.js`                                |

## Usage

Most scripts can be run with Node.js:

```sh
node scripts/build/prebuild.js
```

For TypeScript scripts, use ts-node or compile first:

```sh
npx ts-node scripts/generate-keyboard-shortcuts-table.ts
```

## Notes

- Some scripts may require environment variables or API keys. Check the top of each script for details.
- Output files are usually written to relevant subfolders in the `public` folder.
- Scripts are intended for project maintainers and contributors.
