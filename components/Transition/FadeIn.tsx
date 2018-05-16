import React, { ReactElement } from 'react';
import { Transition } from 'react-transition-group'

const FadeIn = ({ children, duration = 500, delay = 0, easing = "ease", visible = false }) => {
    const styles = {
        entered: {
            opacity: 1
        },
        entering: {
            opacity: 0.01
        },
        exited: {
            opacity: 0.01
        },
        exiting: {
            opacity: 0.01
        }
    };

    const renderChildren = (state)  => {
        return React.Children.map(children, child => {
            return React.cloneElement(child as ReactElement<any>, {
                style: {
                    transitionDelay: `${delay}ms`,
                    transitionDuration: `${duration}ms`,
                    transitionProperty: 'opacity',
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
