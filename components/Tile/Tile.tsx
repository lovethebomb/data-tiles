import ease from 'css-ease';
import { StatelessComponent } from "next";
import React from "react";
import css from 'styled-jsx/css'

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
                    <style jsx>{tileStyle}</style>
                </div>
            </FadeInUp>
        )
    }

    return (
        <FadeInUp
        duration={305}
        easing={ease['ease-out-expo']}
        visible={visible}
        up="40px">
            <div className={className}>
                {children}
                <style jsx>{tileStyle}</style>
            </div>
        </FadeInUp>
    )
}

export const tileStyle = css`
.Tile {
    height: 100%;
    max-width: 20em;
    margin: 0 1em 1em 0;
    box-sizing: border-box;
    box-shadow: 0px 2px 20px #141414;
}
`
export default Tile;