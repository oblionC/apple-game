export default function getLocalUserInfo() {
    var userInfo = localStorage.getItem("applegame-user")
    if(!userInfo) {
        return
    } 
    return JSON.parse(userInfo)
}