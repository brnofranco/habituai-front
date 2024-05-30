import { ReactElement, createContext, useMemo, useState } from 'react';

export const UserContext = createContext({
    userHasUpdate: false,
    setUserHasUpdate: (() => false) as React.Dispatch<React.SetStateAction<boolean>>,
});

function UserProvider({ children }: Readonly<{ children: ReactElement }>) {
    const [userHasUpdate, setUserHasUpdate] = useState(false);

    return useMemo(() => {
        return <UserContext.Provider value={{ userHasUpdate, setUserHasUpdate }}>{children}</UserContext.Provider>;
    }, [userHasUpdate, setUserHasUpdate]);
}

export default UserProvider;
