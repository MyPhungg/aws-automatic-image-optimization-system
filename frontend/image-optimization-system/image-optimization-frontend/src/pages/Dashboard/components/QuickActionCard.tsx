import "./QuickActionCard.css";

import { useNavigate } from "react-router-dom";

interface QuickActionCardProps{

    title:string;

    description:string;

    icon:string;

    path:string;

}

function QuickActionCard({

    title,

    description,

    icon,

    path

}:QuickActionCardProps){

    const navigate=useNavigate();

    return(

        <div
            className="quick-card"
            onClick={()=>navigate(path)}
        >

            <div className="quick-left">

                <div className="quick-icon">

                    {icon}

                </div>

                <div>

                    <h3>{title}</h3>

                    <p>{description}</p>

                </div>

            </div>

            <button>

                Go

            </button>

        </div>

    );

}

export default QuickActionCard;