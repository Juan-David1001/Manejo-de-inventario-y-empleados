import Navbar from "../components/navbar";
import InventarioList from '../components/InventarioList';
function Admin() {
  return (
    <div 
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      width: '100vw',
    }}>
      
    <Navbar />
    <InventarioList />


  </div>
    
  );
}

export default Admin;
