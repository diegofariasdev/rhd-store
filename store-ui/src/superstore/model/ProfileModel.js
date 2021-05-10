class ProfileModel {
    constructor() {
        if(!ProfileModel.instance) {
            this.token = JSON.parse(localStorage.getItem("currentToken"))
            if (this.token == null) {
                this.token = {}
                this.claims = {}
            } else {
                this.loadToken()
            }
            ProfileModel.instance = this
        }
        return ProfileModel.instance
    }

    loadToken() {
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
        localStorage.setItem("currentToken", JSON.stringify(token))
        this.token.access_token = token.access_token
        this.loadToken()
    }

    logout() {
        this.claims.exp = null
        this.claims.sub = null
        this.claims.roles = null
        this.token.access_token = null
        localStorage.removeItem("currentToken")
    }

    isLoggedIn() {
        const hasAccessToken = typeof(this.token.access_token) != 'undefined' && this.token.access_token != null
        const expiredToken = typeof(this.claims.exp) == 'undefined' ||
            this.claims.exp == null ||
            (this.claims.exp <= Math.round(new Date() / 1000))
        if (expiredToken) {
            this.logout()
        }
        return hasAccessToken && !expiredToken
    }

    getUsername() {
        return this.claims.sub
    }

    isAdmin() {
        return (typeof(this.claims.roles) == 'undefined' || this.claims.roles == null)
            ? false
            : this.claims.roles === 'admin'
    }
}

const instance = new ProfileModel()
Object.freeze(instance)

export default instance
