export class AppAuth {
    static userInfoKey: string = "applegame-user"
    static tokenKey: string = "applegame-token"

    static storeToken(token: string) {
        localStorage.setItem(this.tokenKey, token)
    }

    static getToken(): string {
        var token = localStorage.getItem(this.tokenKey)
        if(!token) return ""
        return token

    }

    static getUserInfo() {
        let userInfo = localStorage.getItem(AppAuth.userInfoKey)
        if(!userInfo) {
            return
        } 
        return JSON.parse(userInfo)
    }

    static loginUser(userId: String, username: String, email: String, createdAt: String) {
        localStorage.setItem(AppAuth.userInfoKey, JSON.stringify({
            userId: userId,
            username: username,
            email: email,
            createdAt: createdAt
        }))
    }

    static logoutUser() {
        localStorage.removeItem(AppAuth.userInfoKey)
        localStorage.removeItem(AppAuth.tokenKey)
    }
}