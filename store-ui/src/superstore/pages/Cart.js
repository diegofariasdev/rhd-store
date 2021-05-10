import React, {useEffect, useState} from 'react'
import Layout from '../components/Layout'
import {Box, Button, Grid, Paragraph} from 'grommet'
import NumberFormat from 'react-number-format'
import CartModel from '../model/CartModel'
import {FormNext} from 'grommet-icons'
import ProfileModel from '../model/ProfileModel'
import {useHistory} from 'react-router'
import ItemsTable from '../components/ItemsTable'

function Cart() {
    const history = useHistory()
    const [data, setData] = useState([])
    const [quantity, setQuantity] = useState([])
    const cartModel = CartModel
    const profileModel = ProfileModel

    const onQuantityChange = (event, key) => {
        let newQuantity = parseInt(event.target.value)
        let quantityArray = []
        const foundItem = data.find(item1 => item1.code === key)
        if (newQuantity > quantity[key]) cartModel.addItem(foundItem)
        if (newQuantity < quantity[key]) cartModel.removeItem(foundItem)
        let newData = [...cartModel.items]
        newData.forEach(item => quantityArray[item.code] = item.quantity)
        setData(newData)
        setQuantity(quantityArray)
    }

    const cartCheckout = () => {
        if (profileModel.isLoggedIn())
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
                <ItemsTable
                    data={data}
                    quantity={quantity}
                    onQuantityChange={onQuantityChange}
                    />
            </Box>
        </Layout>
    )
}

export default Cart
