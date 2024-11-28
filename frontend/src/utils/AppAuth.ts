export class AppAuth {
    static userInfoKey: string = "applegame-user"

    static getUserInfo() {
        let userInfo = localStorage.getItem(AppAuth.userInfoKey)
        if(!userInfo) {
            return
        } 
        return JSON.parse(userInfo)
    }

    static loginUser(userId: String, username: String, email: String) {
        localStorage.setItem(AppAuth.userInfoKey, JSON.stringify({
            userId: userId,
            username: username,
            email: email 
        }))
    }
    
    static logoutUser() {
        localStorage.removeItem(AppAuth.userInfoKey)
    }
}