import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { format, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { ImCheckboxChecked } from "react-icons/im";
import { ImCheckboxUnchecked } from "react-icons/im";

// import "../assets/styles/_style.scss";
import "../assets/styles/calendar.css"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
//dbLoaders
import * as byeolDB from '../Script/indexedDB.js'
import { useDispatch, useSelector } from "react-redux"
import {update, updatePosts, updateTodos} from "../store.js"

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

const RenderCells = ({ currentMonth, selectedDate, onDateClick }) => {


	let [dayList, setDayList] = useState(Array(32).fill(null));
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

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
													id: i.id,
													content: q.checklist,
													ifChecked: q.ifChecked
													}];
							} else{
								copy[todayDate].push({clName: i.clName,
													color: i.color,
													id: i.id,
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
	},[currentMonth])
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
							}							>			
					.
					</Row>
				</>				
			)
		}
		return arr;
	}
    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const cloneDay = day;
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
                    key={day}
                    onClick={() => onDateClick(parseISO(cloneDay))}
                >
                    <Row
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'text not-valid'
                                : ''
                        }
                    >
						<Col>{formattedDate}</Col>
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
    return <div className="body">{rows}</div>;
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
    const onDateClick = (day) => {
        setSelectedDate(day);
    };
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
					onDateClick={onDateClick}
				/>				
			</Container>
        </div>
    );
};
export default Calendar;