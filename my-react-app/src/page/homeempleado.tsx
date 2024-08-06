

import InventarioList from '../components/InventarioList';
import AppNavbaremp from '../components/navbaremp';
import UserDataTable from '../components/UserDataTable';


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
