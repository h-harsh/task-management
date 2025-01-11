import { Redirect, Route, Switch } from "wouter";
import { Open, Closed, InProgress } from "./pages";
import { RoutesData } from "./constants";

const Routes = () => {
  return (
    <>
    <Switch>
      <Route path="/" component={() => <Redirect to={RoutesData.OPEN} />} />
      <Route path={RoutesData.OPEN} component={Open} />
      <Route path={RoutesData.CLOSED} component={Closed} />
      <Route path={RoutesData.IN_PROGRESS} component={InProgress} />
    </Switch>
    </>
  )
}

export default Routes