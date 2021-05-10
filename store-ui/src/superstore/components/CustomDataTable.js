import {useTable, usePagination, useSortBy} from 'react-table'
import {useEffect} from 'react'
import {Table, TableBody, TableCell, TableFooter, TableHeader, TableRow} from 'grommet'
import {CaretDownFill, CaretUpFill} from 'grommet-icons'

function CustomDataTable ({columns,
                          data,
                          fetchData,
                          loading,
                          pageCount: controlledPageCount}
) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: { pageIndex, pageSize, sortBy },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 }, // Pass our hoisted table state
            manualPagination: true, // Tell the usePagination
            manualSortBy: true,
            autoResetPage: false,
            autoResetSortBy: false,
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            pageCount: controlledPageCount,
        },
        useSortBy,
        usePagination
    )

    useEffect(() => {
        fetchData({ pageIndex, pageSize, sortBy })
    }, [fetchData, pageIndex, pageSize, sortBy])

    return (
        <>
            <Table {...getTableProps()}>
                <TableHeader>
                {// Loop over the header rows
                    headerGroups.map(headerGroup => (
                        // Apply the header row props
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {// Loop over the headers in each row
                                headerGroup.headers.map(column => (
                                    // Apply the header cell props
                                    <TableCell {...column.getHeaderProps()}>
                                        <span {...column.getSortByToggleProps()}>
                                            {column.render('Header')}
                                            {/* Add a sort direction indicator */}
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <CaretDownFill />
                                                    : <CaretUpFill />
                                                : ''}
                                        </span>
                                    </TableCell>
                                ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                            })}
                        </TableRow>
                    )
                })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        {loading ? (
                            // Use our custom loading state to show a loading indicator
                            <TableCell colSpan="10000">Loading...</TableCell>
                        ) : (
                            <TableCell colSpan="10000">
                                Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                                results
                            </TableCell>
                        )}
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
          Page{' '}
                    <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
                <span>
          | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
        </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[5, 10, 15].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

export default CustomDataTable
