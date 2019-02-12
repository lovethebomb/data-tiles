import Head from 'next/head'
import React from 'react'
import Fathom from './Fathom'

const Layout = (props) => (
  <section>
    <Head>
      <title>Data Tiles - lucas.computer</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      <meta name="theme-color" content="#111" />
      <meta name="description" content="Simple tiles showing some unfamous statistics."/>
      <meta name="robots" content="index,follow"/>
      <meta name="twitter:creator" content="@ltb_lucas"/>
      <link rel="dns-prefetch" href="//fonts.googleapis.com"/>
      <link rel="dns-prefetch" href="//fonts.gstatic.com"/>
      <meta property="og:type" content="website"/>
      <meta property="og:author" content="Lucas Heymès, @ltb_lucas" />
      <meta property="og:url" content="https://data.lucas.computer" />
      <link href="https://fonts.googleapis.com/css?family=Rubik:300,400" rel="stylesheet"/>
      <Fathom tracker="//fathom.lucas.computer/tracker.js" siteId="VWGIA" />
    </Head>
    <article role="main">
      {props.children}
    </article>
  </section>
)

export default Layout