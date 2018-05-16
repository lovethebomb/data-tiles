import ease from 'css-ease';
import { StatelessComponent } from "react";
import React from "react";

import TileContent from './TileContent';
import TileHeader from './TileHeader';

import FadeInUp from '../Transition/FadeInUp';

export interface TileProps {
    containerClass?: string;
    children?: any;
    visible?: boolean;
}

const Tile: StatelessComponent<TileProps> = ({containerClass = "", children, visible = false}) => {
    const className = `Tile ${containerClass}`;
    if (!children) {
        return (
            <FadeInUp
            duration={350}
            easing={ease['ease-out-expo']}
            visible={visible}>
                <div className={className}>
                    <TileHeader />
                    <TileContent />
                    
                </div>
            </FadeInUp>
        )
    }

    return (
        <FadeInUp
        duration={350}
        easing={ease['ease-out-expo']}
        visible={visible}
        up="40px">
            <div className={className}>
                {children}
                <style jsx={true}>{`
                .Tile {
                    height: 100%;
                    width: 320px;
                    margin: 0 1em 1em 0;
                    box-sizing: border-box;
                    box-shadow: 0px 2px 20px #141414;
                }`}</style>
            </div>
        </FadeInUp>
    )
}

export default Tile;