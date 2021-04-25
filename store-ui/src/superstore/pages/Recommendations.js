import React, {useEffect, useRef, useState} from 'react'
import ItemsClient from '../clients/ItemsClient'
import Layout from '../components/Layout'
import ItemCard from '../components/ItemCard'
import {Box, Grid, Pagination, Select, Spinner, Text} from 'grommet'
import CartModel from '../model/CartModel'
import ProfileModel from '../model/ProfileModel'
import {Form} from 'grommet-controls'

function useForceUpdate(){
    const [value, setValue] = useState(0)
    return () => setValue(value => value + 1)
}

function Recommendations() {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [pageSize, setPageSize] = useState('5');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([])
    const forceUpdate = useForceUpdate();
    let search = useRef()
    const itemsClient = new ItemsClient()
    const cartModel = CartModel

    useEffect(() => {
        searchPuzzles(search.current)
    }, [pageSize, page])

    const searchPuzzles = (value) => {
        search.current = value
        setIsLoaded(false)
        setData([])
        itemsClient.fetchItemsPageByName(
            (result) => {
                setData(result)
                setIsLoaded(true)
            },
            (error) => {
                setError(error)
                setIsLoaded(true)
            },
            value,
            {sortBy: 'desc(price)', pageSize: pageSize, pageNumber: page - 1}
        )
    }

    return (
        <Layout
            title='Recommendations'
            showSearch={true}
            onSearchEnter={searchPuzzles}
        >
            <Box direction='column' fill='horizontal'>
                <Form margin={{'bottom': 'small'}}>
                    <Text>Products per page</Text>
                    <Select
                        options={['5', '10', '15']}
                        value={pageSize}
                        onChange={({option}) => { setPageSize(option) }}
                    />
                </Form>
                <Grid
                    gap='medium'
                    rows='medium'
                    columns={{ count: 'fit', size: 'small' }}
                    fill='horizontal'
                >
                    {error && <div>Error: {error.message}</div>}
                    {!isLoaded &&  <Spinner />}
                    {isLoaded && !error && data.content.map(item => (
                        <ItemCard
                            key={item.code}
                            onCardClick={() => {}}
                            onAddToCartClick={() => {
                                cartModel.addItem(item)
                                forceUpdate()
                            }}
                            data={item}
                        />
                    ))}
                </Grid>
                {isLoaded && !error &&
                <Pagination
                    margin={{'vertical': '2em', 'horizontal': 'auto'}}
                    pad='medium'
                    numberItems={data.totalElements}
                    onChange={({page}) => { setPage(page) }}
                    step={data.size}
                    page={data.pageable.pageNumber + 1}
                />
                }
            </Box>
        </Layout>
    )
}

export default Recommendations
