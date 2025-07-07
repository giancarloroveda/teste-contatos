import { z } from "zod";
import { Card } from "primereact/card";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "primereact/inputmask";
import { useNavigate, useParams } from "react-router";
import axios from "../../lib/axios.ts";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Dropdown } from "primereact/dropdown";
import type Person from "../../Interfaces/Person.ts";
import { InputText } from "primereact/inputtext";

const contactSchema = z.object({
    type: z.enum(["phone", "email"]),
    description: z.string(),
    personId: z.number(),
}).superRefine(
    (data, ctx) => {
        if (data.type === "email" && !data.description.includes("@")) {
            ctx.addIssue({
                path: ["description"],
                code: z.ZodIssueCode.custom,
                message: "Description must be a valid email when type is 'email'",
            });
        }
    });

type ContactSchema = z.infer<typeof contactSchema>;

export default function EditContacts() {
    const navigate = useNavigate();
    const params = useParams();

    const [errors, setErrors] = useState<string[]>([]);

    const {
        handleSubmit,
        control,
        formState,
        watch,
        setValue
    } = useForm<ContactSchema>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            type: "email",
        }
    });

    const type = watch("type");

    const [people, setPeople] = useState<Person[]>([]);

    const fetchPeople = async () => {
        const response = await axios.get("/people");
        const data = await response.data;
        setPeople(data);
    };

    const onSubmit = async (data: ContactSchema) => {
        setErrors([]);
        try {
            await axios.put(`/contacts/${params.id}`, data);
            navigate("/contacts");
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrors([error.response?.data.message]);
            }
        }
    };

    useEffect(() => {
        function loadContact() {
            try {
                axios.get(`/contacts/${params.id}`).then((response) => {
                    const data = response.data;
                    setValue("personId", data.person_id);
                    setValue("type", data.type);
                    setValue("description", data.description);
                });
            } catch (error) {
                if (error instanceof AxiosError) {
                    setErrors([error.response?.data.message]);
                }
            }
        }

        fetchPeople().then(() => loadContact());
    }, []);

    useEffect(() => {
        setValue("description", "");
    }, [type]);

    return (
        <main className="w-full h-full flex justify-center items-center">
            <Card title="Editar Contato">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className={"p-fluid"}>
                        <Controller
                            name="personId"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={people.map((person: Person) => ({
                                        label: person.name,
                                        value: person.id
                                    }))}
                                    placeholder="Dono (Pessoa)"
                                />
                            )}
                        />
                        {formState.errors.personId &&
                          <small className="p-error">{formState.errors.personId.message}</small>}
                    </div>

                    <div className={"p-fluid"}>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        {
                                            label: "Email",
                                            value: "email"
                                        },
                                        {
                                            label: "Telefone",
                                            value: "phone"
                                        }
                                    ]}
                                    placeholder="Tipo de contato"
                                />
                            )}
                        />
                        {formState.errors.type &&
                          <small className="p-error">{formState.errors.type.message}</small>}
                    </div>

                    <div className={"p-fluid"}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => type === "email"
                                ? (<InputText
                                    id={"description"}
                                    placeholder={"Email"} {...field}
                                    className={formState.errors.description
                                        ? "p-invalid"
                                        : ""}
                                />)
                                : (
                                    <InputMask
                                        id={"description"}
                                        placeholder={"Telefone"}
                                        {...field}
                                        className={
                                            formState.errors.description
                                                ? "p-invalid"
                                                : ""}
                                        mask="(99) 99999-9999"
                                    />
                                )}
                        />
                        {formState.errors.description &&
                          <small className="p-error">{formState.errors.description.message}</small>}
                    </div>

                    {errors && errors.map((error, index) => (
                        <small className="p-error" key={index}>{error}</small>
                    ))}

                    <div className={"flex justify-end gap-2"}>
                        <Button
                            severity={"secondary"}
                            type="button"
                            label="Cancelar"
                            size={"small"}
                            onClick={() => navigate("/contacts")}
                        ></Button>
                        <Button
                            type="submit"
                            label="Salvar"
                            size={"small"}
                        ></Button>
                    </div>
                </form>
            </Card>
        </main>
    );
}