import Layout from '../components/Layout'
import {useCallback, useMemo, useState} from 'react'
import UsersClient from '../clients/UsersClient'
import ProfileModel from '../model/ProfileModel'
import {useHistory} from 'react-router'
import {Anchor, Heading, Text} from 'grommet'
import CustomDataTable from '../components/CustomDataTable'
import {UserExpert} from 'grommet-icons'

function AdminUsers () {
    const history = useHistory()
    const profileModel = ProfileModel
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0)
    const userClient = useMemo(() => {
        return new UsersClient()
    }, [])
    const columns = useMemo(() => [
        {
            Header: 'Username',
            accessor: 'username',
            Cell: ({row}) => {
                return row.original.profile === 'admin' ?
                    <Text>{row.original.username}</Text> :
                    <Anchor href={"/#/adminusers/" + row.original.username} label={row.original.username} />
            }
        },
        {
            Header: 'Profile',
            accessor: 'profile',
            Cell: ({value}) =>
                <Text>{value} {value === 'admin' ? <UserExpert size='small' /> : <></>} </Text>
        },
        {
            Header: 'Enabled',
            accessor: 'enabled',
            Cell: ({value}) =>
                <Text color={value ? 'dark-1' : 'status-disabled'}>{value ? 'Enabled' : 'Disabled'}</Text>
        },
        {
            Header: 'Creation Date',
            accessor: 'creationTimestamp',
            Cell: ({value}) =>
                <>{value.substr(0, 10)}</>
        }
        ],
        [])

    const fetchUsers = useCallback(({pageSize, pageIndex, sortBy}) => {
        setLoading(true)
        let sort = 'desc(creationTimestamp)'

        if(sortBy.length > 0) {
            const sortDirection = sortBy[0].desc ? 'desc' : 'asc'
            sort = sortDirection + '(' + sortBy[0].id + ')'
        }

        userClient.fetchUsers(
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
            }, null
            , null
            ,{pageSize: pageSize, pageNumber: pageIndex, orderBy: sort})
    }, [history, profileModel, userClient])

    return (
        <Layout
            title='Admin Users'
        >
            <Heading level={2}>Users</Heading>
            <CustomDataTable
                columns={columns}
                data={data}
                onSort={fetchUsers}
                fetchData={fetchUsers}
                loading={loading}
                pageCount={pageCount}
            />
        </Layout>
    )
}

export default AdminUsers
