import ApiClient from './ApiClient'

class ItemsClient extends ApiClient {

    fetchItemsPage(onSuccess, onError, pageAndSort = {sortBy: 'desc(price)', pageSize: 8, pageNumber: 0}) {
        let url = new URL('/items', window.location.origin)
        url.searchParams.append('sortBy', pageAndSort.sortBy ? pageAndSort.sortBy : 'desc(price)')
        url.searchParams.append('pageSize', pageAndSort.pageSize ? pageAndSort.pageSize : 8)
        url.searchParams.append('pageNumber', pageAndSort.pageNumber ? pageAndSort.pageNumber: 0)
        this.fetchUrl(url, null, onSuccess, onError)
    }

    fetchItemsPageByName(onSuccess, onError, search, pageAndSort = {sortBy: 'desc(price)', pageSize: 8, pageNumber: 0}) {
        let url = new URL('/items', window.location.origin)
        url.searchParams.append('search', search ? search : '')
        url.searchParams.append('sortBy', pageAndSort.sortBy ? pageAndSort.sortBy : 'desc(price)')
        url.searchParams.append('pageSize', pageAndSort.pageSize ? pageAndSort.pageSize : 8)
        url.searchParams.append('pageNumber', pageAndSort.pageNumber ? pageAndSort.pageNumber: 0)
        this.fetchUrl(url, null, onSuccess, onError)
    }
}

export default ItemsClient
