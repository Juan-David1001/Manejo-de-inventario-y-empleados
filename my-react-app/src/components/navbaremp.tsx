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

function AppNavbaremp() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
          <Link color="foreground" href="MisDatosmp">
            Mis Datos
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="employee">
            Principal
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Cerrar />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="MisDatosmp" size="lg">
            Principal
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" className="w-full" href="employee" size="lg">
            Mis Datos
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

export default AppNavbaremp;