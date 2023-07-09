import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'

function Navbars(){
	let navigate = useNavigate()
	return(		
<>
      <Navbar data-bs-theme="light" bg = 'light'>
        <Container>
          <Navbar.Brand onClick={()=>navigate('/')}>
            <img
              alt=""
              src= {process.env.PUBLIC_URL +"/img/427111LogoCut.png"}
              width = "160vw"
			  height = "41vw"
              className="d-inline-block align-top"
            />{' '}
		  </Navbar.Brand>			
          <Nav className="me-auto">
            <Nav.Link onClick={()=>navigate('/post')}>post</Nav.Link>			  
            <Nav.Link onClick={()=>navigate('/diary')}>diary</Nav.Link>
          </Nav>		
		
        </Container>
      </Navbar>	
</>
	)
}

export default Navbars;