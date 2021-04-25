import ApiClient from './ApiClient'
import ProfileModel from "../model/ProfileModel";

class OrdersClient extends ApiClient {

    constructor() {
        super();
        this.profileModel = ProfileModel

    }

    fetchOrders(onSuccess, onError, username, pageAndSort = {sortBy: 'desc(creationTimestamp)', pageSize: 8, pageNumber: 0}) {
        let url = new URL('/orders/client/' + username, window.location.origin)
        url.searchParams.append('sortBy', pageAndSort.sortBy ? pageAndSort.sortBy : 'desc(creationTimestamp)')
        url.searchParams.append('pageSize', pageAndSort.pageSize ? pageAndSort.pageSize : 8)
        url.searchParams.append('pageNumber', pageAndSort.pageNumber ? pageAndSort.pageNumber: 0)
        this.fetchUrl(
            url,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                }
            },
            onSuccess,
            onError)
    }

    createOrder(onSuccess, onError, order) {
        let url = new URL('/orders', window.location.origin)
        this.fetchUrl(
            url,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                },
                body: JSON.stringify(order)
            },
            onSuccess,
            onError
        )
    }
}

export default OrdersClient