import { Button, Checkbox, FormControl, RadioGroup, Rating } from '@mui/material';
import { ErrorMessage, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { envs } from '../../config';
import { useUpdateHabits } from '../../hooks/useUpdateHabits';
import { Habit } from '../../pages/Dashboard';
import { makeRequestWithAuthorization } from '../../services/makeRequestWithAuthorization';
import HabitNameField, { habitNameYupValidations } from '../field/habitName';
import { CategoryRadioButton } from '../input/category';
import { ClassificationRadioButton } from '../input/classification';
import {
    WeekDayCheckBoxBaseButton,
    WeekDayCheckBoxCheckedButton,
    WeekDayCheckBoxDisabledButton,
} from '../input/weekDays';
import FieldInput from '../layout/field';

interface Values {
    name?: string;
    classification?: string;
    category?: number;
    dateCreation: string;
    weightExperience: number;
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

interface HabitsWithDayWeekList extends Habit {
    dayWeekList: number[];
}

interface EditHabitFormProps {
    habitId: number | null;
    setHabitIdToBeUpdated: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function EditHabitForm({ habitId, setHabitIdToBeUpdated }: EditHabitFormProps) {
    const host = envs.habitPath;

    const [habitData, setHabitData] = useState<HabitsWithDayWeekList | null>(null);

    useEffect(() => {
        if (habitId) {
            const handleGetHabitByIdData = async () => {
                const habitHost = envs.habitPath;
                const data = await makeRequestWithAuthorization('GET', `${habitHost}/${habitId}`);

                setHabitData({
                    ...data.habit,
                    dayWeekList: data.dayWeekList,
                });
            };

            handleGetHabitByIdData().catch((error) => {
                console.error(error);
                console.error('Não foi possível pegar os dados do hábito.');
            });
        }
    }, [habitId]);

    const { setHabitsHasUpdate } = useUpdateHabits();

    const [weekDaysHasError, setWeekDaysHasError] = useState(false);

    const handleFormSubmit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        setWeekDaysHasError(false);
        setSubmitting(true);
        try {
            const dayWeekList = weekDaysLabels.reduce((list: number[], weekDayLabel) => {
                if (values.classification === 'ruim' || values[weekDayLabel]) {
                    list.push(WeekDayLabelToNumber[weekDayLabel]);
                }
                return list;
            }, []);

            if (values.classification === 'bom' && dayWeekList.length === 0) {
                setWeekDaysHasError(true);
                return;
            }

            const data = {
                habit: {
                    name: values.name !== formInitialValues.name ? values.name : undefined,
                    classification:
                        values.classification !== formInitialValues.classification ? values.classification : undefined,
                    category:
                        values.category !== formInitialValues.category
                            ? {
                                  id: values.category,
                              }
                            : undefined,
                    weightExperience:
                        Number(values.weightExperience) !== formInitialValues.weightExperience
                            ? values.weightExperience * 5
                            : undefined,
                    //TODO: entender pq vem como string
                },
                dayWeekList:
                    JSON.stringify(dayWeekList) !== JSON.stringify(habitData?.dayWeekList) ? dayWeekList : undefined,
            };

            await makeRequestWithAuthorization('PUT', `${host}/${habitData?.id}`, { data });

            setHabitIdToBeUpdated(null);
            toast.success('Hábito atualizado!');
            setHabitsHasUpdate(true);
        } catch (error) {
            toast.error('Não foi possível atualizar o hábito');
            console.error(error);
        }
    };

    const findDayOnDayWeekList = (day: PossibleDay): boolean =>
        !!habitData?.dayWeekList.find((number) => number === WeekDayLabelToNumber[day]);

    const weightExperienceFormattingLabels = {
        5: 1,
        10: 2,
        15: 3,
        20: 4,
        25: 5,
    };

    const formInitialValues: Values = {
        name: habitData?.name,
        classification: habitData?.classification,
        category: habitData?.category.id,
        dateCreation: new Date().toISOString(),
        'Segunda-feira': findDayOnDayWeekList('Segunda-feira'),
        'Terça-feira': findDayOnDayWeekList('Terça-feira'),
        'Quarta-feira': findDayOnDayWeekList('Quarta-feira'),
        'Quinta-feira': findDayOnDayWeekList('Quinta-feira'),
        'Sexta-feira': findDayOnDayWeekList('Sexta-feira'),
        Sábado: findDayOnDayWeekList('Sábado'),
        Domingo: findDayOnDayWeekList('Domingo'),
        weightExperience: weightExperienceFormattingLabels[habitData?.weightExperience ?? 15],
    };

    const handleValidationSchema = Yup.object().shape({
        ...habitNameYupValidations,
        classification: Yup.string().required('*Obrigatório'),
        category: Yup.number()
            .required('*Obrigatório*')
            .test('', '*Obrigatório', (value) => value > 0),
    });

    return (
        habitData && (
            <Formik
                initialValues={formInitialValues}
                validationSchema={handleValidationSchema}
                onSubmit={handleFormSubmit}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {({ values, errors, isSubmitting, setFieldValue, handleChange }) => (
                    <Form className="w-full h-full flex justify-center items-center flex-col">
                        <div className="w-full flex justify-center items-center flex-col mb-8">
                            <h3 className="w-full flex justify-center items-center flex-col text-3xl xl:text-4xl font-bold text-primaryDark">
                                Você gostaria de
                            </h3>

                            <span className="text-red-600">
                                <ErrorMessage name="classification" />
                            </span>

                            <RadioGroup
                                row
                                name="classification"
                                value={values.classification}
                                onChange={(event) => {
                                    setFieldValue('classification', event.currentTarget.value);
                                }}
                                className="h-full w-full flex justify-center items-center xl:flex-col"
                            >
                                <ClassificationRadioButton value="bom" label="criar um novo hábito" />
                                <ClassificationRadioButton value="ruim" label="parar com um hábito ruim" />
                            </RadioGroup>
                        </div>

                        <div className="w-full h-full flex justify-center items-center flex-col xl:flex-row gap-10 xl:gap-32">
                            <div className="w-full h-full flex flex-1 flex-col justify-center gap-6 xl:gap-10">
                                <FieldInput
                                    name="name"
                                    type="text"
                                    fieldComponent={HabitNameField}
                                    hasError={!!errors.name}
                                />

                                <div className="w-full flex gap-2 flex-col justify-center items-center">
                                    <div className="flex flex-col justify-center items-center">
                                        <span className="text-red-600">
                                            <ErrorMessage name="category" />
                                        </span>

                                        <h4 className="font-bold text-lg xl:text-xl">Categoria</h4>
                                    </div>
                                    <RadioGroup
                                        row
                                        name="category"
                                        value={values.category}
                                        onChange={(event) => {
                                            setFieldValue('category', event.currentTarget.value);
                                        }}
                                        className="h-full w-full flex flex-wrap justify-center items-center"
                                    >
                                        <CategoryRadioButton value={1} label="Saúde" />
                                        <CategoryRadioButton value={2} label="Educação" />
                                        <CategoryRadioButton value={3} label="Lazer" />
                                        <CategoryRadioButton value={4} label="Outro" />
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="w-full h-full flex flex-1 flex-col justify-center gap-6 xl:gap-10">
                                <div className="w-full flex flex-col gap-2 justify-center items-center">
                                    <div className="flex flex-col justify-center items-center">
                                        <span className="text-red-600">
                                            <ErrorMessage name="weightExperience" />
                                        </span>
                                        <h4 className="font-bold text-lg xl:text-xl">Importância em XP</h4>
                                    </div>

                                    <div className="w-full flex flex-col gap-2 justify-center items-center">
                                        <Rating
                                            name="weightExperience"
                                            precision={1}
                                            value={values.weightExperience}
                                            onChange={handleChange}
                                            sx={isMobile ? { fontSize: '3rem' } : { fontSize: '4rem' }}
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex flex-col gap-2 justify-center items-center">
                                    <div className="flex flex-col">
                                        {weekDaysHasError && <p className="text-red-600">*Obrigatório</p>}
                                        <h4 className="font-bold text-lg xl:text-xl">
                                            Dias da semana que serão feitos
                                        </h4>
                                    </div>

                                    <FormControl>
                                        <div className="flex justify-center items-center flex-wrap">
                                            {weekDaysLabels.map((weekDay) => (
                                                <Checkbox
                                                    key={weekDay}
                                                    name={weekDay}
                                                    onChange={handleChange}
                                                    disabled={values.classification === 'ruim'}
                                                    disableRipple
                                                    checked={values.classification === 'ruim' ? true : values[weekDay]}
                                                    icon={
                                                        <WeekDayCheckBoxBaseButton>
                                                            {weekDay[0]}
                                                        </WeekDayCheckBoxBaseButton>
                                                    }
                                                    checkedIcon={
                                                        values.classification === 'ruim' ? (
                                                            <WeekDayCheckBoxDisabledButton>
                                                                {weekDay[0]}
                                                            </WeekDayCheckBoxDisabledButton>
                                                        ) : (
                                                            <WeekDayCheckBoxCheckedButton>
                                                                {weekDay[0]}
                                                            </WeekDayCheckBoxCheckedButton>
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </FormControl>
                                </div>
                            </div>
                        </div>

                        <div className="w-full mt-8 xl:mt-16 flex xl:gap-10 gap-4 xl:flex-row flex-col">
                            <Button
                                variant="contained"
                                disabled={isSubmitting || JSON.stringify(formInitialValues) === JSON.stringify(values)}
                                sx={{ width: '100%' }}
                                size="large"
                                type="submit"
                            >
                                Atualizar
                            </Button>

                            <Button
                                variant="outlined"
                                color="ruim"
                                disabled={isSubmitting}
                                sx={{ width: '100%' }}
                                size="large"
                                onClick={() => setHabitIdToBeUpdated(null)}
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
