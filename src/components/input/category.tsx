import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoreIcon from '@mui/icons-material/More';
import WeekendIcon from '@mui/icons-material/Weekend';
import { Radio } from '@mui/material';
import { ReactElement } from 'react';
import { isMobile } from 'react-device-detect';

interface BaseButtonProps extends CategoryRadioButtonProps {
    styles: StyleOptions;
    icons: IconOptions;
}

interface StyleOptions {
    1: string;
    2: string;
    3: string;
    4: string;
    default?: string;
}

interface IconOptions {
    1: ReactElement;
    2: ReactElement;
    3: ReactElement;
    4: ReactElement;
}

interface CategoryRadioButtonProps {
    value: 1 | 2 | 3 | 4;
    label: string;
}

const BaseButton = ({ styles, icons, value, label }: BaseButtonProps) => {
    const baseStyle =
        'xl:w-[160px] w-[120px] h-full p-1 xl:p-2 rounded-lg flex justify-center items-center flex-col border-2 text-md xl:text-lg';

    return (
        <button className={`${baseStyle} ${styles.default} ${styles[value]}`}>
            {icons[value]}
            {label}
        </button>
    );
};

export const CategoryRadioButton = ({ value, label }: CategoryRadioButtonProps) => {
    const iconHeight = isMobile ? { fontSize: '1.5rem' } : { fontSize: '3rem' };

    const uncheckedStyles: StyleOptions = {
        1: 'border-secondaryDark',
        2: 'border-purple-900',
        3: 'border-blue-900',
        4: 'border-gray-900',
        default: 'bg-white text-black',
    };

    const uncheckedIcons: IconOptions = {
        1: <HealthAndSafetyIcon color="saude" sx={iconHeight} />,
        2: <MenuBookIcon color="educacao" sx={iconHeight} />,
        3: <WeekendIcon color="lazer" sx={iconHeight} />,
        4: <MoreIcon color="outro" sx={iconHeight} />,
    };

    const checkedStyles: StyleOptions = {
        1: 'bg-secondaryDark border-secondaryDark',
        2: 'bg-purple-900 border-purple-900',
        3: 'bg-blue-900 border-blue-900',
        4: 'bg-gray-900 border-gray-900',
        default: 'font-bold text-white',
    };

    const checkedIcons = {
        1: <HealthAndSafetyIcon color="white" sx={iconHeight} />,
        2: <MenuBookIcon color="white" sx={iconHeight} />,
        3: <WeekendIcon color="white" sx={iconHeight} />,
        4: <MoreIcon color="white" sx={iconHeight} />,
    };

    return (
        <Radio
            disableRipple
            value={value}
            icon={<BaseButton value={value} label={label} styles={uncheckedStyles} icons={uncheckedIcons} />}
            checkedIcon={<BaseButton value={value} label={label} styles={checkedStyles} icons={checkedIcons} />}
        />
    );
};
