import { createContext, useEffect, useState } from "react";
import  Swal from "sweetalert2"
import { useNavigate } from "react-router-dom";
export const  AuthContext = createContext()


export default function AuthProvider({children}) 
{
    const nav = useNavigate()
    const [currentuser, setCurrentUser] = useState([])
    const [onChange, setonChange] = useState(true)
    // Login
    const login = (email, password) =>{
        fetch("/login", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, password})
        })
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response)
            if(response.error)
            {
                Swal.fire(
                    'error',
                    response.error,
                    'error'
                  )
            }
            else if(response.success)
            { 
                nav("/")
                Swal.fire(
                    'success',
                    response.success,
                    'success'
                  )
                  setonChange(!onChange)


            }
            else{
                Swal.fire(
                    'Error',
                    "Something went wrong",
                    'error'
                  )
            }

        })
    }

    // Logout
    const logout = () =>{
       fetch("/logout", {
        method: "DELETE",
               })
       .then((res)=>res.json())
       .then((response)=>{
        setCurrentUser(null)
        setonChange(!onChange)
        console.log(response)
        if(response.error)
        {
            Swal.fire(
                'Error',
                response.error,
                'error'
              )
        }
        else if(response.success)
        { 
            nav("/")
            Swal.fire(
                'Success',
                response.success,
                'success'
              )
              setonChange(!onChange)
        }
        else{
            Swal.fire(
                'Error',
                "Something went wrong",
                'error'
              )
        }
       })
    }
    // Register
    const register = (name, email, phone_number, password) =>{
        fetch("/users", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({name, email, phone_number, password})
        })
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response)
            if(response.error)
            {
                Swal.fire(
                    'Error',
                    response.error,
                    'error'
                  )
            }
            else if(response.success)
            { 
                nav("/login")
                Swal.fire(
                    'Success',
                    response.success,
                    'success'
                  )
                  setonChange(!onChange)
            }
            else{
                Swal.fire(
                    'Error',
                    "Something went wrong",
                    'error'
                  )
            }

        })
    }

    useEffect(()=>{
        console.log("Fetching current user data")
        fetch("/current_user",{
            method: "GET"
        })
        .then(res=>res.json())
        .then(response=>{
            setCurrentUser(response)
            console.log("current user ",response)
        })
        .catch((error) => {
            console.error("Error fetching current user data:", error);
        });    
    }, [onChange])

    const contextData ={
        login, 
        register,
        logout,
        currentuser
    }

  return (
   <AuthContext.Provider value={contextData}>
    {children}
   </AuthContext.Provider>
  )
}