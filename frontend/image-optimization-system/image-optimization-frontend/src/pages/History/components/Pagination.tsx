import "./Pagination.css";

interface PaginationProps {

    currentPage: number;

    totalPages: number;

    onPageChange: (page: number) => void;

}

function Pagination({

    currentPage,

    totalPages,

    onPageChange,

}: PaginationProps) {

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {

        pages.push(i);

    }

    return (

        <div className="pagination">

            <button

                disabled={currentPage === 1}

                onClick={() => onPageChange(currentPage - 1)}

            >

                Previous

            </button>

            {

                pages.map(page => (

                    <button

                        key={page}

                        className={

                            currentPage === page

                                ? "active-page"

                                : ""

                        }

                        onClick={() => onPageChange(page)}

                    >

                        {page}

                    </button>

                ))

            }

            <button

                disabled={currentPage === totalPages}

                onClick={() => onPageChange(currentPage + 1)}

            >

                Next

            </button>

        </div>

    );

}

export default Pagination;