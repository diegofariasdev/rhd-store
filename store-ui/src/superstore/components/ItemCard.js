import React from 'react'
import {Box, Button, Card, CardBody, CardFooter, Heading, Image, Paragraph} from 'grommet'
import {Cart} from 'grommet-icons'
import NumberFormat from 'react-number-format'

function ItemCard(props) {
    const data = props.data

    return (
    <Card elevation='large' width='small'>
        <CardBody height='medium' onClick={() => props.onCardClick(data)} >
            <Image
                fit='cover'
                src={'data:image/jpeg;base64, ' + data.picture}
            />
        </CardBody>
        <Box
            pad={{ horizontal: 'small' }}
            responsive={false}
            onClick={() => props.onCardClick(data)}>
            <Paragraph margin={{ top: 'none' }}>
                {data.name}
            </Paragraph>
            <Heading level='4' margin='small'>
                <NumberFormat
                    displayType='text'
                    prefix='USD $'
                    decimalScale={2}
                    fixedDecimalScale={true}
                    value={data.price} />
            </Heading>
        </Box>
        <CardFooter pad='small' justify='center'>
            <Button
                icon={<Cart />}
                label='Add to Cart'
                hoverIndicator
                size='small'
                onClick={() => props.onAddToCartClick(data)}
            />
        </CardFooter>
    </Card>
    )
}

export default ItemCard
