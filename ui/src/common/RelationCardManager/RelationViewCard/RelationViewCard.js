import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Button from '../../Button';
import { GREY } from '../../../assets/colorsConstants';

const RelationContainer = styled.div`
    dispaly: flex;
    width: 100%;

    #relationListError {
        font-size: 0.75em;
        font-style: italic;
        padding-left: 1em;
    }

    .relatedEntity {
        padding: 0.25em;
        margin: 0.25em;
        display: flex;
        justify-content: space-between;

        .relationTitle {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .relationId {
            margin-left: 1em;
        }
    }

    .relatedEntity:hover {
        cursor: pointer;
        background-color: ${GREY};
        border-radius: 0.25em;
    }

    .editButton {
        display: flex;
        justify-content: right;
        svg {
            margin: 0;
        }
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
                            <div className="relatedEntity" key={index} onClick={() => history.push(`/${relationType.toLowerCase()}s/${entity.id}`)}>
                                <span className="relationTitle" title={entity[labelTerm]}>{entity[labelTerm]}</span>
                                <span className="relationId">({entity.id})</span>
                            </div>
                        );
                    })
                    : <span id="relationListError">{`No ${relationType.toLowerCase()}s to display`}</span>
                }
            </div>
            <div className="editButton">
                <Button label='' icon='edit' disabled={disableEdit} onClick={() => enableEdit(true)} />
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
