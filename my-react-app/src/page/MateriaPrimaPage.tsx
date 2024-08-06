import RawMaterialTable from '../components/addmateriaprima';
import { Button } from "@nextui-org/react";



export default function MateriaPrimaPage() {
    const Regresar = () => {
        window.location.href = "/";
      }
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            width: '100vw',
        }}>
            <Button color='warning' onClick={Regresar} style={{
                width:'90%',
              
              
            }}>Regresar</Button>
            <RawMaterialTable />
        </div>
    );
}