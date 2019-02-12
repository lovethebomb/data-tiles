import App, { Container } from 'next/app'
import React from 'react'
import css from 'styled-jsx/css'

export default class MyApp extends App {
   public static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    public render() {
        if (process.browser && window.fathom) {
            window.fathom('trackPageview');
        }
        const { Component, pageProps } = this.props

        return (
            <Container>
                <Component {...pageProps} />
                <style jsx={true} global={true}>{layoutStyle}</style>
            </Container>
        )
    }
}

const layoutStyle = css.global`
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

@media screen and (max-width: 320px) {
  section {
    padding: 10px;
  }

  .Tiles .Tile {
    margin: 0.5em 0;
  } 
}
`;