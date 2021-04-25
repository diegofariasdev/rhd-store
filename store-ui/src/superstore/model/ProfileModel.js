class ProfileModel {
    constructor() {
        if(!ProfileModel.instance) {
            this.token = JSON.parse(localStorage.getItem("currentToken"))
            if (this.token == null) {
                this.token = {}
                this.claims = {}
            } else {
                this.loadToken(this.token)
            }
            ProfileModel.instance = this
        }
        return ProfileModel.instance
    }

    loadToken(token) {
        const tokenBody = atob(this.token.access_token.split(".")[1])
        const claims = JSON.parse(tokenBody)
        if (this.claims == null) {
            this.claims = {}
        }
        this.claims.exp = claims.exp
        this.claims.sub = claims.sub
        this.claims.roles = claims.roles
    }

    setToken(token) {
        this.token.access_token = token.access_token
        localStorage.setItem("currentToken", JSON.stringify(token))
        this.loadToken(token)
    }

    logout() {
        this.claims.exp = null
        this.claims.sub = null
        this.token.access_token = null
        localStorage.removeItem("currentToken")
    }

    isLogged() {
        const hasAccessToken = this.token.access_token !== null
        const notExpiredToken = this.claims.exp <= Date.now()
        return hasAccessToken && notExpiredToken
    }

    getUsername() {
        return this.claims.sub
    }

    isAdmin() {
        return this.claims.roles == null ? false : this.claims.roles == 'admin'
    }
}

const instance = new ProfileModel()
Object.freeze(instance)

export default instance
