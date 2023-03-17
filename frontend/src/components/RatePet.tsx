import {useEffect, useState} from "react";
import React from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {ErrorMessage} from "./ErrorMessage";
import {useStorage} from "../services/StorageService";

export function RatePet() {
    const {localStorageCache} = useStorage();
    const {logout, isLoading, isAuthenticated} = useAuth0();
    let [retrieveNextPet, setRetrieveNextPet] = useState(false);
    let [emptyPets, setEmptyPets] = useState(false);
    let [petToRate, setPetToRate] = useState({});
    let [nextPet, setNextPet] = useState(false);
    let [disableRatingButtons, setDisableRatingButtons] = useState(false);
    let [disableNextButton, setDisableNextButton] = useState(false);

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

                setPetToRate(pet);
                setEmptyPets(false);
                setNextPet(false);
                setDisableRatingButtons(false);
                setDisableNextButton(false);
            }

            getPet();
        } else {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    }, [retrieveNextPet])

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
                        {Object.keys(petToRate).length === 0 ?
                            <></>
                            :
                            <RatePetView
                                petName={petToRate.petName}
                                imageUrl={petToRate.imageUrl}
                                setNextPet={setNextPet}
                                setRetrieveNextPet={setRetrieveNextPet}
                                retrieveNextPet={retrieveNextPet}
                                nextPet={nextPet}
                                setDisableRatingButtons={setDisableRatingButtons}
                                disableRatingButtons={disableRatingButtons}
                                setDisableNextButton={setDisableNextButton}
                                disableNextButton={disableNextButton}
                            />
                        }
                    </main>
            }
        </>
    );
}

export type RatePetProps = {
    petName: string,
    imageUrl: string,
    setNextPet: () => void,
    setRetrieveNextPet: () => void,
    retrieveNextPet: boolean,
    nextPet: boolean,
    setDisableRatingButtons: () => void,
    disableRatingButtons: boolean,
    setDisableNextButton: () => void,
    disableNextButton: boolean
}

function RatePetView(props: RatePetProps) {
    let {
        petName,
        imageUrl,
        setRetrieveNextPet,
        setNextPet,
        retrieveNextPet,
        nextPet,
        setDisableRatingButtons,
        disableRatingButtons,
        setDisableNextButton,
        disableNextButton
    } = props;

    return (
        <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-12 text-center ">
                <img src={imageUrl} alt="Image of a pet to rate" className="img-fluid"/>
            </div>
            <div className="row text-center mt-4">
                <legend>{petName}</legend>
            </div>
            <>
                {
                    nextPet ?
                        <DisplayPetRating
                            setRetrieveNextPet={setRetrieveNextPet}
                            retrieveNextPet={retrieveNextPet}
                            setDisableNextButton={setDisableNextButton}
                            disableNextButton={disableNextButton}
                        />
                        :
                        <RatePetButtons
                            setNextPet={setNextPet}
                            setDisableRatingButtons={setDisableRatingButtons}
                            disableRatingButtons={disableRatingButtons}
                        />
                }
            </>
        </div>
    );
}

export type RatePetButtonsProps = {
    setNextPet: () => void,
    setDisableRatingButtons: () => void,
    disableRatingButtons: boolean
}

function RatePetButtons(props: RatePetButtonsProps) {
    let {
        setNextPet,
        setDisableRatingButtons,
        disableRatingButtons,
    } = props;

    const onClickRatingButton = async(event: any, rating: number) => {
        setDisableRatingButtons(true);
    //     TODO: make api call to update score using number param
        console.log(`RATING: ${rating}`)
        setNextPet(true);
    }

    return (
        <div className="row mt-4 mb-5 justify-content-center">
            <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                <button
                    className="btn btn-lg button-color w-100"
                    type="submit"
                    onClick={e => onClickRatingButton(e, 10)}
                    disabled={disableRatingButtons}
                >
                    Pet
                </button>
            </div>
            <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                <button className="btn btn-lg button-color w-100"
                        type="submit"
                        onClick={e => onClickRatingButton(e, 0)}
                        disabled={disableRatingButtons}
                >
                    Pass
                </button>
            </div>
        </div>
    );
}

export type DisplayPetRatingProps = {
    setRetrieveNextPet: () => void,
    retrieveNextPet: boolean,
    setDisableNextButton: () => void,
    disableNextButton: boolean
}

function DisplayPetRating(props: DisplayPetRatingProps) {
    let {
        setRetrieveNextPet,
        retrieveNextPet,
        setDisableNextButton,
        disableNextButton
    } = props;

    const onClickNextButton = (event:any) => {
        setDisableNextButton(true);
        setRetrieveNextPet(!retrieveNextPet);
    }

    // TODO: replace PLACEHOLDER with new rating
    return (
        <>
            <div className="row text-center">
                <legend>Average Rating: PLACEHOLDER</legend>
            </div>
            <div className="row mt-4 mb-5 justify-content-center">
                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                    <button
                        className="btn btn-lg button-color w-100"
                        type="submit"
                        onClick={onClickNextButton}
                        disabled={disableNextButton}
                    >
                        Next!
                    </button>
                </div>
            </div>
        </>
    );
}
