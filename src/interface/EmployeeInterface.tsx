export interface IPropsEmployeeProps { }

export interface IPropsEmployeeDetails {
    [key: string]: string | number | undefined,
    id?:string,
    firstname: string,
    lastname: string,
    email: string,
    gender: string,
    age: number,
    city: string,
    salary: number
}

export interface IPropsEmployeeState {
    data: any | null,
    loading: boolean,
    error: string | null,
    filterValue:string,
    searchValue:string,
    updateTrack?:boolean,
    selectedFormat?:string,
    employeeDetails: IPropsEmployeeDetails
}

export interface IPropsTableHead {
    label: string,
    key: string
}