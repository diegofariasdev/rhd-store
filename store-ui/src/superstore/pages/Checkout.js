import React, {useEffect, useState} from 'react'
import Layout from '../components/Layout'
import NumberFormat from 'react-number-format'
import CartModel from '../model/CartModel'
import {Box, Button, DataTable} from 'grommet'
import {Basket} from 'grommet-icons'
import ProfileModel from '../model/ProfileModel'
import OrdersClient from '../clients/OrdersClient'
import {useHistory} from 'react-router'

function Checkout() {
    const history = useHistory()
    const [data, setData] = useState([])
    const billTitles = ['Subtotal', 'Shipping', 'Total']
    const cartModel = CartModel
    const profileModel = ProfileModel
    const ordersClient = new OrdersClient()

    useEffect(() => {
        let newData = [...cartModel.items]
        newData.push({'name': 'Subtotal', 'price': cartModel.getTotal(), 'quantity': 1})
        newData.push({'name': 'Shipping', 'price': .01, 'quantity': 1})
        newData.push({'name': 'Total', 'price': cartModel.getTotal() + .01, 'quantity': 1})
        setData(newData)
    }, [cartModel])

    const columns = [
        {
            property: 'name',
            header: 'Product',
            render: item => {
                if (billTitles.includes(item.name)) return item.name
                else return item.name + ' | [x' + item.quantity + ']'
            }
        },
        {
            property: 'subtotal',
            header: 'Subtotal',
            render: item => (
                <NumberFormat
                    displayType='text'
                    prefix='USD $'
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.price * item.quantity} />
            )
        }
    ]

    const createOrder = () => {
        let order = {
            orderItems : []
        }

        cartModel.items.forEach((item) => {
            order.orderItems.push({
                item: {code: item.code},
                quantity: item.quantity
            })
        })

        ordersClient.createOrder(() => {
            history.push('/profile')
            cartModel.removeAllItems()
        }, (error) => {
            if(error.details[0] === "uilogout") {
                profileModel.logout()
                history.push('/login?logoutreason=tokenexpired')
            }
        }, order)
    };

    return (
        <Layout title='Your Order'>
            <Box direction='column'>
                <DataTable
                    sortable={true}
                    size='medium'
                    columns={columns}
                    data={data} />
                <Button
                    icon={<Basket/>}
                    primary
                    label='Place order'
                    size='small'
                    onClick={createOrder}
                />
            </Box>
        </Layout>
    )
}

export default Checkout
