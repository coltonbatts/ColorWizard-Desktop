const HTTP_PROTOCOL_PATTERN = /^https?:\/\//i

function shouldBlock(input: unknown): boolean {
  if (typeof input === 'string') {
    return HTTP_PROTOCOL_PATTERN.test(input)
  }

  if (input instanceof URL) {
    return input.protocol === 'http:' || input.protocol === 'https:'
  }

  if (typeof Request !== 'undefined' && input instanceof Request) {
    return HTTP_PROTOCOL_PATTERN.test(input.url)
  }

  return false
}

function networkGuardError(url: string): Error {
  return new Error(`[local-only] blocked remote request in dev: ${url}`)
}

export function installLocalOnlyNetworkGuard(): void {
  const originalFetch = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (shouldBlock(input)) {
      const blockedUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      const error = networkGuardError(blockedUrl)
      console.warn(error.message)
      throw error
    }

    return originalFetch(input, init)
  }

  const originalOpen = window.XMLHttpRequest.prototype.open
  window.XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null,
  ): void {
    const nextUrl = typeof url === 'string' ? url : url.toString()
    if (HTTP_PROTOCOL_PATTERN.test(nextUrl)) {
      const error = networkGuardError(nextUrl)
      console.warn(error.message)
      throw error
    }

    originalOpen.call(this, method, nextUrl, async ?? true, username ?? null, password ?? null)
  }
}
