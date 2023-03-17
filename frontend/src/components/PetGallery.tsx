import {useStorage} from "../services/StorageService";
import {useEffect, useState} from "react";
import React from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {ErrorMessage} from "./ErrorMessage";

export function PetGallery() {
    const {localStorageCache} = useStorage();
    const {logout, isLoading, isAuthenticated, user} = useAuth0();
    let [emptyGallery, setEmptyGallery] = useState(false);
    let [petList, setPetList] = useState([]);

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
                let pets = [];
                result.data.forEach((item) => {
                    pets.push({
                        petId: item.pet_id,
                        petName: item.pet_name,
                        imageUrl: item.image_name,
                        avgScore: item.total_votes === 0 ? 0 : (item.total_score / item.total_votes).toFixed(2)
                    });
                });

                setPetList(pets);
                setEmptyGallery(false);
            }

            getPets();
        } else {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    });

    return (
        <>
            {
                emptyGallery ?
                    <ErrorMessage errorMessage="uh-oh! Looks like you have not submitted any pets yet for rating! You can submit your first pet by visiting the Submit Pet tab." />
                    :
                    <main className="container below-navbar">
                        <div className="row text-center">
                            <h1>Pet Gallery</h1>
                        </div>
                        <div className="row text-center mb-5">
                            <legend>View all of the pets you submitted that were rated by other users</legend>
                        </div>
                        <div className="row align-items-center justify-content-center">
                            {petList.map((pet) => <PetProfile key={pet.petId} petName={pet.petName} avgScore={pet.avgScore} imageUrl={pet.imageUrl} />)}
                        </div>
                    </main>
            }
        </>
    );
}

export type PetProfileProps = {
    petName: string,
    avgScore: number,
    imageUrl: string
}

function PetProfile(props: PetProfileProps) {
    let {petName, avgScore, imageUrl} = props;

    return (
        <div className="col">
            <div className="card card-width mb-5 mx-auto">
                <img src={imageUrl}
                     className="card-img-top"
                     alt={`Photo of ${petName}`}
                />
                <div className="card-body">
                    <h5 className="card-title">{petName}</h5>
                    <p className="card-text">Pet or Pass Score: {avgScore}</p>
                </div>
            </div>
        </div>
    );
}


