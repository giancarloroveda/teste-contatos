import { useEffect, useState } from "react";
import type Person from "../../Interfaces/Person.ts";
import axios from "../../lib/axios.ts";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import type Contact from "../../Interfaces/Contact.ts";
import { Badge } from "primereact/badge";

export default function ListContacts() {
    const navigate = useNavigate();

    const [globalFilterValue, setGlobalFilterValue] = useState("");

    const [contacts, setContacts] = useState<Person[]>([]);

    const fetchContacts = async () => {
        const response = await axios.get("/contacts");
        const data = await response.data;
        setContacts(data);
    };

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        const _globalFilterValue = value.trim().toLowerCase();
        setGlobalFilterValue(_globalFilterValue);
    };

    const handleDelete = async (contact: Contact) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir o contato ${contact.description}?`,
            header: "Confirmar exclusão",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            rejectClassName: "p-button-secondary",
            rejectLabel: "Cancelar",
            acceptLabel: "Confirmar",
            accept: async () => {
                await axios.delete(`/contacts/${contact.id}`);
                fetchContacts();
            },
        });
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const renderHeader = () => {
        return (
            <div className="flex gap-2 p-fluid">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"/>
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Pesquisar"
                    />
                </IconField>
                <div className={"min-w-fit"}>
                    <Button
                        label="Novo"
                        icon="pi pi-plus"
                        onClick={() => navigate("/contacts/new")}
                    ></Button>
                </div>
            </div>
        );
    };

    const actionsRender = (row: Contact) => {
        return (
            <div className="flex gap-2">
                <Button
                    severity={"contrast"}
                    rounded
                    raised
                    icon="pi pi-pencil"
                    onClick={() => navigate(`/contacts/${row.id}`)}
                    size={"small"}
                ></Button>
                <Button
                    icon="pi pi-trash"
                    severity={"danger"}
                    rounded
                    raised
                    onClick={() => handleDelete(row)}
                    size={"small"}
                ></Button>
            </div>
        );
    };

    return (
        <>
            <ConfirmDialog></ConfirmDialog>
            <section>
                <div className={"mb-4"}>
                    <h2 className="text-2xl font-bold">Contatos</h2>
                </div>

                <DataTable
                    header={renderHeader}
                    value={contacts}
                    globalFilterFields={["type", "description", "person_name"]}
                    globalFilter={globalFilterValue}
                    paginator
                    rows={5}
                >
                    <Column field="person_name" header="Dono"></Column>
                    <Column
                        field="type" header="Tipo" body={({ type }) =>
                        type === "email" ? (
                            <Badge value={"Email"}></Badge>
                        ) : (
                            <Badge value={"Telefone"}></Badge>)
                    }
                    ></Column>
                    <Column field="description" header="Descrição"></Column>
                    <Column field={"id"} body={actionsRender}></Column>
                </DataTable>
            </section>
        </>
    );
}
