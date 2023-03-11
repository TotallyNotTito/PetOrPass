import {useState} from 'react';

export function SubmitPetForm() {

    let [petName, setPetName] = useState('');

    const onSubmitPet = (event) => {
        event.preventDefault();
        console.log(petName);
    }

    return (
        <form className="container below-navbar">
            <div className="row text-center">
                <h1>Submit Your Pet!</h1>
            </div>
            <div className="row text-center">
                <legend>Submit an image of your pet to be rated by other users</legend>
            </div>
            <div className="row mt-3 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <label className="form-label" htmlFor="petNameInput">Pet Name</label>
                    <input className="form-control" 
                           onChange={pn => setPetName(pn.target.value)} 
                           value={petName} type="text" 
                           id="petNameInput" 
                           name="petNameInput"
                    />
                </div>
            </div>
            <div className="row mt-3 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <label className="form-label" htmlFor="petImageInput">Upload Pet Image</label>
                    <input className="form-control" type="file" id="petImageInput" name="petImageInput" accept="image/*"/>
                </div>
            </div>
            <div className="row mt-5 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <button className="btn btn-lg button-color w-100" onClick={onSubmitPet} type="submit">Submit!</button>
                </div>
            </div>
        </form>
    );
}
