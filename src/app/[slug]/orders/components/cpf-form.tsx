"use client";
import { z } from "zod";
import { isValidCpf, removeCpfPunctuation } from "../../menu/utils/cpf";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PatternFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

const formSchema = z.object({
    cpf: z
        .string()
        .trim()
        .min(1, {
          message: "O CPF é obrigatório.",
        })
        .refine((value) => isValidCpf(value), {
          message: "CPF inválido.",
        }),
});

type FormSchema = z.infer<typeof formSchema>;

const CpfForm = () => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    })

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();

    const onSubmit = (data: FormSchema) => {
        router.push(`${pathname}?cpf=${removeCpfPunctuation(data.cpf)}`);
    }

    const handleCancel = () => {
        router.back();
    }

    return (
        <Drawer open>
            <DrawerTrigger asChild></DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                <DrawerTitle>Visualizar Pedidos</DrawerTitle>
                <DrawerDescription>
                    Insira seu CPF abaixo para visualizar seus pedidos.
                </DrawerDescription>
                </DrawerHeader>
                <div className="p-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Seu CPF</FormLabel>
                            <FormControl>
                            <PatternFormat
                                placeholder="Digite seu CPF..."
                                format="###.###.###-##"
                                customInput={Input}
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <DrawerFooter>
                        <Button
                        type="submit"
                        variant="destructive"
                        className="rounded-full"
                        disabled={isPending}
                        >
                        {isPending && <Loader2Icon className="animate-spin" />}
                        Confirmar
                        </Button>
                        <DrawerClose asChild>
                        <Button className="w-full rounded-full" variant="outline" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        </DrawerClose>
                    </DrawerFooter>
                    </form>
                </Form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default CpfForm;