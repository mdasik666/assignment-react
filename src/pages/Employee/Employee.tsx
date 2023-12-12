import { AxiosError } from 'axios';
import Header from 'component/Header';
import { IPropsEmployeeDetails, IPropsEmployeeProps, IPropsEmployeeState, IPropsTableHead } from 'interface/EmployeeInterface';
import { ChangeEvent, Component } from 'react'
import { toast } from 'react-toastify';
import { addEmployee, deleteEmployee, getEmployee, updateEmployee } from 'services/api/EmployeeService';
import * as XLSX from 'xlsx';

class Employee extends Component<IPropsEmployeeProps, IPropsEmployeeState> {
    tableHead: Array<IPropsTableHead>;
    constructor(props: any) {
        super(props);
        this.state = {
            data: null,
            loading: false,
            error: null,
            filterValue: "",
            searchValue: "",
            selectedFormat: "csv",
            employeeDetails: {
                firstname: "",
                lastname: "",
                email: "",
                gender: "",
                age: 0,
                city: "",
                salary: 0
            }
        }
        this.tableHead = [
            { label: "First Name", key: `firstname` },
            { label: "Last Name", key: `lastname` },
            { label: "Email", key: `email` },
            { label: "Gender", key: `gender` },
            { label: "Age", key: `age` },
            { label: "City", key: `city` },
            { label: "Salary", key: `salary` },
        ]
    }

    componentDidMount(): void {
        this.fetch()
    }

    fetch = async () => {
        this.setState({ loading: true })
        try {
            const res = await getEmployee()
            if (res.data.status === "Success") {
                this.setState({ data: res.data.empData, loading: false, error: null })
            } else {
                this.setState({ data: null, loading: false, error: res.data.message })
            }
        } catch (error: unknown) {
            toastError((error as AxiosError).message)
        }
    }

    setFieldValues = (val: string, type: string) => {
        this.tableHead.map((th: IPropsTableHead) => {
            if (th.key === type) {
                this.setState({ employeeDetails: { ...this.state.employeeDetails, [th.key]: val } });
            }
        });
    };

    addEmployee = async () => {
        try {
            const res = await addEmployee(this.state.employeeDetails)
            if (res.data.status === "Success") {
                toastSuccess(res.data.message)
                this.clear()
                this.setState({ data: res.data.empData })
            } else {
                toastError(res.data.message)
            }
        } catch (error: unknown) {
            toastError((error as AxiosError).message)
        }
    }

    clear = () => {
        this.setState({
            updateTrack: false,
            employeeDetails: {
                firstname: "",
                lastname: "",
                email: "",
                gender: "",
                age: 0,
                city: "",
                salary: 0
            }
        })
    }

    removeEmployee = async (id: string) => {
        const ok = confirm("Are you sure you want to delete this employee data?")
        if (ok) {
            try {
                const res = await deleteEmployee(id)
                if (res.data.status === "Success") {
                    toastSuccess(res.data.message)
                    this.setState({ data: res.data.empData })
                } else {
                    toastError(res.data.message)
                }
            } catch (error: unknown) {
                toastError((error as AxiosError).message)
            }
        }
    }

    updateEmployee = async (id: string) => {
        const data: IPropsEmployeeDetails = JSON.parse(JSON.stringify(this.state.data)).filter((ed: IPropsEmployeeDetails) => ed.id === id)[0]
        this.setState({
            updateTrack: true,
            employeeDetails: {
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                gender: data.gender,
                age: data.age,
                city: data.city,
                salary: data.salary
            }
        })
    }

    confirmUpdateEmployee = async () => {
        try {
            const res = await updateEmployee(this.state.employeeDetails)
            if (res.data.status === "Success") {
                toastSuccess(res.data.message)
                this.clear()
                this.setState({ data: res.data.empData })
            } else {
                toastError(res.data.message)
            }
        } catch (error: unknown) {
            toastError((error as AxiosError).message)
        }
    }

    filterValue = (val: string) => {
        if (!val) {
            this.setState({ searchValue: "" })
        }
        this.setState({ filterValue: val })
    }

    filterEmployee = () => {
        this.setState({ searchValue: this.state.filterValue })
    }

    handleFormatChange = (val: string) => {
        this.setState({ selectedFormat: val });
    };

    fileHeaderAndData = () => {
        const headers = this.tableHead.map(item => item.label);
        type FilteredData = Omit<IPropsEmployeeDetails, 'id' | 'createdAt' | 'updatedAt'>;
        const filteredData: FilteredData[] = this.state.data.map((item: IPropsEmployeeDetails) => {
            const { id, createdAt, updatedAt, ...rest } = item;
            return rest;
        });
        return { headers, filteredData }
    }

    downloadXlsx = () => {
        const { headers, filteredData } = this.fileHeaderAndData()
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(ws, [headers])
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const buffer = XLSX.write(wb, { type: 'buffer' });
        XLSX.writeFile(wb, 'employeedata.xlsx');
    }

    downloadCsv = () => {
        const { headers, filteredData } = this.fileHeaderAndData()
        const ws = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.sheet_add_aoa(ws, [headers])
        const csv = XLSX.utils.sheet_to_csv(ws);
        const csvFile = new File([csv], 'employeedata.csv');
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(csvFile);
        link.download = 'employeedata.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render() {
        type FilteredData = Pick<IPropsEmployeeDetails, 'firstname' | 'email' | 'gender' | 'age'>;
        const data: FilteredData = {
            firstname: this.state.employeeDetails.firstname,
            email: this.state.employeeDetails.email,
            gender: this.state.employeeDetails.gender,
            age: this.state.employeeDetails.age,
        };
        const isValid = !Boolean(Object.values(data).filter((empObj) => empObj === "" || empObj === 0).length)
        return (
            <div>
                <Header />
                <div className='container-lg mt-2'>
                    <div className='row my-2'>
                        <div className='col-6 d-flex flex-row'>
                            <input value={this.state.filterValue} type="text" className='form-control' placeholder='Search...' onChange={(e: ChangeEvent<HTMLInputElement>) => this.filterValue(e.target.value)} />
                            <button className='btn btn-primary' onClick={this.filterEmployee}>Search</button>
                        </div>
                        <div className='col-6 text-end d-flex align-items-center justify-content-end'>
                            <select value={this.state.selectedFormat} className='form-select' onChange={(e: ChangeEvent<HTMLSelectElement>) => this.handleFormatChange(e.target.value)}>
                                <option value="csv">CSV</option>
                                <option value="xlsx">XLSX</option>
                            </select>
                            <button className='btn btn-success' onClick={this.state.selectedFormat === "csv" ? this.downloadCsv : this.downloadXlsx}>{this.state.selectedFormat === "csv" ? "CSV" : "XLSX"}</button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='table-responsive' style={{ height: "300px" }}>
                                <table className='table table-hover table-sm table-bordered'>
                                    <thead className='table-dark sticky-top'>
                                        <tr className='text-center'>
                                            <th>S.No</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>Gender</th>
                                            <th>Age</th>
                                            <th>City</th>
                                            <th>Salary</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.loading ?
                                                <tr>
                                                    <td className='align-middle' colSpan={this.tableHead.length + 2}>
                                                        <div className='text-center'>Loading...</div>
                                                    </td>

                                                </tr>
                                                :
                                                this.state.data ?
                                                    this.state.data.filter((eData: IPropsEmployeeDetails) => eData.firstname.includes(this.state.searchValue)
                                                        || eData.lastname.includes(this.state.searchValue) || eData.email.includes(this.state.searchValue))
                                                        .map((empdata: IPropsEmployeeDetails, i: number) => {
                                                            return (
                                                                <tr className='align-middle' key={i}>
                                                                    <td>{i + 1}</td>
                                                                    {
                                                                        this.tableHead.map((th: IPropsTableHead, j: number) => {
                                                                            return (
                                                                                <td key={j} className='align-middle'>{empdata[th.key]}</td>
                                                                            )
                                                                        })
                                                                    }
                                                                    <td className='align-middle'>
                                                                        <div className='d-flex flex-row gap-2'>
                                                                            <button onClick={() => this.removeEmployee(empdata?.id as string)} className='btn btn-danger w-100 btn-sm'>Remove</button>
                                                                            <button onClick={() => this.updateEmployee(empdata?.id as string)} className='btn btn-danger w-100 btn-sm'>Update</button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    :
                                                    <tr>
                                                        <td className='align-middle' colSpan={this.tableHead.length + 2}>
                                                            <div className='text-center'>{this.state.error}</div>
                                                        </td>
                                                    </tr>
                                        }
                                        <tr>
                                            <td></td>
                                            {
                                                this.tableHead.map((th: IPropsTableHead, i: number) => {
                                                    return (
                                                        <td key={i} className='align-middle'>
                                                            {
                                                                th.key === "gender" ?
                                                                    <select style={{ width: "100px" }} className='form-select' value={this.state.employeeDetails[th.key]} onChange={(e: ChangeEvent<HTMLSelectElement>) => this.setFieldValues(e.target.value, th.key)}>
                                                                        <option value="0">Select</option>
                                                                        <option value="Male">Male</option>
                                                                        <option value="Female">Female</option>
                                                                    </select>
                                                                    :
                                                                    <input className='form-control' value={this.state.employeeDetails[th.key] === 0 ? "" : this.state.employeeDetails[th.key]} type={["age", "salary"].includes(th.key) ? "number" : th.key === "email" ? "email" : "text"} onChange={(e: ChangeEvent<HTMLInputElement>) => this.setFieldValues(e.target.value, th.key)} />
                                                            }
                                                        </td>
                                                    )
                                                })
                                            }
                                            <td className='align-middle'>
                                                <div className='d-flex flex-row gap-2'>
                                                    <button disabled={!isValid} onClick={this.state.updateTrack ? this.confirmUpdateEmployee : this.addEmployee} className='btn btn-primary w-100 btn-sm'>{this.state.updateTrack ? "Update" : "Add"}</button>
                                                    <button onClick={this.clear} className='btn btn-primary w-100 btn-sm'>Clear</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const toastSuccess = (message: string) => {
    toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    })
}

const toastError = (message: string) => {
    toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    })
}

export default Employee