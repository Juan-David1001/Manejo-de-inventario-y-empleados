import AddJobTypeForm from "../components/AddJobTypeForm"
import DeleteColumnFormm from "../components/deleteform";
import AppNavbar from "../components/navbar";

export default function AñadirJob() {
    return(
        <div>
            <AppNavbar/>
            <AddJobTypeForm/>  
            <DeleteColumnFormm/> 
        </div>  
    );}