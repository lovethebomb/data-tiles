import ease from 'css-ease';
import { StatelessComponent } from "next";
import React from "react";
import css from 'styled-jsx/css'

import TileContent from './TileContent';
import TileHeader from './TileHeader';

import FadeIn from '../Transition/FadeIn';

export interface TileProps {
    containerClass?: string;
    children?: any;
    visible?: boolean;
}

const Tile: StatelessComponent<TileProps> = ({containerClass = "", children, visible = false}) => {
    const className = `Tile ${containerClass}`;
    if (!children) {
        return (
            <FadeIn
            duration={350}
            easing={ease['ease-out-expo']}
            visible={visible}>
                <div className={className}>
                    <TileHeader />
                    <TileContent />
                    <style jsx>{tileStyle}</style>
                </div>
            </FadeIn>
        )
    }

    console.debug('sta', this.visible)
    return (
        <FadeIn
        duration={250}
        easing={ease['ease-out-expo']}
        visible={visible}>
            <div className={className}>
                {children}
                <style jsx>{tileStyle}</style>
            </div>
        </FadeIn>
    )
}

export const tileStyle = css`
.Tile {
    height: 100%;
    width: 20em;
    box-sizing: border-box;
    box-shadow: 0px 2px 20px #141414;
}
`
export default Tile;