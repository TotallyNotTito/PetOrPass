import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export function Logout() {
    const { logout } = useAuth0();

    return (
        <button className="below-navbar" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
        </button>
    );
};
