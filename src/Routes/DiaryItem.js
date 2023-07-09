import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux"
import {useState, useEffect} from 'react';
import ReactQuill from 'react-quill';
import "../assets/styles/quillbubble.css"
import '../App.css';

const DiaryItem = ({ id, emotion, content, date }) => {
	
	const modules = {
		  toolbar: false
	}	
  	let diaryDate = useSelector((state) => state.diaryDate);  	
    const navigate = useNavigate();
    const strDate = format(new Date(date), "yyyy.MM.dd")
    const goDetail = () => {
        navigate(`/diary/${id}`);
    }
    return (
        <div className="DiaryItem">
            <div onClick={goDetail} className={[
                "emotion_img_wrapper"
            ].join(" ")}
            >
            <img src={process.env.PUBLIC_URL + `/img/img${emotion}.png`}/>
            </div>
            <div onClick={goDetail} className="info_wrapper" >
                <div className="diary_date">{strDate}</div>
				<ReactQuill
					style = {
						{border: "none"}
					}
					readOnly
					theme="bubble"
					value={content}
					modules = {modules}				
				/>						
            </div>
            <div className="btn_wrapper">
            </div>
        </div>
    )
}

export default DiaryItem;