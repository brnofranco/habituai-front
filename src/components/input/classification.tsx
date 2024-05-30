import { Radio } from '@mui/material';

interface BaseButtonProps extends ClassificationRadioButtonProps {
    styles: StyleOptions;
}

interface ClassificationRadioButtonProps {
    value: 'bom' | 'ruim';
    label: string;
}

interface StyleOptions {
    bom: string;
    ruim: string;
    default: string;
}

const BaseButton = ({ label, value, styles }: BaseButtonProps) => {
    const baseStyle = 'w-full p-2 xl:h-12 rounded-lg text-md xl:text-xl border-2';

    return <button className={`${baseStyle} ${styles.default} ${styles[value]}`}>{label}</button>;
};

export const ClassificationRadioButton = ({ value, label }: ClassificationRadioButtonProps) => {
    const checkedStyles: StyleOptions = {
        bom: 'bg-primaryDark border-primaryDark',
        ruim: 'bg-red-800 border-red-800',
        default: 'font-bold text-white',
    };

    const uncheckedStyles: StyleOptions = {
        bom: 'border-primaryDark text-primaryDark',
        ruim: 'border-red-800 text-red-800',
        default: 'bg-white',
    };

    return (
        <Radio
            disableRipple
            value={value}
            icon={<BaseButton label={label} value={value} styles={uncheckedStyles} />}
            checkedIcon={<BaseButton label={label} value={value} styles={checkedStyles} />}
        />
    );
};
