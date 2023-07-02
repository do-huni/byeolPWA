import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';import Button from 'react-bootstrap/Button';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import {update} from "../store.js"
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import '../App.css';
import Container from 'react-bootstrap/Container';
//Quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


function Post() {
  let navigate = useNavigate()		
  let postList = useSelector((state) => state.postList);
  const dispatch = useDispatch();
  let [addclName, setAddclName] = useState('기타');	
  let [selectedclName, setSelectedclName] = useState('기타');	
  let [title, setTitle] = useState('제목없음');
  let [reload, setReload] = useState(0);
  const [value, setValue] = useState('');
const modules = {
	toolbar: {
		container: [
		  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		  // [{ 'font': [] }],
		  [{ 'align': [] }],
		  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
		  [{ 'list': 'ordered' }, { 'list': 'bullet' }, 'link'],
		  [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }],
		  ['image'],
		  ['clean']  
		]		
	}
}
  useEffect(()=>{
	byeolDB.getAll(true).then((result) => dispatch(update(result)));
	setSelectedclName(document.querySelector('.form-select').value)
  },[reload])
	
  return (
	<>
	<Container style = {{"margin": "10px auto"}}>
      <InputGroup className="mb-3">
	  <Form.Select	className = "shadow-none" aria-label="Default select example" onChange = {(e)=>{
			  setSelectedclName(e.target.value)
		  }}>
		  {
			  postList.map((a, i)=>{
				  return(
					  <option value = {a} key = {i}>{a}</option>
				  )
			  })
		  }
	  </Form.Select>
        <Form.Control className = "shadow-none" style = {{'width': '40%'}} type="text" placeholder="글 제목" onChange={(e)=>{
				  setTitle(e.target.value);
			  }} />
	  </InputGroup>
	  
	  
    <Form>	
		
 	 <ReactQuill 
		 theme="snow" 
		 value={value} 
		 onChange={setValue}
		 modules = {modules}
		 />		
	
	
      <div className="d-grid gap-2">	 		  
      	<Button variant="dark" size="lg" onClick = {()=>{
				  byeolDB.updateItem(selectedclName,title,value,()=>{navigate('/')})
			  }}>put</Button>		  
	  </div>
    </Form>
</Container>		  
	</>
  );
}

export default Post;
