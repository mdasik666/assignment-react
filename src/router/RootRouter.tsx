import { BrowserRouter, Route, Routes } from "react-router-dom";
import EmployeeRouter from "./Employee/EmployeeRouter";
import Employee from "pages/Employee/Employee";

const RootRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Employee/>}/>
                <Route path="/employee/*" element={<EmployeeRouter/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RootRouter