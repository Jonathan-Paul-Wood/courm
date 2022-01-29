import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '../Select';
import Button from '../Button';

const RelationContainer = styled.div`
    min-height: 3em;
    margin-bottom: 0.5em;
    border: 2px solid #d9d9d9;
    border-radius: 0.15em;
    .input-field {
        padding: 0 3em;
    }

    svg {
        margin: 0;
    }
`;

const Relation = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0.25em 0 0.25em 0.25em;

    .reference-element {
        display: flex;
        flex: 5;
        margin-right: 0.5em;
    }

    .button-group {
        display: flex;
        flex: 2;
        justify-content: right;

        button {
            display: flex;
            justify-content: space-between;
            flex: 1;
            margin: auto 0.25em;
        }
    }
`;

export default function RelationEditCard (props) {
    const { entitiesInRelations, entitiesWithoutRelations, relationType, onChange } = props;

    const [remainingOptions, setRemainingOptions] = useState(entitiesWithoutRelations);
    const [pendingChanges, setPendingChanges] = useState(entitiesInRelations);
    const [pendingSelection, setPendingSelection] = useState(0);

    useEffect(() => {
        onChange(pendingChanges); // update parent state whenever pendingChanges is updated
    }, [pendingChanges]);

    const labelTerm = relationType === 'contact' ? 'firstName' : 'title';

    function handleRemovePendingRelation (index) {
        setRemainingOptions([...remainingOptions, pendingChanges[index]]);
        setPendingChanges(pendingChanges.splice(index, 1));
    }

    function handleAddPendingRelation () {
        setPendingChanges([...pendingChanges, remainingOptions[pendingSelection]]);
        setRemainingOptions(remainingOptions.splice(pendingSelection, 1));
        setPendingSelection(null);
    }

    console.log('relation edit card props: ', props);
    console.log('relation state: ', remainingOptions, pendingChanges);

    return (
        <div className="relationsList">
            <div>
                {`${relationType.toUpperCase()}S`}
            </div>
            <RelationContainer>
                <div>
                    <Select
                        options={remainingOptions.map(x => { return { label: x[labelTerm] }; })}
                        selectedIndex={pendingSelection}
                        // searchable={true}
                        // icon={'search'}
                        onSelect={(e) => setPendingSelection(e.target.index)}
                    />
                    <Button disabled={!pendingSelection} icon="plus" type="secondary" label='' onClick={() => handleAddPendingRelation} />
                </div>
                <>
                    {pendingChanges.map((pendingChange, index) => {
                        return (
                            <Relation key={index}>
                                <span className="pendingRelation">{`${pendingChange[labelTerm]} (${pendingChange.id})`}</span>
                                <Button icon="minus" type="secondary" label='' onClick={() => handleRemovePendingRelation(index)} />
                            </Relation>
                        );
                    })}
                </>
            </RelationContainer>
        </div>
    );
}

RelationEditCard.propTypes = {
    entitiesInRelations: PropTypes.array.isRequired,
    entitiesWithoutRelations: PropTypes.array.isRequired,
    relationType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};
