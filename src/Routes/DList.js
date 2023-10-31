import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect, useLayoutEffect} from 'react';
import {update, updateDiaryList} from "../store.js"
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import '../App.css';
import Container from 'react-bootstrap/Container';
import DiaryItem from './DiaryItem.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Loading from './Loading.js';

//Quill
import ReactQuill from 'react-quill';
import "../assets/styles/quillsnow.css"


function DList() {
  let navigate = useNavigate()		
  const [loading, setLoading] = useState(true);
  let diaryDate = useSelector((state) => state.diaryDate);  
  let diaryList = useSelector((state) => state.diaryList);
  const dispatch = useDispatch();
  useEffect(()=>{
	setLoading(true);		  	  
	  byeolDB.getDiary(diaryDate).then((result)=>{
// 		  result를 sorting?
		  if(result != []){
			  result = result.sort((a,b)=>{
				  let aD = new Date(a.date);
				  let bD = new Date(b.date);
				  if(aD > bD){
					  return -1
				  }
				  if(aD < bD){
					  return 1
				  }
				  return 0;
			  })			  
		  }
		  dispatch(updateDiaryList(result))
		  setLoading(false);
	  })
  },[diaryDate])

  
return (
	<>
      <div className="d-grid gap-2">	 	
		  <Button variant="primary" size="lg" style ={{margin: "10px 0"}} onClick = {()=>{navigate('/diary/post')}}>
			일기 쓰기
		  </Button>				
	  </div>
	<Container id = "diaryContainer" className = "g-0">	
		{(loading)?
			(<Loading/>)
		:(diaryList.map((it)=>{
			return(
			<DiaryItem key ={it.id} {...it}/>
			)
		}))
		}		
	</Container>		  
	</>
  ); 
}

export default DList;