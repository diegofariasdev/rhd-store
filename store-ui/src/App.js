import {
    HashRouter,
    Switch,
    Route
} from 'react-router-dom'
import Recommendations from './superstore/pages/Recommendations'
import Cart from './superstore/pages/Cart'
import Checkout from './superstore/pages/Checkout'
import Profile from './superstore/pages/Profile'
import Login from './superstore/pages/Login'
import AdminUsers from './superstore/pages/AdminUsers'
import AdminOrders from './superstore/pages/AdminOrders'
import AdminItems from './superstore/pages/AdminItems'
import EditUser from './superstore/pages/EditUser'
import EditOrder from './superstore/pages/EditOrder'
import EditItem from './superstore/pages/EditItem'
import Page403 from './superstore/pages/Page403'
import Page404 from './superstore/pages/Page404'
import ProfileModel from './superstore/model/ProfileModel'
import {Redirect} from "react-router";
import NewItem from "./superstore/pages/NewItem";

function App () {
    return (
        <HashRouter>
            <Switch>
                <Route exact path='/'>
                    {ProfileModel.isAdmin() && <Redirect to='/adminorders' />}
                    {!ProfileModel.isAdmin() && <Recommendations/>}
                </Route>
                <Route exact path='/cart'>
                    <Cart/>
                </Route>
                <Route exact path='/checkout'>
                    <Checkout/>
                </Route>
                <Route exact path='/profile'>
                    <Profile/>
                </Route>
                <Route exact path='/login'>
                    <Login/>
                </Route>
                <Route exact path='/adminusers'>
                    <AdminUsers/>
                </Route>
                <Route exact path='/adminusers/:username'>
                    <EditUser/>
                </Route>
                <Route exact path='/adminorders'>
                    <AdminOrders/>
                </Route>
                <Route exact path='/adminorders/:ordercode'>
                    <EditOrder/>
                </Route>
                <Route exact path='/adminitems'>
                    <AdminItems/>
                </Route>
                <Route exact path='/adminitems/new'>
                    <NewItem/>
                </Route>
                <Route exact path='/adminitems/:itemcode'>
                    <EditItem/>
                </Route>
                <Route exact path='/403'>
                    <Page403/>
                </Route>
                <Route exact path='/404'>
                    <Page404/>
                </Route>
            </Switch>
        </HashRouter>
    );
}

export default App;
