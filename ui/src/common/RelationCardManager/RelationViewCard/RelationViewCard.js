import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Button from '../../Button';

const RelationContainer = styled.div`
    #relationListError {
        font-size: 0.75em;
        font-style: italic;
        padding-left: 1em;
    }

    #editButton {
        margin-left: auto;
    }
`;

export default function RelationViewCard (props) {
    const { relationList, relationType, relatedEntityList, enableEdit, disableEdit, labelTerm } = props;

    const history = useHistory();
    console.log('VIEW relationList: ', JSON.stringify(relationList));

    const filteredRelations = relationList.length ? relationList.filter(r => r[relationType + 'Id'] !== null) : [];
    console.log('VIEW filteredRelations: ', filteredRelations);
    const filteredEntities = filteredRelations.map(relation => relatedEntityList.find(entity => entity.id === relation[relationType + 'Id']));
    console.log('VIEW filteredEntities: ', filteredEntities);

    return (
        <RelationContainer>
            <div>
                {filteredEntities.length
                    ? filteredEntities.map((entity, index) => {
                        return (
                            <div key={index} onClick={() => history.push(`/${relationType.toLowerCase()}s/${entity.id}`)}>
                                <span className="relationId">{entity[labelTerm]} ({entity.id})</span>
                            </div>
                        );
                    })
                    : <span id="relationListError">{`No ${relationType.toLowerCase()}s to display`}</span>
                }
            </div>
            <div>
                <Button id="editButton" label='' icon='edit' disabled={disableEdit} onClick={() => enableEdit(true)} />
            </div>
        </RelationContainer>
    );
}

RelationViewCard.propTypes = {
    relationList: PropTypes.array.isRequired,
    relationType: PropTypes.string.isRequired,
    relatedEntityList: PropTypes.array.isRequired,
    enableEdit: PropTypes.func.isRequired,
    disableEdit: PropTypes.bool.isRequired,
    labelTerm: PropTypes.string.isRequired
};
