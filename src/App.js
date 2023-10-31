import React from 'react';
import './App.css';
import {useState, useEffect} from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom'
import { fireStore } from "./FireBase.js";

//import routes Component
import Main from './Routes/Main.js'
import Navbars from './Routes/Navbar.js';
import Post from './Routes/Post.js';
import Detail from './Routes/detail.js'
import Calendar from './Routes/Calendar.js';
import Update from './Routes/Update.js';
import Diary from './Routes/Diary.js';
import DPost from './Routes/DPost.js';
import DDetail from './Routes/DDetail.js';
import DUpdate from './Routes/DUpdate.js';
import Loading from './Routes/Loading.js';

//import bootstrap component
import Container from 'react-bootstrap/Container';


function App() {
	let navigate = useNavigate();
  return (
	  
<div className="App">
<Container className={"g-0"}>
	<Navbars/>
	<Routes>
		<Route path = '/' element = {
				<Main/>				
			}/>
		<Route path = '/post' element = {
				<Post/>				
			}/>		
		<Route path = "/detail/:clName/:id" element = {
				<Detail/>
			}/>
		<Route path = "/update/:clName/:id" element = {
				<Update/>
			}/>		
		<Route path = "/calender" element = {
				<Calendar/>
			}/>		
		<Route path = "/diary" element = {
				<Diary/>
			}/>				
		<Route path = "/diary/post" element = {
				<DPost/>
			}/>		
		<Route path = "/diary/:id" element = {
				<DDetail/>
			}/>		
		<Route path = "/diary/update/:id" element = {
				<DUpdate/>
			}/>				
	</Routes>
</Container>
</div>

  );
}
export default App;
