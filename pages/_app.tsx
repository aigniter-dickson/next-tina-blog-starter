import React, { useEffect } from 'react'
import App from 'next/app'

import path from 'path'

import { TinaCMS, TinaProvider, ModalProvider, useCMS } from 'tinacms'
import { GithubClient, TinacmsGithubProvider, } from 'react-tinacms-github'
import { NextGithubMediaStore } from 'next-tinacms-github'

import '../styles/index.css'

// the following line will cause all content files to be available in a serverless context
path.resolve('./content/')

const MainLayout = ({ Component, pageProps, cms }: any) => {
  useEffect(() => {
    import('react-tinacms-date').then(({ DateFieldPlugin }) => {
      cms.plugins.add(DateFieldPlugin)
    })
    import('react-tinacms-editor').then(({ MarkdownFieldPlugin }) => {
      cms.plugins.add(MarkdownFieldPlugin)
    })
    import('react-tinacms-field-condition').then(
      ({ ConditionalFieldPlugin, ConditionalGroupFieldPlugin }) => {
        cms.plugins.add(ConditionalFieldPlugin)
        cms.plugins.add(ConditionalGroupFieldPlugin)
      }
    )
  }, [pageProps.preview])

  const enterEditMode = async () => {
    const token = localStorage.getItem('tinacms-github-token') || null
    const headers = new Headers()

    if (token) {
      headers.append('Authorization', 'Bearer ' + token)
    }

    const response = await fetch(`/api/preview`, { headers })
    const data = await response.json()

    if (response.status === 200) {
      window.location.reload()
    } else {
      throw new Error(data.message)
    }
  }

  const exitEditMode = () => {
    fetch(`/api/reset-preview`).then(() => {
      window.location.reload()
    })
  }

  return (
    <TinaProvider cms={cms}>
      <ModalProvider>
        <TinacmsGithubProvider
          onLogin={enterEditMode}
          onLogout={exitEditMode}
          error={pageProps.error}
        >
          <Component {...pageProps} />
        </TinacmsGithubProvider>
      </ModalProvider>
    </TinaProvider>
  )
}

const MyApp = ({ Component, pageProps }: import('next/app').AppProps) => {
  const githubClient = new GithubClient({
    proxy: '/api/proxy-github',
    authCallbackRoute: '/api/create-github-access-token',
    clientId: process.env.GITHUB_CLIENT_ID,
    baseRepoFullName: process.env.BASE_REPO_FULL_NAME,
    baseBranch: process.env.BASE_BRANCH, // e.g. 'master' or 'main' on newer repos
  })

  const tinaConfig: import('tinacms').TinaCMSConfig = {
    enabled: !!pageProps.preview,
    toolbar: !!pageProps.preview,
    sidebar: !!pageProps.preview && {
      position: 'displace',
    },
    apis: {
      github: githubClient,
    },
    media: new NextGithubMediaStore(githubClient),
    plugins: [],
  }

  const cms = React.useMemo(() => new TinaCMS(tinaConfig), [])

  return (
    <MainLayout Component={Component} pageProps={pageProps} cms={cms} />
  )
}

export default MyApp

/**
 * Fetch data with getStaticProps based on 'preview' mode
 */
export const getStaticProps: import('next').GetStaticProps = async function({
  preview,
  previewData,
}) {
  console.debug({preview, previewData})
  if (preview) {
    return {
      props: {
        preview:true
      }
    }
    // return getGithubPreviewProps({
    //   ...previewData,
    //   fileRelativePath: 'content/home.json',
    //   parse: parseJson,
    // })
  }
  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        // fileRelativePath: 'content/home.json',
        // data: (await import('../content/home.json')).default,
      },
    },
  }
}
