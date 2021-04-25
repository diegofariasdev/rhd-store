import React, {useState} from 'react'
import {Box, Button, Form, FormField, Heading, TextInput} from 'grommet'
import Layout from '../components/Layout'
import CartModel from '../model/CartModel'
import ProfileModel from '../model/ProfileModel'
import {useHistory, useLocation} from 'react-router'
import UsersClient from '../clients/UsersClient'

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

function Login() {
    const profileModel = ProfileModel
    const userClient = new UsersClient()
    const history = useHistory()
    const query = useQuery()
    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [usernameSignUpError, setUsernameSignUpError] = useState(null)

    const login = ({value}) => {
        setUsernameError(null)
        setPasswordError(null)

        userClient.login((token) => {
            profileModel.setToken(token)
            if(query.get("from") === "cart")
                history.push('/cart')
            else
                history.push('/')
        }, (error) => {
            if(error.details[0] === "Username not found") {
                setUsernameError("Username not found")
            }
            if(error.details[0] === "Bad credentials") {
                setPasswordError("Incorrect username and/or password")
            }
            if(error.details[0] === "User is disabled") {
                setUsernameError("Too many failed attempts")
            }
        }, value.username
        , value.password)
    }

    const signup = ({value}) => {
        userClient.signUp((token) => {
                login({value})
            }, (error) => {
                setUsernameSignUpError("Unexpected error while creating user")
            }, value.username
            , value.password)
    }

    return (
        <Layout title='Login'>
            <Box
                fill='horizontal'
                pad={{"horizontal": "10em"}}>
                <Heading level={2}>Please login</Heading>
                <Form
                    onSubmit={login}
                >
                    <FormField name="username" htmlFor="username-id" label="Username" error={usernameError}>
                        <TextInput id="username-id" name="username" />
                    </FormField>
                    <FormField name="password" htmlFor="password-id" label="Password" error={passwordError}>
                        <TextInput id="password-id" name="password" type="password"/>
                    </FormField>
                    <Box pad={{'horizontal': 'large'}}>
                        <Button primary type="submit" label="Login" />
                    </Box>
                </Form>

                <Heading level={3}>... Or sign up if you're new</Heading>
                <Form
                    onSubmit={signup}
                >
                    <FormField
                        name="username-su"
                        htmlFor="username-su-id"
                        label="Username"
                        validate={(value) => {
                            if(value == "") return "Username is missing"
                        }}
                        error={usernameSignUpError}>
                        <TextInput id="username-su-id" name="username-su" />
                    </FormField>
                    <FormField
                        name="password-su"
                        htmlFor="password-su-id"
                        label="Password">
                        <TextInput id="password-su-id" name="password-su" type="password"/>
                    </FormField>
                    <FormField
                        name="password-su-conf"
                        htmlFor="password-su-conf-id"
                        label="Confirm Password"
                        validate={(field, form) => {
                            if(field !== form.password) return "Password and Confirm Password mismatch"
                        }}>
                        <TextInput id="password-su-conf-id" name="password-su-conf" type="password"/>
                    </FormField>
                    <Box pad={{'horizontal': 'large'}}>
                        <Button type="submit" label="Sign Up" />
                    </Box>
                </Form>
            </Box>
        </Layout>
    )
}

export default Login
