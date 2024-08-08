import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from '@nextui-org/react';
import Cerrar from './cerrar';
import llogo from '../assets/llogo.png';
import {Marcarllegada} from './Marcarllegada';

function AppNavbaremp() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const nombre = localStorage.getItem('username');

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} style={{ width: '100%' , position:'fixed'}}>
      <NavbarContent>
        <NavbarMenuToggle style={{
          backgroundColor: 'white', 
          color: 'black',
          border:'none',
        }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
        <h1 style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: '24px'
          }} >Hola {nombre}</h1>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent>
        <NavbarItem>
          
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='center'>
        <NavbarItem>
          <img 
            src={llogo} 
            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
            alt="Logo" 
          />
        </NavbarItem>
      </NavbarContent>
      
     
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="MisDatosmp">
            Mis Datos
          </Link>
          
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="materia-prima">
            Materia Prima
          </Link>
          
        </NavbarItem>
      </NavbarContent>
      
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="employee" style={{
            marginRight: '10px',
          }}>
            Principal
          </Link>
          <Cerrar />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent>
        <NavbarItem>
        <Marcarllegada />

        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
         
          <Link color="foreground" className="w-full" href="employee" size="lg">
            Principal
          </Link>
          
        </NavbarMenuItem>
        <NavbarMenuItem >
          <Link color="foreground" className="w-full" href="MisDatosmp" size="lg">
            Mis Datos
          </Link>
          <Link color="foreground" href="materia-prima">
            Materia Prima
          </Link> <br />
          <Cerrar />

        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

export default AppNavbaremp;