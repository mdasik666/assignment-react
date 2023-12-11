import axiosInstance from "./AxiosInstance"

const api = "/api/employee"
export const getEmployee = () => {
    return axiosInstance.get(`${api}/fetchemployees`)
}