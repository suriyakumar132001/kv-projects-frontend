import { useEffect, useState } from "react";
import api from "../../services/api";

import "./Dashboard.css";

const Dashboard = () => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        getDashboard();

    }, []);

    const getDashboard = async () => {

        try{

            const res = await api.get("/dashboard/owner");

            setUser(res.data.user);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    };

    if(loading){

        return <h2>Loading Dashboard...</h2>

    }

    return(

        <div className="dashboard">

            <div className="welcome-card">

                <h1>

                    Welcome,

                    {user.name}

                    👋

                </h1>

                <p>

                    Role :

                    <strong>

                        {user.role}

                    </strong>

                </p>

                <p>

                    Email :

                    {user.email}

                </p>

                <p>

                    Phone :

                    {user.phone}

                </p>

                <p>

                    Status :

                    {user.status}

                </p>

            </div>

            <div className="cards">

                <div className="card">

                    <h2>Employees</h2>

                    <h1>0</h1>

                </div>

                <div className="card">

                    <h2>Projects</h2>

                    <h1>0</h1>

                </div>

                <div className="card">

                    <h2>Attendance</h2>

                    <h1>0</h1>

                </div>

                <div className="card">

                    <h2>Revenue</h2>

                    <h1>₹0</h1>

                </div>

            </div>

        </div>

    )

}

export default Dashboard;