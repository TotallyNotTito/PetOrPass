import {Link, Route, Routes} from "react-router-dom";
import {Logout} from "./Logout";
import {RatePet} from "./RatePet";
import {SubmitPetForm} from "./SubmitPetForm";
import {PetGallery} from "./PetGallery";
import {Login} from "./Login";
import {Profile} from "./Profile";

export function NavMain() {
    return (
        <>
            <NavBar/>
            <NavRoutes/>
        </>
    );
}

function NavBar() {
    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top mb-5 primary-color">
            <div className="container-fluid">
                <div className="navbar-brand">Pet or Pass</div>
                <button className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                        aria-controls="navbarCollapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <NavLinks/>
                </div>
            </div>
        </nav>
    );
}

function NavLinks() {
    return (
        <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
                <Link to="/" className="nav-link active">Rate Pets</Link>
            </li>
            <li className="nav-item">
                <Link to="/submit-pet" className="nav-link active">Submit Pet</Link>
            </li>
            <li className="nav-item">
                <Link to="/view-pets" className="nav-link active">View Pets</Link>
            </li>
            <li className="nav-item">
                <Link to="/logout" className="nav-link active">Logout</Link>
            </li>
        </ul>
    );
}

function NavRoutes() {
    return (
        <Routes>
            <Route path="/" element={<RatePet/>}/>
            <Route path="/submit-pet" element={<SubmitPetForm/>}/>
            <Route path="/view-pets" element={<PetGallery/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/profile" element={<Profile/>}/>
        </Routes>
    );
}
