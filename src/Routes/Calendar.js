import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { format, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { ImCheckboxChecked } from "react-icons/im";
import { ImCheckboxUnchecked } from "react-icons/im";
import { BsFillTrashFill } from "react-icons/bs";
import { BiCalendarCheck, BiBookHeart } from "react-icons/bi";
// import "../assets/styles/_style.scss";
import "../assets/styles/calendar.css"
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
//dbLoaders
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {update, updatePosts, updateTodos, updateDiaryList} from "../store.js"
import Modal from 'react-modal';
import DiaryItem from './DiaryItem.js';
import '../App.css';


const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
    return (
	<Container>
		<Row>
			<Col xs ={9} className="col-start">
                <span className="textYear">
                    <span className="text month">
                        {format(currentMonth, 'M')}월
                    </span>
                    {format(currentMonth, 'yyyy')}
                </span>				
			</Col>
			<Col xs = {3} className="col-end">
                <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
                <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />				
			</Col>
		</Row>
	</Container>			
    );
};

const RenderDays = () => {
    const days = [];
    const date = ['Sun', 'Mon', 'Thu', 'Wed', 'Thrs', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        days.push(
            <Col className="date" key={i}>
                {date[i]}
            </Col>,
        );
    }

    return <Row className="days">{days}</Row>;
};

const RenderCells = ({ currentMonth, selectedDate }) => {
    const dispatch = useDispatch();
	const [modalIsOpen, setModalIsOpen] = useState(false);	
	let [dayList, setDayList] = useState(Array(32).fill(null));
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
	const [clickedDate, setClickedDate] = useState(0);
	const [reload, setReload] = useState(0);
    let diaryList = useSelector((state) => state.diaryList);	
	
	useEffect(()=>{
	  byeolDB.getDiary(format(currentMonth, "yyyy.MM")).then((result)=>{
		  dispatch(updateDiaryList(result.filter(i=> (new Date(i.date)).getDate() == clickedDate)));		
	  })
	},[clickedDate])
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
	
	useEffect(()=>{
		//별디비에서 투두 가져오기
		byeolDB.getTodoAll().then((result)=>{
			let curMonth = currentMonth.getMonth();
			let copy = Array(32).fill(null)			
			for(let i of result){
				for(let j of i.lists){
					for(let q of j.todos){
						let todayObj = new Date(q.dueDate);
						console.log(curMonth, todayObj.getMonth())
						if(curMonth === todayObj.getMonth()){
							let todayDate = todayObj.getDate()
							if(!copy[todayDate]){
								copy[todayDate] = [{clName: i.clName,
													color: i.color,
													id: j.id,
													todoID: q.id,
													content: q.checklist,
													ifChecked: q.ifChecked
													}];
							} else{
								copy[todayDate].push({clName: i.clName,
													color: i.color,
													id: j.id,
													todoID: q.id,
													content: q.checklist,
													ifChecked: q.ifChecked
													});
							}
						}
					}
				}
			}
			setDayList(copy);										
		})			
	},[currentMonth, reload])
	function printTodos(funcDate){
		let arr = []
		const clNames = [...new Set( funcDate.map(v =>{
			return v.clName
		}))]	 
		for(let i of clNames){
			arr.push(
				<>
					<Row style = {
							{backgroundColor: funcDate.find(v => v.clName == i).color,
							fontSize: "0",
							color: funcDate.find(v=>v.clName ==i).color,
							margin: "2px",								
							height: "10%",
							borderRadius: "10px"}
							}							
						key = {i}>			
					.
					</Row>
				</>				
			)
		}
		return arr;
	}
	function printDiary(){
		return(
			<Container id = "diaryContainer" className = "modalss g-0">												
			{diaryList.map((it)=>{
				return(
				<DiaryItem key ={it.id} {...it}/>
				)
			})}		
			</Container>
		)
	}
	function printDetail(obj){
	  let arr = []
	  
	  if(obj.length != 0){
		  for(let i of obj){
			  arr.push(
				  <>
				  <Row className = "clstTodo">
				  	<Col key = {i.todoID}>{i.content}</Col>
					<Col xs="auto">
						<Form.Check // prettier-ignore
							type="checkbox"
							id = {i.todoID}
							checked = {i.ifChecked}
							onChange={() => byeolDB.doneTodo(i.clName, i.id, i.todoID).then((result) =>{
								setReload(reload+1);
							})}							
						  />
					  </Col>
					<Col xs="auto"><div onClick = {()=>
												  byeolDB.deleteTodo(i.clName, i.id, i.todoID).then((result)=>{
						setReload(reload+1);
					})
												  }><BsFillTrashFill/></div></Col>					  
				  </Row>
				  <Row className = "clstRow">
				  	<Col xs="auto" key = {i.clName+i.id}>{i.clName}</Col>					  					  					  
				  </Row>
				  </>
			  )
		  }
		  }	 
	  return arr;
	}	
    while (day <= endDate) {
		let key = 100;
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const cloneDay = day;
			key +=1;
            days.push(
                <div
                    className={`col cell ${
                        !isSameMonth(day, monthStart)
                            ? 'disabled'
                            : isSameDay(day, selectedDate)
                            ? 'selected'
                            : format(currentMonth, 'M') !== format(day, 'M')
                            ? 'not-valid'
                            : 'valid'
                    }`}
                    key={key}
					id = {
						format(currentMonth, 'M') !== format(day, 'M')
                            ? "nope"
                            : formattedDate
					}
					onClick = {(e)=>{					
						if(e.currentTarget.id != "nope"){							
							console.log(dayList[e.currentTarget.id])
							setClickedDate(parseInt(e.currentTarget.id))
							setModalIsOpen(true)
						}
					}}
                >
                    <Row
						key = {"Row"+key}
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'text not-valid'
                                : ''
                        }
                    >
						<Col key = {"Col" + key}>{formattedDate}</Col>
                    </Row>
						{
							format(currentMonth, 'M') !== format(day, 'M')
								?""
								:(dayList[formattedDate])
									?printTodos(dayList[formattedDate])
									:""
							}
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
			<Row key = {day} xs={8}>
				{days}
			</Row>,
        );
        days = [];
    }
    return <div className="body">{rows}
		
		  <Modal isOpen={modalIsOpen}
    			onRequestClose={()=>setModalIsOpen(false)}			  
    			ariaHideApp={false}	
			  	style = {
				{overlay: {zIndex: 1000}}
			}>
			<Container>
	<Row style = {{fontSize: "18pt", fontWeight: "900", margin: "10px 0", textAlign: "left"}}><Col><BiBookHeart style = {{marginLeft: 0}}/>Diary</Col></Row>				
			{(diaryList.length != 0)
				?printDiary()
			 	:<Container>일기가 존재하지 않습니다.</Container>
			}
				
				
				<Row style = {{fontSize: "18pt", fontWeight: "900", margin: "10px 0", textAlign: "left"}}><Col><BiCalendarCheck style = {{marginLeft: 0}}/>TodoList</Col></Row>
			<Container id = "clstContainer">			  
			  {dayList[clickedDate]
			   	  ?printDetail(dayList[clickedDate])
				  :"일정이 존재하지 않습니다."
			  }
			</Container>
			</Container>								
		  </Modal>			
					
	</div>;
};



const Calendar = () => {
	  
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
	
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };
	let dDay = new Date(2020,10,18)
    return (
        <div className="calendar" style = {{"margin": "5px 4px 5px 0px"}}>
            <RenderHeader
                currentMonth={currentMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
            />
			<Container className>
				<RenderDays />
				<RenderCells
					currentMonth={currentMonth}
					selectedDate={selectedDate}
				/>				
			</Container>									
			
			<div className='dDay dDayRow'>오랑한 지 <span className='dDay1'>{Math.ceil(	(dDay.getTime()-selectedDate.getTime()) / (1000*60*60*-24))}</span> 일 째</div>
        </div>
    );
};
export default Calendar;