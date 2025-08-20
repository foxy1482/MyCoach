import React from 'react'
import Header from './components/header/DisplayHeader.jsx'
import Main from './components/main/DisplayMain.jsx'
import Footer from './components/footer/DisplayFooter.jsx'
import '../css/general.css'


export default function App() {
  return (
    <React.Fragment>
      <Header></Header>
      <Main></Main>
      <Footer></Footer>
    </React.Fragment>
  )
}
