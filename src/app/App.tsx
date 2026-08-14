import { Container } from "@mui/material";
import "../css/app.css";
import { Link, Route, Switch } from "react-router-dom";
import { About } from "./screens/About";
import { Users } from "./screens/Users";

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/about" component={About} />
        <Route path="/users" component={Users} />
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
}

function Home() {
  return <Container>Home</Container>;
}

export default App;
