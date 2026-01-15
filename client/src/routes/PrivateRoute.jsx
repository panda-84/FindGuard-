import {Navigate , Outlet} from 'react-router-dom';
import {getToken} from '../Utils/storage';

export const PrivateRoute = () => {
    const token = getToken();
    return token ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoute;
