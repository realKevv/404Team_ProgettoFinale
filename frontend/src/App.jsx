import './App.css'
import { Sidebar } from './components/Sidebar'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {

  return (
    <>
      <Navbar />
      <HomePage />
      <Sidebar />
    </>
  )
}

export default App
