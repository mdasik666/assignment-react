import axios, { AxiosError } from 'axios';
import Header from 'component/Header';
import { ChangeEvent, Component } from 'react'
import { getEmployee } from 'services/api/EmployeeService';

interface EmployeeProps { }

interface EmployeeState {
    data: string | null,
    loading: boolean,
    error: string | null,
    employeeDetails: {
        firstname: string,
        lastname: string,
        email: string,
        gender: string,
        age: number,
        city: string,
        salary: number
    }
}

class Employee extends Component<EmployeeProps, EmployeeState> {
    tableHead: Array<string>;
    constructor(props: any) {
        super(props);
        this.state = {
            data: null,
            loading: false,
            error: null,
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
        this.tableHead = [`firstname`, `lastname`, `email`, `gender`, `age`, `city`, `salary`]
    }

    componentDidMount(): void {
        this.fetch()
    }

    fetch = async () => {
        this.setState({
            loading: true,
        })
        try {
            const res = await getEmployee()
            if (res.data.status === "Success") {
                console.log(res.data)
                this.setState({ data: res.data.empData, loading: false, error: null })
            } else {
                this.setState({ data: null, loading: false, error: res.data.message })
            }
        } catch (error: unknown) {
            this.setState({ data: null, loading: false, error: (error as AxiosError).message })
        }
    }

    setFieldValues = (e:string,type:string) => {
        console.log(e,type)
    }
    
    render() {
        console.log(this.state.employeeDetails)
        return (
            <>
                <Header />
                <table>
                    <thead>
                        <tr>
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
                            this.state.data &&
                            <>Done</>
                        }
                        <tr>
                            <td></td>
                            {
                                this.tableHead.map((th: string) => {
                                    return (
                                        th === "gender" ?
                                            <td>
                                                <input type='text' onChange={(e: ChangeEvent<HTMLInputElement>) => this.setFieldValues(e.target.value,th)} />
                                            </td>
                                            :
                                            <td>
                                                <input type='text' onChange={(e: ChangeEvent<HTMLInputElement>) => this.setFieldValues(e.target.value,th)} />
                                            </td>
                                    )
                                })
                            }
                            <td>
                                <button>Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        )
    }
}

export default Employee