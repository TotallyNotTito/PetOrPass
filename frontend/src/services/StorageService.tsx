import {createContext, useContext, useState} from "react";
import {LocalStorageCache} from "@auth0/auth0-react";

export const StorageProvider = ({children}) => {

    const [localStorageCache, setLocalStorageCache] = useState(new LocalStorageCache());
    
//     TODO: need getter and setter for token in storage
//     TODO: need to set up with httpservice to have correct token

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
