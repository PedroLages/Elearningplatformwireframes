import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { MyClass } from "./pages/MyClass";
import { Courses } from "./pages/Courses";
import { Messages } from "./pages/Messages";
import { Instructors } from "./pages/Instructors";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Overview },
      { path: "my-class", Component: MyClass },
      { path: "courses", Component: Courses },
      { path: "messages", Component: Messages },
      { path: "instructors", Component: Instructors },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);
