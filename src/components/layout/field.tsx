import { ReactElement } from 'react';
import { Field, ErrorMessage } from 'formik';

interface FieldComponentProps {
    name: string;
    value: string;
    type: string;
    error: boolean;
}

interface FieldInputProps {
    fieldComponent: (props: FieldComponentProps) => ReactElement;
    name: string;
    type: string;
    hasError: boolean;
}

export default function FieldInput({ fieldComponent, name, type, hasError }: Readonly<FieldInputProps>) {
    return (
        <div className="w-full flex flex-col">
            <Field as={fieldComponent} name={name} type={type} error={hasError} />
            <span className="text-red-600">
                <ErrorMessage name={name} />
            </span>
        </div>
    );
}
