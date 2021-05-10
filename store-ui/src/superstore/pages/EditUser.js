import Layout from '../components/Layout'
import {
    Box,
    Button,
    Form,
    FormField,
    Heading,
    RadioButtonGroup,
    TextInput} from 'grommet'
import {useHistory, useParams} from 'react-router'
import {useEffect, useMemo, useState} from 'react'
import UsersClient from '../clients/UsersClient'
import ProfileModel from '../model/ProfileModel'

function EditUser() {
    const { username } = useParams()
    const history = useHistory()
    const profileModel = ProfileModel
    const [userData, setUserData] = useState({
        username : 'loading...'
    })
    const userClient = useMemo(() => {
        return new UsersClient()
    }, [])

    const saveUser = (user) => {
        userClient.updateUser(
            () => {
                history.push("/adminusers")
            },
            (error) => {
                if(error.error === "uilogout") {
                    profileModel.logout()
                    history.push('/login?logoutreason=tokenexpired')
                }
            },
            user
        )
    }

    useEffect(() => {
        userClient.fetchUser(
            (userData) => {
                setUserData(userData)
            },
            (error) => {
                if(error.error === "uilogout") {
                    profileModel.logout()
                    history.push('/login?logoutreason=tokenexpired')
                }
            },
            username
        )
    },[userClient, username, profileModel, history])

    return (
        <Layout
            title={'Edit User'}
        >
            <Heading level={2}>Editing user '{username}'</Heading>
            <Form
                value={userData}
                onChange={(newValue) => setUserData(newValue)}
                onSubmit={({value}) => {saveUser(value)}}
            >
                <FormField name="username" htmlFor="username-id" label="Username">
                    <TextInput disabled id="username-id" name="username"/>
                </FormField>
                <FormField name="profile" htmlFor="profile-id" label="Profile">
                    <RadioButtonGroup
                        id="profile-id"
                        name="profile"
                        options={['admin', 'client']}
                    />
                </FormField>
                <FormField name="enabled" htmlFor="enabled-id" label="Enabled">
                    <RadioButtonGroup
                        id="enabled-id"
                        name="enabled"
                        options={[true, false]}
                    />
                </FormField>
                <FormField name="password" htmlFor="password-id" label="New Password">
                    <TextInput id="password-id" name="password"/>
                </FormField>
                <Box pad={{'horizontal': 'large'}}>
                    <Button primary type="submit" label="Save" />
                </Box>
            </Form>
        </Layout>
    )
}

export default EditUser
