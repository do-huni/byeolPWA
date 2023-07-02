import Nav from 'react-bootstrap/Nav';
import Lists from './Lists.js';
import Calendar from './Calendar.js';
import Container from 'react-bootstrap/Container';

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