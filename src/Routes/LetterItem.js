import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import "../assets/styles/quillbubble.css"
import '../App.css';

const LetterItem = ({ author, date, title, value, id }) => {
	

    const navigate = useNavigate();
    const goDetail = () => {
        navigate(`/letter/${id}`);
    }
    return (
		<>
        <tr onClick = {goDetail}>
			<td className = {"letter br1pxsolid"}>{title}</td>
			<td className = {"letter"} rowSpan = {2}>{author}</td>
        </tr>
		<tr style = {{borderBottom: "1px solid #c2c2c2"}}>
			<td className = {"letterDate br1pxsolid"}>{date}</td>			
		</tr>
		</>
    )
}

export default LetterItem;