import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useUpdateHabits } from "../../hooks/useUpdateHabits";
import { makeRequestWithAuthorization } from "../../services/makeRequest";
import HabitNameField, { habitNameYupValidations } from "../field/habitName";
import FieldInput from "../layout/field";

const weekDaysLabels = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
];

export default function EditHabitForm({ habitId, setHabitIdToBeUpdated }) {
    const host = import.meta.env.VITE_HABIT_PATH;

    const [habitData, setHabitData] = useState(undefined);

    useEffect(() => {
        if (habitId) {
            const handleGetHabitByIdData = async () => {
                const habitHost = import.meta.env.VITE_HABIT_PATH;
                const data = await makeRequestWithAuthorization(
                    "GET",
                    `${habitHost}/${habitId}`
                );

                setHabitData({
                    ...data.habit,
                    dayWeekList: data.dayWeekList,
                });
            };

            handleGetHabitByIdData().catch((error) => {
                console.log(error);
                console.error("Não foi possível pegar os dados do hábito.");
            });
        }
    }, [habitId]);

    const { setHabitsHasUpdate } = useUpdateHabits();

    const [weekDaysHasError, setWeekDaysHasError] = useState(false);

    const formInitialValues = {
        name: habitData?.name,
        classification: habitData?.classification,
        category: habitData?.category.id,
        dateCreation: new Date().toISOString(),
        "Segunda-feira": !!habitData?.dayWeekList.find(
            (number) => number === 1
        ),
        "Terça-feira": !!habitData?.dayWeekList.find((number) => number === 2),
        "Quarta-feira": !!habitData?.dayWeekList.find((number) => number === 3),
        "Quinta-feira": !!habitData?.dayWeekList.find((number) => number === 4),
        "Sexta-feira": !!habitData?.dayWeekList.find((number) => number === 5),
        Sábado: !!habitData?.dayWeekList.find((number) => number === 6),
        Domingo: !!habitData?.dayWeekList.find((number) => number === 7),
        //weightExperience: "10"  feature futura
    };

    const handleValidationSchema = Yup.object().shape({
        ...habitNameYupValidations,
        classification: Yup.string().required("*Obrigatório*"),
        category: Yup.number().required("*Obrigatório*"),
    });

    const handleFormSubmit = async (values, { setSubmitting }) => {
        setWeekDaysHasError(false);
        setSubmitting(true);
        try {
            const dayWeekList = weekDaysLabels.reduce(
                (list, weekDayLabel, index) => {
                    if (values[weekDayLabel]) {
                        list.push(index + 1);
                    }
                    return list;
                },
                []
            );

            if (dayWeekList.length === 0) {
                setWeekDaysHasError(true);
                return;
            }

            const data = {
                habit: {
                    name:
                        values.name !== formInitialValues.name
                            ? values.name
                            : undefined,
                    classification:
                        values.classification !==
                        formInitialValues.classification
                            ? values.classification
                            : undefined,
                    category: {
                        id:
                            values.category !== formInitialValues.category
                                ? values.category
                                : undefined,
                    },
                },
                dayWeekList:
                    JSON.stringify(dayWeekList) !==
                    JSON.stringify(habitData.dayWeekList)
                        ? dayWeekList
                        : undefined,
            };

            await makeRequestWithAuthorization(
                "PUT",
                `${host}/${habitData.id}`,
                { data }
            );

            setHabitIdToBeUpdated(false);

            toast.success("Hábito atualizado!");
            setHabitsHasUpdate(true);
        } catch (error) {
            toast.error("Não foi possível atualizar o hábito");
            console.error(error);
        }
    };

    return (
        habitData && (
            <Formik
                initialValues={formInitialValues}
                validationSchema={handleValidationSchema}
                onSubmit={handleFormSubmit}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {({
                    values,
                    errors,
                    isSubmitting,
                    setFieldValue,
                    handleChange,
                }) => (
                    <Form className="w-full h-full flex justify-center items-center flex-col">
                        <h4 className="w-full mb-8 text-4xl font-bold text-primaryDark">
                            Atualizar hábito
                        </h4>

                        <div className="w-full h-full flex justify-center items-center flex-col lg:flex-row gap-10 lg:gap-32">
                            <div className="w-full h-full flex flex-1 flex-col justify-center gap-10">
                                <FieldInput
                                    name="name"
                                    type="text"
                                    fieldComponent={HabitNameField}
                                    hasError={!!errors.name}
                                />

                                <div className="w-full flex gap-2 flex-col">
                                    <div className="flex gap-4">
                                        <label className="font-bold">
                                            Classificação*:
                                        </label>

                                        <span className="text-red-600">
                                            <ErrorMessage name="classification" />
                                        </span>
                                    </div>

                                    <RadioGroup
                                        row
                                        name="classification"
                                        value={values.classification}
                                        onChange={(event) => {
                                            setFieldValue(
                                                "classification",
                                                event.currentTarget.value
                                            );
                                        }}
                                    >
                                        <FormControlLabel
                                            value="bom"
                                            label="Bom"
                                            control={<Radio />}
                                        />
                                        <FormControlLabel
                                            value="ruim"
                                            label="Ruim"
                                            control={<Radio />}
                                        />
                                    </RadioGroup>
                                </div>

                                <div className="w-full flex gap-2 flex-col">
                                    <div className="flex gap-4">
                                        <label className="font-bold">
                                            Categoria*:
                                        </label>

                                        <span className="text-red-600">
                                            <ErrorMessage name="category" />
                                        </span>
                                    </div>
                                    <RadioGroup
                                        row
                                        value={values.category}
                                        onChange={(event) => {
                                            setFieldValue(
                                                "category",
                                                event.currentTarget.value
                                            );
                                        }}
                                    >
                                        <FormControlLabel
                                            value={1}
                                            label="Saúde"
                                            control={<Radio />}
                                        />
                                        <FormControlLabel
                                            value={2}
                                            label="Educação"
                                            control={<Radio />}
                                        />
                                        <FormControlLabel
                                            value={3}
                                            label="Lazer"
                                            control={<Radio />}
                                        />
                                        <FormControlLabel
                                            value={4}
                                            label="Outro"
                                            control={<Radio />}
                                        />
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="w-full flex flex-1 flex-col">
                                <div className="flex gap-4 flex-wrap">
                                    <label className="font-bold">
                                        Dias da semana que serão feitos*:
                                    </label>
                                    {weekDaysHasError && (
                                        <p className="text-red-600">
                                            *Obrigatório*
                                        </p>
                                    )}
                                </div>
                                <FormControl>
                                    {weekDaysLabels.map((weekDay) => (
                                        <FormControlLabel
                                            key={weekDay}
                                            name={weekDay}
                                            label={weekDay}
                                            onChange={handleChange}
                                            control={
                                                <Checkbox
                                                    checked={values[weekDay]}
                                                />
                                            }
                                        />
                                    ))}
                                </FormControl>
                            </div>
                        </div>

                        <div className="w-full mt-8 flex lg:gap-10 gap-4 lg:flex-row flex-col">
                            <Button
                                variant="contained"
                                disabled={
                                    isSubmitting ||
                                    JSON.stringify(formInitialValues) ===
                                        JSON.stringify(values)
                                }
                                sx={{ width: "100%" }}
                                size="large"
                                type="submit"
                            >
                                Atualizar
                            </Button>

                            <Button
                                variant="outlined"
                                color="ruim"
                                disabled={isSubmitting}
                                sx={{ width: "100%" }}
                                size="large"
                                onClick={() => setHabitIdToBeUpdated(false)}
                            >
                                Voltar
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        )
    );
}