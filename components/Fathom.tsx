import React from "react";

export interface FathomProps {
    tracker: string;
    siteId: string;
    namespace?: string;
}

export interface FathomState {
    isLoaded: boolean;
}

export default class Fathom extends React.Component<FathomProps, FathomState> {
    public static defaultProps: Partial<FathomProps> = {
        namespace: "fathom"
    };

    public state = {
        isLoaded: false
    }

    public render(): JSX.Element {
        return (
            <script dangerouslySetInnerHTML={{
                __html: `
            (function(f, a, t, h, o, m){
                a[h]=a[h]||function(){
                    (a[h].q=a[h].q||[]).push(arguments)
                };
                o=f.createElement('script'),
                m=f.getElementsByTagName('script')[0];
                o.async=1; o.src=t; o.id='fathom-script';
                m.parentNode.insertBefore(o,m)
            })(document, window, '${this.props.tracker}', '${this.props.namespace}');
            fathom('set', 'siteId', '${this.props.siteId}');
            `}}/>
        );
    }
}