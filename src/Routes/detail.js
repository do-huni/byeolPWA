import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import { Routes, Route, Link, useNavigate, Outlet, useParams } from 'react-router-dom';	
import {update, updatePosts, updateTodos} from "../store.js"
import Table from 'react-bootstrap/Table';
import '../App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { ko } from "date-fns/esm/locale";
import { BsPencilFill, BsFillTrashFill } from "react-icons/bs";
import { BiCalendarCheck } from "react-icons/bi";
import ReactQuill from 'react-quill';
import "../assets/styles/quillbubble.css"
import Loading from './Loading.js';
import { doc, deleteDoc, addDoc, setDoc, collection, getDoc, query, getDocs, orderBy, limit, startAfter} from "firebase/firestore"; 
import { storage } from '../FireBase.js';
import { fireStore } from '../FireBase.js';

function Detail(){
    const dispatch = useDispatch();	
  	let navigate = useNavigate()			
    let todos = useSelector((state)=>state.todos)	
	let [title, setTitle] = useState("제목")	
	let [todo, setTodo] = useState("할 일")
	let [content,setContent] = useState("내용")
    let [reload, setReload] = useState(0);	
	let [test, setTest] = useState(1)
	let [date, setDate] = useState("날짜")
  	let [todoDate, setTodoDate] = useState(new Date());		
	let user = useSelector((state) => state.user);	
	const [loading, setLoading] = useState(true);
	let clName = decodeURI(useParams().clName);
	let id = useParams().id;	
  	let posts = useSelector((state)=>state.posts)	
	
const modules = {
      toolbar: false
}	
  useEffect(()=>{		 	  
	setLoading(true);
	async function fetchData(){
		const docRef = doc(fireStore, "byeolDB", user.uid, "post", clName, "lists", id);
		const docSnap = await getDoc(docRef);
		const docData = docSnap.data();
		console.log(docData);
		const todoRef = doc(fireStore, "byeolDB", user.uid, "todo", clName);
		const todoSnap = await getDoc(todoRef);
		let todoData = todoSnap.data();
		console.log(todoData);
		todoData["lists"] = JSON.parse(todoData["lists"]);
		if(todoData.lists.find(el => el.id == id)){
		   todoData = todoData.lists.find(el => el.id == id).todos
		} else{
			todoData = 0
		}
		dispatch(updateTodos(todoData))
		
		setTitle(docData.title);
	 	setContent(docData.content);		  
	 	setDate(docData.date);		  		  
	 	setLoading(false);
	}
	fetchData();
  },[reload])	
	
	
	function printTodos(){
	  let arr = []
	  
	  if(todos != 0){
		  for(let i of todos){
			  arr.push(
				  <>
				  <Row className = "clstTodo">
				  	<Col key = {i.id}>{i.checklist}</Col>
					<Col xs="auto">
						<Form.Check // prettier-ignore
							type="checkbox"
							id = {i.id}
							checked = {i.ifChecked}
							onChange={async () => {
							const todoRef = doc(fireStore, "byeolDB", user.uid, "todo", clName);
							const todoSnap = await getDoc(todoRef);
							let todoData = todoSnap.data();
							todoData["lists"] = JSON.parse(todoData["lists"]);
							todoData.lists.find(el => el.id == id).todos.find(el => el.id == i.id).ifChecked = !todoData.lists.find(el => el.id == id).todos.find(el => el.id == i.id).ifChecked;								
							todoData["lists"] = JSON.stringify(todoData["lists"]);
						    await setDoc(doc(fireStore, "byeolDB", user.uid, "todo", clName),todoData);	
						   setReload(reload+1);									
							}
							}					
						  />
					  </Col>
					<Col xs="auto"><div onClick = {async ()=>{
							const todoRef = doc(fireStore, "byeolDB", user.uid, "todo", clName);
							const todoSnap = await getDoc(todoRef);
							let todoData = todoSnap.data();
							todoData["lists"] = JSON.parse(todoData["lists"]);
							const todoIndex = todoData.lists.find(el => el.id == id).todos.findIndex(el => el.id == i.id);
						    console.log(todoIndex);
							todoData.lists.find(el => el.id == id).todos.splice(todoIndex, 1);								
							todoData["lists"] = JSON.stringify(todoData["lists"]);
						    await setDoc(doc(fireStore, "byeolDB", user.uid, "todo", clName),todoData);	
						    setReload(reload+1);										
							}
					}><BsFillTrashFill/></div></Col>					  
				  </Row>
				  <Row className = "clstRow">
				  	<Col xs="auto" key = {i.due+i.id}>{i.dueDate}</Col>					  					  
				  </Row>
				  </>
			  )
		  }
	  }
	  return arr;
	}
	return(
		<>
		{
		(loading)?(<Loading/>)
		:(
		<Container style = {{"margin": "10px auto"}}>
			<Row><span className = {"postClass"}>#{clName}</span></Row>
			<Row><div className = {"postTitle"}>{title}</div></Row>
			<Row><div className = {"postDate"}>{date}</div></Row>
			
			
			<ReactQuill
				style = {
					{border: "none"}
				}
				readOnly
				theme="bubble"
				value={content}
		 		modules = {modules}				
			/>			
			<Container id = "todoContainer">
				<Row style = {{fontSize: "18pt", fontWeight: "900", margin: "10px 0", textAlign: "left"}}><Col><BiCalendarCheck style = {{marginLeft: 0}}/>TodoList</Col></Row>
			<Container id = "clstContainer">
				{printTodos()}				
			</Container>
				<InputGroup className="mb-3">
				<DatePicker selected={todoDate}
					onChange={date => setTodoDate(date)}
					className = "shadow-none form-control firstInput col-md-auto"
					locale={ko}
					dateFormat="yy-MM-dd"										
					/>	
				<Form.Control aria-label="Last name" id = "todoInput" className = "shadow-none" type="text" placeholder="할 일" onChange={(e)=>{
						  setTodo(e.target.value);
					  }} />				
				<Button variant="dark" onClick = {async ()=>{			
							const idRef = doc(fireStore, "byeolDB", user.uid, "id", "todoid");
							const idSnap = await getDoc(idRef);
							let idData = idSnap.data();		
						    if(idData == undefined){
							    idData = {
							  	    "access": "todo",
								    "id": 0
							    };
						    };							
							idData.id += 1;
							const todoRef = doc(fireStore, "byeolDB", user.uid, "todo", clName);
							const todoSnap = await getDoc(todoRef);
							let todoData = todoSnap.data();
							console.log(todoData);
							todoData["lists"] = JSON.parse(todoData["lists"]);
							if(!todoData.lists.find(el => el.id == id)){
								todoData.lists.push({
									id: id,
									todos: []
								});								
							}
							todoData.lists.find(el => el.id == id).todos.push({
								id: idData.id,
								checklist: todo,
								ifChecked: false,
								dueDate: format(todoDate, "yyyy-MM-dd")								
							});								
							todoData["lists"] = JSON.stringify(todoData["lists"]);
						    await setDoc(doc(fireStore, "byeolDB", user.uid, "todo", clName),todoData);	
							await setDoc(doc(fireStore, "byeolDB", user.uid, "id", "todoid"), idData);
						   document.getElementById("todoInput").value = "";
						   setReload(reload+1);								

					  }}>추가</Button>						
				</InputGroup>
			</Container>				
			<BsPencilFill style = {{marginLeft: 0}} onClick = {() => navigate(`/update/${clName}/${id}`)}/>
			
			<BsFillTrashFill onClick = {async ()=>{
  					  var ans = window.confirm("삭제 하시겠습니까?");
					  if(ans){
						  const docRef = doc(fireStore, "byeolDB", user.uid, "post", clName, "lists", id);		
						  const deleteQ = await deleteDoc(docRef);						 											  
						  navigate('/');						  
					  }
				  }}/>	
		</Container>
		)
		}
		</>
	)
}

export default Detail;