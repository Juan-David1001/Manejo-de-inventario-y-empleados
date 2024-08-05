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

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Empleados",
    "Materia Prima",
    "Gastos",
    "Facturación",
    "Cerrar Sesión"
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} style={{ width: '100%' }}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">Velas</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/empleados">
            Empleados
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/materia-prima">
            Materia Prima
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/gastos">
            Gastos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/facturacion">
            Facturación
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Cerrar />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                item === "Cerrar Sesión" ? "danger" : "foreground"
              }
              className="w-full"
              href={item === "Cerrar Sesión" ? "#" : `/${item.toLowerCase().replace(" ", "-")}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
