import Link from 'next/link'

const buttonClass = 'px-3 py-1 rounded border border-gray-300'
const disabledClass = `${buttonClass} text-gray-400 cursor-not-allowed`

// Previous / page numbers / Next links. `href` builds the link for a page,
// so the same component works for any listing.
const Pagination = ({
  page,
  totalPages,
  href,
}: {
  page: number
  totalPages: number
  href: (page: number) => string
}) => {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      aria-label='Pagination'
      className='container mx-auto flex flex-wrap justify-center items-center gap-2 my-8'
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className={`${buttonClass} hover:bg-gray-100`}
        >
          Previous
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled='true'>
          Previous
        </span>
      )}

      {pages.map((number) =>
        number === page ? (
          <span
            key={number}
            className={`${buttonClass} bg-blue-500 border-blue-500 text-white`}
            aria-current='page'
          >
            {number}
          </span>
        ) : (
          <Link
            key={number}
            href={href(number)}
            className={`${buttonClass} hover:bg-gray-100`}
            aria-label={`Page ${number}`}
          >
            {number}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          className={`${buttonClass} hover:bg-gray-100`}
        >
          Next
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled='true'>
          Next
        </span>
      )}
    </nav>
  )
}

export default Pagination
