import {Component} from 'react'
import ChaincodeUtil from '../utils/ChaincodeUtil'
import config from '../Config'

class UserService extends Component {

    static getBalance(username) {
        let args = [localStorage.getItem("username"), localStorage.getItem("passwordHash"), username]
        let func = 'queryUserBalance'
        return ChaincodeUtil.query(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem("org")], func, args)
            .then(response => {
                return response.result
            })
    }

    static queryActiveUsers() {
        let args = [localStorage.getItem("username"), localStorage.getItem("passwordHash")]
        let func = 'queryActiveUsers'
        return ChaincodeUtil.query(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem("org")], func, args)
            .then(response => {
                return response.result
            })
    }

    static queryAllUsers() {
        let args = [localStorage.getItem("username"), localStorage.getItem("passwordHash")]
        let func = 'queryAllUsers'
        return ChaincodeUtil.query(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem("org")], func, args)
            .then(response => {
                return response.result
            })
    }

    static confirmUser(username) {
        let args = [localStorage.getItem("username"), localStorage.getItem("passwordHash"), username]
        let func = 'confirmUser'
        return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem("org")], func, args)
            .then(response => {
                const user = response.result
                const txId = response.transaction
                return user
            })
    }

    static blockUser(username) {
        let args = [localStorage.getItem("username"), localStorage.getItem("passwordHash"), username]
        let func = 'blockUser'
        return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem("org")], func, args)
            .then(response => {
                const user = response.result
                // const txId = response.transaction
                return user
            })
    }

    static unBlockUser(username) {
        let args = [localStorage.getItem("username"), localStorage.getItem("passwordHash"), username]
        let func = 'unBlockUser'
        return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem("org")], func, args)
            .then(response => {
                const user = response.result
                // const txId = response.transaction
                return user
            })
    }

    static queryAllLogs() {
        let args = [""]
        // let args = [localStorage.getItem("username"), localStorage.getItem("passwordHash")]
        let func = 'queryAllLogs'
        return ChaincodeUtil.query(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem("org")], func, args)
            .then(response => {
                return response.result
            })
    }
}

export default UserService