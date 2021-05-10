import {Redirect, useHistory} from 'react-router'
import React, {useEffect, useMemo, useState} from 'react'
import {Box, Button, DataTable, Heading} from 'grommet'
import Layout from '../components/Layout'
import ProfileModel from '../model/ProfileModel'
import OrdersClient from '../clients/OrdersClient'

function Profile() {
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [userLogged, setUserLogged] = useState(false)
    const [data, setData] = useState([])
    const orderClient = useMemo(() => {
        return new OrdersClient()
    }, [])
    const profileModel = ProfileModel

    const columns = [
        {
            property: 'code',
            header: 'Code',
            size: "small",
            render: datum => (
                datum.code.substr(0, 7)
            )
        },
        {
            property: 'creationTimestamp',
            header: 'Date',
            render: datum => (
                datum.creationTimestamp.substr(0, 10)
            )
        },
        {
            property: 'productsCount',
            header: 'Products',
            render: datum => {
                let total = 0
                datum.orderItems.forEach(item => total += item.quantity)
                return total
            }
        },
        {
            property: 'total',
            header: 'Total'
        },
        {
            property: 'status',
            header: 'Status',
            render: datum => {
                const lastStatus = datum.orderLog[datum.orderLog.length - 1].status
                return lastStatus
            }
        }
    ]

    useEffect(() => {
        if (profileModel.isLoggedIn()) {
            setUserLogged(true)
            if(!profileModel.isAdmin()) {
                orderClient.fetchOrdersByUsername((data) => {
                    setData(data.content)
                }, (error) => {
                    if(error.details[0] === "uilogout") {
                        profileModel.logout()
                        history.push('/login?logoutreason=tokenexpired')
                    }
                }, profileModel.getUsername())
            }
        } else {
            setUserLogged(false)
        }
        setLoading(false)
    }, [history, orderClient, profileModel])

    const logout = () => {
        profileModel.logout()
        history.push('/')
    };

    return (
        <Layout title='Profile'>
            {loading &&  <div>Loading...</div>}
            {!loading && !userLogged && <Redirect to='/login' />}
            {!loading && userLogged &&
            <Box direction='column' width='large' fill='horizontal'>
                {!profileModel.isAdmin() && <>
                    <Heading level={3}>Orders</Heading>
                    <DataTable
                        margin={{'top': '15px'}}
                        size="small"
                        columns={columns}
                        data={data}
                    />
                </>}

                <Heading level={3}>User Info ({profileModel.getUsername()})</Heading>
                <Button primary type="submit" label="Logout" color="accent-4" onClick={logout}/>
            </Box>
            }
        </Layout>
    )
}

export default Profile
