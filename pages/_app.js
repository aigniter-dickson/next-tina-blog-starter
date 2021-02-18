import { TinaProvider, TinaCMS } from 'tinacms'
import { MarkdownFieldPlugin } from 'react-tinacms-editor'

import '../styles/index.css'

const MyApp = ({ Component, pageProps }) => {
  const cms = new TinaCMS({
    // enabled: process.env.NODE_ENV !== 'production',
    enabled: true,
    sidebar: true,
    toolbar: true,
    plugins: [MarkdownFieldPlugin],
  })

  return (
    <TinaProvider cms={cms}>
        <Component {...pageProps} />
    </TinaProvider>
  )
}

export default MyApp
