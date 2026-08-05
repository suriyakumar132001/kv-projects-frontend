import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import employeeService from "../../services/employeeService";
import EmployeeForm from "../../components/employee/EmployeeForm";

import "./Employee.css";


const AddEmployee = () => {

  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();


  const [loading,setLoading] = useState(false);


  const [formData,setFormData] = useState({

    employeeId:"",
    name:"",
    email:"",
    phone:"",
    department:"",
    designation:"",
    salary:"",
    joiningDate:"",
    status:"Active",
    address:"",
    emergencyContact:""

  });



  const handleChange = (e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };



  const handleSubmit = async(e)=>{

    e.preventDefault();


    try{

      setLoading(true);


      await employeeService.createEmployee(formData);



      toast.success(
        "Employee Created Successfully"
      );


      navigate(`/${role}/employees`);



    }
    catch(error){


      console.error(error);


      toast.error(

        error.response?.data?.message ||
        "Failed to create employee"

      );


    }
    finally{

      setLoading(false);

    }


  };



  return (

    <EmployeeForm

      title="Add New Employee"

      formData={formData}

      onChange={handleChange}

      onSubmit={handleSubmit}

      loading={loading}

      submitText="Create Employee"

    />

  );

};


export default AddEmployee;