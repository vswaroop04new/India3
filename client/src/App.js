import './App.css'
import App2 from './Components/Verifier'
import Login from './Components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './Components/PrivateRoute'
import Government from './Components/Government'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route
              component={App2}
              element={<App2 />}
              path="/registrar"
              exact
            />
          </Route>
          <Route component={App2} element={<App2 />} path="/verifier" exact />
          <Route path="/" element={<Login />} />
          <Route path="/govt" element={<Government />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
