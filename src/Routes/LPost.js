import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';import Button from 'react-bootstrap/Button';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import {updateUser,update, updatePosts} from "../store.js"
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import '../App.css';
import Container from 'react-bootstrap/Container';
//Quill
import ReactQuill from 'react-quill';
import "../assets/styles/quillsnow.css"
//fb
import { doc, addDoc, setDoc, collection, getDoc, query, getDocs, orderBy,  } from "firebase/firestore"; 
import { storage } from '../FireBase.js';
import { fireStore } from '../FireBase.js';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {useRef, useMemo} from 'react';
import { format } from "date-fns";


function LPost() {
  let navigate = useNavigate()		
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);			
  let [title, setTitle] = useState('');
  let [reload, setReload] = useState(0);
  const [value, setValue] = useState('');
const quillRef = useRef();
const imageHandler = () => {

  // 1. 이미지를 저장할 input type=file DOM을 만든다.
  const input = document.createElement('input');
  // 속성 써주기
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
  // input이 클릭되면 파일 선택창이 나타난다.
  // input에 변화가 생긴다면 = 이미지를 선택
  input.addEventListener('change', async () => {
    const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기			  
    const file = input.files[0];
	const storageRef = ref(storage, `img/${file.name}`);
	const uploadTask = uploadBytes(storageRef, file);
    const range =  editor.getSelection();
	editor.insertEmbed(range.index, "image", process.env.PUBLIC_URL +"/img/loading.gif");
	  
	uploadTask.then((snapshot)=>{
		editor.deleteText(range.index, 1);		
		getDownloadURL(snapshot.ref).then((downloadURL)=>{
			console.log(downloadURL);
      // 가져온 위치에 이미지를 삽입한다
      		editor.insertEmbed(range.index, 'image', downloadURL);			
		})
	})
  });
};


const modules =  useMemo(() => {
  return {
	toolbar: {
		container: [
		  [{ 'size': ['small', false, 'large', 'huge'] },'blockquote', 'code-block'],
		  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],			
		  [{ 'header': 1 }, { 'header': 2 }],
		  ['bold', 'italic', 'underline', 'strike'],
		  [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] },'link', 'image', 'video'],
		],
		handlers:{
          image: imageHandler,		
	},
	}}
}, []);
	
	
  return (
	<>
	<Container id = "letterContainer" style = {{"margin": "10px auto"}}>
      <InputGroup className="mb-3">
        <Form.Control className = "shadow-none" style = {{'width': '60%'}} type="text" placeholder="글 제목" id = "titleInput" defaultValue = {title} onChange={(e)=>{
				  setTitle(e.target.value);
			  }}/>
	  </InputGroup>
		
 	 <ReactQuill 
    	 ref={quillRef}	
		 theme="snow" 
		 value={value} 
		 onChange={setValue}
		 modules = {modules}
		 />		
	
	
      <div className="d-grid gap-2">	 		  
      	<Button variant="dark" size="lg" style ={{margin: "10px 0"}} onClick = {async ()=>{
				   await addDoc(collection(fireStore, "letters"),{
					   author: user.name,
					   title: title,
					   value: value,
					   date: format(new Date(), "yyyy.MM.dd HH:mm:ss")
				   });
				   navigate('/letter');
			  }}>작성하기</Button>		  	  		  
	  </div>
</Container>		  
	</>
  );
}

export default LPost;
