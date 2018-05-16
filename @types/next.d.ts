import * as React from "react"

declare module "next" {

    export interface Context {
        pathname: string;
        query: any;
        asPath: string;
        req: { locale: string, localeDataScript: string, messages: object, antdLocale: object };
        res?: object;
        renderPage: () => object;
    }

    type SFC<P = {}> = StatelessComponent<P>;
    interface StatelessComponent<P = {}> extends React.StatelessComponent<P> {
        getInitialProps?: (Context) => P | Promise<any>;
    }

}