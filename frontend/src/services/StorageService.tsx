import {createContext, useContext, useState} from "react";
import {LocalStorageCache} from "@auth0/auth0-react";

export const StorageProvider = ({children}) => {

    const [localStorageCache, setLocalStorageCache] = useState(new LocalStorageCache());

    const useStorageContextPackage = {
        localStorageCache
    };

    return (
        <StorageContext.Provider value={useStorageContextPackage}>
            {children}
        </StorageContext.Provider>
    );
}

const StorageContext = createContext(null);

export const useStorage = () => {
    return useContext(StorageContext);
}
