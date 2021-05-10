import {DataTable, Image, Text} from 'grommet'
import NumberFormat from 'react-number-format'
import {NumberInput} from 'grommet-controls'

function ItemsTable (props) {
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
                props.disabled
                    ? <Text>{props.quantity[item.code]}</Text>
                    : <NumberInput
                        key={item.code}
                        value={props.quantity[item.code]}
                        min={0}
                        onChange={event => {
                            props.onQuantityChange(event, item.code)
                        }}
                    />
            ),
        }
    ]

    return (
        <DataTable
            sortable={true}
            size='medium'
            columns={columns}
            data={props.data} />
    )
}

export default ItemsTable
