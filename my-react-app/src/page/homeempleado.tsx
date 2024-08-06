

import InventarioList from '../components/InventarioList';
import AppNavbaremp from '../components/navbaremp';



const HomeEmpleado: React.FC = () => {

  return (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100vw',
  }}>
    
    <AppNavbaremp />
    <InventarioList  />
  </div>
  );
};

export default HomeEmpleado;
