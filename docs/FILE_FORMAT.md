# File Format (v1)

Project root contains:

- `project.json`: project metadata and swatches
- `reference/`: imported source images
- `exports/`: reserved for future output files

`project.json` schema (v1):

- `schemaVersion`: number (`1`)
- `name`: string
- `notes`: string
- `createdAt`: string (timestamp)
- `updatedAt`: string (timestamp)
- `lastSavedAt`: string (timestamp)
- `referenceImage`: string | null (relative path)
- `swatches`: array of `{ id, hex, rgb: { r, g, b }, label? }`

Notes:

- Load uses safe validation and repair defaults for malformed or missing fields.
- Save is atomic (`project.json.tmp` -> fsync -> rename to `project.json`).
- Migrations are version-gated by `schemaVersion` (v1 placeholder is in place).
