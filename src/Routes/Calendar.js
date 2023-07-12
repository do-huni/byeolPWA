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
	  byeolDB.getDiary(format(currentMonth, "yyyy-MM")).then((result)=>{
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
	const [modalOpen, setModalOpen] = useState(false);	
	const [counter, setCounter] = useState(0);
	
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
			<div className='dDay dDayRow'>오랑한 지 <span className='dDay1' onClick={()=>{setCounter(counter +1);
																					  if(counter==5){
																						setModalOpen(true)
																					  }
																					  }}>{Math.ceil(	(dDay.getTime()-selectedDate.getTime()) / (1000*60*60*-24))}</span> 일 째</div>
			
			
		  <Modal isOpen={modalOpen}
    			onRequestClose={()=>setModalOpen(false)}			  
    			ariaHideApp={false}	
			  	style = {
				{overlay: {zIndex: 1000}}
			}>
			<Container>
				<div className = "letter" style ={{fontSize: "20pt", fontWeight: "900"}}>한별이에게</div>
				<p className = "letter"> &nbsp;안녕 한별누나! 스물한살 도훈이야. 스물 둘을 두번이나 축하해줄 수 있다니 영광이야! 작년 스물 둘 챙겨준 게 입대 두달 전이었는데.. 어느덧 시간이 흘러흘러 이렇게 또 별이 생일을 챙겨주고 있네요. ㅎㅎ 영광입니다!
				<br></br><br></br> &nbsp;스무살 때부터 항상 같이 붙어있다보니 잘 몰랐는데, 타인에게 무언가를 바라고 받는다는 게 참으로 어려운 일인 거 같아. 한별이를 볼 수 없는 일상 속에서,
					새로운 사람들을 오랜만에 만나보니까, 인간관계라는게 참 일방향적이다 싶더라구.
					각자가 바라는 것과 해줄 수 있는 것들도 너무 다르고 다양하고 서로를 향한 생각도 너무나도 다르고, 그걸 또 알게 돼버리니까 사람들한테 딱히 무언갈 기대하지 않게 되더라.<br></br><br></br>
					&nbsp;근데 신기한게 이렇게 회의회의 한 상태로 너한테 전화를 하면, 갑자기 이런거 다 까먹고 오오옳 홀롤롤로로 바보소리만 내고 있더라? 웃기징. 아까까진 잔뜩 무게잡고 인생 독고다이 이러고 있었는데 말야.
					너랑 전화하는 순간 혼자 있을 때 보다 더 더 짐을 내려놓는 거 같아. <br></br><br></br>
					&nbsp;여보의 바보짓에 까스라이팅 됐나..? 한별이 앞에만 가면 온갖 벽들이 다 무너져. 실컷 애교도 부리고 싶고 사랑도 해주고 싶고 어떨 땐 그냥 사랑 실컷 받고도 싶고 그래. 딴 사람한테는 잘 안그러는 데, 왜 한별이 앞에만 서면 하고싶은 게 많아지지?
					너랑 이것도 저것도 같이 하고싶고, 한별이가 좋아할 만한 건 다 해주고싶고, 그리고 실컷 예쁨도 받고 싶고. 자꾸 너랑 함께 있는 미래를 기대하게 돼. 찐오랑인듯.
				<br></br><br></br> &nbsp;내 오롱롱랑랑랑아!! 내 여보 내 동반자야! 앞으로도 내 영원히 사랑할게요. 그니까 백살 천살 만살까지 나랑 함께해죠!</p>
			</Container>								
		  </Modal>					
        </div>
    );
};
export default Calendar;