import { Route } from "react-router-dom";
import Layout from "./layouts/index";
import routes, { RouteType } from "./routes";

const generateRoutes = (routes: RouteType[]): any => {
  const tmp = [];
  for (const route of routes) {
    if (route.path && route.element) {
      tmp.push(
        <Route key={route.key} path={route.path} element={<route.element />}>
          {generateRoutes(route.children)}
        </Route>
      );
    } else if (route.element) {
      tmp.push(<Route key={route.key} index element={<route.element />} />);
    } else {
      tmp.push(
        <Route key={route.key} path={route.path}>
          {generateRoutes(route.children)}
        </Route>
      );
    }
  }

  return tmp;
};

export default () => (
  <Route path="/" element={<Layout />}>
    {generateRoutes(routes)}
  </Route>
);
