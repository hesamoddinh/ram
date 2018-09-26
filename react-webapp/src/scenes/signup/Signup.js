import React, {Component} from 'react'
import AuthService from '../../services/AuthService'

import {Redirect} from 'react-router-dom'
import {Button, Form, Grid, Input, Message, Segment} from 'semantic-ui-react'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'

const CryptoJS = require('crypto-js')

class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToReferrer: false,
            username: '',
            passwordHash: '',
            error: false,
            loading: false
        }
    }

    getToken = () => {
        AuthService.getToken('admin')
    }

    signup = () => {
        this.setState({loading: true})
        AuthService.register(this.state.username, this.state.passwordHash.toString())
            .then(() => {
                this.setState({redirectToReferrer: true, loading: false}, () => {
                    this.props.history.push('/dashboard')
                })
            })
            .catch(err => {
                this.setState({loading: false})
                if (err) {
                    this.setState({errorCode: err.errorCode})
                }
            })
    }

    onChangePassword = (e, input) => {
        this.setState({passwordHash: CryptoJS.SHA256(input.value)})
    }

    onChangeUsername = (e, input) => {
        this.setState({username: input.value})
    }

    style = {
        // marginTop: "5%",
        margin: '0',
        height: '100vh',
        // background: `url(${signupBackground})`,
        backgroundSize: 'cover'
    }

    componentDidMount = () => {
        this.getToken()
    }

    render() {
        const textAlign = this.props.intl.formatMessage({id: 'layout.textAlign'})
        const {from} = this.props.location.state || {from: {pathname: '/'}}
        const {redirectToReferrer} = this.state

        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }
        return (
            <Segment style={{borderRadius: '0'}} inverted={true} color={'violet'}>
                <Grid id={'signup-container'} relaxed padded centered columns={1} style={this.style}>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column computer={6} mobile={14} tablet={10} largeScreen={5}>
                            <Segment>
                                <Form error={!!this.state.errorCode}>
                                    <Form.Field>
                                        <label style={{textAlign: textAlign}}><FormattedMessage
                                            id='scenes.signup.username'/></label>
                                        <Input style={{direction:'ltr',textAlign: textAlign}} name="username"
                                               onChange={this.onChangeUsername}/>
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{textAlign: textAlign}}><FormattedMessage
                                            id='scenes.signup.password'/></label>
                                        <Input style={{direction:'ltr', textAlign: textAlign}} name="password" type="password"
                                               onChange={this.onChangePassword}/>
                                    </Form.Field>
                                    {this.state.errorCode
                                        ? <Message
                                            style={{textAlign: textAlign}}
                                            error
                                            header={this.props.intl.formatMessage({id: 'error'})}
                                            content={this.props.intl.formatMessage({id: `signup.error.${this.state.errorCode}`})}
                                        /> : null}
                                    <Form.Field>
                                        <Button disabled={!this.state.username.length || !this.state.passwordHash.toString().length} loading={this.state.loading} style={{marginTop: '5%'}} fluid color={'violet'} onClick={this.signup}>
                                            <FormattedMessage id='scenes.signup.signup'/></Button>
                                    </Form.Field>
                                    <Form.Field>
                                        <Button fluid color={'violet'} onClick={() => this.props.history.push('/login')}
                                                basic content={this.props.intl.formatMessage({id: 'login.title'})}/>
                                    </Form.Field>

                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

Signup.propTypes = {
    intl: intlShape
}
export default injectIntl(Signup)
