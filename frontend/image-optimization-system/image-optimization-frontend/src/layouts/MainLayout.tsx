import {type ReactNode} from 'react'
import NavBar from '../components/Navbar/NavBar'
import Footer from '../components/Footer/Footer'

import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="layout">
      <NavBar />
      <main className='layout-content'>{children}</main>
      <Footer />
    </div>
  )
}
export default MainLayout