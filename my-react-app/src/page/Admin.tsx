import Navbar from "../components/navbar";
import InventarioList from "../components/InventarioList";
function Admin() {
  return (
    <div style={{
        position:'fixed',
        top:0,
        left:0,
        width:'100vw'
    }}>
    <Navbar />
    <InventarioList />


  </div>
    
  );
}

export default Admin;
