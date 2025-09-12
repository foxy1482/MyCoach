import React from 'react'
import Header from './components/header/DisplayHeader.jsx'
import Main from './components/main/DisplayMain.jsx'
import Footer from './components/footer/DisplayFooter.jsx'
import '../css/general.css'
import { BrowserRouter } from 'react-router-dom'


export default function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Main></Main>
      <Footer></Footer>
    </BrowserRouter>
  )
}
