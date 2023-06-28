import { Button, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { formatISO } from 'date-fns';
import { ErrorMessage, Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { envs } from '../../config';
import { useUpdateHabits } from '../../hooks/useUpdateHabits';
import { makeRequestWithAuthorization } from '../../services/makeRequestWithAuthorization';
import HabitNameField, { habitNameYupValidations } from '../field/habitName';
import FieldInput from '../layout/field';

interface Values {
    name: string;
    classification: string;
    category: number;
    dateCreation: string;
    weightExperience?: number;
    'Segunda-feira': boolean;
    'Terça-feira': boolean;
    'Quarta-feira': boolean;
    'Quinta-feira': boolean;
    'Sexta-feira': boolean;
    Sábado: boolean;
    Domingo: boolean;
}

enum WeekDayLabelToNumber {
    'Segunda-feira' = 1,
    'Terça-feira' = 2,
    'Quarta-feira' = 3,
    'Quinta-feira' = 4,
    'Sexta-feira' = 5,
    'Sábado' = 6,
    'Domingo' = 7,
}

type PossibleDay =
    | 'Segunda-feira'
    | 'Terça-feira'
    | 'Quarta-feira'
    | 'Quinta-feira'
    | 'Sexta-feira'
    | 'Sábado'
    | 'Domingo';

const weekDaysLabels: PossibleDay[] = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
];

interface CreateHabitFormProps {
    setOpenCreateHabitModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateHabitForm({ setOpenCreateHabitModal }: CreateHabitFormProps) {
    const host = envs.habitPath;

    const { setHabitsHasUpdate } = useUpdateHabits();

    const [weekDaysHasError, setWeekDaysHasError] = useState(false);

    const handleFormSubmit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        setWeekDaysHasError(false);
        setSubmitting(true);
        try {
            const dayWeekList = weekDaysLabels.reduce((list: number[], weekDayLabel) => {
                if (values[weekDayLabel]) {
                    list.push(WeekDayLabelToNumber[weekDayLabel]);
                }
                return list;
            }, []);

            if (dayWeekList.length === 0) {
                setWeekDaysHasError(true);
                return;
            }

            const data = {
                habit: {
                    dateCreation: values.dateCreation,
                    name: values.name,
                    classification: values.classification,
                    category: { id: Number(values.category) },
                },
                dayWeekList,
            };

            await makeRequestWithAuthorization('POST', host, { data });

            setOpenCreateHabitModal(false);
            toast.success('Hábito criado!');
            setHabitsHasUpdate(true);
        } catch (error) {
            toast.error('Não foi possível criar o hábito');
            console.error(error);
        }
    };

    const formInitialValues: Values = {
        name: '',
        classification: '',
        category: -1,
        dateCreation: formatISO(new Date()),
        'Segunda-feira': false,
        'Terça-feira': false,
        'Quarta-feira': false,
        'Quinta-feira': false,
        'Sexta-feira': false,
        Sábado: false,
        Domingo: false,
        //weightExperience: "10"  feature futura
    };

    const handleValidationSchema = Yup.object().shape({
        ...habitNameYupValidations,
        classification: Yup.string().required('*Obrigatório*'),
        category: Yup.number().required('*Obrigatório*'),
    });

    return (
        <Formik
            initialValues={formInitialValues}
            validationSchema={handleValidationSchema}
            onSubmit={handleFormSubmit}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({ values, errors, isSubmitting, setFieldValue, handleChange }) => (
                <Form className="w-full h-full flex justify-center items-center flex-col">
                    <h4 className="w-full mb-8 text-4xl font-bold text-primaryDark">Criar novo hábito</h4>

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
                                    <label className="font-bold">Classificação*:</label>

                                    <span className="text-red-600">
                                        <ErrorMessage name="classification" />
                                    </span>
                                </div>

                                <RadioGroup
                                    row
                                    name="classification"
                                    value={values.classification}
                                    onChange={(event) => {
                                        setFieldValue('classification', event.currentTarget.value);
                                    }}
                                >
                                    <FormControlLabel value="bom" label="Bom" control={<Radio />} />
                                    <FormControlLabel value="ruim" label="Ruim" control={<Radio />} />
                                </RadioGroup>
                            </div>

                            <div className="w-full flex gap-2 flex-col">
                                <div className="flex gap-4">
                                    <label className="font-bold">Categoria*:</label>

                                    <span className="text-red-600">
                                        <ErrorMessage name="category" />
                                    </span>
                                </div>
                                <RadioGroup
                                    row
                                    value={values.category}
                                    onChange={(event) => {
                                        setFieldValue('category', event.currentTarget.value);
                                    }}
                                >
                                    <FormControlLabel value={1} label="Saúde" control={<Radio />} />
                                    <FormControlLabel value={2} label="Educação" control={<Radio />} />
                                    <FormControlLabel value={3} label="Lazer" control={<Radio />} />
                                    <FormControlLabel value={4} label="Outro" control={<Radio />} />
                                </RadioGroup>
                            </div>
                        </div>

                        <div className="w-full flex flex-1 flex-col">
                            <div className="flex gap-4 flex-wrap">
                                <label className="font-bold">Dias da semana que serão feitos*:</label>
                                {weekDaysHasError && <p className="text-red-600">*Obrigatório*</p>}
                            </div>
                            <FormControl>
                                {weekDaysLabels.map((weekDay) => (
                                    <FormControlLabel
                                        key={weekDay}
                                        name={weekDay}
                                        label={weekDay}
                                        onChange={handleChange}
                                        control={<Checkbox checked={values[weekDay]} />}
                                    />
                                ))}
                            </FormControl>
                        </div>
                    </div>

                    <div className="w-full mt-8 flex lg:gap-10 gap-4 lg:flex-row flex-col">
                        <Button
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{ width: '100%' }}
                            size="large"
                            type="submit"
                        >
                            Criar
                        </Button>

                        <Button
                            variant="outlined"
                            color="ruim"
                            disabled={isSubmitting}
                            sx={{ width: '100%' }}
                            size="large"
                            onClick={() => setOpenCreateHabitModal(false)}
                        >
                            Voltar
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
