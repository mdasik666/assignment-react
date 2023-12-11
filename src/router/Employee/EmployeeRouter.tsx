import { BrowserRouter, Route, Routes } from "react-router-dom";
import Employee from "pages/Employee/Employee";

const EmployeeRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Employee/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default EmployeeRouter