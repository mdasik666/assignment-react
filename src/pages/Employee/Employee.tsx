import axios from 'axios';
import Header from 'component/Header';
import { Component } from 'react'
import { getEmployee } from 'services/api/EmployeeService';

interface EmployeeProps { }

interface EmployeeState {
    data: string | null,
    loading: boolean,
    error: string | null
}

class Employee extends Component<EmployeeProps, EmployeeState> {
    constructor(props: any) {
        super(props);
        this.state = { data: null, loading: false, error: null }
    }

    componentDidMount(): void {
    }

    fetch = async() => {
        this.setState({
            loading: true,
        })
        try {
            const res = await getEmployee()
            if(res.data.status === "Success"){
                this.setState({data:res.data.empData,loading:false,error:null})
            }else{
                this.setState({data:null,loading:false,error:res.data.message})
            }
        } catch (error:unknown) {
            
        }
    }

    render() {
        return (
            <>
                <Header />
                <table>
                    <thead>

                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </>
        )
    }
}

export default Employee