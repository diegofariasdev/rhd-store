import Layout from '../components/Layout'
import {Anchor, Box, Button, Heading} from 'grommet'
import CustomDataTable from '../components/CustomDataTable'
import React, {useCallback, useMemo, useState} from 'react'
import NumberFormat from 'react-number-format'
import ItemsClient from '../clients/ItemsClient'
import {Form} from "grommet-controls";

function AdminItems () {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0)
    const itemsClient = useMemo(() => {
        return new ItemsClient()
    }, [])
    const columns = useMemo(() => [
            {
                Header: 'Code',
                accessor: 'code',
                Cell: ({value}) => <Anchor href={"/#/adminitems/" + value} label={value} />
            },
            {
                Header: 'Name',
                accessor: 'name'
            },
            {
                Header: 'Category',
                accessor: 'category'
            },
            {
                Header: 'Price',
                accessor: 'price',
                Cell: ({value}) =>
                    <NumberFormat
                        displayType='text'
                        prefix='USD $'
                        decimalScale={2}
                        fixedDecimalScale={true}
                        value={value} />
            },
            {
                Header: 'Creation Date',
                accessor: 'creationTimestamp',
                Cell: ({value}) =>
                    <>{value.substr(0, 10)}</>
            }
        ],
        [])

    const fetchItems = useCallback(({pageSize, pageIndex, sortBy}) => {
        setLoading(true)
        let sort = 'desc(creationTimestamp)'

        if(sortBy.length > 0) {
            const sortDirection = sortBy[0].desc ? 'desc' : 'asc'
            sort = sortDirection + '(' + sortBy[0].id + ')'
        }
        itemsClient.fetchItemsPage(
            (data) => {
                setData(data.content)
                setPageCount(data.totalPages)
                setLoading(false)
            },
            (error) => {
            },
            {pageSize: pageSize, pageNumber: pageIndex, orderBy: sort}
        )
    }, [itemsClient])

    return (
        <Layout
            title='Admin Items'
        >
            <Heading level={2}>Items</Heading>

            <Box
                direction='row-responsive'
                margin={{'bottom' : '2em'}}
            >
                <Form>
                    <Button
                        primary
                        label='New'
                        href='#/adminitems/new'
                    />
                </Form>
            </Box>

            <CustomDataTable
                columns={columns}
                data={data}
                onSort={fetchItems}
                fetchData={fetchItems}
                loading={loading}
                pageCount={pageCount}
            />
        </Layout>
    )
}

export default AdminItems
