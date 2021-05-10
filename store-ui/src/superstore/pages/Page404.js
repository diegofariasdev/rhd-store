import Layout from "../components/Layout";
import {Search} from "grommet-icons";
import {Box, Heading, Text} from "grommet";

function Page404() {

    return (
        <Layout title='Ooooooops!'>
            <Heading level={2} margin={{'horizontal' : 'auto'}}>404 Not found!</Heading>
            <Box fill='horizontal' align='center'>
                <Search size='xlarge' margin={{'horizontal' : 'auto'}}/>
                <Text
                    size='large'>
                    We didn't found the resource. Maybe you followed a broken link?
                </Text>
            </Box>
        </Layout>
    )
}

export default Page404
