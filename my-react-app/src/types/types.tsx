export interface RawMaterial {
    id: number;
    nombre: string;
    cantidad: number;
    precio: number;
    fecha_ingreso: string; // ISO 8601 date string
}

export interface AddRawMaterialPayload {
    nombre: string;
    cantidad: number;
    precio: number;
}

// types/types.ts

export interface Product {
    id: number; // ID único del producto
    name: string; // Nombre del producto
    price: number; // Precio del producto
}

export interface AddProductPayload {
    name: string; // Nombre del producto
    price: number; // Precio del producto
}

export interface InventoryItem {
    id: number;          // ID del ítem de inventario
    product_id: number;  // ID del producto al que pertenece este ítem
    quantity: number;    // Cantidad del producto en inventario
}
// types/types.ts

export interface InventoryItem {
    id: number;          // ID del ítem de inventario
    product_id: number;  // ID del producto al que pertenece este ítem
    quantity: number;    // Cantidad del producto en inventario
}

export interface UserData {
    id: number;
    user_id: number;
    nombre: string;
    velas: number;
    papel: number;
    fecha: string;
  }