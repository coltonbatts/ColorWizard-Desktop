export const CURRENT_SCHEMA_VERSION = 1

export type Rgb = { r: number; g: number; b: number }

export type ProjectSwatch = {
  id: string
  hex: string
  rgb: Rgb
  label?: string | null
}

export type ProjectData = {
  schemaVersion: number
  name: string
  notes: string
  createdAt: string
  updatedAt: string
  lastSavedAt: string
  referenceImage?: string | null
  swatches: ProjectSwatch[]
}

export type ProjectEnvelope = {
  projectPath: string
  project: ProjectData
  needsRepair: boolean
  repairNotes: string[]
}

export function normalizeProject(project: Partial<ProjectData>): ProjectData {
  const updatedAt = project.updatedAt ?? '0'

  return {
    schemaVersion: project.schemaVersion ?? CURRENT_SCHEMA_VERSION,
    name: project.name ?? 'Recovered Project',
    notes: project.notes ?? '',
    createdAt: project.createdAt ?? '0',
    updatedAt,
    lastSavedAt: project.lastSavedAt ?? updatedAt,
    referenceImage: project.referenceImage ?? null,
    swatches: Array.isArray(project.swatches) ? project.swatches : [],
  }
}

export function projectFingerprint(project: ProjectData): string {
  return JSON.stringify({
    schemaVersion: project.schemaVersion,
    name: project.name,
    notes: project.notes,
    referenceImage: project.referenceImage ?? null,
    swatches: project.swatches,
  })
}

export function formatTimestamp(value: string | null | undefined): string {
  if (!value) return 'Never'

  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return 'Never'

  const date = new Date(numeric)
  if (Number.isNaN(date.getTime())) return 'Never'

  return date.toLocaleString()
}
