// import react router dom
import { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import App from '../App/App.js';
import Register from '../Register/Register';
import Unsubscribe from '../Unsubscribe/Unsubscribe';

function PageRouter() {

  return (
    <div className="App" id="outer-container">
        <Router>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/register" element={<Register />} />
                <Route path="/unsubscribe" element={<Unsubscribe />}/>
                <Route path="/*"element={<App />} />
            </Routes>
        </Router>
    </div>
    );
}

export function useQuery() {
	const { search } = useLocation();

	return useMemo(() => new URLSearchParams(search), [search]);
}

export default PageRouter;
