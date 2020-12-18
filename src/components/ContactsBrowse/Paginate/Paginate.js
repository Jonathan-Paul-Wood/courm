import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../../common/Button/Button';

const PaginateWrapper = styled.div`
    height: 10vh;
    background: #f2f2f2;
    border-radius: 4px;
    box-shadow: 2px 3px 2px #cccccc;
    margin: 0.5rem 0;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    
    .pageInfo {
        margin: auto 4rem;
    }
`;

export default function Paginate(props) {
    const { total, page, cardsPerPage, updatePage } = props;

    let max = total / cardsPerPage;
    if (total % cardsPerPage > 0) {
        max++;
    }

    function handlePageUpdate(newPage) {
        if (newPage >= 1 && newPage <= max) {
            updatePage(newPage);
        }
    }

    return (
        <PaginateWrapper>
            <Button
                size='sm'
                label=''
                icon='chevronLeft'
                onClick={() => handlePageUpdate(page - 1)}
                disabled={page <= 1}
            />
            <div className="pageInfo">
                Results {(page - 1) * cardsPerPage} to {page * cardsPerPage} of {total}
            </div>
            <Button
                size='sm'
                label=''
                icon='chevronRight'
                onClick={() => handlePageUpdate(page + 1)}
                disabled={page >= max}
            />
        </PaginateWrapper>
    );
}

Paginate.propTypes = {
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    cardsPerPage: PropTypes.number.isRequired,
    updatePage: PropTypes.func.isRequired,
}