import { Container } from "@mui/material";
import "../css/app.css";
import { Link, Route, Switch } from "react-router-dom";
import { HomePage } from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { HelpPage } from "./screens/helpPage";

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">HomePage</Link>
          </li>
          <li>
            <Link to="/products">ProductsPage</Link>
          </li>
          <li>
            <Link to="/orders">OrdersPage</Link>
          </li>
          <li>
            <Link to="/member-page">UserPage</Link>
          </li>
          <li>
            <Link to="/help">HelpPage</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/products" component={ProductsPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/member-page" component={UserPage} />
        <Route path="/help" component={HelpPage} />
        <Route exact path="/" component={HomePage} />
      </Switch>
    </div>
  );
}

export default App;
