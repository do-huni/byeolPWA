import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import { IoSettingsOutline } from "react-icons/io5";
import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';
import { BiSolidUser, BiSolidUserAccount, BiSolidLogIn, BiSolidLogOut } from "react-icons/bi";
import { BsDatabaseFill, BsDatabaseFillUp, BsDatabaseFillDown } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { signInGoogle, signOut } from '../FireBaseAuth.js';
import { fireStore } from '../FireBase.js';
import { useDispatch, useSelector } from "react-redux"
import * as byeolDB from '../Script/indexedDB.js'
import {updateUser,update, updatePosts} from "../store.js"
import { doc, setDoc, collection, getDoc } from "firebase/firestore"; 


function Navbars(){
	let navigate = useNavigate()
	const [modalIsOpen, setModalIsOpen] = useState(false);	
	const [userNameInput, setUserNameInput] = useState("");	
	function getDBData(){
		return new Promise(async (resolve, reject)=>{
			const docRef = doc(fireStore, "byeolDB", user.uid);
			const docSnap = await getDoc(docRef);						
			if (docSnap.exists()) {
				resolve(docSnap.data());
			} else {
			  // docSnap.data() will be undefined in this case
				reject();
			}					
		});	
	}
	async function replaceData(parsedData){
		await byeolDB.replaceAllData(parsedData);
		window.location.reload();
	}
    let user = useSelector((state) => state.user);		
  	const dispatch = useDispatch();		
	
	useEffect(()=>{
		byeolDB.getUser().then((result)=>{
			dispatch(updateUser(result));
		})
	}, [])	
	return(		
<>
      <Navbar data-bs-theme="light" bg = 'light'>
        <Container>
          <Navbar.Brand onClick={()=>navigate('/')}>
            <img
              alt=""
              src= {process.env.PUBLIC_URL +"/img/427111LogoCut.png"}
              style = {{width: "20dvh"}}
              className="d-inline-block align-top"
            />{' '}
		  </Navbar.Brand>			
          <Nav className="me-auto">
            <Nav.Link onClick={()=>navigate('/post')}>post</Nav.Link>			  
            <Nav.Link onClick={()=>navigate('/diary')}>diary</Nav.Link>
          </Nav>		
		  <IoSettingsOutline onClick={()=>setModalIsOpen(true)} style = {{marginLeft: 0, fontSize: "18pt"}}/>			
		
        </Container>
      </Navbar>	
		   
	  <Modal isOpen={modalIsOpen}
			onRequestClose={()=>setModalIsOpen(false)}			  
			ariaHideApp={false}	
			style = {
			{overlay: {zIndex: 1000},
			content: {padding: "0"}
			}
		}>
		<Container>
			<Row style = {{fontSize: "18pt", fontWeight: "900", margin: "10px 0", textAlign: "left"}}><Col><BiSolidUser style = {{marginLeft: 0}}/>Your Name</Col></Row>
			<Row style = {{justifyContent: "center", background: "#404040", color: "#ffffff", margin: "12px", padding: "3px"}}>{user.name}</Row>
			<Row style = {{fontSize: "18pt", fontWeight: "900", margin: "10px 0", textAlign: "left"}}><Col><BiSolidUserAccount style = {{marginLeft: 0}}/>Change Name</Col></Row>			
			<Row style = {{margin: 0}}>
				<InputGroup className="mb-3">	  
				<Form.Control
				  style = {{"border" : "#6c757d 1px solid"}}		  			
				  className = "shadow-none"
				  variant="outline-secondary"			
				  placeholder="이름 입력"
				  aria-describedby="basic-addon2"
				  id = "userNameInput"
				  onChange={(e)=>{
						  setUserNameInput(e.target.value);
					  }}			
				/>
				<Button variant="outline-secondary" id="button-addon1" onClick = {()=>{
							byeolDB.setUser(user.uid, user.email, userNameInput).then((r)=>{
								dispatch(updateUser(r))
								document.getElementById("userNameInput").value = ""
							})
					  }}>
				  변경하기
				</Button>
				</InputGroup>
	 		</Row>
			<Row style = {{fontSize: "18pt", fontWeight: "900", margin: "10px 0", textAlign: "left"}}><Col><BsDatabaseFill style = {{marginLeft: 0}}/>Data</Col></Row>			
			
			<Row style = {{margin: "10px 12px"}}>
				<Button variant="outline-secondary" id="button-addon1" onClick = {()=>{
						byeolDB.getJSON().then((result)=>{
							// console.log(result);
							setDoc(doc(fireStore, "byeolDB", result.user[0].uid), {
								diary: JSON.stringify(result.diary),
								post: JSON.stringify(result.post),
								user: JSON.stringify(result.user),
								id: JSON.stringify(result.id),
								todo: JSON.stringify(result.todo)
							}
						);
						});	
						}}>
				  <BsDatabaseFillUp style = {{marginLeft: 0}}/>UPLOAD
				</Button>
			</Row>
			<Row style = {{margin: "10px 12px"}}>
				<Button variant="outline-secondary" id="button-addon1" onClick = {()=>{
						getDBData()
							.then((result)=>{
							let parsedData = {
								diary: JSON.parse(result.diary),
								post: JSON.parse(result.post),
								user: JSON.parse(result.user),
								id: JSON.parse(result.id),
								todo: JSON.parse(result.todo)
							};
							replaceData(parsedData);
						})
							.catch(()=>{
							alert("서버에 업로드된 데이터가 없습니다!");
						});
					  }}>
				  <BsDatabaseFillDown style = {{marginLeft: 0}}/>DOWNLOAD
				</Button>
			</Row>
			<Row style = {{fontSize: "18pt", fontWeight: "900", margin: "10px 0", textAlign: "left"}}><Col><BiSolidLogIn style = {{marginLeft: 0}}/>Login</Col></Row>
			<Row style = {{justifyContent: "center", background: "#404040", color: "#ffffff", margin: "12px", padding: "3px"}}>{user.email}</Row>			
			{
				
			}
			{(user.uid == 0)
				?(
			<Row style = {{margin: "10px 12px"}}>
				<Button variant="primary" id="button-addon1" onClick = {()=>{
							signInGoogle().then((result)=>
												byeolDB.setUser(result.user.uid, result.user.email, user.name).then((r)=>{
								dispatch(updateUser(r));
							})
											   );
					  }}>
				  <FcGoogle style = {{marginLeft: 0, fontSize: "20pt", background: "white"}}/> Continue with Google
				</Button>					
			</Row>					
			)
				:(
			<Row style = {{margin: "10px 12px"}}>
				<Button variant="danger" id="button-addon1" onClick = {()=>{
							signOut().then(()=>{
								byeolDB.setUser("0", "xxxx@gmail.com", user.name).then((r)=>{
									dispatch(updateUser(r));
								})
							})
					  }}>
				  <BiSolidLogOut style = {{marginLeft: 0, fontSize: "20pt"}}/> Logout
				</Button>					
			</Row>					
			)
			}				
			</Container>								
	  </Modal>			   
</>
	)
}

export default Navbars;