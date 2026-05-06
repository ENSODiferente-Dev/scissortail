const BODY_REGEX = /<body[^>]*>([\s\S]*?)<\/body>/i
const SCRIPT_REGEX = /<script\b[^>]*>[\s\S]*?<\/script>/gi

const LEGACY_LINK_REPLACEMENTS = [
  ['href="./index.html"', 'href="#/"'],
  ['href="./terms.html"', 'href="#/terms"'],
  ['href="./privacy.html"', 'href="#/privacy"'],
]

const HOME_SCROLL_LINK_REPLACEMENTS = [
  ['href="#top"', 'href="#/" data-scroll-target="top"'],
  ['href="#about"', 'href="#/" data-scroll-target="about"'],
  ['href="#services"', 'href="#/" data-scroll-target="services"'],
  ['href="#estimate"', 'href="#/" data-scroll-target="estimate"'],
]

function removeFirstDivBlockByMarker(html, marker) {
  const start = html.indexOf(marker)
  if (start === -1) return html

  const divTagRegex = /<\/?div\b[^>]*>/g
  divTagRegex.lastIndex = start

  let depth = 0
  let blockStart = -1

  let match = divTagRegex.exec(html)
  while (match) {
    const tag = match[0]
    const index = match.index ?? -1
    if (index < start) {
      match = divTagRegex.exec(html)
      continue
    }

    if (blockStart === -1) {
      blockStart = index
    }

    if (tag.startsWith('</div')) {
      depth -= 1
      if (depth === 0) {
        const blockEnd = index + tag.length
        return html.slice(0, blockStart) + html.slice(blockEnd)
      }
      match = divTagRegex.exec(html)
      continue
    }

    depth += 1
    match = divTagRegex.exec(html)
  }

  return html
}

function applyReplacements(html, replacements) {
  return replacements.reduce((acc, [searchValue, replaceValue]) => {
    return acc.split(searchValue).join(replaceValue)
  }, html)
}

export function buildLegacyMarkup(rawHtml, { home = false } = {}) {
  const bodyMatch = rawHtml.match(BODY_REGEX)
  let content = bodyMatch ? bodyMatch[1] : rawHtml

  content = content.replace(SCRIPT_REGEX, '')
  content = applyReplacements(content, LEGACY_LINK_REPLACEMENTS)

  if (home) {
    content = applyReplacements(content, HOME_SCROLL_LINK_REPLACEMENTS)
  }

  return content
}

export function buildLegacyHomeRemainderMarkup(rawHtml) {
  const content = buildLegacyMarkup(rawHtml, { home: true })
  const mainStart = content.indexOf('<main>')
  const mainEnd = content.indexOf('</main>', mainStart)
  const footerStart = content.indexOf('<footer')
  const footerEnd = content.indexOf('</footer>', footerStart)
  const mobileNavStart = content.indexOf('<nav class="fixed inset-x-0 bottom-0 z-50')
  const mobileNavEnd = content.indexOf('</nav>', mobileNavStart)

  if (mainStart === -1 || mainEnd === -1) {
    return ''
  }

  let mainBlock = content.slice(mainStart, mainEnd + '</main>'.length)
  mainBlock = removeFirstDivBlockByMarker(mainBlock, '<div class="max-w-3xl">')

  const footerBlock =
    footerStart !== -1 && footerEnd !== -1 ? content.slice(footerStart, footerEnd + '</footer>'.length) : ''
  const mobileNavBlock =
    mobileNavStart !== -1 && mobileNavEnd !== -1
      ? content.slice(mobileNavStart, mobileNavEnd + '</nav>'.length)
      : ''

  return [mainBlock, footerBlock, mobileNavBlock].filter(Boolean).join('\n')
}
