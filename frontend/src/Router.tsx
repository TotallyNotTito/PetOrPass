import {Route, Routes} from "react-router-dom";
import {Logout} from "./components/Logout";
import {NavBar} from "./components/NavBar";
import {RatePet} from "./components/RatePet";
import {SubmitPetForm} from "./components/SubmitPetForm";
import {PetGallery} from "./components/PetGallery";

export function PetOrPassRoutes() {
    return (
        <div>
            <NavBar/>
            <Routes>
                <Route path="/" element={<RatePet/>}/>
                <Route path="/submit-pet" element={<SubmitPetForm/>}/>
                <Route path="/view-pets" element={<PetGallery/>}/>
                <Route path="/logout" element={<Logout/>}/>
            </Routes>
        </div>
    );
}