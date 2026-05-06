import LegacyHtmlPage from '../components/LegacyHtmlPage'
import { useExternalScript } from '../hooks/useExternalScript'
import { useLegacyHomeInteractions } from '../hooks/useLegacyHomeInteractions'
import { buildLegacyMarkup } from '../lib/legacyHtml'
import homeRaw from '../content/index.html?raw'

const FORM_SCRIPT_SRC = 'https://link.msgsndr.com/js/form_embed.js'
const FORM_MARKER = {
  name: 'data-script-owner',
  value: 'leadconnector-form',
}
const FORM_ATTRS = {
  'data-script-owner': 'leadconnector-form',
}

const HOME_MARKUP = buildLegacyMarkup(homeRaw, { home: true })

function HomePage() {
  useExternalScript({
    src: FORM_SCRIPT_SRC,
    attrs: FORM_ATTRS,
    markerAttr: FORM_MARKER,
  })

  useLegacyHomeInteractions()

  return <LegacyHtmlPage html={HOME_MARKUP} />
}

export default HomePage
