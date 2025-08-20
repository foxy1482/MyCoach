import React from "react";
import { DisplayLogin } from "../auth/DisplayLogin";
import { DisplayRegister } from "../auth/DisplayRegister";
import { DisplayStart } from './DisplayStart.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DisplayDashboard } from "./dashboard/DisplayDashboard";
import { DisplayChangePW } from "../auth/DisplayChangePW.jsx";
import { DisplayResetPW } from "../auth/DisplayResetPW.jsx";
import { DisplayRoutines } from "./rutinas/DisplayRoutines.jsx";

export default function Main()
{
    return (
        <main className="main m-auto w-full max-w-[1600px] flex flex-col p-2.5 ">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DisplayLogin />} ></Route>
                    <Route path="/register" element={<DisplayRegister />} ></Route>
                    <Route path="/comienzo" element={<DisplayStart />} ></Route>
                    <Route path="/changepwd" element={<DisplayChangePW />} ></Route>
                    <Route path="/reset-password" element={<DisplayResetPW />} ></Route>
                    <Route path="/dashboard" element={<DisplayDashboard />} ></Route>
                    <Route path="/rutinas" element={<DisplayRoutines />}></Route>
                    <Route path="/dietas" element={<div></div>}></Route>
                    <Route path="/progreso" element={<div></div>}></Route>
                    <Route path="/soporte" element={<div></div>}></Route>
                    <Route path="/perfil" element={<div></div>}></Route>
                </Routes>
            </BrowserRouter>
        </main>
    )
}