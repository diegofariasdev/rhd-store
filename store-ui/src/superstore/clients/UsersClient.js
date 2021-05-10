import ApiClient from './ApiClient'
import md5 from 'crypto-js/md5'
import ProfileModel from '../model/ProfileModel'

class UsersClient extends ApiClient {

    constructor() {
        super();
        this.profileModel = ProfileModel
    }

    login(onLogin, onFail, username, password) {
        const url = new URL('/users/login', window.location.origin)
        const user = {"username": username, "password": md5(password).toString()}
        this.fetchUrl(url,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)},
            onLogin,
            onFail)
    }

    signUp(onSuccess, onFail, username, password) {
        const url = new URL('/users', window.location.origin)
        const user = {"username": username, "password": md5(password).toString()}
        this.fetchUrl(url,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)},
            onSuccess,
            onFail)
    }

    fetchUsers(onSuccess, onFail, searchProfile, searchEnable, pageAndSort) {
        const url = new URL('/users', window.location.origin)
        url.searchParams.append('profile', searchProfile ? searchProfile : '')
        url.searchParams.append('enable', searchEnable ? searchEnable : '')
        url.searchParams.append('orderBy', pageAndSort.orderBy ? pageAndSort.orderBy : 'desc(creationTimestamp)')
        url.searchParams.append('pageSize', pageAndSort.pageSize ? pageAndSort.pageSize : 5)
        url.searchParams.append('pageNumber', pageAndSort.pageNumber ? pageAndSort.pageNumber: 0)
        if(!this.profileModel.isLoggedIn()) {
            onFail({error : "uilogout", message: "user logged out"})
            return
        }
        this.fetchUrl(url,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                }
            },
            onSuccess,
            onFail
        )
    }

    fetchUser(onSuccess, onFail, username) {
        const url = new URL('/users/' + username, window.location.origin)
        if(!this.profileModel.isLoggedIn()) {
            onFail({error : "uilogout", message: "user logged out"})
            return
        }
        this.fetchUrl(url,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                }
            },
            onSuccess,
            onFail
        )
    }

    updateUser(onSuccess, onFail, user) {
        const url = new URL('/users', window.location.origin)
        user.password = md5(user.password).toString()
        if(!this.profileModel.isLoggedIn()) {
            onFail({error : "uilogout", message: "user logged out"})
            return
        }
        this.fetchUrl(url,
            {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.profileModel.token.access_token
                },
                body: JSON.stringify(user)
            },
            onSuccess,
            onFail
        )
    }
}

export default UsersClient
