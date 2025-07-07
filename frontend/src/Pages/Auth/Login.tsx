import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Link } from "react-router";
import { useState } from "react";
import useAuth from "../../Hooks/useAuth.tsx";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
    const [errors, setErrors] = useState<string[]>([]);
    const { login } = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/people",
    });
    const { control, handleSubmit, formState } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginSchema) => {
        const errors = await login(data.email, data.password);
        if (errors) {
            setErrors(errors);
        }
    };

    return (
        <main className="w-full h-full flex justify-center items-center">
            <Card title="Entrar">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className={"p-fluid"}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="email"
                                    placeholder={"Email"}
                                    {...field}
                                    className={
                                        formState.errors.email
                                            ? "p-invalid"
                                            : ""}
                                />
                            )}
                        />
                        {formState.errors.email &&
                          <small className="p-error">{formState.errors.email.message}</small>}
                    </div>

                    <div className={"p-fluid"}>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Password
                                    id="password"
                                    {...field}
                                    placeholder={"Senha"}
                                    toggleMask
                                    feedback={false}
                                    className={formState.errors.password
                                        ? "p-invalid"
                                        : ""}
                                />
                            )}
                        />
                        {formState.errors.password &&
                          <small className="p-error">{formState.errors.password.message}</small>}
                    </div>

                    {errors && errors.map((error, index) => (
                        <small className="p-error" key={index}>{error}</small>
                    ))}

                    <div className={"p-fluid"}>
                        <Button type="submit" label="Entrar"></Button>
                    </div>
                </form>

                <div className={"flex justify-center mt-4 hover:underline"}>
                    <Link to={"/register"}>Cadastre-se agora.</Link>
                </div>
            </Card>
        </main>
    );
}