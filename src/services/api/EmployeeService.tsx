import axiosInstance from "./AxiosInstance"

const apiEmp = "/api/employee"
export const getEmployee = () => {
    return axiosInstance.get(`${apiEmp}/fetchemployees`)
}