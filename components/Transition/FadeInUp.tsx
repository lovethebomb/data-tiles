import React, { ReactElement } from 'react';
import { Transition } from 'react-transition-group'

const FadeIn = ({ children, duration = 500, up = "80px", delay = 0, easing = "ease", visible = false }) => {
    const styles = {
        entered: {
            opacity: 1,
            transform: 'translate3d(0, 0, 0)'
        },
        entering: {
            opacity: 0.01,
            transform: `translate3d(0, ${up}, 0)`
        },
        exited: {
            opacity: 0.01,
            transform: `translate3d(0, ${up}, 0)`
        },
        exiting: {
            opacity: 0.01,
            transform: `translate3d(0, ${up}, 0)`
        }
    };

    const renderChildren = (state)  => {
        return React.Children.map(children, child => {
            return React.cloneElement(child as ReactElement<any>, {
                style: {
                    transitionDelay: [`${delay}ms`, `${delay + 10}ms`],
                    transitionDuration: [`${duration}ms`, `${duration}ms`],
                    transitionProperty: ['opacity', 'transform'],
                    transitionTimingFunction: easing,
                    willChange: 'opacity',
                    ...styles[state]
                }
            })
        })
    }

    return (
        <Transition in={visible} timeout={delay + duration}>
        {(state) => (
            <React.Fragment>
                {renderChildren(state)}
            </React.Fragment>
        )}
        </Transition>
    )
}

export default FadeIn;
