import React, {Component} from 'react'
import {FormattedMessage, injectIntl} from 'react-intl'
import {Segment, Statistic} from 'semantic-ui-react'
import UserService from "../../../services/UserService";

class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            balance: 0
        }
        this.eventEmitter = props.eventEmitter
    }

    componentDidMount () {
        this.eventEmitter.on('reloadBalance', this.getBalance)
        this.getBalance()
    }

    getBalance = () => {
        UserService.getBalance(localStorage.getItem("username"))
            .then(payload => {
                this.setState({balance: payload})
            })
    }

    render() {
        return (
            <Segment color={'violet'} size={'massive'} padded>
                <Statistic className={'faNo'}>
                    <Statistic.Value className={'faNo'}>{this.state.balance}</Statistic.Value>
                    <Statistic.Label className={'faNo'}><FormattedMessage id={'account.balance'}/></Statistic.Label>
                </Statistic>
            </Segment>
        )
    }
}

export default Account = injectIntl(Account)
