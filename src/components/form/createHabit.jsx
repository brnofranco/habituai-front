import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { makeRequestWithAuthorization } from "../../services/makeRequest";

const weekDaysLabels = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
];

export default function CreateHabitForm({ setOpenCreateHabitModal }) {
    const host = import.meta.env.VITE_HABITS_PATH;

    const [isLoading, setIsLoading] = useState(false);
    const [nameHasError, setNameHasError] = useState(false);
    const [classificationHasError, setClassificationHasError] = useState(false);
    const [categoryHasError, setCategoryHasError] = useState(false);
    const [weekDaysHasError, setWeekDaysHasError] = useState(false);
    const [weekDays, setWeekDays] = useState([]);
    const [formValues, setFormValues] = useState({
        name: "",
        classification: "",
        category: "",
        dateCreation: new Date().toISOString().split("T")[0],
        weightExperience: "10", // feature futura
    });

    const handleWeekDays = (event) => {
        const { value, checked } = event.target;

        if (!checked) {
            const newWeekDayList = weekDays.filter(
                (number) => number !== value
            );
            setWeekDays(newWeekDayList);
            return;
        }

        setWeekDays([...weekDays, value]);
    };

    const handleChangeValues = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        setFormValues((current) => {
            return {
                ...current,
                [fieldName]: fieldValue,
            };
        });
    };

    const validateAllFields = () => {
        let hasError = false;
        const validateEmptyField = (field, setFieldError) => {
            const isEmpty = !formValues[field].trim();

            setFieldError(isEmpty);
            return isEmpty;
        };
        console.log(weekDays);
        if (validateEmptyField("name", setNameHasError)) hasError = true;

        if (validateEmptyField("classification", setClassificationHasError))
            hasError = true;

        if (validateEmptyField("category", setCategoryHasError))
            hasError = true;

        if (weekDays.length === 0) {
            setWeekDaysHasError(true);
            hasError = true;
        } else {
            setWeekDaysHasError(false);
        }

        return hasError;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            if (validateAllFields()) {
                return;
            }

            await makeRequestWithAuthorization("POST", host, {
                data: { ...formValues, weekDays },
            });

            setOpenCreateHabitModal(false);
            toast.success("Hábito criado!");
        } catch (error) {
            toast.error("Não foi possível criar o hábito");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className="w-full h-full flex justify-center items-center flex-col"
        >
            <h4 className="w-full mb-8 text-4xl font-bold text-primaryDark">
                Criar novo hábito
            </h4>

            <div className="w-full h-full flex justify-center items-center flex-col lg:flex-row gap-10 lg:gap-32">
                <div className="w-full h-full flex flex-1 flex-col justify-center gap-10">
                    <TextField
                        id="name"
                        name="name"
                        type="text"
                        label="Nome do hábito*"
                        variant="outlined"
                        error={nameHasError}
                        onChange={handleChangeValues}
                    />

                    <div className="w-full flex gap-2 flex-col">
                        <div className="flex gap-4">
                            <label className="font-bold">Classificação*:</label>
                            {classificationHasError && (
                                <p className="text-red-600">*Obrigatório*</p>
                            )}
                        </div>

                        <RadioGroup
                            row
                            name="classification"
                            onChange={handleChangeValues}
                        >
                            <FormControlLabel
                                value="good"
                                label="Bom"
                                control={<Radio />}
                            />
                            <FormControlLabel
                                value="bad"
                                label="Ruim"
                                control={<Radio />}
                            />
                        </RadioGroup>
                    </div>

                    <div className="w-full flex gap-2 flex-col">
                        <div className="flex gap-4">
                            <label className="font-bold">Categoria*:</label>
                            {categoryHasError && (
                                <p className="text-red-600">*Obrigatório*</p>
                            )}
                        </div>
                        <RadioGroup
                            row
                            name="category"
                            onChange={handleChangeValues}
                        >
                            <FormControlLabel
                                value="health"
                                label="Saúde"
                                control={<Radio />}
                            />
                            <FormControlLabel
                                value="study"
                                label="Estudo"
                                control={<Radio />}
                            />
                            <FormControlLabel
                                value="leisure"
                                label="Lazer"
                                control={<Radio />}
                            />
                            <FormControlLabel
                                value="other"
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
                            <p className="text-red-600">*Obrigatório*</p>
                        )}
                    </div>
                    <FormControl>
                        {weekDaysLabels.map((weekDay, index) => (
                            <FormControlLabel
                                key={index}
                                value={index + 1}
                                label={weekDay}
                                control={<Checkbox onChange={handleWeekDays} />}
                            />
                        ))}
                    </FormControl>
                </div>
            </div>

            <div className="w-full mt-8 flex gap-10">
                <Button
                    variant="outlined"
                    color="bad"
                    disabled={isLoading}
                    sx={{ width: "40%" }}
                    size="large"
                    onClick={() => setOpenCreateHabitModal(false)}
                >
                    Voltar
                </Button>

                <Button
                    variant="contained"
                    disabled={isLoading}
                    sx={{ width: "60%" }}
                    size="large"
                    type="submit"
                >
                    Criar
                </Button>
            </div>
        </form>
    );
}