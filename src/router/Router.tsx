import { Route, Routes } from 'react-router-dom'

import { Tabla } from 'src/pages/Tabla/Tabla'
import { Path } from './routes'

export interface Page {
  name: string
  path: string
  Component: () => JSX.Element
  background?: string
}

export const Pages: Record<keyof typeof Path, Page> = {
  Home: {
    name: 'INICIO',
    path: Path.Home,
    Component: Tabla
  }
}

export const Router = (): JSX.Element => {
  return (
  <Routes>
    {Object.values(Pages).map(({ path, Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ))}
  </Routes>
  )
}
