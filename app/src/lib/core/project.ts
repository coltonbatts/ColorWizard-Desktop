export const CURRENT_SCHEMA_VERSION = 2

export type Rgb = { r: number; g: number; b: number }

export type ProjectSwatch = {
  id: string
  hex: string
  rgb: Rgb
  label?: string | null
}

export type ProjectReference = {
  id: string
  path: string
  name: string // Derived from filename, kept for backward compat
  label?: string | null // User-editable label (optional)
  order: number
}

export type ProjectData = {
  schemaVersion: number
  name: string
  notes: string
  createdAt: string
  updatedAt: string
  lastSavedAt: string
  referenceImage?: string | null // v1 legacy
  references: ProjectReference[]
  primaryReferenceId?: string | null
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
  const references = Array.isArray(project.references) ? project.references : []
  const sortedReferences = [...references].sort((a, b) => a.order - b.order)
  
  // Ensure primary is valid
  let primaryReferenceId = project.primaryReferenceId ?? null
  if (primaryReferenceId && !sortedReferences.some(r => r.id === primaryReferenceId)) {
    primaryReferenceId = null
  }
  if (!primaryReferenceId && sortedReferences.length > 0) {
    primaryReferenceId = sortedReferences[0].id
  }

  return {
    schemaVersion: project.schemaVersion ?? CURRENT_SCHEMA_VERSION,
    name: project.name ?? 'Recovered Project',
    notes: project.notes ?? '',
    createdAt: project.createdAt ?? '0',
    updatedAt,
    lastSavedAt: project.lastSavedAt ?? updatedAt,
    referenceImage: project.referenceImage ?? null,
    references: sortedReferences,
    primaryReferenceId,
    swatches: Array.isArray(project.swatches) ? project.swatches : [],
  }
}

export function projectFingerprint(project: ProjectData): string {
  return JSON.stringify({
    schemaVersion: project.schemaVersion,
    name: project.name,
    notes: project.notes,
    referenceImage: project.referenceImage ?? null,
    references: project.references,
    primaryReferenceId: project.primaryReferenceId ?? null,
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
