import {Anchor, Box, Button, Heading, Keyboard, TextInput, Tip} from "grommet";
import {Cart, OrderedList, Search, TableAdd, User, UserSettings} from "grommet-icons";
import React from "react";
import CartModel from "../model/CartModel";
import ProfileModel from "../model/ProfileModel";

function AppBar (props) {
    const cartModel = CartModel
    const profileModel = ProfileModel
    const homeUrl='/'
    const cartUrl='#/cart'
    const profileUrl='#/profile'

    const userSettingsUrl='#/adminusers'
    const orderSettingsUrl='#/adminorders'
    const itemSettingsUrl='#/adminsettings'

    return (
        <Box
            tag='header'
            direction='row'
            align='center'
            justify='between'
            background='brand'
            pad={{left: 'medium', right: 'small', vertical: 'small'}}
            elevation='medium'
            style={{zIndex: '1'}}
        >

            {props.showSearch &&
            <Box width='medium' pad='small' >
                <Keyboard onEnter={(event) => {if(props.onSearchEnter) props.onSearchEnter(event.target.value)}} >
                    <TextInput
                        icon={<Search />}
                        reverse
                        placeholder="Search for your puzzle!"

                    />
                </Keyboard>
            </Box>
            }
            <Heading
                level='3'
                margin='none'>
                <Anchor label="Superstore" href={homeUrl} /> | {props.title}
            </Heading>
            <Box direction='row'>
                {!profileModel.isAdmin() && <Button
                    icon={<Cart color={cartModel.isEmpty() ? '' : 'accent-1'}/>}
                    href={cartUrl} />}
                {profileModel.isAdmin() && <>
                <Tip content="Admin Users">
                    <Button
                        icon={<UserSettings />}
                        href={userSettingsUrl} />
                </Tip>
                <Tip content="Admin Orders">
                    <Button
                        icon={<TableAdd />}
                        href={orderSettingsUrl} />
                </Tip>
                <Tip content="Admin Items">
                    <Button
                        icon={<OrderedList />}
                        href={itemSettingsUrl} />
                </Tip>
                </>}
                <Button
                    icon={<User color={profileModel.isLogged() ? 'accent-1' : ''}/>}
                    href={profileUrl} />
            </Box>
        </Box>
    )
}

export default AppBar;