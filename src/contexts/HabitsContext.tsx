import { ReactElement, createContext, useMemo, useState } from 'react';

export const HabitsContext = createContext({
    habitsHasUpdate: false,
    setHabitsHasUpdate: (() => false) as React.Dispatch<React.SetStateAction<boolean>>,
});

function HabitsProvider({ children }: Readonly<{ children: ReactElement }>) {
    const [habitsHasUpdate, setHabitsHasUpdate] = useState(false);

    return useMemo(() => {
        return (
            <HabitsContext.Provider value={{ habitsHasUpdate, setHabitsHasUpdate }}>{children}</HabitsContext.Provider>
        );
    }, [habitsHasUpdate, setHabitsHasUpdate]);
}

export default HabitsProvider;
