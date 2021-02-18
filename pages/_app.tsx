import { TinaProvider, TinaCMS } from 'tinacms'
import { MarkdownFieldPlugin } from 'react-tinacms-editor'

import type { AppProps /* , AppContext */ } from 'next/app'

import '../styles/index.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
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
