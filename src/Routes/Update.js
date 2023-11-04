import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';import Button from 'react-bootstrap/Button';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import {update} from "../store.js"
import { Routes, Route, Link, useNavigate, Outlet, useParams } from 'react-router-dom';	
import '../App.css';
import Container from 'react-bootstrap/Container';
import ReactQuill from 'react-quill';
import "../assets/styles/quillsnow.css"
import Loading from './Loading.js';
import { doc, setDoc, collection, getDoc, query, getDocs, orderBy,  } from "firebase/firestore"; 
import { storage } from '../FireBase.js';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {useRef, useMemo} from 'react';

function Post() {
  let navigate = useNavigate()
  let postList = useSelector((state) => state.postList);
  const dispatch = useDispatch();
  let clName = decodeURI(useParams().clName);
  let id = useParams().id;		
  let [title, setTitle] = useState('제목없음');
  let [reload, setReload] = useState(0);
  let [date, setDate] = useState("날짜")	
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);		

	
  useEffect(()=>{	
	setLoading(true);
	byeolDB.getAll(true).then((result) => dispatch(update(result)));
	byeolDB.getAll(false).then((result)=>{
		  						// console.log(result[1].clName == clName)		  
								 result = result.filter((i)=>i.clName == clName);
		  						 const curPost = result[0].lists.filter((i)=> i.id == id)[0];
		  						 setTitle(curPost.title);//title띄어쓰기 문제!!
		  						 setValue(curPost.content);		  
		  						 setDate(curPost.date);		  		  
								 setTitle(curPost.title);		
								 setLoading(false);				  						 
	  })	
  },[reload])
	
const quillRef = useRef();
const imageHandler = () => {
  console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');

  // 1. 이미지를 저장할 input type=file DOM을 만든다.
  const input = document.createElement('input');
  // 속성 써주기
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
  // input이 클릭되면 파일 선택창이 나타난다.

  // input에 변화가 생긴다면 = 이미지를 선택
  input.addEventListener('change', async () => {
    const file = input.files[0];
	const storageRef = ref(storage, `img/${file.name}`);
	const uploadTask = uploadBytes(storageRef, file);
	
	uploadTask.then((snapshot)=>{
      const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기		
		getDownloadURL(snapshot.ref).then((downloadURL)=>{
			console.log(downloadURL);
      		const range = editor.getSelection();
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
	{(loading)?(<Loading/>)
	:		  
	<Container style = {{"margin": "10px auto"}}>
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
	  
    <Form>	
	
      <div className="d-grid gap-2">	 		  
      	<Button variant="dark" size="lg" style ={{margin: "10px 0"}} onClick = {()=>{
				  byeolDB.editItem(clName,title,value, id, ()=>{navigate(`/detail/${clName}/${id}`)})
			  }}>수정하기</Button>		  
	  </div>
    </Form>
</Container>		  
}
	</>
  );
}

export default Post;
