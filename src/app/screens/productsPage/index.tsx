import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Products } from "./Products";
import { ChosenProduct } from "./ChosenProduct";
import "../../../css/home.css";
import "../../../css/products.css";

export function ProductsPage() {
  const match = useRouteMatch();

  return (
    <div className="products-page">
      <Switch>
        <Route path={`${match.path}/:productId`}>
          <ChosenProduct />
        </Route>
        <Route path={match.path}>
          <Products />
        </Route>
      </Switch>
    </div>
  );
}
