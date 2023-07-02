import { configureStore, createSlice } from '@reduxjs/toolkit'
import * as byeolDB from './Script/indexedDB.js'

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
export let {update} = postList.actions;
export let {updatePosts} = posts.actions;
export let {updateTodos} = todos.actions;

export default configureStore({
  reducer: {
	  postList: postList.reducer,
	  posts: posts.reducer,
	  todos: todos.reducer
  }
}) 