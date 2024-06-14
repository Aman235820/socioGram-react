import { NavLink as ReactLink } from 'react-router-dom';
import { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
} from 'reactstrap';

export default function CustomNavbar(props) {
    
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    

    return (
        <>
            <div className='header'>
                <Navbar
                    color='dark'
                    dark
                    expand='md'
                    fixed='top'>

                    <NavbarBrand tag={ReactLink} to="/">socioGram</NavbarBrand>
                    <NavbarToggler onClick={toggle} />

                    <Collapse isOpen={isOpen} navbar>

                        <Nav className="me-auto" navbar>
                            <NavItem>
                                <NavLink href="/components/">Components</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={ReactLink} to="/login">
                                    Login
                                </NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    More
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem>Option 1</DropdownItem>
                                    <DropdownItem>Option 2</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>Reset</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                        <NavbarText>Simple Text</NavbarText>
                    </Collapse>
                </Navbar>
            </div>
        </>
    );
}