import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { MergedWorkflowPage } from './pages/MergedWorkflowPage'
import { SampleRollPage } from './pages/SampleRollPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MergedWorkflowPage />} />
          <Route path="/sample-roll" element={<SampleRollPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
