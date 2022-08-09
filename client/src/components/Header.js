 
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";




const Header = () => {
 const { user, logout  } = useGlobalContext();
  const { pathname } = useLocation();


    return (
    <div className="main-header">
        <div className="main-header__inner ">
            <div className="main-header__left">
                <Link to={"/"}>
                EVENT AGENDA
                </Link>

            </div>
            <div className="main-header__right">S
                {user? (
                    <button className="btn" onClick={logout }> logout </button>

                ) : pathname=== "/" ?
                (      <Link to="/register"  className="btn">
                            REGISTER
                        </Link> ) :( <Link to="/"  className="btn">
                                            LOGIN
                                            </Link>
                                                )
                            }
                
          
            </div>
        </div>
    </div>

    )
};
export default Header;