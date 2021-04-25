import {Box, Grommet} from 'grommet'
import AppBar from './AppBar'

function Layout (props) {
    const theme = {
        global: {
            colors: {
                brand: '#228BE6',
            },
            font: {
                family: 'Roboto',
                size: '18px',
                height: '20px',
            },
        },
    }

    return (
        <Grommet theme={theme} full>
            <Box fill>
                <AppBar {...props}/>
                <Box flex direction='row' pad='medium' overflow={{ horizontal: 'hidden'}}>
                    {props.children}
                </Box>
            </Box>
        </Grommet>
    )
}

export default Layout
