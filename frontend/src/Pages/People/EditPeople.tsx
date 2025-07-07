import { z } from "zod";
import { Card } from "primereact/card";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputMask } from "primereact/inputmask";
import { useNavigate, useParams } from "react-router";
import axios from "../../lib/axios.ts";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import ContactsList from "../../Components/ContactsList.tsx";

const personSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cpf: z.string()
        .length(14, "O CPF deve conter 11 caracteres")
        .transform((value) => value.replace(/[-.]/g, "")),
});

type PersonSchema = z.infer<typeof personSchema>;

export default function EditPeople() {
    const navigate = useNavigate();
    const params = useParams();

    const [errors, setErrors] = useState<string[]>([]);

    const {
        handleSubmit,
        control,
        formState,
        setValue
    } = useForm<PersonSchema>({
        resolver: zodResolver(personSchema)
    });

    useEffect(() => {
            async function loadPerson() {
                try {
                    const res = await axios.get(`/people/${params.id}`);
                    setValue("name", res.data.name);
                    setValue("cpf", res.data.cpf);
                } catch (error) {
                    if (error instanceof AxiosError) {
                        setErrors([error.response?.data.message]);
                    }
                }
            }

            loadPerson();
        }, []
    );

    const onSubmit = async (data: PersonSchema) => {
        try {
            await axios.put(`/people/${params.id}`, data);
            navigate("/people");
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrors([error.response?.data.message]);
            }
        }
    };

    return (
        <main className="w-full h-full flex gap-12 flex-col justify-center items-center">
            <Card title="Editar Pessoa">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className={"p-fluid"}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="name"
                                    placeholder={"Nome"}
                                    {...field}
                                    className={
                                        formState.errors.name
                                            ? "p-invalid"
                                            : ""}
                                />
                            )}
                        />
                        {formState.errors.name &&
                          <small className="p-error">{formState.errors.name.message}</small>}
                    </div>

                    <div className={"p-fluid"}>
                        <Controller
                            name="cpf"
                            control={control}
                            render={({ field }) => (
                                <InputMask
                                    id={"cpf"}
                                    placeholder={"CPF"}
                                    {...field}
                                    className={
                                        formState.errors.cpf
                                            ? "p-invalid"
                                            : ""}
                                    mask="999.999.999-99"
                                />
                            )}
                        />
                        {formState.errors.cpf &&
                          <small className="p-error">{formState.errors.cpf.message}</small>}
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
                            onClick={() => navigate("/people")}
                        ></Button>
                        <Button
                            type="submit"
                            label="Salvar"
                            size={"small"}
                        ></Button>
                    </div>
                </form>
            </Card>

            <Card title="Contatos">
                <ContactsList personId={Number(params.id)}/>
            </Card>
        </main>
    );
}