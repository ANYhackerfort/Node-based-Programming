import TokenDisplay from "../page/TaskPage";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../landingPage/LandingPage";
import Playground from "../page/Project";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <TokenDisplay /> , // Changed element to display "Test Test Test"
  },
  { path: "/demo", element: <LandingPage /> },
  {
    path: "projects/playground",
    element: <Playground />,
  },
]);

export default routers;