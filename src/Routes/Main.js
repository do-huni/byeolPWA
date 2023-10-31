import Nav from 'react-bootstrap/Nav';
import Lists from './Lists.js';
import Calendar from './Calendar.js';
import Container from 'react-bootstrap/Container';
import {useState, useEffect} from 'react';




function Main(){
	
	return(		
<>
	<Container>
		<Calendar/>
		<Lists/>
	</Container>			   
</>
	)
}

export default Main;