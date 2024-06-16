
import { SwapIndex } from "./containers/SwapIndex/Swap";
import { HashIndex } from "./containers/Hash";
// 首先我们需要导入一些组件...
import { useRoutes, Outlet, Routes, Route, Navigate } from "react-router-dom"

function App() {

  return (
    <Routes>
      <Route path="/" element={<SwapIndex />}></Route>
      <Route path="/hash" element={<HashIndex />}></Route>
    </Routes>
  );
}
export default App


