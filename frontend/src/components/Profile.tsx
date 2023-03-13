import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export function Profile() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (<div className="below-navbar">Loading ...</div>);
    }

    return (
        isAuthenticated && (
            <div className="below-navbar">
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        )
    );
};
