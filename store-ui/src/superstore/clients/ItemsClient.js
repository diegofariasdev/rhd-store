import ApiClient from './ApiClient'
import ProfileModel from "../model/ProfileModel";

class ItemsClient extends ApiClient {

    constructor() {
        super();
        this.profileModel = ProfileModel
    }

    fetchItemsPage(onSuccess, onError, pageAndSort = {orderBy: 'desc(price)', pageSize: 8, pageNumber: 0}) {
        let url = new URL('/items', window.location.origin)
        url.searchParams.append('orderBy', pageAndSort.orderBy ? pageAndSort.orderBy : 'desc(price)')
        url.searchParams.append('pageSize', pageAndSort.pageSize ? pageAndSort.pageSize : 8)
        url.searchParams.append('pageNumber', pageAndSort.pageNumber ? pageAndSort.pageNumber: 0)
        this.fetchUrl(url, null, onSuccess, onError)
    }

    fetchItemsPageByName(onSuccess, onError, search, pageAndSort = {orderBy: 'desc(price)', pageSize: 8, pageNumber: 0}) {
        let url = new URL('/items', window.location.origin)
        url.searchParams.append('search', search ? search : '')
        url.searchParams.append('orderBy', pageAndSort.orderBy ? pageAndSort.orderBy : 'desc(price)')
        url.searchParams.append('pageSize', pageAndSort.pageSize ? pageAndSort.pageSize : 8)
        url.searchParams.append('pageNumber', pageAndSort.pageNumber ? pageAndSort.pageNumber: 0)
        this.fetchUrl(url, null, onSuccess, onError)
    }

    fetchItemByCode(onSuccess, onError, itemcode) {
        let url = new URL('/items/' + itemcode, window.location.origin)
        this.fetchUrl(url,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                }
            },
            onSuccess,
            onError)
    }

    updateItem(onSuccess, onError, value) {
        let url = new URL('/items', window.location.origin)
        this.fetchUrl(url,
            {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                },
                body: JSON.stringify({
                    code: value.code,
                    description: value.description,
                    price: value.price,
                    pictureUrl: value.pictureurl
                })
            },
            onSuccess,
            onError)
    }

    saveItem(onSuccess, onError, value) {
        let url = new URL('/items', window.location.origin)
        this.fetchUrl(url,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                },
                body: JSON.stringify([{
                    name: value.name,
                    category: value.category,
                    description: value.description,
                    price: value.price,
                    pictureUrl: value.pictureurl
                }])
            },
            onSuccess,
            onError)
    }
}

export default ItemsClient
