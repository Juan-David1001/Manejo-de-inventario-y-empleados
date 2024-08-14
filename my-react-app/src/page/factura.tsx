import { useEffect, useState } from "react";
import axios from "axios";
import AppNavbar from "../components/navbar";
import llogo from "../assets/llogo.png";
import { Product } from "../types/types";

interface SelectedProduct {
  product: Product | null;
  quantity: number;
}

export default function Factura() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // Obtén los productos del backend
    axios.get<Product[]>('http://192.168.0.16:5000/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleProductChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = event.target.value;
    const product = products.find(p => p.id === parseInt(productId)) || null;
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = {
      ...newSelectedProducts[index],
      product: product,
      quantity: 0
    };
    setSelectedProducts(newSelectedProducts);
  };

  const handleQuantityChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(event.target.value) || 0;
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = {
      ...newSelectedProducts[index],
      quantity: quantity
    };
    setSelectedProducts(newSelectedProducts);
  };

  useEffect(() => {
    // Calcular el total
    const newTotal = selectedProducts.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * (item.quantity || 0);
    }, 0);
    setTotal(newTotal);
  }, [selectedProducts]);

  const addRow = () => {
    setSelectedProducts([...selectedProducts, { product: null, quantity: 0 }]);
  };
  const Emprimir = () => {
    window.print();
  };


  return (
    <div>
      <AppNavbar />

      <div className="w-[100vw] h-auto rounded-lg border-solid border-2 border-gray-500">
        <header className="text-2xl font-bold bg-blue-950 p-3 flex">
          <img className="w-16 h-16" src={llogo} alt="Factura" />
          <h2 className="text-white mx-auto">Velas y Velones</h2>
        </header>

        <div className="grid grid-cols-10 p-4">
          <div className="col-span-3 cad flex">
            <p>Numero: </p>
            <input className="w-full bg-white ml-3" type="text" />
          </div>
          <div className="col-span-4 cad flex">
            <p>Datos fiscales: </p>
            <input className="w-full bg-white ml-3" type="text" />
          </div>
          <div className="cad col-span-3 flex justify-center items-center">
            <p>Fecha </p>
          </div>
          <div className="col-span-7 cad h-12 flex">
            <p>Cliente: </p>
            <input className="w-full bg-white ml-8" type="text" />
          </div>
          <div className="cad h-12 flex">
            <input className="w-full bg-white ml-3" type="number" />
          </div>
          <div className="cad h-12 flex">
            <input className="w-full bg-white ml-3" type="number" />
          </div>
          <div className="cad h-12 flex">
            <input className="w-full bg-white ml-3" type="number" />
          </div>
          <div className="cad h-12 flex col-span-10">
            <p>Direccion:</p>
            <input className="w-full bg-white ml-8" type="text" />
          </div>
          <div className="cad col-span-7 h-12 flex">
            <p>Ciudad:</p>
            <input className="w-full bg-white ml-8" type="text" />
          </div>
          <div className="cad h-12 flex col-span-3">
            <p>Telefono:</p>
            <input className="w-full bg-white ml-8" type="text" />
          </div>
        </div>

       
        <div className="w-[100vw] mt-30 p-5">
          <table className="w-full gap-2">
          <thead className="bg-blue-950 text-white">
  <tr>
    <th className="py-2 px-4  text-start">Producto</th>
    <th className="py-2 px-4 text-start">Cantidad</th>
    <th className="py-2 px-4 text-center">Precio unitario</th>
    <th className="py-2 px-4 text-center">Total</th>
  </tr>
</thead>
<tbody className="text-black">
  {selectedProducts.map((item, index) => (
    <tr key={index}>
      <td className="py-2 px-4 text-center">
        <select
          value={item.product?.id || ''}
          onChange={e => handleProductChange(index, e)}
          className="w-full bg-white border border-gray-300 rounded p-1"
        >
          <option value="">Selecciona un producto</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </td>
      <td className="py-2 px-4 text-center">
        <input
          id="cann"
          type="number"
          value={item.quantity || ''}
          onChange={e => handleQuantityChange(index, e)}
          className="w-full bg-white border border-gray-300 rounded p-1 " placeholder="0"
        />
      </td>
      <td className="py-2 px-4 text-center">
        {item.product?.price ? Math.round(item.product.price) : 'N/A'}
      </td>
      <td className="py-2 px-4 text-center">
        {Math.round((item.product?.price || 0) * (item.quantity || 0))}
      </td>
    </tr>
  ))}
  <tr>
    <td colSpan={3} className="text-right  font-bold py-2 px-4">Total</td>
    <td className="font-bold py-2 px-4 text-center">
      {Math.round(total)}
    </td>
  </tr>
</tbody>


          </table>
          <button id="Addrow" onClick={addRow} className="mt-4 p-2 bg-blue-950 hover:bg-green-500">
            Agregar Fila
          </button>
        </div>
      </div>
      <button
            
            id="Addrow"
            onClick={Emprimir}
            className="mt-4 p-2 bg-blue-950 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
          >
            Imprimir
          </button>
    </div>
  );
}
