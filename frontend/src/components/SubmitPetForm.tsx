import {useState, useRef} from 'react';
import axios from 'axios';

export function SubmitPetForm() {

    let [petName, setPetName] = useState('');
    let [petImage, setPetImage] = useState(null);
    let [submitSuccess, setSubmitSuccess] = useState(false);
    const imageInputField = useRef(null);

    const onSubmitPet = (event) => {
        event.preventDefault();
        const uri = `http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/pet`
        console.log(`URI: ${uri}`)
        axios.postForm(uri,{
            petName: petName,
            submittedBy: 'test@test.test',
            petImageFile: petImage
        });

        setSubmitSuccess(true);
        setPetName('');
        setPetImage(null);
        imageInputField.current.value = '';
    }

    return (
        <form className="container below-navbar">
            <div className="row text-center">
                <h1>Submit Your Pet!</h1>
            </div>
            <div className="row text-center">
                <legend>Submit an image of your pet to be rated by other users</legend>
            </div>
            {submitSuccess ? <SubmitSuccessMessage/> : null}
            <div className="row mt-3 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <label className="form-label" htmlFor="petNameInput">Pet Name</label>
                    <input className="form-control" 
                           onChange={pn => setPetName(pn.target.value)} 
                           value={petName}
                           type="text"
                           id="petNameInput" 
                           name="petNameInput"
                    />
                </div>
            </div>
            <div className="row mt-3 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <label className="form-label" htmlFor="petImageInput">Upload Pet Image</label>
                    <input className="form-control" 
                           type="file" 
                           id="petImageInput" 
                           name="petImageInput" 
                           accept="image/*"
                           ref={imageInputField}
                           onChange={pi => setPetImage(pi.target.files[0])}
                    />
                </div>
            </div>
            <div className="row mt-5 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <button className="btn btn-lg button-color w-100"
                            onClick={onSubmitPet}
                            type="submit">Submit!</button>
                </div>
            </div>
        </form>
    );
}

function SubmitSuccessMessage() {
    return (
      <div className="row text-center mt-3 success-text">
          <p><strong>Success! Thanks for submitting your pet &#60;3</strong></p>
      </div>
    );
}
