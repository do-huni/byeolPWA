import { format } from "date-fns";

const DBversion = 2;
function upgrade(event){
	console.log('upgradeneeded');
	const db = event.target.result;
	let oldVersion = event.oldVersion;
	if(oldVersion<1){
		const postStore = db.createObjectStore("post", {keyPath: 'clName', autoIncrement: false});
		postStore.createIndex('clName', 'clName', {unique: true});
		const todoStore = db.createObjectStore("todo", {keyPath: 'clName', autoIncrement: false});
		const idStore = db.createObjectStore("id", {keyPath: 'access', autoIncrement: false});	
		idStore.createIndex('access', 'access', {unique: true});								
		const diaryStore = db.createObjectStore("diary", {keyPath: 'hook', autoIncrement: false});	
		diaryStore.createIndex('hook', 'hook', {unique: true});	
	}
	if(oldVersion<2){
		const userStore = db.createObjectStore("user", {keyPath: 'uid', autoIncrement: false});			
	}
}
export function setUser(uid, email, name){
	return new Promise((resolve, reject)=>{
		
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		const db = event.target.result;				
		const deleteStore = db.transaction('user', 'readwrite').objectStore('user');
		const deleteReq = deleteStore.clear();
		
		deleteReq.addEventListener('success', function(r){
			const userStore = db.transaction('user', 'readwrite').objectStore('user');
			const user = {
				uid: uid,
				email: email,
				name: name
			};			
			const req = userStore.put(user);	//end of putReq
			resolve(user);			
		});
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded									
	})	//end of promise
} //end of function	

export function getUser(){
	return new Promise((resolve, reject)=>{
		
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		let returnVal = {uid: "", name: "", email: ""};		
		const db = event.target.result;		
		const readStore =db.transaction('user', 'readwrite').objectStore('user');
		const readReq = readStore.getAll();
		readReq.addEventListener("success", function(r){
			// console.log(r.target.result);
			if(r.target.result.length == 0){
				const userAddStore = db.transaction('user', 'readwrite').objectStore('user');
				const user = {
					uid: "0",
					email: "xxxx@gmail.com",
					name: "익명"
				};			
				const req = userAddStore.put(user);	//end of putReq					
			}
			const userStore = db.transaction('user', 'readwrite').objectStore('user');
			const req = userStore.getAll();	
			req.addEventListener("success", function(result){			
				resolve(result.target.result[0]);			
			});		
			
		});					
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded									
	})	//end of promise
} //end of function	
export function replaceAllData(parsedData){		
	return new Promise((resolve, reject)=>{		
	// console.log(parsedData);
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		const db = event.target.result;		
// 		db를 싹 비우기
		const deleteUserStore = db.transaction('user', 'readwrite').objectStore('user');
		const deleteUserReq = deleteUserStore.clear();
		deleteUserReq.addEventListener('success', function(r){
		const deleteIdStore = db.transaction('id', 'readwrite').objectStore('id');
		const deleteIdReq = deleteIdStore.clear();
		deleteIdReq.addEventListener('success', function(r){
		const deleteTodoStore = db.transaction('todo', 'readwrite').objectStore('todo');
		const deleteTodoReq = deleteTodoStore.clear();
		deleteTodoReq.addEventListener('success', function(r){
		const deleteDiaryStore = db.transaction('diary', 'readwrite').objectStore('diary');
		const deleteDiaryReq = deleteDiaryStore.clear();
		deleteDiaryReq.addEventListener('success', function(r){
		const deletePostStore = db.transaction('post', 'readwrite').objectStore('post');
		const deletePostReq = deletePostStore.clear();
		deletePostReq.addEventListener('success', async function(r){
// 			for문 돌면서 쓰기. 비동기로 해도 될듯
			const putDiaryStore =  db.transaction('diary', 'readwrite').objectStore('diary');			
			for(let i = 0; i<parsedData.diary.length; i++){
				await putDiaryStore.add(parsedData.diary[i]);
				console.log("diary 로드 완료");
			}
			const putPostStore =  db.transaction('post', 'readwrite').objectStore('post');			
			for(let i = 0; i<parsedData.post.length; i++){
				await putPostStore.add(parsedData.post[i]);
				console.log("post 로드 완료");				
			}
			const putTodoStore =  db.transaction('todo', 'readwrite').objectStore('todo');			
			for(let i = 0; i<parsedData.todo.length; i++){
				await putTodoStore.add(parsedData.todo[i]);
				console.log("todo 로드 완료");				
			}
			const putIdStore =  db.transaction('id', 'readwrite').objectStore('id');			
			for(let i = 0; i<parsedData.id.length; i++){
				await putIdStore.add(parsedData.id[i]);
				console.log("id 로드 완료");				
			}
			const putUserStore =  db.transaction('user', 'readwrite').objectStore('user');			
			for(let i = 0; i<parsedData.user.length; i++){
				await putUserStore.add(parsedData.user[i]);
				console.log("user 로드 완료");				
			}			
			resolve();
		});			
		});			
		});			
		});			
		});
		
		
	});	//end of dbReq
	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded				
	}) //end of promise		
} //end of function		
export function getJSON(){
	return new Promise((resolve, reject)=>{
		
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		let returnVal = {post: "", todo: "", id: "", diary: "", user: ""};		
		const db = event.target.result;		
		const postStore = db.transaction('post', 'readwrite').objectStore('post');			
		let getAllPostData = postStore.getAll();
		getAllPostData.addEventListener("success", function(post){
			const todoStore = db.transaction('todo', 'readwrite').objectStore('todo');			
			let getAllTodoData = todoStore.getAll();
			getAllTodoData.addEventListener("success", function(todo){
				const idStore = db.transaction('id', 'readwrite').objectStore('id');			
				let getAllIdData = idStore.getAll();				
				getAllIdData.addEventListener("success", function(id){
					const diaryStore = db.transaction('diary', 'readwrite').objectStore('diary');			
					let getAllDiaryData = diaryStore.getAll();				
					getAllDiaryData.addEventListener("success", function(diary){
						const userStore = db.transaction('user', 'readwrite').objectStore('user');
						let getAllUserData = userStore.getAll();
						getAllUserData.addEventListener("success", function(user){						
							
							returnVal["post"] = post.target.result;
							returnVal["todo"] = todo.target.result;
							returnVal["id"] = id.target.result;
							returnVal["diary"] = diary.target.result;
							returnVal["user"] = user.target.result;
							
							resolve(returnVal);								
						})								
					})//end of diary
				});	//end of id				
			}); //end of todo			
		}); //end of post
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded				
	})	//end of promise
} //end of function	
export function addItem(clName, color){
	
	const dbReq = indexedDB.open('byeolDB',DBversion)

	dbReq.addEventListener("success", function(event){
		const db = event.target.result;
		const transaction = db.transaction('post', 'readwrite');
		const postStore = transaction.objectStore('post');		
		const req = postStore.add({
		clName: clName,
		color: color,
		lists: []
		})
		let todoStore = db.transaction("todo", "readwrite").objectStore("todo")
		const todoReq = todoStore.add({
			clName : clName,
			color: color,
			lists: []
		})
	});
	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	});
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded		
}

export function updateItem(clName, title, content, callback){
	let id;
	const dbReq = indexedDB.open('byeolDB',DBversion)

	dbReq.addEventListener("success", function(event){
		const db = event.target.result;
		const transaction = db.transaction('post', 'readwrite');		
		const postStore = transaction.objectStore('post');			
		const readReq = postStore.get(clName)		
		readReq.addEventListener('success', function(e){
			let idStore = db.transaction("id", "readwrite").objectStore("id")
			const idReadReq = idStore.get("id")
			idReadReq.addEventListener('success', function(e1){
				if(!e1.target.result){
					let idAddStore = db.transaction("id", "readwrite").objectStore("id")
					const idAddReq = idAddStore.add({
						id : 1,
						access: 'id'
					})
					// console.log('complete')
					id = 1;

				} else{
					id = e1.target.result.id;
				}		
				const color = e.target.result.color;
				const lists = e.target.result.lists
				const addObj= {
					id: id,
					title: title,
					content: content,
					date: format(new Date(), "yyyy.MM.dd HH:mm:ss")
				}
				const putStore = db.transaction('post', 'readwrite').objectStore('post');		
				const req = putStore.put({
					clName: clName,
					color: color,
					lists: [...lists,addObj]
				});	//end of putReq
				const idPutStore = db.transaction('id', 'readwrite').objectStore('id');
				const idPutReq = idPutStore.put({
					id: id+1,
					access: 'id'
				})		
				req.onsuccess = function(a){
					callback();					
				}
			}) //end of idReadReq success

		});	 //end of readReq		
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded			
} //end of function

export function deleteItem(clName, id, callback){
	const dbReq = indexedDB.open('byeolDB',DBversion)

	dbReq.addEventListener("success", function(event){
		const db = event.target.result;		
		const postStore = db.transaction('post', 'readwrite').objectStore('post');			
		const readReq = postStore.get(clName);
		readReq.addEventListener('success', function(e){
			const lists = e.target.result.lists	;	
			const color = e.target.result.color;
			const putStore = db.transaction('post', 'readwrite').objectStore('post');		
			const putVal = lists.filter(e=> e.id != id);
			const req = putStore.put({
				clName: clName,
				color: color,
				lists: putVal
			});	//end of putReq	
			const todoStore = db.transaction('todo', 'readwrite').objectStore('todo');
			const todoReadReq = todoStore.get(clName);
			todoReadReq.addEventListener('success', function(e1){
				let todoLists = e1.target.result.lists.filter(i => i.id != id);
				let color = e1.target.result.color;
				const todoPutStore = db.transaction('todo', 'readwrite').objectStore('todo');
				const todoPut = todoPutStore.put({
					clName: clName,
					color: color,
					lists: todoLists
				})
				callback();				
			});
		}); //end of readReq
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded			
} //end of function	

export function getAll(ifName){
	return new Promise((resolve, reject)=>{
		
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		let returnVal = 1;		
		const db = event.target.result;		
		const postStore = db.transaction('post', 'readwrite').objectStore('post');			
		let getAllData = postStore.getAll();
		getAllData.addEventListener("success", function(event){
			let nameList = [];
			for(let value of event.target.result){
				nameList.push(value.clName);
			}
			if(ifName){
				returnVal = nameList;
			} else{
				returnVal = event.target.result;
			}
			resolve(returnVal);			
		})
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded					
		
		
		
	})	//end of promise
} //end of function	

export function deleteClass(clName){
	const dbReq = indexedDB.open('byeolDB',DBversion)

	dbReq.addEventListener("success", function(event){
		const db = event.target.result;		
		const postStore = db.transaction('post', 'readwrite').objectStore('post');			
		const deleteReq = postStore.delete(clName);
		deleteReq.addEventListener('success', function(e){
			// console.log(e)	
		}); //end of deleteReq
		const todoStore = db.transaction('todo', 'readwrite').objectStore('todo');
		const TdeleteReq = todoStore.delete(clName);
		TdeleteReq.addEventListener("success", function(e1){
			// console.log(e1)
		})
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded			
} //end of function	

export function editItem(clName, title, content, id, callback){
	
	const dbReq = indexedDB.open('byeolDB',DBversion)

	dbReq.addEventListener("success", function(event){
		const db = event.target.result;
		const transaction = db.transaction('post', 'readwrite');		
		const postStore = transaction.objectStore('post');			
		const readReq = postStore.get(clName)		
		readReq.addEventListener('success', function(e){									
				const color = e.target.result.color;
				let lists = e.target.result.lists
				lists = lists.filter(i => i.id != id);			
				const addObj= {
					id: id,
					title: title,
					content: content,
					date: format(new Date(), "yyyy.MM.dd HH:mm:ss")
				}
				const putStore = db.transaction('post', 'readwrite').objectStore('post');		
				const req = putStore.put({
					clName: clName,
					color: color,
					lists: [...lists,addObj]
				});	//end of putReq
				callback();
			}) //end of idReadReq success

		});	 //end of readReq		
	}//end of dbReq success

export function addTodo(clName, id, checklist, dueDate, callback){
	
	const dbReq = indexedDB.open('byeolDB',DBversion)

	dbReq.addEventListener("success", function(event){
		const db = event.target.result;		
		let idStore = db.transaction("id", "readwrite").objectStore("id")
		const idReadReq = idStore.get("todoid")
		idReadReq.addEventListener('success', function(e1){
			let todoid;
			if(!e1.target.result){
				let idAddStore = db.transaction("id", "readwrite").objectStore("id")
				const idAddReq = idAddStore.add({
					id : 1,
					access: 'todoid'
				})
				// console.log('complete')
				todoid = 1;

			} else{
				todoid = e1.target.result.id;
			}
			const idPutStore = db.transaction('id', 'readwrite').objectStore('id');
			const idPutReq = idPutStore.put({
				id: todoid+1,
				access: 'todoid'
			})
			//todoid 읽고(없으면 생성) 1더하는 작업 fin
			const todoReadStore = db.transaction("todo", "readwrite").objectStore('todo');			
			const readReq = todoReadStore.get(clName)
			readReq.addEventListener('success', function(e){			
				const color = e.target.result.color;
				let lists = e.target.result.lists
				//lists에 id == todoid인 값이 없다면, lists = [...lists, {id:id, todos: []}]
				if(!lists.find(val => val.id == id)){
					const firstPush = {
						id: id,
						todos: []
					}
					lists = [...lists, firstPush];
				}
				//그 값의 todos에 [...addObj]
				let valIndex = lists.findIndex(val => val.id == id);
				const addObj= {
					id: todoid,
					checklist: checklist,
					ifChecked: false,
					dueDate: dueDate					
				}				
				lists[valIndex].todos = [...lists[valIndex].todos,addObj]
				const todoPutStore = db.transaction("todo","readwrite").objectStore('todo');
				const todoPutReq = todoPutStore.put({
					clName: clName,
					color: color,
					lists: lists
				});	//end of putReq	
				callback();
			})//end of readreq
		})
	});//end of dbReq
	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	});
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded		
}


export function getTodoAll(){
	return new Promise((resolve, reject)=>{
		
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		let returnVal = 1;		
		const db = event.target.result;		
		const todoStore = db.transaction('todo', 'readwrite').objectStore('todo');
		let getAllData = todoStore.getAll();
		getAllData.addEventListener("success", function(event){
			returnVal = event.target.result;
			resolve(returnVal);			
		})
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded							
	})	//end of promise
} //end of function	

/*
todoStore의 clName을 get해옴
put 요청
clName = 그대로
color = 그대로
lists의 id == id(입력값)의 todos에서
todoid == todoid(입력값)인 값 obj를 가져오고
ifChecked = !ifChecked 한다음
list에서 그 todoid filter != 하고
put [...lists, obj]

*/
export function doneTodo(clName, id, todoID){
	return new Promise((resolve, reject)=>{
		
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		const db = event.target.result;
		const transaction = db.transaction('todo', 'readwrite');		
		const todoStore = transaction.objectStore('todo');			
		const readReq = todoStore.get(clName);
		readReq.addEventListener('success', function(e){
			let lists = e.target.result.lists	;	
			const color = e.target.result.color;
			const index = lists.findIndex(el => el.id == id);
			const todoIndex = lists[index].todos.findIndex(el => el.id == todoID);
			lists[index].todos[todoIndex].ifChecked = !lists[index].todos[todoIndex].ifChecked;			
			
			const putStore = db.transaction('todo', 'readwrite').objectStore('todo');		
			const req = putStore.put({
				clName: clName,
				color: color,
				lists: lists
			});	//end of putReq
			resolve("finished");

		});	 //end of readReq		
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded								
	})	//end of promise
} //end of function	

export function deleteTodo(clName, id, todoID){
	return new Promise((resolve, reject)=>{
		
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		const db = event.target.result;
		const transaction = db.transaction('todo', 'readwrite');		
		const todoStore = transaction.objectStore('todo');			
		const readReq = todoStore.get(clName);
		readReq.addEventListener('success', function(e){
			let lists = e.target.result.lists	;	
			const color = e.target.result.color;
			const index = lists.findIndex(el => el.id == id);
			const todoIndex = lists[index].todos.findIndex(el => el.id == todoID);
			lists[index].todos.splice(todoIndex, 1);				
			const putStore = db.transaction('todo', 'readwrite').objectStore('todo');		
			const req = putStore.put({
				clName: clName,
				color: color,
				lists: lists
			});	//end of putReq
			resolve("finished");

		});	 //end of readReq		
	})//end of dbReq success

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	}); // end of error
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded		
	})	//end of promise
} //end of function	


//DiaryDB
export function addDiary(hook, date, emotion, content, callback){
	
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		const db = event.target.result;		
		let idStore = db.transaction("id", "readwrite").objectStore("id")
		const idReadReq = idStore.get("diaryid")
		idReadReq.addEventListener('success', function(e1){
			let diaryid;
			if(!e1.target.result){
				let idAddStore = db.transaction("id", "readwrite").objectStore("id")
				const idAddReq = idAddStore.add({
					id : 1,
					access: 'diaryid'
				})
				// console.log('complete')
				diaryid = 1;

			} else{
				diaryid = e1.target.result.id;
			}
			const idPutStore = db.transaction('id', 'readwrite').objectStore('id');
			const idPutReq = idPutStore.put({
				id: diaryid+1,
				access: 'diaryid'
			})
			//diaryid 읽고(없으면 생성) 1더하는 작업 fin

			//hook읽고(없으면 생성) put하기			
			const diaryReadStore = db.transaction("diary", "readwrite").objectStore('diary');			
			const readReq = diaryReadStore.get(hook)
			readReq.addEventListener('success', function(e2){		
				let lists;
				if(!e2.target.result){
					let diaryAddStore = db.transaction("diary", "readwrite").objectStore("diary")
					lists = [];
					const diaryAddReq = diaryAddStore.add({
						hook : hook,
						lists: lists
					})								
				} else{
					lists = e2.target.result.lists					
				}							
				const addObj = {
					id: diaryid,
					emotion: emotion,
					content: content,
					date: date
				}
				const diaryPutStore = db.transaction("diary","readwrite").objectStore('diary');
				const diaryPutReq = diaryPutStore.put({					
					hook: hook,
					lists: [...lists, addObj]
				});	//end of putReq	
				callback();
			})//end of readreq
		})
	});//end of dbReq
	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	});
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded		
}

export function getDiary(hook){
	return new Promise((resolve, reject)=>{	
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
	const db = event.target.result;		
		const diaryReadStore = db.transaction("diary", "readwrite").objectStore('diary');			
		const readReq = diaryReadStore.get(hook)
		readReq.addEventListener('success', function(e2){		
			let lists;
			if(!e2.target.result){
				let diaryAddStore = db.transaction("diary", "readwrite").objectStore("diary")
				lists = [];
				const diaryAddReq = diaryAddStore.add({
					hook : hook,
					lists: lists
				})								
			} else{
				lists = e2.target.result.lists					
			}							
			resolve(lists);						
		})//end of readreq
	});//end of dbReq
	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	});
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded		
	}) // end of promise
}

export function editDiary(hook, id, content, date, emotion, callback){
	
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		const db = event.target.result;
		const transaction = db.transaction('diary', 'readwrite');		
		const postStore = transaction.objectStore('diary');			
		const readReq = postStore.get(hook)		
		readReq.addEventListener('success', function(e){									
				let lists = e.target.result.lists
				lists = lists.filter(i => i.id != id);			
				const addObj= {
					content: content,
					date: date,
					emotion: emotion,
					id: id
				}
				const putStore = db.transaction('diary', 'readwrite').objectStore('diary');		
				const req = putStore.put({
					hook:  hook,
					lists: [...lists,addObj]
				});	//end of putReq
				callback();
			}) //end of idReadReq success

		});	 //end of readReq		

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	});
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded		
}

export function deleteDiary(hook, id, callback){
	
	const dbReq = indexedDB.open('byeolDB',DBversion)
	dbReq.addEventListener("success", function(event){
		const db = event.target.result;
		const transaction = db.transaction('diary', 'readwrite');		
		const postStore = transaction.objectStore('diary');			
		const readReq = postStore.get(hook)		
		readReq.addEventListener('success', function(e){									
				let lists = e.target.result.lists
				lists = lists.filter(i => i.id != id);			
				const putStore = db.transaction('diary', 'readwrite').objectStore('diary');		
				const req = putStore.put({
					hook:  hook,
					lists: [...lists]
				});	//end of putReq
				callback();
			}) //end of idReadReq success

		});	 //end of readReq		

	dbReq.addEventListener("error", function(event){
		const error = event.target.error;
		console.log('error', error.name);
	});
	dbReq.addEventListener("upgradeneeded", function(event){
		upgrade(event);
	}); //end of db req upgradeneeded		
}