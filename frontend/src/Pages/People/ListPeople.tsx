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

export default function ListPeople() {
    const navigate = useNavigate();

    const [globalFilterValue, setGlobalFilterValue] = useState("");

    const [people, setPeople] = useState<Person[]>([]);

    const fetchPeople = async () => {
        const response = await axios.get("/people");
        const data = await response.data;
        console.log(data);
        setPeople(data);
    };

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        const _globalFilterValue = value.trim().toLowerCase();
        setGlobalFilterValue(_globalFilterValue);
    };

    const handleDelete = async (person: Person) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir a pessoa ${person.name}?`,
            header: "Confirmar exclusão",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            rejectClassName: "p-button-secondary",
            rejectLabel: "Cancelar",
            acceptLabel: "Confirmar",
            accept: async () => {
                await axios.delete(`/people/${person.id}`);
                fetchPeople();
            },
        });
    };

    useEffect(() => {
        fetchPeople();
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
                        onClick={() => navigate("/people/new")}
                    ></Button>
                </div>
            </div>
        );
    };

    const actionsRender = (row: Person) => {
        return (
            <div className="flex gap-2">
                <Button
                    severity={"contrast"}
                    rounded
                    raised
                    icon="pi pi-pencil"
                    onClick={() => navigate(`/people/${row.id}`)}
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
                    <h2 className="text-2xl font-bold">Pessoas</h2>
                </div>

                <DataTable
                    header={renderHeader}
                    value={people}
                    globalFilterFields={["name", "cpf"]}
                    globalFilter={globalFilterValue}
                    paginator
                    rows={5}
                >
                    <Column field="name" header="Nome"></Column>
                    <Column field="cpf" header="CPF"></Column>
                    <Column field={"id"} body={actionsRender}></Column>
                </DataTable>
            </section>
        </>
    );
}
