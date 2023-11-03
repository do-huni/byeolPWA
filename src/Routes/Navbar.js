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
import { doc, setDoc, collection, getDoc, query, getDocs, orderBy } from "firebase/firestore"; 
import Loading from './Loading.js';


function Navbars(){
	let navigate = useNavigate()
	const [loadingOpen, setLoadingOpen] = useState(false);		
	const [modalIsOpen, setModalIsOpen] = useState(false);	
	const [userNameInput, setUserNameInput] = useState("");	
	
	function getDBData(){
		return new Promise(async (resolve, reject)=>{			
			const docRef = doc(fireStore, "byeolDB", user.uid);
			const docSnap = await getDoc(docRef);						
			const parsedData = {
				diary: [],
				user: [],
				post: [],
				todo: [],
				id: []
			};
			if (docSnap.exists()) {
				//userQuery
				let down_user = JSON.parse(docSnap.data().user);				
				const d_uid = down_user[0].uid;
				parsedData["user"].push(down_user[0]);
				//diaryQuery
				const diaryQ = query(collection(fireStore, "byeolDB", d_uid, "diary"));
				const diarySnap = await getDocs(diaryQ);				
				diarySnap.forEach(async (doc) =>{
					let lists = [];
					const id = doc.id;
					const data = doc.data();
					const diaryListQ = query(collection(fireStore, "byeolDB", d_uid, "diary", id, "lists"));
					const diaryListSnap = await getDocs(diaryListQ);
					diaryListSnap.forEach((docList)=>{
						const dl_data = docList.data();
						lists.push(dl_data);
					});
					const diaryElement = {
						"hook": data["hook"],
						"lists": lists
					};
					parsedData["diary"].push(diaryElement);
				});
				//idQuery
				const idQ = query(collection(fireStore, "byeolDB", d_uid, "id"));
				const idSnap = await getDocs(idQ);
				idSnap.forEach((doc) =>{
					const id = doc.id;
					const data = doc.data();
					const idElement = {
						"access": data["access"],
						"id": data["id"]
					};
					parsedData["id"].push(idElement);					
				})			
				//postQuery
				const postQ = query(collection(fireStore, "byeolDB", d_uid, "post"));
				const postSnap = await getDocs(postQ);				
				postSnap.forEach(async (doc) =>{
					let lists = [];
					const id = doc.id;
					const data = doc.data();
					const postListQ = query(collection(fireStore, "byeolDB", d_uid, "post", id, "lists"));
					const postListSnap = await getDocs(postListQ);
					postListSnap.forEach((docList)=>{
						const dl_data = docList.data();
						lists.push(dl_data);
					});
					const postElement = {
						"clName": data["clName"],
						"color": data["color"],
						"lists": lists
					};
					parsedData["post"].push(postElement);
				});				
				//todoQuery
				const todoQ = query(collection(fireStore, "byeolDB", d_uid, "todo"));
				const todoSnap = await getDocs(todoQ);
				todoSnap.forEach((doc) =>{
					const id = doc.id;
					const data = doc.data();
					const todoElement = {
						"clName": data["clName"],
						"color": data["color"],
						"lists": JSON.parse(data["lists"])
					};
					parsedData["todo"].push(todoElement);					
				})						
				resolve(parsedData);
			} else {
			  // docSnap.data() will be undefined in this case
				reject();
			}					
		});	
		
	//데이터 일괄 삭제
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
	

	}
	async function replaceData(parsedData){
		await byeolDB.replaceAllData(parsedData);
		console.log("실행 끝")
		setLoadingOpen(false);
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
	  <Modal isOpen={loadingOpen}
			onRequestClose={()=>setLoadingOpen(true)}			  
			ariaHideApp={false}	
			style = {
			{overlay: {zIndex: 1001,
					   top:0,
					   left:0
					  },
			content: {padding: "0",				
    				  top: "50%",
    				  left: "50%",		
    				  transform: "translate(-50%, -50%)",						  
    	              width: "240px",
    			      height: "240px",						  
					 }				   
			}
		}>
		<Container>	
			<Loading/>
		</Container>								
	  </Modal>			   
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
  					  var ans = window.confirm("데이터를 업로드 하시겠습니까?");
					  if(ans){
						setLoadingOpen(true);
						byeolDB.getJSON().then(async (result)=>{
							//user 작성
							await setDoc(doc(fireStore, "byeolDB", result.user[0].uid), {
								user: JSON.stringify(result.user)
							}).then(async (e)=>{

								//diary 작성
								for(let i of result.diary){
									await setDoc(doc(fireStore, "byeolDB", result.user[0].uid, "diary", i.hook), {
										"hook" : i.hook
									});
									//컬렉션 안만들어질 수 도 있음. 예외처리 주의!
									for(let j of i.lists){
										await setDoc(doc(collection(fireStore, "byeolDB", result.user[0].uid, "diary", i.hook, "lists"), String(j.id)), {
											content: j.content,
											date: j.date,
											emotion:j.emotion,
											id: j.id
										});
									}
								}
								//id 작성
								for(let i of result.id){
									await setDoc(doc(fireStore, "byeolDB", result.user[0].uid, "id", i.access), {
										"access" : i.access,
										"id": i.id
									});
								}
								//post 작성
								for(let i of result.post){
									await setDoc(doc(fireStore, "byeolDB", result.user[0].uid, "post", i.clName), {
										"clName" : i.clName,
										"color": i.color
									});
									//컬렉션 안만들어질 수 도 있음. 예외처리 주의!
									for(let j of i.lists){
										await setDoc(doc(collection(fireStore, "byeolDB", result.user[0].uid, "post", i.clName, "lists"), String(j.id)), {
											content: j.content,
											date: j.date,
											title: j.title,
											id: j.id
										});
									}
								}	
								//todo 작성
								for(let i of result.todo){
									await setDoc(doc(fireStore, "byeolDB", result.user[0].uid, "todo", i.clName), {
										"clName" : i.clName,
										"color": i.color,
										"lists": JSON.stringify(i.lists)
									});
								}
								setLoadingOpen(false);
							})
								.catch((e)=>{
								alert("업로드 오류 발생");
								alert(e);
							});							
						});							  
					  }						
						}}>
				  <BsDatabaseFillUp style = {{marginLeft: 0}}/>UPLOAD
				</Button>
			</Row>
			<Row style = {{margin: "10px 12px"}}>
				<Button variant="outline-secondary" id="button-addon1" onClick = {()=>{
  					  var ans = window.confirm("데이터를 다운로드 하시겠습니까? 기존 데이터를 덮어씁니다.");
					  if(ans){
						setLoadingOpen(true);
						getDBData()
							.then((result)=>{
							console.log(result);
							replaceData(result);
						})
							.catch(()=>{
							alert("서버에 업로드된 데이터가 없습니다!");
							setLoadingOpen(false);
						});								  
					  }										
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