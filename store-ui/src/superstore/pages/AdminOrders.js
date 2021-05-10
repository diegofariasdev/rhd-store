import Layout from '../components/Layout'
import {Anchor, Heading, Text} from 'grommet'
import CustomDataTable from '../components/CustomDataTable'
import {useCallback, useMemo, useState} from 'react'
import ProfileModel from '../model/ProfileModel'
import {useHistory} from 'react-router'
import OrdersClient from '../clients/OrdersClient'
import getLastStatus from "../model/Utils";

function AdminOrders () {
    const history = useHistory()
    const profileModel = ProfileModel
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0)
    const orderClient = useMemo(() => {
        return new OrdersClient()
    }, [])
    const columns = useMemo(() => [
            {
                Header: 'Code',
                accessor: 'code',
                Cell: ({value}) => <Anchor href={"/#/adminorders/" + value} label={value} />
            },
            {
                Header: 'User',
                accessor: 'user.username'
            },
            {
                Header: 'Total',
                accessor: 'total'
            },
            {
                Header: 'Total Products',
                accessor: 'orderItems',
                Cell: ({value}) =>
                    <Text>{value.reduce((acc, curr) => +acc + +curr.quantity, 0)}</Text>
            },
            {
                Header: 'Status',
                accessor: 'orderLog',
                Cell: ({value}) =>
                    <Text>{getLastStatus(value).status}</Text>
            }
        ],
        [])
    const fetchOrders = useCallback(({pageSize, pageIndex, sortBy}) => {
        setLoading(true)
        let sort = 'desc(creationTimestamp)'

        if(sortBy.length > 0) {
            const sortDirection = sortBy[0].desc ? 'desc' : 'asc'
            sort = sortDirection + '(' + sortBy[0].id + ')'
        }

        orderClient.fetchOrders(
            (data) => {
                setData(data.content)
                setPageCount(data.totalPages)
                setLoading(false)
            },
            (error) => {
                if(error.error === "uilogout") {
                    profileModel.logout()
                    history.push('/login?logoutreason=tokenexpired')
                }
            },
            {pageSize: pageSize, pageNumber: pageIndex, orderBy: sort})
    }, [history, profileModel, orderClient])

    return (
        <Layout
            title='Admin Orders'
        >
            <Heading level={2}>Orders</Heading>
            <CustomDataTable
                columns={columns}
                data={data}
                onSort={fetchOrders}
                fetchData={fetchOrders}
                loading={loading}
                pageCount={pageCount}
            />
        </Layout>
    )
}

export default AdminOrders
