import ApiClient from './ApiClient'
import md5 from 'crypto-js/md5'

class UsersClient extends ApiClient {

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
}

export default UsersClient
