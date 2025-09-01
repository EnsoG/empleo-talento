import { useEffect } from "react";
import { DatePickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Card,
    Divider,
    LoadingOverlay,
    Select,
    Skeleton,
    Stack,
    Text,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { Candidate, DriverLicense, Gender, Nationality } from "../../types";
import { endpoints } from "../../endpoints";
import { personalInfoSchema } from "../../schemas/portalSchemas";
import { parseDateToLocal } from "../../utilities";
import { PortalLayout } from "../../layouts/PortalLayout";
import { MyProfileLayout } from "../../layouts/MyProfileLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";

export const PersonalInfo = () => {
    const { data: candidate, isLoading: candidateLoading, fetchData: fetchCandidate } = useFetch<Candidate>();
    const { data: licenses, isLoading: licensesLoading, fetchData: fetchLicenses } = useFetch<DriverLicense[]>();
    const { isLoading: updateLoading, fetchData: fetchUpdate } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        validate: zodResolver(personalInfoSchema)
    });

    const getCandidate = async () => await fetchCandidate(endpoints.candidates, {
        method: "GET",
        credentials: "include"
    });

    const getDriverLicenses = async () => await fetchLicenses(endpoints.driverLicenses, {
        method: "GET"
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Do Request
        const data = personalInfoSchema.parse(values);
        await fetchUpdate(endpoints.candidates, {
            showNotifications: true,
            successMessage: "Informacion personal actualizada con exito",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Candidate And Close Modal
        await getCandidate()
    }

    useEffect(() => {
        getCandidate();
        getDriverLicenses();
    }, []);

    useEffect(() => {
        if (candidate) {
            form.setValues({
                name: candidate.name,
                paternal: candidate.paternal,
                maternal: candidate.maternal,
                run: candidate.run,
                birth_date: candidate.birth_date ? parseDateToLocal(candidate.birth_date) : null,
                phone: candidate.phone,
                gender: candidate.gender,
                nationality: candidate.nationality,
                license_id: candidate.driver_license ? String(candidate.driver_license.license_id) : null
            });
        }
    }, [candidate]);

    return (
        <PortalLayout>
            <PortalBanner title="Mi Perfil" />
            <MyProfileLayout>
                <Card
                    padding="lg"
                    shadow="sm"
                    withBorder>
                    <Text c="blue" size="md" fw="bold">Informacion Personal</Text>
                    <Divider my="sm" />
                    <Skeleton
                        height="100%"
                        visible={candidateLoading || licensesLoading}>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <LoadingOverlay visible={updateLoading} />
                            <Stack>
                                <TextInput
                                    label="Nombre"
                                    placeholder="Ingrese su nombre"
                                    key={form.key("name")}
                                    {...form.getInputProps("name")}
                                    withAsterisk />
                                <TextInput
                                    label="Apellido Paterno"
                                    placeholder="Ingrese su apellido paterno"
                                    key={form.key("paternal")}
                                    {...form.getInputProps("paternal")}
                                    withAsterisk />
                                <TextInput
                                    label="Apellido Materno"
                                    placeholder="Ingrese su apellido materno"
                                    key={form.key("maternal")}
                                    {...form.getInputProps("maternal")} />
                                <TextInput
                                    label="RUT"
                                    placeholder="Ingrese su rut"
                                    description="Ejemplo: 11.111.111-1"
                                    maxLength={13}
                                    key={form.key("run")}
                                    {...form.getInputProps("run")} />
                                <DatePickerInput
                                    label="Fecha Nacimiento"
                                    placeholder="Ingrese su fecha de nacimiento"
                                    maxDate={new Date()}
                                    valueFormat="DD / MM / YYYY"
                                    key={form.key("birth_date")}
                                    {...form.getInputProps("birth_date")}
                                    clearable />
                                <TextInput
                                    label="Numero Telefonico"
                                    placeholder="Ingrese su numero telefonico"
                                    description="Ejemplo: +56912345678"
                                    key={form.key("phone")}
                                    {...form.getInputProps("phone")} />
                                <Select
                                    label="Genero"
                                    placeholder="Seleccione su genero"
                                    data={Object.values(Gender)}
                                    comboboxProps={{ withinPortal: false }}
                                    key={form.key("gender")}
                                    {...form.getInputProps("gender")}
                                    clearable />
                                <Select
                                    label="Pais"
                                    placeholder="Seleccione su pais"
                                    data={Object.values(Nationality)}
                                    comboboxProps={{ withinPortal: false }}
                                    key={form.key("nationality")}
                                    {...form.getInputProps("nationality")}
                                    searchable
                                    clearable />
                                {(licenses) &&
                                    <Select
                                        label="Licencia Conducir"
                                        placeholder="Seleccione su licencia de conducir"
                                        key={form.key("license_id")}
                                        {...form.getInputProps("license_id")}
                                        data={licenses.map((l) => ({
                                            value: String(l.license_id),
                                            label: l.license
                                        }))}
                                        comboboxProps={{ withinPortal: false }}
                                        clearable
                                        searchable />
                                }
                                <Button type="submit">Actualizar</Button>
                            </Stack>
                        </form>
                    </Skeleton>
                </Card>
            </MyProfileLayout>
        </PortalLayout>
    )
}