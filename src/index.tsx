import { createRoot } from 'react-dom/client';
import IndexPage from './pages';
import BeforeInputPage from './pages/beforeInput';
import MutationObserverPage from './pages/mutationObserver';
import CustomRenderPage from './pages/customRender';
import { HashRouter, Routes, Route } from 'react-router-dom';

const root = createRoot(document.getElementById("app"));
root.render((
  <HashRouter>
    <Routes>
      <Route path='/beforeinput' element={<BeforeInputPage />} />
      <Route path='/mutation' element={<MutationObserverPage />} />
      <Route path='/custom' element={<CustomRenderPage />} />
      <Route path='/' exact={true} element={<IndexPage />} />
    </Routes>
  </HashRouter>
));