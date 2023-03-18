import {NavMain} from "./components/NavMain";
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider} from "@auth0/auth0-react";
import {useStorage} from "./services/StorageService"

function App() {
    const {localStorageCache} = useStorage();

    return (
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: `http://${import.meta.env.VITE_IP_ADDR}:${import.meta.env.VITE_PORT}`
            }}
            cache={localStorageCache}
        >
            <BrowserRouter>
                <NavMain/>
            </BrowserRouter>
        </Auth0Provider>
    )
}

export default App
