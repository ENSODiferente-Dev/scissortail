import LegacyHtmlPage from '../components/LegacyHtmlPage'
import { buildLegacyMarkup } from '../lib/legacyHtml'
import termsRaw from '../content/terms.html?raw'

const TERMS_MARKUP = buildLegacyMarkup(termsRaw)

function TermsPage() {
  return <LegacyHtmlPage html={TERMS_MARKUP} />
}

export default TermsPage
