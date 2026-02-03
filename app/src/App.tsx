import { convertFileSrc, invoke } from '@tauri-apps/api/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  formatTimestamp,
  normalizeProject,
  projectFingerprint,
  type ProjectData,
  type ProjectEnvelope,
  type ProjectSwatch,
  type Rgb,
} from './lib/core/project'

type Sample = {
  hex: string
  rgb: Rgb
}

const initialSample: Sample = {
  hex: '#000000',
  rgb: { r: 0, g: 0, b: 0 },
}

const sideBySideKey = 'cw.workspace.sideBySide'

function rgbToHex(rgb: Rgb): string {
  return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g
    .toString(16)
    .padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`.toUpperCase()
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

function App() {
  const [projectRoot, setProjectRoot] = useState('')
  const [projectNameInput, setProjectNameInput] = useState('Untitled Project')
  const [projectPath, setProjectPath] = useState<string | null>(null)
  const [project, setProject] = useState<ProjectData | null>(null)
  const [status, setStatus] = useState('Ready.')
  const [repairNotes, setRepairNotes] = useState<string[]>([])

  const [sample, setSample] = useState<Sample>(initialSample)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number } | null>(null)
  const [sideBySide, setSideBySide] = useState(() => localStorage.getItem(sideBySideKey) === '1')
  const [lastSavedFingerprint, setLastSavedFingerprint] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    invoke<string>('default_projects_dir')
      .then((path) => setProjectRoot(path))
      .catch(() => setProjectRoot(''))
  }, [])

  useEffect(() => {
    localStorage.setItem(sideBySideKey, sideBySide ? '1' : '0')
  }, [sideBySide])

  const referenceAbsPath = useMemo(() => {
    if (!projectPath || !project?.referenceImage) return null
    return `${projectPath}/${project.referenceImage}`
  }, [project?.referenceImage, projectPath])

  const referenceAssetUrl = useMemo(() => {
    if (!referenceAbsPath) return null
    return convertFileSrc(referenceAbsPath)
  }, [referenceAbsPath])

  const isDirty = useMemo(() => {
    if (!project || !lastSavedFingerprint) return false
    return projectFingerprint(project) !== lastSavedFingerprint
  }, [lastSavedFingerprint, project])

  function applyEnvelope(envelope: ProjectEnvelope, okMessage: string) {
    const normalizedProject = normalizeProject(envelope.project)
    setProjectPath(envelope.projectPath)
    setProject(normalizedProject)
    setRepairNotes(envelope.needsRepair ? envelope.repairNotes : [])
    setLastSavedFingerprint(projectFingerprint(normalizedProject))
    setPan({ x: 0, y: 0 })
    setZoom(1)
    setSample(initialSample)
    setStatus(okMessage)
  }

  async function chooseProjectRoot() {
    try {
      const folder = await invoke<string | null>('pick_folder', {
        title: 'Select project root folder',
      })
      if (!folder) return

      setProjectRoot(folder)
      setStatus(`Project root set: ${folder}`)
    } catch {
      setStatus('Unable to choose project root.')
    }
  }

  async function createNewProject() {
    if (!projectRoot) {
      setStatus('Set a project root first.')
      return
    }

    try {
      const envelope = await invoke<ProjectEnvelope>('create_project', {
        baseDir: projectRoot,
        projectName: projectNameInput,
      })

      applyEnvelope(envelope, `Created project at ${envelope.projectPath}`)
    } catch {
      setStatus('Unable to create project.')
    }
  }

  async function openProject() {
    try {
      const folder = await invoke<string | null>('pick_folder', {
        title: 'Open ColorWizard project folder',
      })

      if (!folder) return

      const envelope = await invoke<ProjectEnvelope>('load_project', {
        projectDir: folder,
      })

      applyEnvelope(envelope, `Opened project: ${envelope.project.name}`)
    } catch {
      setStatus('Unable to open project.')
    }
  }

  async function saveProject(nextProject?: ProjectData) {
    if (!projectPath || !project) return

    try {
      const payload = normalizeProject(nextProject ?? project)
      const envelope = await invoke<ProjectEnvelope>('save_project', {
        projectDir: projectPath,
        project: payload,
      })

      applyEnvelope(envelope, 'Project saved to disk.')
    } catch {
      setStatus('Save failed. Project data remains in memory.')
    }
  }

  async function importImage() {
    if (!projectPath || !project) {
      setStatus('Create or open a project before importing an image.')
      return
    }

    try {
      const imagePath = await invoke<string | null>('pick_image_file')
      if (!imagePath) return

      const envelope = await invoke<ProjectEnvelope>('import_reference_image', {
        projectDir: projectPath,
        imagePath,
        project,
      })

      applyEnvelope(envelope, 'Imported reference image.')
    } catch {
      setStatus('Unable to import reference image.')
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === 'Space' && !isEditableTarget(event.target)) {
        event.preventDefault()
        setSpaceHeld(true)
      }

      if (isEditableTarget(event.target)) return
      if (!(event.metaKey || event.ctrlKey)) return

      const key = event.key.toLowerCase()
      if (key === 's') {
        event.preventDefault()
        void saveProject()
      }
      if (key === 'o') {
        event.preventDefault()
        void openProject()
      }
      if (key === 'n') {
        event.preventDefault()
        void createNewProject()
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code !== 'Space') return
      setSpaceHeld(false)
      setIsPanning(false)
      setLastPanPoint(null)
    }

    function onBlur() {
      setSpaceHeld(false)
      setIsPanning(false)
      setLastPanPoint(null)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [project, projectPath, projectNameInput, projectRoot])

  function prepareSamplingCanvas() {
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!image || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0)
  }

  function sampleAtPointer(event: React.MouseEvent<HTMLImageElement>) {
    if (isPanning) return

    const image = imageRef.current
    const canvas = canvasRef.current
    if (!image || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const rect = image.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const x = Math.max(0, Math.min(rect.width - 1, event.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height - 1, event.clientY - rect.top))

    const imageX = Math.floor((x / rect.width) * image.naturalWidth)
    const imageY = Math.floor((y / rect.height) * image.naturalHeight)

    const pixel = context.getImageData(imageX, imageY, 1, 1).data
    const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] }
    setSample({ rgb, hex: rgbToHex(rgb) })
  }

  function addSwatch() {
    if (!project) {
      setStatus('Open or create a project first.')
      return
    }

    const swatch: ProjectSwatch = {
      id: `${Date.now()}`,
      rgb: sample.rgb,
      hex: sample.hex,
      label: `Swatch ${project.swatches.length + 1}`,
    }

    const nextProject: ProjectData = {
      ...project,
      swatches: [swatch, ...project.swatches],
    }

    setProject(nextProject)
    void saveProject(nextProject)
  }

  function removeSwatch(id: string) {
    if (!project) return

    const nextProject: ProjectData = {
      ...project,
      swatches: project.swatches.filter((swatch) => swatch.id !== id),
    }

    setProject(nextProject)
    void saveProject(nextProject)
  }

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    const next = Math.min(8, Math.max(0.2, zoom - event.deltaY * 0.001))
    setZoom(next)
  }

  function onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !spaceHeld) return
    setIsPanning(true)
    setLastPanPoint({ x: event.clientX, y: event.clientY })
  }

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!isPanning || !lastPanPoint) return

    const deltaX = event.clientX - lastPanPoint.x
    const deltaY = event.clientY - lastPanPoint.y

    setPan((current) => ({ x: current.x + deltaX, y: current.y + deltaY }))
    setLastPanPoint({ x: event.clientX, y: event.clientY })
  }

  function endPan() {
    setIsPanning(false)
    setLastPanPoint(null)
  }

  const viewerCursor = spaceHeld ? (isPanning ? 'grabbing' : 'grab') : 'crosshair'

  function renderInteractiveViewer() {
    return (
      <div
        className="relative h-full overflow-hidden rounded-lg border border-black/15 bg-[#dfd7ca]"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={endPan}
        onMouseUp={endPan}
      >
        <img
          key={referenceAssetUrl ?? 'none'}
          ref={imageRef}
          src={referenceAssetUrl ?? undefined}
          alt="Reference"
          onLoad={prepareSamplingCanvas}
          onMouseMove={sampleAtPointer}
          draggable={false}
          className="absolute left-1/2 top-1/2 max-h-none max-w-none select-none"
          style={{
            transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
            transformOrigin: 'center center',
            cursor: viewerCursor,
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent text-ink">
      <div className="border-b border-black/10 bg-white/65 px-4 py-2 backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium">{project?.name ?? 'No project open'}</div>
          <div className="flex items-center gap-4 text-black/70">
            <span className={isDirty ? 'text-amber-700' : 'text-emerald-700'}>
              {isDirty ? 'Unsaved changes' : 'Saved'}
            </span>
            <span>Last saved: {formatTimestamp(project?.lastSavedAt)}</span>
          </div>
        </div>
      </div>

      {repairNotes.length > 0 ? (
        <div className="mx-3 mt-3 rounded-md border border-amber-400/60 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <div className="font-semibold">Project needs repair</div>
          <div className="mt-1">Loaded with safe defaults. Review and save to finalize repairs.</div>
        </div>
      ) : null}

      <div className="grid min-h-[calc(100vh-3.1rem)] grid-cols-[280px_1fr_320px] gap-3 p-3">
        <aside className="rounded-xl border border-black/10 bg-panel p-4 shadow-sm">
          <h1 className="font-heading text-lg font-semibold">Reference</h1>

          <div className="mt-3 space-y-2">
            <label className="text-xs uppercase tracking-wide text-black/55">Project root</label>
            <div className="truncate rounded border border-black/10 bg-white px-2 py-1 text-xs">{projectRoot || 'Not set'}</div>
            <button
              type="button"
              className="w-full rounded border border-black/30 px-3 py-2 text-sm"
              onClick={() => void chooseProjectRoot()}
            >
              Choose root
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <label className="text-xs uppercase tracking-wide text-black/55">Project name</label>
            <input
              value={projectNameInput}
              onChange={(event) => setProjectNameInput(event.target.value)}
              className="w-full rounded border border-black/20 bg-white px-2 py-1.5 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded bg-accent px-3 py-2 text-sm font-semibold text-white"
                onClick={() => void createNewProject()}
              >
                New
              </button>
              <button
                type="button"
                className="rounded border border-black/30 px-3 py-2 text-sm"
                onClick={() => void openProject()}
              >
                Open
              </button>
            </div>
            <button
              type="button"
              className="w-full rounded border border-black/30 px-3 py-2 text-sm"
              onClick={() => void importImage()}
            >
              Import reference
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-wide text-black/55">References</div>
            {referenceAssetUrl ? (
              <div className="space-y-2">
                <button type="button" className="w-full overflow-hidden rounded border border-black/20 bg-white p-1">
                  <img src={referenceAssetUrl} alt="Reference thumbnail" className="h-16 w-full object-cover" />
                </button>
                <div className="overflow-hidden rounded border border-black/20 bg-white">
                  <img src={referenceAssetUrl} alt="Current reference" className="h-44 w-full object-contain" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-black/60">No reference imported yet.</p>
            )}
          </div>
        </aside>

        <main className="rounded-xl border border-black/10 bg-panel p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Work Canvas</h2>
            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sideBySide}
                  onChange={(event) => setSideBySide(event.target.checked)}
                />
                Side-by-side
              </label>
              <span className="rounded border border-black/20 bg-white px-2 py-1">Zoom {zoom.toFixed(2)}x</span>
            </div>
          </div>

          <div className="h-[calc(100vh-9rem)]">
            {referenceAssetUrl ? (
              sideBySide ? (
                <div className="grid h-full grid-cols-2 gap-2">
                  <div className="overflow-hidden rounded-lg border border-black/15 bg-[#dfd7ca]">
                    <img src={referenceAssetUrl} alt="Reference full view" className="h-full w-full object-contain" />
                  </div>
                  {renderInteractiveViewer()}
                </div>
              ) : (
                renderInteractiveViewer()
              )
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-black/15 bg-[#dfd7ca] text-sm text-black/60">
                Import a reference image to start sampling colors.
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        </main>

        <aside className="rounded-xl border border-black/10 bg-panel p-4 shadow-sm">
          <h2 className="font-heading text-lg font-semibold">Tools</h2>

          <div className="mt-3 rounded border border-black/15 bg-white p-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Sample</span>
              <span className="rounded border border-black/20 px-2 py-0.5">{sample.hex}</span>
            </div>
            <div className="mt-1 text-xs text-black/65">
              RGB ({sample.rgb.r}, {sample.rgb.g}, {sample.rgb.b})
            </div>
            <div className="mt-2 h-8 rounded border border-black/20" style={{ background: sample.hex }} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="rounded bg-black px-3 py-2 text-sm font-medium text-white"
              onClick={addSwatch}
            >
              Add swatch
            </button>
            <button
              type="button"
              className="rounded border border-black/30 px-3 py-2 text-sm"
              onClick={() => void saveProject()}
            >
              Save
            </button>
          </div>

          <div className="mt-4 space-y-2 overflow-auto">
            {project?.swatches.length ? (
              project.swatches.map((swatch) => (
                <div key={swatch.id} className="flex items-center justify-between rounded border border-black/15 bg-white p-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-6 w-6 rounded border border-black/20"
                      style={{ background: swatch.hex }}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-sm font-medium">{swatch.hex}</div>
                      <div className="text-xs text-black/65">
                        {swatch.rgb.r}, {swatch.rgb.g}, {swatch.rgb.b}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded border border-black/25 px-2 py-1 text-xs"
                    onClick={() => removeSwatch(swatch.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-black/60">No swatches saved yet.</p>
            )}
          </div>

          <p className="mt-4 rounded bg-black/5 p-2 text-xs text-black/70">{status}</p>
          <p className="mt-2 text-xs text-black/55">Hold Space to pan. Scroll to zoom. Cmd/Ctrl+S, O, N shortcuts supported.</p>
        </aside>
      </div>
    </div>
  )
}

export default App
