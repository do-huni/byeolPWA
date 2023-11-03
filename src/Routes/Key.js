import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';




function Key() {


return (
	<>
	<Container style = {{"padding": "10px"}}>
			<InputGroup>	  
			<Form.Control
			  style = {{"border" : "#6c757d 1px solid"}}		  			
			  className = "shadow-none"
			  variant="outline-secondary"			
			  placeholder="access_key"
			  aria-describedby="basic-addon2"
			  id = "accessKeyInput"	
			/>
			<Button variant="outline-secondary" id="button-addon1" onClick = {()=>{
						const key = document.getElementById("accessKeyInput").value;
						if(key != process.env.REACT_APP_ACCESS_KEY)
							alert("틀렸습니다.");
						localStorage.setItem("key", key);
						window.location.reload();
				  }}>
			 submit
			</Button>
			</InputGroup>		
	</Container>
	</>
  );
}


export default Key;
