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
import { BsFillTrashFill } from "react-icons/bs";
import { BiCalendarCheck } from "react-icons/bi";
import 'react-quill/dist/quill.snow.css';

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
	let clName = decodeURI(useParams().clName);
	let id = useParams().id;	
  	let posts = useSelector((state)=>state.posts)	
	
	
  useEffect(()=>{		 
	byeolDB.getAll(true).then((result) => dispatch(update(result)));
	byeolDB.getAll(false).then((result)=>{
		  						// console.log(result[1].clName == clName)		  
								 result = result.filter((i)=>i.clName == clName);
		  						 const curPost = result[0].lists.filter((i)=> i.id == id)[0];
		  						 
	  })
	byeolDB.getTodoAll().then((result)=>{
		result = result.find(el=> el.clName == clName)
		if(result.lists.find(el => el.id == id)){
		   result = result.lists.find(el => el.id == id).todos
		} else{
			result = 0
		}
		dispatch(updateTodos(result))
	})
  },[reload])	
	
  useEffect(()=>{
	  byeolDB.getAll(false).then((result)=>{
		  						// console.log(result[1].clName == clName)		  
								 result = result.filter((i)=>i.clName == clName);
		  						 const curPost = result[0].lists.filter((i)=> i.id == id)[0];
		  						 setTitle(curPost.title);//title띄어쓰기 문제!!
		  						 setContent(curPost.content);		  
		  						 setDate(curPost.date);		  		  
		  						 
	  })
  },[])	
	
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
							onChange={() => byeolDB.doneTodo(clName, id, i.id).then((result) =>{
								setReload(reload+1);
							})}							
						  />
					  </Col>
					<Col xs="auto"><div onClick = {()=>
												  byeolDB.deleteTodo(clName, id, i.id).then((result)=>{
						setReload(reload+1);
					})
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
		<Container style = {{"margin": "10px auto"}}>
			<Row><span className = {"postClass"}>#{clName}</span></Row>
			<Row><div className = {"postTitle"}>{title}</div></Row>
			<Row style = {{"borderBottom":"1px rgba(0,0,0,0.2) solid"}}><div className = {"postDate"}>{date}</div></Row>
			
			<div style = {{textAlign: "left"}} dangerouslySetInnerHTML = 	{{__html:content}}/>
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
				<Button variant="dark" onClick = {()=>{
						  byeolDB.addTodo(clName,id,todo,format(todoDate, "yyyy-MM-dd"),()=>{
										  document.getElementById("todoInput").value = "";
										  setReload(reload+1);				          	  
						  })
					  }}>put</Button>						
				</InputGroup>
			</Container>				
			<Button variant="dark" size="lg" onClick = {() => navigate(`/update/${clName}/${id}`)}>edit</Button>
			
			<Button variant="dark" size="lg" onClick = {()=>{
					  byeolDB.deleteItem(clName,id,	() => {navigate('/')})  
				  }}>delete</Button>				
		</Container>
		
	)
}

export default Detail;