import Cookies from 'js-cookie';
import { ReactElement, createContext, useMemo, useState } from 'react';

export const AuthContext = createContext({
    auth: false,
    setAuth: (() => false) as React.Dispatch<React.SetStateAction<boolean>>,
});

function AuthProvider({ children }: Readonly<{ children: ReactElement }>) {
    const token = Cookies.get('token');

    const [auth, setAuth] = useState(!!token);

    return useMemo(() => {
        return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
    }, [auth, setAuth]);
}

export default AuthProvider;
