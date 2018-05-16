import { StatelessComponent } from 'next';
import React from 'react'

import Header from '../components/Header'
import Layout from '../components/Layout'


const About: StatelessComponent<any> = () => (
  <Layout>
      <Header />
      <div className="About">
            <p>This application is a sample side-project created to learn a bit more about <a href="https://github.com/zeit/next.js/">Next.js</a> and <a href="https://www.typescriptlang.org/">TypeScript</a>.</p>
            <p>All the API requests are handled by a small express project, which also serve the <a href="https://github.com/zeit/next.js/">Next.js</a> app.</p>
            <p>Feel free to checkout the code on <a href="https://github.com/lovethebomb/data-tiles">Github</a> or <a href="https://www.lucas.computer">reach out</a> to me!</p>
      </div>
  </Layout>
)

export default About 