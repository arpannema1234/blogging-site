import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Blog from "./components/Blog.jsx";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import CreateBlog from "./components/CreateBlog.jsx";
import Home from "./pages/Home.jsx";
import { HomeContextProvider } from "./store/home-context.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditBlog from "./components/EditBlog.jsx";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEO1Z9ZZf9g65AAD_RH5by8IVW0cA11lU",
  authDomain: "blogging-app-3930c.firebaseapp.com",
  projectId: "blogging-app-3930c",
  storageBucket: "blogging-app-3930c.appspot.com",
  messagingSenderId: "275023146978",
  appId: "1:275023146978:web:b992932081d8e0f554d3bb",
  measurementId: "G-YTNSYED0PT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/blog/:blogid", element: <Blog /> },
      { path: "/create-blog", element: <CreateBlog /> },
      { path: "/edit-blog/:blogid", element: <EditBlog /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/login", element: <Login /> },
      { path: "/create-account", element: <CreateAccount /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <HomeContextProvider>
    <RouterProvider router={router} />
  </HomeContextProvider>
);
