import { NavLink as ReactLink, useNavigate , Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import AuthContext from  "../../../guards/AuthProvider";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../../redux/slices/AuthSlice';

export default function CustomNavbar(props) {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const [isFormPage , setFormPage] = useState(true);

    const {user} = useContext(AuthContext);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if(props.myLocation ==='login' || props.myLocation ==='register'){
            setFormPage(true);
          }
          else{
            setFormPage(false);
          }
    }, [props.myLocation]);

    const handleLogout = ()=>{
          dispatch(userLogout(user.id));
          navigate("/");
    }
    

    return (
        <>
            <div className='header'>
                <Navbar
                    color='dark'
                    dark
                    expand='md'
                    fixed='top'
                    mb-4
                    >

                    <NavbarBrand tag={ReactLink} to="/register">socioGram</NavbarBrand>
                    <NavbarToggler onClick={toggle} />

                    { !isFormPage && <Collapse isOpen={isOpen} navbar>

                        <Nav className="me-auto" navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    {user.name}
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem><Link to="https://my-ecommerce-ochre.vercel.app/" target='_blank'>Services</Link></DropdownItem>
                                    <DropdownItem><Link to="https://github.com/Aman235820/" target='_blank'>Github</Link></DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem  onClick={handleLogout}>Logout</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                        <div>
                            <Button
                                active
                                color="light"
                                size=""
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </Collapse>}
                </Navbar>
            </div>
        </>
    );
}