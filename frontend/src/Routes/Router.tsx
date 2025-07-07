import { createBrowserRouter } from "react-router";
import Register from "../Pages/Auth/Register.tsx";
import Login from "../Pages/Auth/Login.tsx";
import MainLayout from "../Layouts/MainLayout.tsx";
import ListPeople from "../Pages/People/ListPeople.tsx";
import CreatePeople from "../Pages/People/CreatePeople.tsx";
import EditPeople from "../Pages/People/EditPeople.tsx";
import ListContacts from "../Pages/Contacts/ListContacts.tsx";
import CreateContacts from "../Pages/Contacts/CreateContacts.tsx";
import EditContacts from "../Pages/Contacts/EditContacts.tsx";

export const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register/>,
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {
                path: "/people",
                element: <ListPeople/>
            },
            {
                path: "/people/new",
                element: <CreatePeople/>
            },
            {
                path: "/people/:id",
                element: <EditPeople/>
            },
            {
                path: "/contacts",
                element: <ListContacts/>
            },
            {
                path: "/contacts/new",
                element: <CreateContacts/>
            },
            {
                path: "/contacts/:id",
                element: <EditContacts/>
            }
        ]
    }
]);