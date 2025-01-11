import { Redirect, Route, Switch } from "wouter";
import { Open, Closed, InProgress } from "./pages";

const Routes = () => {
  return (
    <>
    <Switch>
      <Route path="/" component={() => <Redirect to="/open" />} />
      <Route path="/open" component={Open} />
      <Route path="/closed" component={Closed} />
      <Route path="/in-progress" component={InProgress} />
    </Switch>
    </>
  )
}

export default Routes