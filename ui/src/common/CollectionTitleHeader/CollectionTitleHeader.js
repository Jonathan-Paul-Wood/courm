import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button';
import PropTypes from 'prop-types';
import { title2 } from '../../styles/typography';

const ContentWrapper = styled.div`
    height: 4em;
    background-color: #ffffff;
    z-index: 700;
    padding: 0 1em;
    margin: 0 0 1em 0;

    border-bottom: solid 1px black;
    
    display: grid;
    grid-template-columns: 10% 80% 10%;
    grid-template-rows: 100%;
    grid-template-areas: "header-left" "header-title" "header-right";

    #header-title {
        text-align: center;
        margin: auto 2em;
        grid-area: "header-title";
    }

    #header-right {
        margin: auto 0;
        display: flex;
        justify-content: right;
        grid-area: "header-right";
    }
`;

const classes = {
    headerTitle: {
        textAlign: 'center',
        margin: 'auto 2em',
        ...title2
    }
};

export default function CollectionTitleHeader (props) {
    const navigate = useNavigate();
    // const [listMode, setListMode] = useState(true);

    return (
        <ContentWrapper>
            <Button
                icon={'arrowLeft'}
                label="Back"
                type="secondary"
                onClick={history.goBack}
            />
            <h2 style={classes.headerTitle}>{props.title}</h2>
            <div id="header-right">
                {/* {listMode ? (
                    <div className="switch">
                        <label>
                        List
                        <input type="checkbox" />
                        <span className="lever"></span> Map
                        </label>
                    </div>
                ) : (
                    <button>Edit</button>
                )} */}
            </div>
        </ContentWrapper>
    );
}

CollectionTitleHeader.propTypes = {
    title: PropTypes.string.isRequired
};
