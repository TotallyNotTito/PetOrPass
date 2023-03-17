import {useEffect, useState} from "react";
import React from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {ErrorMessage} from "./ErrorMessage";
import {useStorage} from "../services/StorageService";

export function RatePet() {
    const {localStorageCache} = useStorage();
    const {logout, isLoading, isAuthenticated} = useAuth0();
    let [nextPet, setNextPet] = useState(false);
    let [emptyPets, setEmptyPets] = useState(false);
    let [petToRate, setPetToRate] = useState({});

    useEffect(() => {
        // Before verifying if user is authenticated, must check if SDK is still loading
        while (isLoading) {}

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

        // If user is authenticated, we can call protected backend route to retrieve a pet to rate
        // If user is not authenticated, log out and redirect to login page
        if (isAuthenticated) {
            const getPet = async () => {
                let result;
                try {
                    result = await axios.get(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/pet`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });
                } catch (err) {
                    // Upon encountering an unidentified server error, the user will be logged out and returned to login page
                    if (err.response) {
                        // If no pets have been submitted by any users, then the page will display an empty state
                        if (err.response.status === 404 &&
                            err.response.data.hasOwnProperty('error') &&
                            err.response.data.error === "No pets have been added to the Pets table"
                        ){
                            setEmptyPets(true);
                        } else {
                            logout({ logoutParams: { returnTo: window.location.origin } });
                        }
                    } else {
                        logout({ logoutParams: { returnTo: window.location.origin } });
                    }

                    return;
                }

                // Upon successful reply from server, display pet to the user for rating
                const pet = {
                    petId: result.data.pet_id,
                    petName: result.data.pet_name,
                    imageUrl: result.data.image_name
                };

                console.log(pet)

                setPetToRate(pet);
                setEmptyPets(false);
            }

            getPet();
        } else {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    }, [nextPet])

    return (
        <>
            {
                emptyPets ?
                    <ErrorMessage errorMessage="uh-oh! Looks like no one has submitted any pets yet for rating! You can be the first by visiting the Submit Pet tab." />
                    :
                    <main className="container below-navbar">
                        <div className="row text-center">
                            <h1>Rate This Pet!</h1>
                        </div>
                        <div className="row text-center mb-4">
                            <legend>Would you pet it or will you take a pass?</legend>
                        </div>
                        {Object.keys(petToRate).length === 0 ? <></> : <RatePetView petName={petToRate.petName} imageUrl={petToRate.imageUrl} />}
                    </main>
            }
        </>
    );
}

export type RatePetProps = {
    petName: string,
    imageUrl: string
}

function RatePetView(props: RatePetProps) {
    let {petName, imageUrl} = props;

    return (
        <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-12 text-center ">
                <img src={imageUrl} alt="Image of a pet to rate" className="img-fluid"/>
            </div>
            <div className="row text-center mt-4">
                <legend>{petName}</legend>
            </div>
        </div>
    );
}


