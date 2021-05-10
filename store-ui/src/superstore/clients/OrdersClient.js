import ApiClient from './ApiClient'
import ProfileModel from '../model/ProfileModel'

class OrdersClient extends ApiClient {

    constructor() {
        super();
        this.profileModel = ProfileModel
    }

    fetchOrdersByUsername(onSuccess, onError, username, pageAndSort = {sortBy: 'desc(creationTimestamp)', pageSize: 8, pageNumber: 0}) {
        let url = new URL('/orders/client/' + username, window.location.origin)
        url.searchParams.append('sortBy', pageAndSort.sortBy ? pageAndSort.sortBy : 'desc(creationTimestamp)')
        url.searchParams.append('pageSize', pageAndSort.pageSize ? pageAndSort.pageSize : 8)
        url.searchParams.append('pageNumber', pageAndSort.pageNumber ? pageAndSort.pageNumber: 0)
        if(!this.profileModel.isLoggedIn()) {
            onError({error : "uilogout", message: "user logged out"})
            return
        }
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
        if(!this.profileModel.isLoggedIn()) {
            onError({error : "uilogout", message: "user logged out"})
            return
        }
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

    fetchOrders(onSuccess, onError, pageAndSort = {sortBy: 'desc(creationTimestamp)', pageSize: 5, pageNumber: 0}) {
        let url = new URL('/orders', window.location.origin)
        url.searchParams.append('sortBy', pageAndSort.sortBy ? pageAndSort.sortBy : 'desc(creationTimestamp)')
        url.searchParams.append('pageSize', pageAndSort.pageSize ? pageAndSort.pageSize : 8)
        url.searchParams.append('pageNumber', pageAndSort.pageNumber ? pageAndSort.pageNumber: 0)
        if(!this.profileModel.isLoggedIn()) {
            onError({error : "uilogout", message: "user logged out"})
            return
        }
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

    fetchOrder(onSuccess, onError, ordercode) {
        let url = new URL('/orders/' + ordercode, window.location.origin)
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

    updateOrder(onSuccess, onError, order) {
        let url = new URL('/orders', window.location.origin)
        this.fetchUrl(
            url,
            {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                },
                body: JSON.stringify(order)
            },
            onSuccess,
            onError)
    }
}

export default OrdersClient