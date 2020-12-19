import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';

export default function Tooltip(props) {
    const {trigger, style, placement, content, children} = props;
    const [showPopup, setPopup] = useState(false);
    return (
        <Manager>
            <Reference>
                {({ ref }) => (
                    <span
                        style={style}
                        className="reference-element"
                        ref={ref}
                        onClick={() => {
                            setPopup(!showPopup);
                        }}
                    >
                        {children}
                    </span>
                )}
            </Reference>
            <Popper placement="bottom">
                {({ ref, style, placement, arrowProps }) =>
                    showPopup ? (
                    <div
                        className="popper"
                        ref={ref}
                        style={style}
                        data-placement={placement}
                    >
                        {content}
                        <div ref={arrowProps.ref} style={arrowProps.style} />
                    </div>
                    ) : (
                    ""
                    )
                }
            </Popper>
        </Manager>
    );
}

Tooltip.defaultProps = {
    trigger: 'click',
    placement: 'auto',
    style: {},
}

Tooltip.propTypes = {
    trigger: PropTypes.string,
    placement: PropTypes.string,
    content: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    style: PropTypes.object,
}