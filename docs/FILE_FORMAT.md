# File Format

Project root contains:

- `project.json`: project metadata and swatches
- `reference/`: imported source images (project-owned copies)
- `exports/`: reserved for future output files

## Schema v2 (current)

`project.json` schema (v2):

- `schemaVersion`: number (`2`)
- `name`: string
- `notes`: string
- `createdAt`: string (timestamp)
- `updatedAt`: string (timestamp)
- `lastSavedAt`: string (timestamp)
- `referenceImage`: string | null (v1 legacy, kept for backward compat)
- `references`: array of `{ id, path, name, label?, order }`
  - `id`: unique identifier
  - `path`: relative path within project (e.g., `reference/reference-123.png`)
  - `name`: derived from filename (backward compat, not user-editable)
  - `label`: optional user-editable display name
  - `order`: sort order (0-based)
- `primaryReferenceId`: string | null (id of primary reference)
- `swatches`: array of `{ id, hex, rgb: { r, g, b }, label? }`

## Schema v1 (legacy)

- `schemaVersion`: number (`1`)
- `referenceImage`: string | null (relative path)
- Automatically migrates to v2 on load

## Semantics

### Reference Management

- **Import**: Copies source image into `reference/` folder with timestamped filename. File path is stable and never changes.
- **Rename**: Edits `label` field only. File on disk is never renamed. If `label` is unset, `name` (derived from filename) is used for display.
- **Remove**: Deletes the file from `reference/` folder (project-owned copy). Original source file outside project is never touched.
- **Order**: Controlled via `order` field. References are sorted by `order` ascending.

### File Safety

- Load uses safe validation and repair defaults for malformed or missing fields.
- Save is atomic (`project.json.tmp` -> fsync -> rename to `project.json`).
- Migrations are version-gated by `schemaVersion`.
- File operations are constrained to project directory.
