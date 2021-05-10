import {Box, Button, Form, FormField, Select, TextArea, TextInput} from 'grommet'

function ItemForm (props) {

    return (
        <Form
            value={props.data}
            onChange={props.onChange}
            onSubmit={({value}) => {props.onSubmit(value)}}
        >
            <FormField
                name="name"
                htmlFor="name-id"
                label="Name">
                <TextInput disabled={props.isEditing} id="name-id" name="name"/>
            </FormField>
            <FormField name="category" htmlFor="category-id" label="category">
                <Select
                    disabled={props.isEditing}
                    name="category"
                    options={['2x2', '3x3', '4x4', '5x5', '6x6', '7x7', '8x8', 'MxN', 'NxN', 'other']}
                />
            </FormField>
            <FormField name="description" htmlFor="description-id" label="Description">
                <TextArea name="description" />
            </FormField>
            <FormField
                name="price"
                htmlFor="price-id"
                label="Price"
                validate={(field, form) => {
                    if(!/^[0-9]+(.[0-9]{1,2})?$/.test(form.price)) return "Price must match NN...N.NN"
                }}
            >
                <TextInput id="price-id" name="price"/>
            </FormField>
            <FormField name="pictureurl" htmlFor="pictureurl-id" label="Picture URL">
                <TextInput id="pictureurl-id" name="pictureurl" placeholder="Write new image URL"/>
            </FormField>
            <Box pad={{'horizontal': 'large'}}>
                <Button primary type="submit" label="Save" />
            </Box>
        </Form>
    )
}

export default ItemForm
