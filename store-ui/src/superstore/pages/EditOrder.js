import Layout from '../components/Layout'
import {
    Button,
    CheckBoxGroup,
    Form,
    FormField,
    Heading,
    TextInput
} from 'grommet'
import ItemsTable from '../components/ItemsTable'
import {useHistory, useParams} from 'react-router'
import {useEffect, useMemo, useState} from 'react'
import OrdersClient from '../clients/OrdersClient'
import ProfileModel from '../model/ProfileModel'

function EditOrder () {
    const { ordercode } = useParams()
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [status, setStatus] = useState([])
    const [statusDisabled, setStatusDisabled] = useState(false)
    const [items, setItems] = useState([{
        code: 'abc',
        picture: null,
        name: null,
        price: null,
        quantity: null
    }])
    const [quantity, setQuantity] = useState({abc: 0})
    const orderClient = useMemo(() => {
        return new OrdersClient()
    }, [])
    const profileModel = ProfileModel

    const onQuantityChange = (event, key) => {
        let newQuantity = parseInt(event.target.value)
        let quantityArray = {}
        const foundItem = items.find(item1 => item1.code === key)
        if (newQuantity > quantity[key]) foundItem.quantity++
        if (newQuantity < quantity[key]) foundItem.quantity--
        let newItems = [...items]
        newItems.forEach(item => quantityArray[item.code] = item.quantity)
        setItems(newItems)
        setQuantity(quantityArray)
    }

    const onStatusChange = ({ value, option }) => {
        if (option.name === 'completed') {
            setStatus(value.filter(status => status !== 'admin-cancelled'))
        }
        if (option.name === 'admin-cancelled') {
            setStatus(value.filter(status => status !== 'completed'))
        }
    }

    const onSave = () => {
        let order = {
            user: {username: username},
            code: ordercode,
            orderItems: [],
            orderLog: []
        }

        items.forEach(item => {
            if (item.quantity > 0) {
                order.orderItems.push(
                    {
                        item:{code: item.code},
                        quantity: item.quantity
                    })
            }
        })

        status.forEach(entry => order.orderLog.push(
            {
                status: entry
            }))

        orderClient.updateOrder(
            () => {
                history.push("/adminorders")
            },
            (error) => {
                if(error.error === "uilogout") {
                    profileModel.logout()
                    history.push('/login?logoutreason=tokenexpired')
                }
            },
            order
        )
    }

    useEffect(() => {
        let quantityArray = []
        orderClient.fetchOrder(
            (order) => {
                let items = []
                let status = []
                order.orderItems.forEach(item => {
                    let item1 = {...item.item}
                    item1.quantity = item.quantity
                    items.push(item1)
                    quantityArray[item.item.code] = item.quantity
                })
                order.orderLog.forEach(entry => {
                    status.push(entry.status)
                })
                setStatusDisabled(status.length > 1)
                setUsername(order.user.username)
                setStatus(status)
                setItems(items)
                setQuantity(quantityArray)
            },
            (error) => {
                if(error.error === "uilogout") {
                    profileModel.logout()
                    history.push('/login?logoutreason=tokenexpired')
                }
            },
            ordercode
        )
    }, [history, orderClient, ordercode, profileModel])

    return (
        <Layout title='Edit Order'>
            <Heading level={2}> Editing order '{ordercode}'</Heading>
            <Form>
                <FormField
                    name="username"
                    htmlFor="username-id"
                    label="Username">
                    <TextInput
                        disabled
                        id="username-id"
                        name="username"
                        value={username}/>
                </FormField>

                <FormField
                    name="status"
                    htmlFor="status-id"
                    label="Status">
                    <CheckBoxGroup
                        id="status-id"
                        disabled={statusDisabled}
                        name="status"
                        valueKey="name"
                        options={[
                            {label: "Placed", name: "placed", disabled: true},
                            {label: "Cancelled", name: "admin-cancelled"},
                            {label: "Completed", name: "completed"}
                        ]}
                        value={status}
                        onChange={onStatusChange}
                    />
                </FormField>

                <FormField
                    label="Order Items"
                    disabled={statusDisabled}
                >
                    <ItemsTable
                        data={items}
                        quantity={quantity}
                        onQuantityChange={onQuantityChange}
                        disabled={statusDisabled}
                    />
                </FormField>
                <Button
                    primary
                    label={statusDisabled ? 'Return' : 'Save'}
                    onClick={onSave}
                />
            </Form>
        </Layout>
    )
}

export default EditOrder
