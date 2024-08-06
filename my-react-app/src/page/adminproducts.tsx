import ProductList from "../components/ProductList.tsx";
import AppNavbar from "../components/navbar.tsx";


export default function AdminProducts() {
    return (
        <div>
            <AppNavbar />
           <ProductList /> 
        </div>
    );
}