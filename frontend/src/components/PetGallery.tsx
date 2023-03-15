import {useStorage} from "../services/StorageService";
import {useEffect, useState} from "react";
import React from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {ErrorMessage} from "./ErrorMessage";

export function PetGallery() {
    const {localStorageCache} = useStorage();
    const {logout, isLoading, isAuthenticated, user} = useAuth0();
    const [emptyGallery, setEmptyGallery] = useState(false);
    const [petList, setPetList] = useState([]);

    useEffect(() => {
        // Verify that local storage contains token keys,
        // and if not, log out and redirect to login page
        const storageKeys = localStorageCache.allKeys();
        if (storageKeys.length === 0) {
            logout({ logoutParams: { returnTo: window.location.origin } });
            return;
        }

        // Verify that correct key for accessing jwt exists in local storage
        // and if not, log out and redirect to login page
        let foundKey = false;
        storageKeys.forEach((key)=>{
            if (key.includes("@@user@@")) {
                foundKey = key;
            }
        })

        let token;
        if (foundKey === false) {
            logout({ logoutParams: { returnTo: window.location.origin } });
            return;
        } else {
            token = localStorageCache.get(foundKey).id_token;
        }

        // Before verifying if user is authenticated, must check if SDK is still loading
        // If still loading, exit useEffect, then wait for isLoading state to change and trigger another call to useEffect
        if (isLoading) {
            return;
        }

        // If user is authenticated, we can call protected backend route to retrieve list of pets
        // If user is not authenticated, log out and redirect to login page
        if (isAuthenticated) {
            const getPets = async () => {
                let result;
                try {
                    result = await axios.get(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/pets/${user.email}`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });
                } catch (err) {
                    // Upon encountering an unidentified server error, the user will be logged out and returned to login page
                    if (err.response) {
                        // If user has not yet submitted any pets, then their gallery will display an empty state
                        if (err.response.status === 404 &&
                            Array.isArray(err.response.data) &&
                            err.response.data[0].hasOwnProperty('error') &&
                            err.response.data[0].error === "No pets have been added to the Pets table by this user"
                        ){
                            setEmptyGallery(true);
                        } else {
                            logout({ logoutParams: { returnTo: window.location.origin } });
                        }
                    } else {
                        logout({ logoutParams: { returnTo: window.location.origin } });
                    }

                    return;
                }

                // Upon successful reply from server, display list of pets submitted by user
                // TODO: create type for list of props being created here - and for being used below in return fxn
                let pets = [];
                result.data.forEach((item) => {
                    pets.push({
                        petId: item.id,
                        petName: item.pet_name,
                        imageUrl: item.image_name,
                        avgScore: (item.total_score / item.total_votes).toFixed(2)
                    });
                });
                setPetList(pets);
                setEmptyGallery(false);
            }

            getPets();
        } else {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    }, [isLoading]);

    return (
        <>
            {
                emptyGallery ?
                    <ErrorMessage errorMessage="uh-oh! Looks like you have not submitted any pets yet for rating! You can submit your first pet by visiting the Submit Pet tab." />
                    : <ul className="below-navbar">{petList.map((pet) => <li key={pet.petId}>{pet.petName} - {pet.avgScore} - {pet.imageUrl}</li>)}</ul>
            }
        </>
    );
}
