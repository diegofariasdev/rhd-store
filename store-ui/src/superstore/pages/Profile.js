import {Redirect, useHistory} from 'react-router'
import React, {useEffect, useState} from 'react'
import {Box, Button, DataTable, Heading} from "grommet";
import Layout from '../components/Layout'
import CartModel from '../model/CartModel'
import ProfileModel from '../model/ProfileModel'
import OrdersClient from '../clients/OrdersClient'

function Profile() {
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [userLogged, setUserLogged] = useState(false)
    const [data, setData] = useState([])
    const orderClient = new OrdersClient()
    const cartModel = CartModel
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
        }
    ]

    useEffect(() => {
        if (profileModel.isLogged()) {
            setUserLogged(true)
            orderClient.fetchOrders((data) => {
                setData(data.content)
            }, () => {

            }, profileModel.getUsername())
        } else {
            setUserLogged(false)
        }
        setLoading(false)
    }, [])

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
