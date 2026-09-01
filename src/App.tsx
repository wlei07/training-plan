import { Route, Routes } from 'react-router-dom'
import { SiteFooter } from './components/SiteFooter'
import { TopNav } from './components/TopNav'
import { ExercisePage } from './pages/ExercisePage'
import { GroupPage } from './pages/GroupPage'
import { GroupsPage } from './pages/GroupsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import styles from './App.module.css'

/**
 * Layout and routes. Expects a Router and a LanguageProvider above it, which
 * is what lets tests mount it under a MemoryRouter.
 */
export default function App() {
  return (
    <div className={styles.shell}>
      <TopNav />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<GroupsPage />} />
          <Route path="/g/:groupId" element={<GroupPage />} />
          <Route path="/g/:groupId/e/:exerciseId" element={<ExercisePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
