import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SplashScreen } from './SplashScreen'

interface MarkdownFile {
  name: string
  path: string
  content: string
  modified: string
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentDir, setCurrentDir] = useState<string | null>(null)
  const [files, setFiles] = useState<MarkdownFile[]>([])
  const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null)
  const [editorContent, setEditorContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState('Ready')
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('cb-dark-mode')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('cb-dark-mode', darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (!showSplash) {
      initializeApp()
    }
  }, [showSplash])

  async function initializeApp() {
    try {
      // Get default documents directory or use a custom one
      const defaultDir = await invoke<string>('get_default_markdown_dir')
      console.log('Default directory:', defaultDir)
      setCurrentDir(defaultDir)
      
      // Load existing files
      const fileList = await invoke<MarkdownFile[]>('list_markdown_files', { dir: defaultDir })
      setFiles(fileList)
      setStatus(`Loaded ${fileList.length} markdown file${fileList.length !== 1 ? 's' : ''}`)
      
      // If no files exist, create a welcome file
      if (fileList.length === 0) {
        const welcomePath = `${defaultDir}/Welcome.md`
        await invoke('write_markdown_file', {
          path: welcomePath,
          content: `# Welcome to CB Markdown Organizer

This is your markdown file organizer. You can:

- **Import files**: Click "Import File" to add existing markdown files
- **Create new files**: Click "New File" to create a new markdown document
- **Select a folder**: Click "Select Folder" to organize files in a different location

## Getting Started

1. Click "Import File" to add your existing markdown files
2. Or click "New File" to create a new document
3. Click on any file in the sidebar to view or edit it

Happy organizing! 🎉
`,
        })
        // Reload files
        const updatedList = await invoke<MarkdownFile[]>('list_markdown_files', { dir: defaultDir })
        setFiles(updatedList)
        setStatus(`Created welcome file. ${updatedList.length} file${updatedList.length !== 1 ? 's' : ''} total.`)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Failed to initialize:', err)
      setError(`Failed to initialize: ${errorMsg}`)
      setStatus(`Error: ${errorMsg}`)
    }
  }

  async function loadFiles(dir: string) {
    try {
      console.log('Loading files from:', dir)
      const fileList = await invoke<MarkdownFile[]>('list_markdown_files', { dir })
      console.log('Files loaded:', fileList)
      setFiles(fileList)
      setStatus(`Loaded ${fileList.length} markdown file${fileList.length !== 1 ? 's' : ''}`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Failed to load files:', err)
      setError(`Error loading files: ${errorMsg}`)
      setStatus(`Error: ${errorMsg}`)
    }
  }

  async function selectFolder() {
    try {
      const folder = await invoke<string | null>('pick_folder', { title: 'Select Markdown Folder' })
      if (folder) {
        setCurrentDir(folder)
        await loadFiles(folder)
        setSelectedFile(null)
        setEditorContent('')
        setIsEditing(false)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Failed to select folder:', err)
      setError(`Error selecting folder: ${errorMsg}`)
      setStatus(`Error: ${errorMsg}`)
    }
  }

  async function openFile(file: MarkdownFile) {
    try {
      console.log('Opening file:', file.path)
      const content = await invoke<string>('read_markdown_file', { path: file.path })
      console.log('File content length:', content.length)
      setSelectedFile(file)
      setEditorContent(content)
      setIsEditing(false)
      setStatus(`Opened: ${file.name}`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Failed to open file:', err)
      setError(`Error opening file: ${errorMsg}`)
      setStatus(`Error: ${errorMsg}`)
    }
  }

  async function saveFile() {
    if (!selectedFile) return

    try {
      await invoke('write_markdown_file', {
        path: selectedFile.path,
        content: editorContent,
      })
      setIsEditing(false)
      setStatus(`Saved: ${selectedFile.name}`)
      // Reload files to update modified time
      if (currentDir) {
        await loadFiles(currentDir)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Failed to save file:', err)
      setError(`Error saving file: ${errorMsg}`)
      setStatus(`Error: ${errorMsg}`)
    }
  }

  async function importMarkdownFile() {
    try {
      const filePath = await invoke<string | null>('pick_markdown_file')
      if (!filePath) return

      // Read the file content
      const content = await invoke<string>('read_markdown_file', { path: filePath })
      
      // Get the filename
      const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'imported.md'
      
      // If we have a current directory, copy it there
      if (currentDir) {
        const destPath = `${currentDir}/${fileName}`
        await invoke('write_markdown_file', {
          path: destPath,
          content,
        })
        setStatus(`Imported: ${fileName}`)
        await loadFiles(currentDir)
        
        // Open the imported file
        const importedFile: MarkdownFile = {
          name: fileName,
          path: destPath,
          content,
          modified: Date.now().toString(),
        }
        await openFile(importedFile)
      } else {
        // No directory selected, just open the file directly
        const importedFile: MarkdownFile = {
          name: fileName,
          path: filePath,
          content,
          modified: Date.now().toString(),
        }
        setSelectedFile(importedFile)
        setEditorContent(content)
        setIsEditing(false)
        setStatus(`Opened: ${fileName}`)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Failed to import file:', err)
      setError(`Error importing file: ${errorMsg}`)
      setStatus(`Error: ${errorMsg}`)
    }
  }

  async function createNewFile() {
    if (!currentDir) {
      setStatus('Please select a folder first')
      return
    }

    const fileName = prompt('Enter file name (without .md extension):')
    if (!fileName) return

    const filePath = `${currentDir}/${fileName}.md`
    try {
      await invoke('write_markdown_file', {
        path: filePath,
        content: '# New Document\n\n',
      })
      setStatus(`Created: ${fileName}.md`)
      await loadFiles(currentDir)
      // Open the new file
      const newFile: MarkdownFile = {
        name: `${fileName}.md`,
        path: filePath,
        content: '# New Document\n\n',
        modified: Date.now().toString(),
      }
      await openFile(newFile)
      setIsEditing(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Failed to create file:', err)
      setError(`Error creating file: ${errorMsg}`)
      setStatus(`Error: ${errorMsg}`)
    }
  }

  async function deleteFile(file: MarkdownFile) {
    if (!confirm(`Delete ${file.name}?`)) return

    try {
      await invoke('delete_markdown_file', { path: file.path })
      setStatus(`Deleted: ${file.name}`)
      if (selectedFile?.path === file.path) {
        setSelectedFile(null)
        setEditorContent('')
        setIsEditing(false)
      }
      await loadFiles(currentDir!)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Failed to delete file:', err)
      setError(`Error deleting file: ${errorMsg}`)
      setStatus(`Error: ${errorMsg}`)
    }
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className={`flex h-screen flex-col ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${darkMode ? 'border-[#6B9A8A]/30 bg-black' : 'border-gray-200 bg-white'} px-4 py-3 ${darkMode ? 'border-t border-[#6B9A8A]/15' : 'shadow-sm'}`}>
        {error && (
          <div className={`mb-2 border px-3 py-2 text-sm font-mono ${
            darkMode 
              ? 'bg-[#1a2e28]/40 border-[#6B9A8A]/40 text-[#7AB8A8]' 
              : 'bg-red-50 border-red-200 text-red-800 rounded'
          }`}>
            <div className="font-semibold">[ERROR]:</div>
            <div>{error}</div>
            <button
              onClick={() => setError(null)}
              className={`mt-1 text-xs underline font-mono ${
                darkMode ? 'text-[#7AB8A8] hover:text-[#8AC8B8]' : 'text-red-600 hover:text-red-800'
              }`}
            >
              [DISMISS]
            </button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <h1 className={`text-xl font-bold font-mono ${
            darkMode 
              ? 'text-[#6B9A8A]' 
              : 'text-gray-900'
          }`}>
            {'>'} CB_MARKDOWN_ORGANIZER.exe
          </h1>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-mono ${
              darkMode ? 'text-[#7AB8A8]/80' : 'text-gray-600'
            }`}>
              [{status}]
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-2 text-sm font-medium font-mono transition-all ${
                darkMode
                  ? 'bg-[#1a2e28]/40 border border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/60 hover:border-[#6B9A8A]/50'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 rounded'
              }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '[LIGHT_MODE]' : '[DARK_MODE]'}
            </button>
            <button
              onClick={selectFolder}
              className={`px-4 py-2 text-sm font-medium font-mono transition-all ${
                darkMode
                  ? 'bg-[#1a2e28]/40 border border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/60 hover:border-[#6B9A8A]/50'
                  : 'bg-blue-600 text-white hover:bg-blue-700 rounded'
              }`}
            >
              [SELECT_FOLDER]
            </button>
            {currentDir && (
              <button
                onClick={() => loadFiles(currentDir)}
                className={`px-4 py-2 text-sm font-medium font-mono transition-all ${
                  darkMode
                    ? 'bg-[#1a2e28]/40 border border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/60 hover:border-[#6B9A8A]/50'
                    : 'bg-gray-600 text-white hover:bg-gray-700 rounded'
                }`}
                title="Refresh file list"
              >
                [REFRESH]
              </button>
            )}
            <button
              onClick={importMarkdownFile}
              className={`px-4 py-2 text-sm font-medium font-mono transition-all ${
                darkMode
                  ? 'bg-[#1a2e28]/40 border border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/60 hover:border-[#6B9A8A]/50'
                  : 'bg-purple-600 text-white hover:bg-purple-700 rounded'
              }`}
            >
              [IMPORT_FILE]
            </button>
            {currentDir && (
              <button
                onClick={createNewFile}
                className={`px-4 py-2 text-sm font-medium font-mono transition-all ${
                  darkMode
                    ? 'bg-[#1a2e28]/40 border border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/60 hover:border-[#6B9A8A]/50'
                    : 'bg-green-600 text-white hover:bg-green-700 rounded'
                }`}
              >
                [NEW_FILE]
              </button>
            )}
          </div>
        </div>
        {currentDir && (
          <div className="mt-2 flex items-center justify-between">
            <div className={`text-xs font-mono ${darkMode ? 'text-[#7AB8A8]/60' : 'text-gray-500'}`}>
              {'>'} PATH: {currentDir}
            </div>
            {files.length === 0 && (
              <div className={`text-xs font-mono ${darkMode ? 'text-yellow-400/80' : 'text-amber-600'}`}>
                {'>'} [WARNING] No markdown files found. Click "Import File" or "New File" to get started.
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - File List */}
        <aside className={`w-64 border-r overflow-y-auto ${
          darkMode ? 'border-[#6B9A8A]/20 bg-black' : 'border-gray-200 bg-white'
        }`}>
          <div className="p-4">
            <h2 className={`mb-3 text-sm font-semibold font-mono border-b pb-2 ${
              darkMode ? 'text-[#6B9A8A] border-[#6B9A8A]/25' : 'text-gray-700 border-gray-200'
            }`}>
              {'>'} FILES.DIR {'─'.repeat(15)}
            </h2>
            {files.length === 0 ? (
              <p className={`text-sm font-mono ${darkMode ? 'text-[#7AB8A8]/50' : 'text-gray-500'}`}>
                {'>'} No files found {'─'.repeat(10)}
              </p>
            ) : (
              <ul className="space-y-1">
                {files.map((file) => (
                  <li key={file.path}>
                    <button
                      onClick={() => openFile(file)}
                      className={`w-full px-3 py-2 text-left text-sm font-mono transition-all ${
                        selectedFile?.path === file.path
                          ? darkMode
                            ? 'bg-[#1a2e28]/40 border border-[#6B9A8A]/30 text-[#7AB8A8]'
                            : 'bg-blue-100 text-blue-900 rounded'
                          : darkMode
                            ? 'text-[#7AB8A8]/70 hover:bg-[#1a2e28]/25 hover:text-[#7AB8A8] border border-transparent hover:border-[#6B9A8A]/25'
                            : 'text-gray-700 hover:bg-gray-100 rounded'
                      }`}
                    >
                      <div className="font-medium">{'>'} {file.name}</div>
                      <div className={`text-xs font-mono ${
                        darkMode ? 'text-[#7AB8A8]/40' : 'text-gray-500'
                      }`}>
                        {'└─'} {new Date(parseInt(file.modified) * 1000).toLocaleDateString()}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Editor/Viewer */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {selectedFile ? (
            <>
              {/* Toolbar */}
              <div className={`border-b px-4 py-2 ${
                darkMode ? 'border-[#6B9A8A]/20 bg-black border-t border-[#6B9A8A]/10' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium font-mono ${
                    darkMode ? 'text-[#6B9A8A]' : 'text-gray-700'
                  }`}>
                    {'>'} {selectedFile.name}
                  </span>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveFile}
                          className={`px-3 py-1 text-sm font-mono transition-all ${
                            darkMode
                              ? 'bg-[#1a2e28]/40 border border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/60 hover:border-[#6B9A8A]/50'
                              : 'bg-blue-600 text-white hover:bg-blue-700 rounded'
                          }`}
                        >
                          [SAVE]
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false)
                            openFile(selectedFile)
                          }}
                          className={`border px-3 py-1 text-sm font-mono transition-all ${
                            darkMode
                              ? 'border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/40 hover:border-[#6B9A8A]/50'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50 rounded'
                          }`}
                        >
                          [CANCEL]
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className={`border px-3 py-1 text-sm font-mono transition-all ${
                            darkMode
                              ? 'border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/40 hover:border-[#6B9A8A]/50'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50 rounded'
                          }`}
                        >
                          [EDIT]
                        </button>
                        <button
                          onClick={() => deleteFile(selectedFile)}
                          className={`border px-3 py-1 text-sm font-mono transition-all ${
                            darkMode
                              ? 'border-[#6B9A8A]/30 text-[#7AB8A8] hover:bg-[#1a2e28]/40 hover:border-[#6B9A8A]/50'
                              : 'border-red-300 text-red-700 hover:bg-red-50 rounded'
                          }`}
                        >
                          [DELETE]
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Editor/Viewer Area */}
              <div className="flex-1 overflow-hidden">
                {isEditing ? (
                  <div className="relative h-full">
                    <div className={`absolute top-0 left-0 p-4 font-mono text-xs ${darkMode ? 'text-[#7AB8A8]/50' : 'text-gray-400'}`}>
                      {'>'} EDIT_MODE: ACTIVE {'─'.repeat(20)}
                    </div>
                    <textarea
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      className={`h-full w-full resize-none border-0 p-4 pt-8 font-mono text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-black text-[#7AB8A8] placeholder-[#6B9A8A]/30 caret-[#7AB8A8] selection:bg-[#6B9A8A]/20'
                          : 'bg-white text-gray-900'
                      }`}
                      placeholder="Start typing your markdown..."
                    />
                  </div>
                ) : (
                  <div className={`h-full overflow-y-auto relative ${
                    darkMode ? 'bg-black' : 'bg-white'
                  }`}>
                    <div className={`absolute top-0 left-0 p-4 font-mono text-xs z-10 ${darkMode ? 'text-[#7AB8A8]/50' : 'text-gray-400'}`}>
                      {'>'} VIEW_MODE: ACTIVE {'─'.repeat(20)}
                    </div>
                    <div className={`prose prose-slate prose-sm max-w-none p-6 pt-12 ${
                      darkMode ? 'prose-invert' : ''
                    }`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className={`text-3xl font-bold mt-6 mb-4 border-b pb-2 font-mono ${
                            darkMode ? 'text-[#6B9A8A] border-[#6B9A8A]/25' : 'text-gray-900 border-gray-200'
                          }`} {...props} />,
                          h2: ({node, ...props}) => <h2 className={`text-2xl font-semibold mt-5 mb-3 border-b pb-2 font-mono ${
                            darkMode ? 'text-[#6B9A8A] border-[#6B9A8A]/25' : 'text-gray-900 border-gray-200'
                          }`} {...props} />,
                          h3: ({node, ...props}) => <h3 className={`text-xl font-semibold mt-4 mb-2 font-mono ${
                            darkMode ? 'text-[#7AB8A8]' : 'text-gray-900'
                          }`} {...props} />,
                          h4: ({node, ...props}) => <h4 className={`text-lg font-semibold mt-3 mb-2 font-mono ${
                            darkMode ? 'text-[#7AB8A8]' : 'text-gray-900'
                          }`} {...props} />,
                          p: ({node, ...props}) => <p className={`mb-4 leading-relaxed font-mono ${
                            darkMode ? 'text-[#8AC8B8]/90' : 'text-gray-700'
                          }`} {...props} />,
                          ul: ({node, ...props}) => <ul className={`list-disc list-inside mb-4 space-y-1 font-mono ${
                            darkMode ? 'text-[#8AC8B8]/90' : 'text-gray-700'
                          }`} {...props} />,
                          ol: ({node, ...props}) => <ol className={`list-decimal list-inside mb-4 space-y-1 font-mono ${
                            darkMode ? 'text-[#8AC8B8]/90' : 'text-gray-700'
                          }`} {...props} />,
                          li: ({node, ...props}) => <li className="ml-4" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className={`border-l-4 pl-4 italic my-4 font-mono ${
                            darkMode ? 'border-[#6B9A8A]/40 text-[#7AB8A8]/80 bg-[#1a2e28]/20' : 'border-gray-300 text-gray-600'
                          }`} {...props} />,
                          code: ({node, inline, ...props}: any) => 
                            inline ? (
                              <code className={`px-1.5 py-0.5 text-sm font-mono ${
                                darkMode
                                  ? 'bg-[#1a2e28]/40 text-[#7AB8A8] border border-[#6B9A8A]/25'
                                  : 'bg-gray-100 text-pink-600 rounded'
                              }`} {...props} />
                            ) : (
                              <code className={`block p-4 overflow-x-auto my-4 text-sm font-mono border ${
                                darkMode
                                  ? 'bg-black border-[#6B9A8A]/25 text-[#7AB8A8]'
                                  : 'bg-gray-900 text-gray-100 border-gray-700 rounded-lg'
                              }`} {...props} />
                            ),
                          pre: ({node, ...props}) => <pre className={`p-4 overflow-x-auto my-4 text-sm border font-mono ${
                            darkMode
                              ? 'bg-black border-[#6B9A8A]/25 text-[#7AB8A8]'
                              : 'bg-gray-900 text-gray-100 border-gray-700 rounded-lg'
                          }`} {...props} />,
                          a: ({node, ...props}) => <a className={`underline font-mono ${
                            darkMode ? 'text-[#7AB8A8] hover:text-[#8AC8B8]' : 'text-blue-600 hover:text-blue-800'
                          }`} {...props} />,
                          strong: ({node, ...props}) => <strong className={`font-bold font-mono ${
                            darkMode ? 'text-[#7AB8A8]' : 'text-gray-900'
                          }`} {...props} />,
                          em: ({node, ...props}) => <em className={`italic font-mono ${
                            darkMode ? 'text-[#8AC8B8]' : 'text-gray-800'
                          }`} {...props} />,
                          hr: ({node, ...props}) => <hr className={`my-6 ${
                            darkMode ? 'border-[#6B9A8A]/25' : 'border-gray-300'
                          }`} {...props} />,
                          table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className={`min-w-full border ${
                            darkMode ? 'border-[#6B9A8A]/25' : 'border-gray-300'
                          }`} {...props} /></div>,
                          thead: ({node, ...props}) => <thead className={darkMode ? 'bg-[#1a2e28]/30 border-b border-[#6B9A8A]/25' : 'bg-gray-100'} {...props} />,
                          th: ({node, ...props}) => <th className={`border px-4 py-2 text-left font-semibold font-mono ${
                            darkMode ? 'border-[#6B9A8A]/25 text-[#7AB8A8]' : 'border-gray-300 text-gray-900'
                          }`} {...props} />,
                          td: ({node, ...props}) => <td className={`border px-4 py-2 font-mono ${
                            darkMode ? 'border-[#6B9A8A]/20 text-[#8AC8B8]/90' : 'border-gray-300 text-gray-700'
                          }`} {...props} />,
                        }}
                      >
                        {editorContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={`flex h-full items-center justify-center ${
              darkMode ? 'text-[#7AB8A8]/50' : 'text-gray-500'
            }`}>
              <div className="text-center font-mono">
                <p className="text-lg">{'>'} NO_FILE_SELECTED</p>
                <p className="mt-2 text-sm">{'─'.repeat(30)}</p>
                <p className="mt-2 text-sm">Select a file from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
