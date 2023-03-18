import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./App.css"
import {StorageProvider} from "./services/StorageService"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <StorageProvider>
            <App />
        </StorageProvider>
    </React.StrictMode>
)
