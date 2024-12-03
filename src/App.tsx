import { BrowserRouter } from 'react-router-dom'

import { Router } from './router/Router'

const AppContent = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  )
}

export const App = (): JSX.Element => {
  return (
    <AppContent />
  )
}

export default App
