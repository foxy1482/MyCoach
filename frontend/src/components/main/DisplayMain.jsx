import React from "react";
import { DisplayLogin } from "../auth/DisplayLogin";
import { DisplayRegister } from "../auth/DisplayRegister";
import { DisplayStart } from './DisplayStart.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DisplayDashboard } from "./dashboard/DisplayDashboard";
import { DisplayChangePW } from "../auth/DisplayChangePW.jsx";
import { DisplayResetPW } from "../auth/DisplayResetPW.jsx";
import { DisplayRoutines } from "./rutinas/DisplayRoutines.jsx";
import { DisplayProfile } from "./perfil/DisplayProfile.jsx";
import { DisplayMyClients } from "./trainer/DisplayMyClients.jsx";
import { Logout } from "./perfil/Logout.jsx";
import { DisplayMyRoutines } from "./trainer/DisplayMyRoutines.jsx";
import { DisplayMyExercises } from "./trainer/DisplayMyExercises.jsx";
import { DisplayDiets } from "./dietas/DisplayDiets.jsx";
import { DisplayMyDiets } from "./trainer/DisplayMyDiets.jsx";
import { DisplayMyFoods } from "./trainer/DisplayMyFoods.jsx";
import { LoadScreen } from "../utilities/LoadScreen.jsx";

export default function Main()
{
    return (
        <main className="main m-auto w-full max-w-[1460px] flex flex-col p-4 ">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DisplayLogin />} ></Route>
                    <Route path="/register" element={<DisplayRegister />} ></Route>
                    <Route path="/comienzo" element={<DisplayStart />} ></Route>
                    <Route path="/changepwd" element={<DisplayChangePW />} ></Route>
                    <Route path="/reset-password" element={<DisplayResetPW />} ></Route>
                    <Route path="/dashboard" element={<DisplayDashboard />} ></Route>
                    <Route path="/rutinas" element={<DisplayRoutines />}></Route>
                    <Route path="/dietas" element={<DisplayDiets></DisplayDiets>}></Route>
                    <Route path="/progreso" element={<div className="flex flex-col m-auto text-center text-2xl font-inter">
                        <span className="font-bold text-9xl text-red-500">Error 404</span>
                        Sección en desarrollo
                        </div>}></Route>
                    <Route path="/soporte" element={<div className="flex flex-col m-auto text-center text-2xl font-inter">
                        <span className="font-bold text-9xl text-red-500">Error 404</span>
                        Sección en desarrollo
                        </div>}></Route>
                    <Route path="/perfil" element={<DisplayProfile></DisplayProfile>}></Route>
                    <Route path="/perfil/logout" element={<Logout></Logout>}></Route>
                    <Route path="/myClients" element={<DisplayMyClients/>}></Route>
                    <Route path="/myRoutines" element={<DisplayMyRoutines/>}></Route>
                    <Route path="/myExercises" element={<DisplayMyExercises/>}></Route>
                    <Route path="/myDiets" element={<DisplayMyDiets></DisplayMyDiets>}></Route>
                    <Route path="/myFoods" element={<DisplayMyFoods></DisplayMyFoods>}></Route>
                </Routes>
            </BrowserRouter>
        </main>
    )
}