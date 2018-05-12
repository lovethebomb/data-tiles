import css from 'styled-jsx/css'
import Head from 'next/head'

import Header from './Header'

const Layout = (props) => (
  <section>
    <Head>
      <title>Data Tiles</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css?family=Rubik:300,400" rel="stylesheet" />
    </Head>
    <article role="main">
      {props.children}
      <style jsx global>{layoutStyle}</style>
    </article>
  </section>
)

const layoutStyle = css`
html, body {
  width: 100%;
  height: 100%;
  background-color: #181818;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 16px;
  line-height: 1.2em;
  letter-spacing: 0.05em;
  color: #FFF8EA;
  font-weight: 300;
  margin: 0;
}

section {
  padding: 2em;
}

article {
}

article p {
  margin: auto;
  line-height: 1.6em;
  margin: 1em auto;
}

h1 {
  font-weight: 700;
  margin: auto;
  font-size: 32px;
  margin: 0.5em auto auto;
}

h2 {
  font-size: 20px;
  font-weight: 300;
  margin: 0.2em auto 0.5em auto;
}

h3 {
  font-size: 14px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

aside {
  margin-top: 2em;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  margin: .5em auto;
}

a {
  color: inherit;
  font-weight: 400;
}

a:hover {
  color: #b5b5b5;
}
`;

export default Layout