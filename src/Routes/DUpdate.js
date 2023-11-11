import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';import Button from 'react-bootstrap/Button';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import {update} from "../store.js"
import { Routes, Route, Link, useNavigate, Outlet, useParams } from 'react-router-dom'
import '../App.css';
import { format } from "date-fns";
import { ko } from "date-fns/esm/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Container from 'react-bootstrap/Container';
import EmotionItem from './EmotionItem.js';
import Loading from './Loading.js';

//Quill
import ReactQuill from 'react-quill';
import "../assets/styles/quillsnow.css"
//fb
import { doc, setDoc, collection, getDoc, query, getDocs, orderBy,  } from "firebase/firestore"; 
import { storage } from '../FireBase.js';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {useRef, useMemo} from 'react';

function DUpdate() {
const [loading, setLoading] = useState(true);		
const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || "";

const emotionList = [
    {
        emotion_id: 1,
        emotion_img: process.env.PUBLIC_URL + `/img/img1.png`,
        emotion_descript: '신난'
    },
    {
        emotion_id: 2,
        emotion_img: process.env.PUBLIC_URL + `/img/img2.png`,
        emotion_descript: '행복한'
    },
    {
        emotion_id: 3,
        emotion_img: process.env.PUBLIC_URL + `/img/img3.png`,
        emotion_descript: '꿉꿉한'
    },
    {
        emotion_id: 8,
        emotion_img: process.env.PUBLIC_URL + `/img/img8.png`,
        emotion_descript: "꼬시기"
    },	
    {
        emotion_id: 5,
        emotion_img: process.env.PUBLIC_URL + `/img/img5.png`,
        emotion_descript: "일어나"
    },
    {
        emotion_id: 6,
        emotion_img: process.env.PUBLIC_URL + `/img/img6.png`,
        emotion_descript: "자러간다"
    },
    {
        emotion_id: 7,
        emotion_img: process.env.PUBLIC_URL + `/img/img7.png`,
        emotion_descript: "GANG~!"
    },
    {
        emotion_id: 4,
        emotion_img: process.env.PUBLIC_URL + `/img/img4.png`,
        emotion_descript: "'8'"
    },	
    {
        emotion_id: 9,
        emotion_img: process.env.PUBLIC_URL + `/img/img9.png`,
        emotion_descript: "예쁜 짓!"
    },
    {
        emotion_id: 10,
        emotion_img: process.env.PUBLIC_URL + `/img/img10.png`,
        emotion_descript: "무운어어~"
    },
    {
        emotion_id: 11,
        emotion_img: process.env.PUBLIC_URL + `/img/img11.png`,
        emotion_descript: "진지함."
    },
    {
        emotion_id: 12,
        emotion_img: process.env.PUBLIC_URL + `/img/img12.png`,
        emotion_descript: "쀼>_<"
    }		
]	


  let navigate = useNavigate()		
  const dispatch = useDispatch();
  let [title, setTitle] = useState('제목없음');
  let [reload, setReload] = useState(0);
  const [value, setValue] = useState('');
  let [date, setDate] = useState(new Date());	
  const [emotion, setEmotion] = useState(1);
  let id = useParams().id;	
  let posts = useSelector((state)=>state.post);
  let diaryList = useSelector((state) => state.diaryList);	
	
  const handleClickEmote = (emotion) => {
	  setEmotion(emotion);
  }
  
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

	useEffect(()=>{
		setLoading(true);
		let selectedDiary = diaryList.filter(i => i.id == id)[0];
		setValue(selectedDiary.content);
		setDate((new Date(selectedDiary.date)))
		setEmotion(selectedDiary.emotion);
		setLoading(false);
	},[])
	
  return (
	<>
	{(loading)?(<Loading/>)
	:	  	  
	<Container style = {{"margin": "10px auto"}}>
	<Row><Col>일기 쓸 날짜</Col></Row>
	<div className="mb-3 ioDP">
	<DatePicker selected={date}
		style = {
				{width: "auto"}
			}
		onChange={date => setDate(date)}
		className = "shadow-none form-control col-md-auto"
		locale={ko}
		dateFormat="yyyy-MM-dd"		
		readOnly = {true}
		/>	
	</div>
	<Row><Col>오늘의 감정</Col></Row>
	<Container id = "emoSelect">
		<div className="input_box emotion_list_wrapper">
				{emotionList.map((it) => (
					< EmotionItem
						onClick={handleClickEmote}
						key={it.emotion_id}
						{...it}
						isSelected={it.emotion_id === emotion}
					/>
				))}
</div>
	</Container>
		  
 	 <ReactQuill 
    	 ref={quillRef}	
		 theme="snow" 
		 value={value} 
		 onChange={setValue}
		 modules = {modules}
		 />		
	
	
      <div className="d-grid gap-2">	 
	<Button variant="dark" size="lg" style ={{margin: "10px 0"}} onClick ={()=>{
			byeolDB.editDiary(format(date, "yyyy-MM"),id, value, format(date,"yyyy-MM-dd"), emotion, ()=>{
				navigate(`/diary`)
			})}}
		>수정하기</Button>			  
	  </div>	  
</Container>		 
}
	</>
  );
}

export default DUpdate;
