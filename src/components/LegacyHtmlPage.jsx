import parse from 'html-react-parser'

function LegacyHtmlPage({ html }) {
  return parse(html)
}

export default LegacyHtmlPage
