import React from 'react';
import PropTypes from 'prop-types';

export default function AppConfigure(props) {

    return (
        <div>
            HEY CONFIGZURE
            <button onClick={() => props.addContacts()} />
        </div>
    );
}

AppConfigure.propTypes = {
    addContacts: PropTypes.func.isRequired,
}