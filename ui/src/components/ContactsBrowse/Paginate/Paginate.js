import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../../common/Button';

const PaginateWrapper = styled.div`
    height: 8vh;
    background: #f2f2f2;
    border-radius: 4px;
    box-shadow: 2px 3px 2px #cccccc;
    margin: 0.5rem 0;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    
    .pageInfo {
        margin: auto 3rem;
    }
`;

export default function Paginate (props) {
    const { total, page, cardsPerPage, count, updatePage } = props;

    let max = total / cardsPerPage;
    if (total % cardsPerPage > 0) {
        max++;
    }

    function handlePageUpdate (newPage) {
        if (newPage >= 1 && newPage <= max) {
            updatePage(newPage);
            window.scrollTo(0, 0);
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
                {((page - 1) * cardsPerPage) + 1} to {((page - 1) * cardsPerPage) + count} of {total}
            </div>
            <Button
                size='sm'
                label=''
                icon='chevronRight'
                onClick={() => handlePageUpdate(page + 1)}
                disabled={page >= Math.floor(max)}
            />
        </PaginateWrapper>
    );
}

Paginate.propTypes = {
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    cardsPerPage: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    updatePage: PropTypes.func.isRequired
};
