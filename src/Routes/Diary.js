import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import {update} from "../store.js"
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import '../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {edit} from "../store.js"
import { BsCaretRightFill, BsCaretLeftFill } from "react-icons/bs";

import DList from './DList.js';


function Diary() {
  let navigate = useNavigate()		
  let diaryDate = useSelector((state) => state.diaryDate);  
  let diaryList = useSelector((state) => state.diaryList);
  const dispatch = useDispatch();

return (
	<>
	<Container style = {{marginBottom: "10px"}}>
		<Row style = {
				{borderBottom: "1px solid #ccc",
				margin: "0 0 10px 0",
				padding: "10px",
				fontSize: "1.5rem"}
			}>
			<Col onClick={()=>{					
					dispatch(edit({ifminus: true}));
				}}>
				<BsCaretLeftFill/>
			</Col>
			<Col>
				{diaryDate}				
			</Col>
			<Col onClick={()=>{					
					dispatch(edit({ifminus: false}));
				}}>
				<BsCaretRightFill/>
			</Col>
		</Row>
		
		<DList/>
	</Container>		  
	</>
  );
}


export default Diary;
