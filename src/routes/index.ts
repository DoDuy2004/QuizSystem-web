import { useRoutes } from 'react-router';
import routeConfig from '../configs/routesConfig';

export default function AppRoutes() {
  return useRoutes(routeConfig);
}
