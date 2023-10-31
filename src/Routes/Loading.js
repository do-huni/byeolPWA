import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import {update} from "../store.js"
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {edit} from "../store.js"
import { BsCaretRightFill, BsCaretLeftFill } from "react-icons/bs";

import DList from './DList.js';



function Loading() {


return (
	<>
		<img
		  alt=""
		  src= {process.env.PUBLIC_URL +"/img/loading.gif"}
		/>
	</>
  );
}


export default Loading;
