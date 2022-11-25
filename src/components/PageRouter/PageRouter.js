// import react router dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App/App.js';
import Register from '../Register/Register';

function PageRouter() {

  return (
    <div className="App" id="outer-container">
        <Router>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/register" element={<Register />} />
                <Route path="/*"element={<App />} />
            </Routes>
        </Router>
        

    </div>
    );
}

export default PageRouter;
