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

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Inventario", path: "/admin" },
    { label: "Empleados", path: "/empleados" },
    { label: "Materia Prima", path: "/materia-prima" },
    { label: "Editar Trabajos", path: "/editjobs" },
    { label: "Editar Productos", path: "/editproducts" },
    { label: "Factura ", path: "/factura" },
   
  ];

  return (
    <Navbar id='Navbar' onMenuOpenChange={setIsMenuOpen} style={{ width: '100%' , position:'fixed'} }>
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
          <p className="font-bold text-inherit">Velas</p>
        </NavbarBrand>
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
        {menuItems.map((item) => (
          <NavbarItem key={item.path}>
            <Link color="foreground" href={item.path}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Cerrar />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              color={item.label === "Cerrar Sesión" ? "danger" : "foreground"}
              className="w-full"
              href={item.path}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
