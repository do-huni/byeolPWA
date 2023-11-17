import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import {update, updatePosts} from "../store.js"
import Table from 'react-bootstrap/Table';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../App.css';
import { doc,deleteDoc,  addDoc, setDoc, collection, getDoc, query, getDocs, orderBy, limit, startAfter} from "firebase/firestore"; 
import { storage } from '../FireBase.js';
import { fireStore } from '../FireBase.js';

function Lists() {
  let navigate = useNavigate()	
  let posts = useSelector((state)=>state.posts)
  let postList = useSelector((state) => state.postList);	
  let [selectedclName, setSelectedclName] = useState('all');		
  let [reload, setReload] = useState(0);	
  let [addclName, setAddclName] = useState('기타');	
  let user = useSelector((state) => state.user);		
  
  const dispatch = useDispatch();	
  useEffect(()=>{
	  async function fetchData(){
		  let postClNameList = [];		  
		  const postCol = collection(fireStore, 'byeolDB', user.uid, 'post');
		  const postQ =  query(postCol); 		 
		  const postSnap = await getDocs(postQ);
		  let queriedPosts = postSnap.docs.map(async (docu) =>{			 
				  let data = docu.data();				
				  const postsCol = collection(fireStore, 'byeolDB', user.uid, 'post', data['clName'], 'lists');
				  const postsQ =  query(postsCol); 	
				  const postsSnap = await getDocs(postsQ);
				  let items = postsSnap.docs.map(doc=>{
					  return doc.data();
				  });
			      data['lists'] = items;	
				  postClNameList = [...postClNameList, data['clName']];		
			      return data;
		 });		
		  await Promise.all(queriedPosts).then((queriedPosts)=>{
			  dispatch(updatePosts(queriedPosts));
		  	  dispatch(update(postClNameList));
		  });

		  // byeolDB.getAll(true).then((result)=>dispatch(update(result)));
		  // byeolDB.getAll(false).then((result)=>dispatch(updatePosts(result)));	  		  
	  };
	  fetchData();
  },[reload, user])

  // useEffect(()=>{
  // byeolDB.getAll(false).then((result)=>{
  // if(selectedclName != 'all'){result = result.filter((i)=>i.clName == selectedclName);}
  // dispatch(updatePosts(result))			  
  // })
  // },[selectedclName])
	
	// useEffect(()=>{
	// byeolDB.getAll(true).then((result) => dispatch(update(result)));
	// setSelectedclName(document.querySelector('.form-select').value)
	// },[reload])	
  function printList(){
	  let arr = []
	  if(posts.length>0){
		  for(let i of posts){
			  for(let j in i.lists){
				  if(j==0){
					  arr.push(
					  <tr key = {i.clName + i.lists[j].title} onClick={()=> navigate(`detail/${i.clName}/${i.lists[j].id}`)}>
						  <td rowSpan = {i.lists.length} style ={{verticalAlign : "middle"}}>
							  <div style = {{background: i.color, width: "14px", height: "14px", display: "inline-block", borderRadius: "5px" , verticalAlign: "middle"}}>&nbsp;</div>
							  {i.clName}
							  </td>
						  <td>{i.lists[j].title}</td>
					  </tr>						  
					  )
				  } else{
					  arr.push(				  					  
						  <tr key = {i.clName + i.lists[j].title} onClick={()=> navigate(`detail/${i.clName}/${i.lists[j].id}`)}>							  
							  <td>{i.lists[j].title}</td>
						  </tr>
					  )					  
				  }
			  }
		  }
	  }
	return arr	  
  }
  return (
    <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">		  		  
      <InputGroup className="mb-3">
      <Form.Control
		style = {{"flex": "0 0 38px", "border" : "#6c757d 1px solid"}}		  
		className = "shadow-none"		  
        type="color"
        id="exampleColorInput"
        defaultValue="#563d7c"
        title="Choose your color"
      />	  			  
        <Form.Control
		  style = {{"border" : "#6c757d 1px solid"}}		  			
		  className = "shadow-none"
		  variant="outline-secondary"			
          placeholder="분류 입력"
          aria-describedby="basic-addon2"
		  id = "classInput"
		  onChange={(e)=>{
				  setAddclName(e.target.value);				  
			  }}			
        />
        <Button variant="outline-secondary" id="button-addon1" onClick = {async ()=>{
				  const color = document.getElementById("exampleColorInput").value;
				  await setDoc(doc(fireStore, "byeolDB", user.uid, "post", addclName),{
					  clName: addclName,
					  color: color,
					  lists: []
				  });						  
				  await setDoc(doc(fireStore, "byeolDB", user.uid, "todo", addclName),{
					  clName: addclName,
					  color: color,
					  lists: JSON.stringify([])
				  });						  		  
				  setReload(reload+1);		  
				  document.getElementById("classInput").value = "";	
			  }}>
          추가하기
        </Button>
        <Button variant="outline-secondary" id="button-addon2" onClick = {async ()=>{
				  const docRef = doc(fireStore, "byeolDB", user.uid, "post", addclName);		
				  const deleteQ = await deleteDoc(docRef);						  
				  setReload(reload+1);			
				  document.getElementById("classInput").value = "";					  
			  }}>
          삭제하기
        </Button>		  
      </InputGroup>		  
		  
		  
	  <Form.Select className = "shadow-none" aria-label="Default select example" onChange = {(e)=>{
			  setSelectedclName(e.target.value)
		  }}>
		  <option value = 'all'>전체보기</option>
		  {
			  postList.map((a, i)=>{
				  return(
					  <option key = {i} value = {a}>{a}</option>
				  )
			  })
		  }
	  </Form.Select>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th style = {{"width": "30%"}}>분류</th>
          <th>제목</th>
        </tr>
      </thead>
      <tbody>
		  {printList()}
      </tbody>
    </Table>		  
    </Tab.Container>
  );
}

export default Lists;