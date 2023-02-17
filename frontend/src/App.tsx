import './App.css'
import { Link, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Converter from './components/Converter';

function App() {
    return (
        <div className="App">
            <nav>
                <div className="menu">
                    <Link to="/">Home</Link>
                    <Link to="/converter">Converter</Link>
                </div>
            </nav>
            <Routes>
                <Route path="/converter" element={<Converter />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    )
}

export default App
