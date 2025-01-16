export class AppAuth {
    static userInfoKey: string = "applegame-user"

    static getUserInfo() {
        let userInfo = localStorage.getItem(AppAuth.userInfoKey)
        if(!userInfo) {
            return
        } 
        return JSON.parse(userInfo)
    }

    static loginUser(userId: String, username: String, email: String, createdAt: String) {
        console.log(createdAt)
        localStorage.setItem(AppAuth.userInfoKey, JSON.stringify({
            userId: userId,
            username: username,
            email: email,
            createdAt: createdAt
        }))
    }

    static logoutUser() {
        localStorage.removeItem(AppAuth.userInfoKey)
    }
}