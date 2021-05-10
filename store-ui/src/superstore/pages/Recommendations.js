import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import ItemsClient from '../clients/ItemsClient'
import Layout from '../components/Layout'
import ItemCard from '../components/ItemCard'
import {Grid, Pagination, Select, Spinner, Text} from 'grommet'
import CartModel from '../model/CartModel'
import {Form} from 'grommet-controls'

function useForceUpdate(){
    const [, setValue] = useState(0)
    return () => setValue(value => value + 1)
}

function Recommendations() {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [pageSize, setPageSize] = useState('5');
    const [page, setPage] = useState(1);
    const [data, setData] = useState([])
    const forceUpdate = useForceUpdate();
    const itemsClient = useMemo(() => {
        return new ItemsClient()
    }, [])
    const cartModel = CartModel
    let search = useRef()

    const searchPuzzles = useCallback(
        (value) => {
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
                {orderBy: 'desc(price)', pageSize: pageSize, pageNumber: page - 1}
            )
        },
        [itemsClient, page, pageSize]
    )

    const onPageSizeChange = ({option}) => {
        setPage(1)
        setPageSize(option)
    }

    useEffect(() => {
        searchPuzzles(search.current)
    }, [searchPuzzles])

    return (
        <Layout
            title='Recommendations'
            showSearch={true}
            onSearchEnter={searchPuzzles}
        >
            <Form margin={{'bottom': 'small'}}>
                <Text>Products per page</Text>
                <Select
                    options={['5', '10', '15']}
                    value={pageSize}
                    onChange={onPageSizeChange}
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
        </Layout>
    )
}

export default Recommendations
