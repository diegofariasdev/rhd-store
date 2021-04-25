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
import AdminSettings from './superstore/pages/AdminSettings'

function App () {
    return (
        <HashRouter>
            <Switch>
                <Route exact path='/'>
                    <Recommendations/>
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
                <Route exact path='/adminorders'>
                    <AdminOrders/>
                </Route>
                <Route exact path='/adminsettings'>
                    <AdminSettings/>
                </Route>
            </Switch>
        </HashRouter>
    );
}

export default App;
