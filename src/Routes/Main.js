import Nav from 'react-bootstrap/Nav';
import Lists from './Lists.js';
import Key from './Key.js';
import Calendar from './Calendar.js';
import Container from 'react-bootstrap/Container';
import {useState, useEffect} from 'react';
import Modal from 'react-modal';




function Main(){
	const [loadingOpen, setLoadingOpen] = useState(false);
	
	useEffect(()=>{				
		if(localStorage.getItem("key") == process.env.REACT_APP_ACCESS_KEY){
			setLoadingOpen(false);
		} else{
			setLoadingOpen(true);
		}
	},[])
	return(		
<>
	<Container>
		<Calendar/>
		<Lists/>
	</Container>	
		   
	  <Modal isOpen={loadingOpen}
			onRequestClose={()=>setLoadingOpen(true)}			  
			ariaHideApp={false}	
			style = {
			{overlay: {zIndex: 1001,
					   top:0,
					   left:0
					  },
			content: {padding: "0",				
    				  top: "50%",
    				  left: "50%",		
    				  transform: "translate(-50%, -50%)",						  
    	              width: "80%",
    			      height: "60px",						  
					 }				   
			}
		}>
			<Key/>
	  </Modal>		   
</>
	)
}

export default Main;