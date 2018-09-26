import React, {Component} from 'react'
import {Form, Header, Message, Segment} from 'semantic-ui-react'
import {injectIntl} from "react-intl";
import UserService from "../../../services/UserService";
import CoinService from "../../../services/CoinService";

class GenerateCoinForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            usersLoading: false,
            submitting: false
        }
        this.eventEmitter = props.eventEmitter
    }

    onChangeUser = (e, {value}) => this.setState({username: value})

    onChangeAmount = (e, {value}) => this.setState({amount: value})

    getUsers = () => {
        this.setState({usersLoading: true})
        UserService.queryActiveUsers()
            .then(payload => {
                let users = payload.filter(user => {
                    return localStorage.getItem("username") !== user.Record.username
                }).map(user => {
                    const rec = user.Record
                    return {text: rec.username, key: rec.username, value: rec.username,}
                })
                this.setState({users, usersLoading: false})
            })
            .catch(err => {
                this.setState({usersLoading: false})
            })
    }

    generateCoin = () => {
        this.setState({submitting: true, success: false, error: false})
        CoinService.generateCoin(this.state.username, this.state.amount)
            .then(payload => {
                this.eventEmitter.emit('reloadLogs', {}, false)
                this.setState({submitting: false, success: true})
            })
            .catch(err => {
                this.setState({submitting: false, error: err.msg})
            })
    }

    componentDidMount = () => {
        this.getUsers()
    }


    render() {
        return (
            <Segment color={'violet'} padded>
                <Header as='h3' content={this.props.intl.formatMessage({id: 'generateCoin.title'})}/>
                <Form error={!!this.state.error} success={!!this.state.success} onSubmit={this.generateCoin}>
                    <Form.Group widths='equal'>
                        <Form.Input type={'number'}
                                    min={1}
                                    onChange={this.onChangeAmount}
                                    fluid label={this.props.intl.formatMessage({id: 'generateCoin.amount'})}/>
                        <Form.Select fluid
                                     label={this.props.intl.formatMessage({id: 'generateCoin.user'})}
                                     onChange={this.onChangeUser}
                                     options={this.state.users}/>
                    </Form.Group>
                    <Form.Group widths='2'>
                        <Form.Button fluid loading={this.state.submitting}
                                     disabled={!this.state.username || !this.state.amount}
                                     color={'violet'}>{this.props.intl.formatMessage({id: 'generateCoin.submit'})}</Form.Button>
                    </Form.Group>
                    <Message style={{direction: 'ltr', textAlign: 'left'}} error content={this.state.error}/>
                    <Message style={{direction: 'ltr', textAlign: 'left'}} success
                             content={'Coins produced and transferred successfully.'}/>
                </Form>
            </Segment>
        )
    }
}

export default GenerateCoinForm = injectIntl(GenerateCoinForm)
