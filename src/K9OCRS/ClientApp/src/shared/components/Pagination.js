import React from 'react';
import usePagination, { DOTS } from '../../util/usePagination';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const CustomPagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
    window.scrollTo(0, 0);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const onChange = pageNumber => {
    onPageChange(pageNumber);
    window.scrollTo(0, 0);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <Pagination className={className} >
      <PaginationItem disabled={currentPage === 0}>
        <PaginationLink onClick={onPrevious} previous>
          {'<'}
        </PaginationLink>
      </PaginationItem>
      {
        paginationRange?.map((page, idx) => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (page === DOTS) {
            return (
              <PaginationItem key={`${idx}_${page}`} disabled>
                <PaginationLink>
                  &#8230;
                </PaginationLink>
              </PaginationItem>
            );
          }

          // Render our Page Links
          return (
            <PaginationItem key={`${idx}_${page}`} active={page === currentPage}>
              <PaginationLink onClick={() => onChange(page)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })
      }
      <PaginationItem disabled={currentPage === lastPage}>
        <PaginationLink onClick={onNext} next>
          {'>'}
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};

export default CustomPagination;
