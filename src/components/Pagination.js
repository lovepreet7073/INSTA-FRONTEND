import React from "react";

const Pagination = ({ currentPage, totalPosts, postsPerPage, paginate }) => {
const totalPages = Math.ceil(totalPosts / postsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center mt-5">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => paginate(currentPage - 1)}
            aria-label="Previous"
          >
            <span aria-hidden="true">«</span>
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? "active" : ""}`}
          >
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => paginate(currentPage + 1)}
            aria-label="Next"
          >
            <span aria-hidden="true">»</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
