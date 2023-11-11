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
import { format } from "date-fns";
import { ko } from "date-fns/esm/locale";
import ReactQuill from 'react-quill';
import "../assets/styles/quillbubble.css"
import Loading from './Loading.js';
import { doc, addDoc, setDoc, collection, getDoc, query, getDocs, orderBy, limit, startAfter, deleteDoc} from "firebase/firestore"; 
import { storage } from '../FireBase.js';
import { fireStore } from '../FireBase.js';
import { BsPencilFill, BsFillTrashFill } from "react-icons/bs";

function LDetail(){
    const dispatch = useDispatch();	
  	let navigate = useNavigate()			
	let id = useParams().id;	
	const [title, setTitle] = useState("제목");	
	const [value, setValue] = useState("내용");
	const [author, setAuthor] = useState("글쓴이");		
	const [date, setDate] = useState("날짜");
	const [loading, setLoading] = useState(true);
	useEffect(()=>{
	  setLoading(true);
	  async function fetchData(){
		  const docRef = doc(fireStore, "letters", id);
		  const docSnap = await getDoc(docRef);
		  const docData = docSnap.data();
		  setValue(docData.value);
		  setDate(docData.date);
		  setAuthor(docData.author);
		  setTitle(docData.title);
	  	  setLoading(false);
	  }
	  fetchData();		
	},[])
	
const modules = {
      toolbar: false
}	
	
	return(		
		<>
		{(loading)?(<Loading/>)
		:
		(<Container id = "letterContainer" style = {{"margin": "10px auto"}}>
			<Row><div className = {"letterDetailTitle"}>{title}</div></Row>
			 <Row><Col className = {"letterClass"}>보낸 이: {author}</Col><Col className = {"letterDetailDate"}>{date}</Col></Row>			 


			<ReactQuill
				style = {
					{border: "none",
					}
				}
				readOnly
				theme="bubble"
				value={value}
		 		modules = {modules}				
			/>			
			
			<BsPencilFill style = {{marginLeft: 0}} onClick = {() => navigate(`/letter/update/${id}`)}/>
			
			<BsFillTrashFill onClick = {async ()=>{
  					  var ans = window.confirm("삭제 하시겠습니까?");
					  if(ans){						  						  
						  const docRef = doc(fireStore, "letters", id);		
						  const deleteQ = await deleteDoc(docRef);
						  navigate('/letter');
					  }
				  }}/>		
		</Container>)
		}	
	</>
	)
}

export default LDetail;