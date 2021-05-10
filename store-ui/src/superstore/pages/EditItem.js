import Layout from '../components/Layout'
import {Heading} from 'grommet'
import {useHistory, useParams} from 'react-router'
import {useEffect, useMemo, useState} from 'react'
import ItemsClient from '../clients/ItemsClient'
import ProfileModel from "../model/ProfileModel";
import ItemForm from "../components/ItemForm";

function EditItem () {
    const { itemcode } = useParams()
    const history = useHistory()
    const [data, setData] = useState({})
    const itemsClient = useMemo(() => {
        return new ItemsClient()
    }, [])
    const profileModel = ProfileModel

    useEffect(() => {
        if(itemcode === 'new')
            return
        itemsClient.fetchItemByCode(
            (itemData) => {
                setData(itemData)
            },
            (error) => {
                if(error.error === "uilogout") {
                    profileModel.logout()
                    history.push('/login?logoutreason=tokenexpired')
                }
            },
            itemcode
        )
    }, [itemsClient, itemcode])

    const saveItem = (value) => {
        itemsClient.updateItem(
            (result) => {
                history.push("/adminitems")
            },
            (error) => {
                if(error.error === "uilogout") {
                    profileModel.logout()
                    history.push('/login?logoutreason=tokenexpired')
                }
            },
            value)
    }

    return (
        <Layout title='Edit Item'>
            <Heading level={2}>Editing item '{itemcode}'</Heading>
            <ItemForm
                data={data}
                onChange={(newValue) => setData(newValue)}
                onSubmit={saveItem}
                isEditing={true}
            />
        </Layout>
    )
}

export default EditItem
