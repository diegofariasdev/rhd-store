import React, {useEffect, useState} from 'react'
import Layout from '../components/Layout'
import {Box, Button, DataTable, Grid, Image, Paragraph} from 'grommet'
import NumberFormat from 'react-number-format'
import {NumberInput} from 'grommet-controls'
import CartModel from '../model/CartModel'
import {FormNext} from 'grommet-icons'
import ProfileModel from "../model/ProfileModel";
import {useHistory} from "react-router";

function Cart() {
    const history = useHistory()
    const [data, setData] = useState([])
    const [quantity, setQuantity] = useState([])
    const cartModel = CartModel
    const profileModel = ProfileModel

    const onQuantityChange = (event, key) => {
        let newQuantity = parseInt(event.target.value)
        const foundItem = data.find(item1 => item1.code === key)
        if (newQuantity > quantity[key]) cartModel.addItem(foundItem)
        if (newQuantity < quantity[key]) cartModel.removeItem(foundItem)
        let quantityArray = []
        let newData = [...cartModel.items]
        newData.forEach(item => quantityArray[item.code] = item.quantity)
        setData(newData)
        setQuantity(quantityArray)
    }

    const cartCheckout = () => {
        if (profileModel.isLogged())
            history.push('/checkout')
        else
            history.push('/login?from=cart')
    };

    useEffect(() => {
        let quantityArray = []
        cartModel.items.forEach(item => quantityArray[item.code] = item.quantity)
        setData(cartModel.items)
        setQuantity(quantityArray)
    }, [cartModel.items])

    const columns = [
        {
            property: 'picture',
            size: 'xsmall',
            render: item => (

                <Image
                    fit='cover'
                    size='small'
                    src={'data:image/jpeg;base64, ' + item.picture}
                />
            ),
        },
        {
            property: 'name',
            primary: true,
            header: 'Name',
        },
        {
            property: 'price',
            header: 'Price',
            render: item => (
                <NumberFormat
                    displayType='text'
                    prefix='USD $'
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={item.price} />
            ),
        },
        {
            property: 'quantity',
            header: 'Quantity',
            render: item => (
                <NumberInput
                    key={item.code}
                    value={quantity[item.code]}
                    min={0}
                    onChange={event => {
                        onQuantityChange(event, item.code)
                    }}
                />
            ),
        }
    ]

    return (
        <Layout title='Your Order'>
            <Box align='center'>
                <Grid
                    rows={['xxsmall']}
                    columns={['medium', 'small']}
                    gap="small"
                    pad={{"bottom": "medium"}}
                    areas={[
                        { name: 'total', start: [0, 0], end: [0, 0] },
                        { name: 'proceed', start: [1, 0], end: [1, 0] }
                    ]}
                >
                    <Box gridArea="total">
                        <Paragraph margin={ {"right": "5em"} } >
                            {cartModel.isEmpty() && "Your cart is empty"}
                            {!cartModel.isEmpty() &&
                                <NumberFormat
                                displayType='text'
                                prefix='Your total is: USD $'
                                decimalScale={2}
                                fixedDecimalScale={true}
                                value={cartModel.getTotal()} />}
                        </Paragraph>
                    </Box>
                    <Box gridArea="proceed">
                        {!cartModel.isEmpty() &&
                            <Button
                                icon={<FormNext/>}
                                primary
                                label='Proceed to Checkout'
                                size='small'
                                onClick={cartCheckout}
                            />
                        }
                    </Box>
                </Grid>
                <DataTable
                    sortable={true}
                    size='medium'
                    columns={columns}
                    data={data} />
            </Box>
        </Layout>
    )
}

export default Cart
