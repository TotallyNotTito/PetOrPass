import {Link} from "react-router-dom";
export function NavBar() {
    return (
        <div>
            <Link to="/">Rate Pets</Link>
            <Link to="/submit-pet">Submit Pet</Link>
            <Link to="/view-pets">View Pets</Link>
            <Link to="/logout">Logout</Link>
        </div>
    );
}