import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { RouterProvider } from "react-router";
import { router } from "./Routes/Router.tsx";
import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider>
            <RouterProvider
                router={router}
            ></RouterProvider>
        </PrimeReactProvider>
    </StrictMode>
);
