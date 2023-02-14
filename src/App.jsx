import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'

import Business from './Business';
import Detail from './Business/Detail';

const App = () => {
  return (
    <BrowserRouter>
          <Routes>
            <Route exact path="/" name="Business" element={<Business />} />
            <Route exact path="/:id" name="Business Detail" element={ <Detail />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App