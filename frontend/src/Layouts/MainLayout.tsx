import { Outlet, useNavigate } from "react-router";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import useAuth from "../Hooks/useAuth.tsx";
import { Menu } from "primereact/menu";

export default function MainLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth({
        middleware: "auth",
    });

    const items = [
        {
            label: "Pessoas",
            icon: "pi pi-users",
            command: () => navigate("/people"),
        },
        {
            label: "Contatos",
            icon: "pi pi-id-card",
            command: () => navigate("/contacts"),
        },
    ];

    const optionsMenuItems = [
        {
            label: "Sair",
            icon: "pi pi-sign-out",
            command: async () => await logout(),
        }
    ];


    const op = useRef<OverlayPanel>(null);

    const start = <span className="font-bold text-lg text-[#06b6d4]">My App</span>;
    const end = <div>
        <Button
            icon="pi pi-cog"
            rounded outlined
            severity={"secondary"}
            onClick={(e) => op.current?.toggle(e)}
            className="mr-2"
        ></Button>
        <OverlayPanel ref={op} unstyled>
            <Menu model={optionsMenuItems}></Menu>
        </OverlayPanel>
    </div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Menubar model={items} start={start} end={end}/>

            <main className="p-4 flex-grow">
                <Outlet/>
            </main>
        </div>
    );
}