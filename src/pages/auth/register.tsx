import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormItem, FormLabel, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: NextPage = () => {
    const form = useForm<Inputs>();
    // const { data: session } = useSession();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                toast.success(data.message);
            })
            .catch(err => {
                toast.error(err.response.data.message);
            })
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="w-1/2">
                <CardHeader className="text-2xl font-bold text-center">
                    Register
                </CardHeader>
                <CardContent className="px-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                            <FormItem>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    {...form.register("name")}
                                />
                            </FormItem>
                            <FormItem>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    {...form.register("email")}
                                />
                            </FormItem>
                            <FormItem>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    {...form.register("password")}
                                />
                            </FormItem>
                            <FormItem>
                                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...form.register("confirmPassword")}
                                />
                            </FormItem>
                            <div className="flex justify-center pt-4">
                                <Button type="submit">
                                    Register
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    )
}


export default Register;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}