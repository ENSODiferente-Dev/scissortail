import LegacyHtmlPage from '../components/LegacyHtmlPage'
import { buildLegacyMarkup } from '../lib/legacyHtml'
import privacyRaw from '../content/privacy.html?raw'

const PRIVACY_MARKUP = buildLegacyMarkup(privacyRaw)

function PrivacyPage() {
  return <LegacyHtmlPage html={PRIVACY_MARKUP} />
}

export default PrivacyPage
