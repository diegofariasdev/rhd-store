import Layout from "../components/Layout";
import {Bug} from "grommet-icons";
import {Anchor, Box, Heading, Text} from "grommet";

function Page403() {

    return (
        <Layout title='Ooooooops!'>
            <Heading level={2} margin={{'horizontal' : 'auto'}}>Forbidden Resource</Heading>
            <Box fill='horizontal' align='center'>
                <Bug size='xlarge' margin={{'horizontal' : 'auto'}}/>
                <Text
                    size='large'>
                    You don't have access to the requested resource. Please <Anchor href='/#/login'>Log in</Anchor> correctly.
                </Text>
            </Box>
        </Layout>
    )
}

export default Page403
