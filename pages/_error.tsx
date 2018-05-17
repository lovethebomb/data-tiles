import React from 'react'
import Header from '../components/Header';
import Layout from '../components/Layout';

export default class Error extends React.Component<{ statusCode: number }> {
  public static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }

  public render() {

    const Generic = (
        <React.Fragment>
            <h2>Error {this.props.statusCode}</h2>
            <p>Something went wrong, please try again later.</p>
        </React.Fragment>
    )
    const NotFound = (
        <React.Fragment>
            <h2>{this.props.statusCode}</h2>
            <p>Woops, this content is not available or cannot be found anymore!</p>
        </React.Fragment>
    )
    return (
        <Layout>
            <Header />
            <div className="Error">
                {this.props.statusCode === 404 ? NotFound : Generic}
            </div>
            <style jsx={true} global={true}>{`
            .Error {
                margin: 2em auto;
            }
            .Error h2 {
                font-family: monospace;
                font-size: 24px;
                font-weight: bold;
            }
            `}
            </style>
        </Layout>
    )
  }
}