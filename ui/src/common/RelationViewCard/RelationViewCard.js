import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const RelationContainer = styled.div`
    min-height: 3em;
    margin-bottom: 0.5em;
    border: 2px solid #d9d9d9;
    border-radius: 0.15em;
    .input-field {
        padding: 0 3em;
    }

    #relationListError {
        font-size: 0.75em;
        font-style: italic;
        padding-left: 1em;
    }
`;

export default function RelationViewCard (props) {
    const { relationList, relationType } = props;

    const history = useHistory();
    console.log('relationList: ', JSON.stringify(relationList));
    console.log(relationList);

    const filteredRelations = relationList.filter(r => r[relationType + 'Id'] !== "null");

    return (
        <div className="relationsList">
            <div>
                {`${relationType.toUpperCase()}S`}
            </div>
            <RelationContainer>
                {filteredRelations.length
                    ? filteredRelations.map((relation, index) => {
                        return (
                            <div key={index} onClick={() => history.push(`/${relationType.toLowerCase()}s/${relation[relationType]}`)}>
                                <span className="relationId">{relation[relationType + 'Id']}</span>
                            </div>
                        );
                    })
                    : <span id="relationListError">{`No ${relationType.toLowerCase()}s to display`}</span>}
            </RelationContainer>
        </div>
    );
}

RelationViewCard.propTypes = {
    relationList: PropTypes.array.isRequired,
    relationType: PropTypes.string.isRequired
};
