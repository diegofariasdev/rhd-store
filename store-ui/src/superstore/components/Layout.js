import {Box, Grommet, Text} from 'grommet'
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
                <Box
                    flex
                    overflow='auto'
                    direction='column'
                    pad='medium'>
                    {props.children}
                </Box>
                <Box
                    direction='row'
                    background="brand"
                    pad="medium"
                    justify='between'
                >
                    <Text>RHD Application Test by Diego Farías</Text>
                </Box>
            </Box>
        </Grommet>
    )
}

export default Layout
