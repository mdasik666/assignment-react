import { IPropsEmployeeDetails } from "interface/EmployeeInterface"
import axiosInstance from "./AxiosInstance"

const apiEmp = "/api/employee"

export const getEmployee = () => {
    return axiosInstance.get(`${apiEmp}/fetchemployees`)
}

export const addEmployee = (data:IPropsEmployeeDetails) => {
    return axiosInstance.post(`${apiEmp}/addemployee`,data)
}

export const updateEmployee = (data:IPropsEmployeeDetails) => {
    return axiosInstance.put(`${apiEmp}/updateemployee`,data)
}

export const deleteEmployee = (id:string) => {
    return axiosInstance.delete(`${apiEmp}/deleteemployee/${id}`)
}