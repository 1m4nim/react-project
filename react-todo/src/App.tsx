import React from 'react'; // Reactのインポートは必須ではありませんが、JSXを使用する場合は慣例として残します
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <Outlet />, // <-- ここにカンマを追加
    children: [
      {
        path: "/",
        element: (
          <div>
            <div>タスク一覧</div>
            <Link to="trash">ゴミ箱へ</Link>
          </div>
        ) as JSX.Element, // JSX.Elementを返すことを明示
      },
    ],
  },
]);

const App = (): JSX.Element => {
  return <RouterProvider router={router} />;
};

export default App;