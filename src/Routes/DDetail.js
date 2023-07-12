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

function DDetail(){
    const dispatch = useDispatch();	
  	let navigate = useNavigate()			
    let diaryList = useSelector((state) => state.diaryList);	
    let [reload, setReload] = useState(0);	
	let id = useParams().id;	
  	let diaryDate = useSelector((state) => state.diaryDate);  	
	const [value, setValue] = useState("내용");
	const [date, setDate] = useState("날짜");
	const [emotion, setEmotion] = useState(1);
	
	useEffect(()=>{
		let selectedDiary = diaryList.filter(i => i.id == id)[0];
		setValue(selectedDiary.content);
		setDate(format(new Date(selectedDiary.date), 'yyyy년 MM월 dd일(EEE)', {locale: ko}));
		setEmotion(selectedDiary.emotion);
	})
	
const modules = {
      toolbar: false
}	
	
	return(
		<Container style = {{"margin": "10px auto"}}>
			<Row><div className = {"postTitle"}>{date}</div></Row>	
			
            <div className={[
                "emotion_img_wrapper"
            ].join(" ")}
            >
            <img src={process.env.PUBLIC_URL + `/img/img${emotion}.png`}/>
            </div>
			
			<ReactQuill
				style = {
					{border: "none"}
				}
				readOnly
				theme="bubble"
				value={value}
		 		modules = {modules}				
			/>			
			
			<Button variant="primary" size="lg" style = {{margin: "5px"}} onClick = {() => navigate(`/diary/update/${id}`)}>수정하기</Button>
			
			<Button variant="dark" size="lg" style = {{margin: "5px"}} onClick = {()=>{
  					  var ans = window.confirm("삭제 하시겠습니까?");
					  if(ans){
					  	byeolDB.deleteDiary(diaryDate,id, () => {navigate('/diary')})  					 											  
					  }
				  }}>삭제하기</Button>				
		</Container>
		
	)
}

export default DDetail;