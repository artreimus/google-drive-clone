import { Navigate } from 'react-router-dom';
import { useProvideContext } from '../../contexts/Context';

function PrivateRoute({ children }: any): JSX.Element {
  const { currentUser }: any = useProvideContext();
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  return children;
}

export default PrivateRoute;
