# 오늘 한 것
table css 디자인, colspan 추가
DB에 색상 값 입력, table에 분류 별 색상 가시화
input css 스타일 이쁘게함
# 할 것들
1. table css 조금 더 꾸미기
2. 게시글 수정기능 구현하기 V
3. 이미지 추가기능 구현하기 V
4. 투두리스트 만들기 v
5. 달력에 투두리스트 연동하기 v
6. 이벤트! 
===
ver2
1. 로딩화면 구현 v
2. 폰트 프리로딩 v
3. 이미지 프리로딩 v(gif preloading)
4. 서버연동 v
 1) 데이터 JSON으로 변형해서 업로드 v
 2) JSON으로 변형된 데이터 다운로드 v
 3) AWS 서버 열든 뭘로 열든 일단 업로드 할 장소 만들기 => firebase v
 4) 나랑 한별이 데이터 공유하는 방법 구현 with 비밀번호 => 구현X 메모로 할까?
5. 3주년 이벤트 화려하게
6. 안정성 강화 -> 텍스트에디터 툴바고정 본문 스크롤 v
7. 게임 넣기? XX
8. 메모기능
9. 입장 key 입력하기 v
heap
node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'
확인
늘리기
export NODE_OPTIONS=--max_old_space_size=1000

"homepage": "https://do-huni.github.io/byeolPWA",

      <BrowserRouter basename={process.env.PUBLIC_URL}>
npm run build
npm run postbuild
git add .
git commit -am 'Add homepage'
git push origin master
git subtree push --prefix build/ origin gh-pages

https://h-owo-ld.tistory.com/100
https://sennieworld.tistory.com/61

0.NavBar
[Aca.Byeol] => '/'
[추가] => 'add'

			<div style = {
					{"textAlign": "left", "margin" : "10px 0 0 0"}
					}dangerouslySetInnerHTML={{ __html: draftToHtml(content)}}></div>
<div style = {{background: i.color, width: "24px", display: "inline-block", borderRadius: "5px"}}>&nbsp;</div>
1. 메인페이지
[메인 이미지] 커플 사진 여러개중 하나
[오늘의 훈도 한마디]

[검색] v
[리스트 필터링] v
[리스트]*n v

2. 글작성페이지
제목 v
글 v
[checkbox]이미지 업로드 v
[checkbox]하이퍼링크 v
[checkbox]투두리스트 추가

3. 디테일페이지
제목 v
[이미지] v
[글] v
[투두리스트]

4. Diary 페이지





===
DB = indexedDB

DB구조
byeolDB

1. objectStore: post
스키마
key: 분류 이름
value: 
{
clName: 분류 이름
lists: []
color: #code
}

lists 안에 이런 오브젝트들 들어있음

{
id: n
title: string
content: string
todoID: j
}

2. objectStore: toDo
스키마
{
clName = 분류명,
color = "",
lists [
 {
 	id: id,
	todos: [
		고유값: 어쩌지,
		checklist: string,
		ifChecked: boolean,
		dueDate: date 객체로 변환 가능한 값
	]
 }

]

# addtodo(clName, 글id)
todoStore의 clName을 get해옴 XX
idstore에서 todoid값을 get해옴 v
idstore에서 todoid값을 +1 v

put 요청 v
clName = 그대로 v
color = 그대로 v
lists의 id == id(입력값)의 todos에 v
put [...lists, obj] v

# gettodo(clName, 글id){
todostore에서 clName을 get해옴v
clName에서 글id랑 같은 lists의 element를 find로 반환v
그놈의 todos를 다 가져옴v
}

# donetodo(clName, 글id, todoid)
todoStore의 clName을 get해옴
put 요청
clName = 그대로
color = 그대로
lists의 id == id(입력값)의 todos에서
todoid == todoid(입력값)인 값 obj를 가져오고
ifChecked = !ifChecked 한다음
list에서 그 todoid filter != 하고
put [...lists, obj]

# deletetodo(clName, 글id, todoid)
todostore의 clName을 get해옴
put요청 하는데 lists에서 id==id에서 해당todoid제외

# deletePostTodo(clName, 글id)
lists에서 id 값 제외

3. objectStore: id
스키마
id: 0
unique
++

access - todoID
unique
++

4. diaryStore

스키마
{
hook: "2022.08",
list: [
	{
		id: id
		emotion: emotion
		content: content
		date: date
	}
]
}

# addDiary
