import { Component } from 'react'

class Header extends Component{
    render(){
        return (            
            <header className='row'>
                <div className='col-12 text-center bg-dark text-light py-2'>
                    <h3>Assignment - CRUD Operation using MERN with MySql</h3>
                </div>
            </header>
        )
    }
}

export default Header