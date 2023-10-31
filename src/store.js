import { configureStore, createSlice } from '@reduxjs/toolkit'
import * as byeolDB from './Script/indexedDB.js'
import { sub, format, add } from "date-fns";

let user = createSlice({
	name: 'user',
	initialState: {
		uid: "0",		
		name: "익명",
		email: "xxxx@gmail.com"		
	},
	reducers: {
		updateUser(state, action){
			let returnVal = action.payload;
			return returnVal;			
		}
	}
})

let posts = createSlice({
	name: 'posts',
	initialState: [{
		clName: 0,
		color: "#fff",
		lists: [{
			title: '제목',
			id: 0,
			content: 'content',
			date: 2020
		}]
	}],
	reducers:{
		updatePosts(state, action){
			let returnVal = action.payload;
			return returnVal
		}	
	}
})
let todos = createSlice({
	name: 'todos',
	initialState: [{
		clName: 0,
		color: "#fff",
		lists: [{
			checklist: '제목',
			id: 0,
			ifChecked: false,
			dueDate: 2020
		}]
	}],
	reducers:{
		updateTodos(state, action){
			let returnVal = action.payload;
			return returnVal
		}	
	}
})
let postList = createSlice({
	name: 'postList',
	initialState: ['1'],
	reducers:{
		update(state, action){
			let returnVal = action.payload;
			return returnVal;
		}
	}
})

let diaryList = createSlice({
	name: "diaryList",
	initialState: [
	{
	id: 0,
	emotion: 0,
	content: "일기 내용",
	date: "2001-12-10"
	},
	{
	id: 1,
	emotion: 0,
	content: "일기 내용",
	date: "2001-07-15"
	}		
],
	reducers:{
		updateDiaryList(state, action){
			let returnVal = action.payload;
			return returnVal			
		}
	}
})

let diaryDate = createSlice({
	name: "diaryDate",
	initialState: format(new Date(), "yyyy-MM"),
	reducers:{
		edit(state, action){
			let copy = new Date(state);
			if (action.payload.ifminus){
				return format(sub(copy, {
					months: 1
				}),"yyyy-MM")
			} else{
				return format(add(copy, {
					months: 1
				}),"yyyy-MM")	
			}
		}
	}	
})
export let {update} = postList.actions;
export let {updatePosts} = posts.actions;
export let {updateTodos} = todos.actions;
export let {edit} = diaryDate.actions;
export let {updateDiaryList} = diaryList.actions;
export let {updateUser} = user.actions;

export default configureStore({
  reducer: {
	  postList: postList.reducer,
	  posts: posts.reducer,
	  todos: todos.reducer,
	  diaryList: diaryList.reducer,
	  diaryDate: diaryDate.reducer,
	  user: user.reducer
  }
}) 