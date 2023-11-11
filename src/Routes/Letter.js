import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect, useLayoutEffect} from 'react';
import {update, updateDiaryList} from "../store.js"
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import '../App.css';
import Container from 'react-bootstrap/Container';
import LetterItem from './LetterItem.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Loading from './Loading.js';

import { SlEnvolopeLetter } from "react-icons/sl";
import { BsArrowDownShort, BsBrush} from "react-icons/bs";
import { doc, addDoc, setDoc, collection, getDoc, query, getDocs, orderBy, limit, startAfter} from "firebase/firestore"; 
import { storage } from '../FireBase.js';
import { fireStore } from '../FireBase.js';
//Quill
import ReactQuill from 'react-quill';
import "../assets/styles/quillsnow.css"


function Letter() {
  let navigate = useNavigate()		
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [start, setStart] = useState(null);
  const [size, setSize] = useState(10);
  const [loadMore, setLoadMore] = useState(0);
 	
  const dispatch = useDispatch();
  useEffect(()=>{	 
	  setLoading(true);
	  async function fetchData(){
	  const letterDB = collection(fireStore, 'letters');
      let letterQ =  query(letterDB, orderBy("date", "desc"), limit(size)); 		 		  
// 	  최초가 아닐 경우
	  if(start){
		  console.log("startAfter쿼리 실행");
		  console.log(start);
		  letterQ = query(letterDB, orderBy("date", "desc"), startAfter(start), limit(size));
	  } else{
		  if(loadMore != 0){
	  		  setLoading(false);			  
			  return;
		  }
	  }
	  const letterSnap = await getDocs(letterQ);
      setStart(letterSnap.docs.length == size?letterSnap.docs[letterSnap.docs.length-1] : null);
	  const dataList = list;
	  await letterSnap.forEach(async (doc) =>{
		  let data = doc.data();
		  data["id"] = doc.id;
		  dataList.push(data);
	  });		  
	  setList(dataList);
	  setLoading(false);
	  }
	  fetchData();
  },[loadMore]);

  
return (
	<>
	<Container>
      <div className="d-grid gap-2">	 	
		  <Button variant="light" style ={{margin: "10px 0", background: "#fff", border: "1px solid #ccc"}} onClick = {()=>{navigate('/letter/post')}}>
			<SlEnvolopeLetter style = {{marginLeft: 0}}/> 편지 쓰기
		  </Button>				
	  </div>
		<table id = "letterTable">
			<thead>
				<tr>
				<td style = {{width: "80%"}} className = {"letterTHead"}>제목</td>
				<td style = {{width: "20%"}} className = {"letterTHead"}>쓴 사람</td>
				</tr>
			</thead>
			<tbody>
		{(loading)?
			(
					<tr><td  style = {{width: "100%"}} colSpan = "4">
					<Loading style = {{width: "100%"}}/>
					</td></tr>)		 
		:(list.map((it)=>{
			return(
			<LetterItem key ={it.id} {...it}/>
			)
		}))		
		}	
			</tbody>
		</table>	
		<Row><BsArrowDownShort onClick = {()=>{setLoadMore(loadMore+1)}} style = {{marginLeft: 0, fontSize: "18pt"}}/></Row>
	</Container>		
	</>
  ); 
}

export default Letter;