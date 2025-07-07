import { useEffect, useState } from "react";
import type Person from "../Interfaces/Person.ts";
import axios from "../lib/axios.ts";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";

interface ContactsListProps {
    personId: number;
}

export default function ContactsList({ personId }: ContactsListProps) {
    const [globalFilterValue, setGlobalFilterValue] = useState("");

    const [contacts, setContacts] = useState<Person[]>([]);

    const fetchContacts = async () => {
        const response = await axios.get("/contacts?personId=" + personId);
        const data = await response.data;
        setContacts(data);
    };

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        const _globalFilterValue = value.trim().toLowerCase();
        setGlobalFilterValue(_globalFilterValue);
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
            </div>
        );
    };

    return (
        <>
            <section>
                <DataTable
                    header={renderHeader}
                    value={contacts}
                    globalFilterFields={["type", "description"]}
                    globalFilter={globalFilterValue}
                    paginator
                    rows={5}
                >
                    <Column
                        field="type" header="Tipo" body={({ type }) =>
                        type === "email" ? (
                            <Badge value={"Email"}></Badge>
                        ) : (
                            <Badge value={"Telefone"}></Badge>)
                    }
                    ></Column>
                    <Column field="description" header="Descrição"></Column>
                </DataTable>
            </section>
        </>
    );
}