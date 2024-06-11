import React from "react";

export type RouteType = {
  key: string;
  path?: string;
  element?: React.LazyExoticComponent<React.FC>;
  children: RouteType[];
};

const routes: RouteType[] = [
  {
    key: "main",
    element: React.lazy(() => import("./pages/Main")),
    children: [],
  },
  {
    key: "category",
    path: "category/:id",
    element: React.lazy(() => import("./pages/Category")),
    children: [],
  },
  {
    key: "test",
    path: "test/:id",
    children: [
      {
        key: "test-index",
        element: React.lazy(() => import("./pages/Test")),
        children: [],
      },
      {
        key: "test-result",
        path: "result",
        element: React.lazy(() => import("./pages/Result")),
        children: [],
      },
    ],
  },
  {
    key: "document",
    path: "document/:id",
    element: React.lazy(() => import("./pages/Document")),
    children: [],
  },
  {
    key: "claim",
    path: "claim/:id",
    element: React.lazy(() => import("./pages/Claim")),
    children: [],
  },
  {
    key: "profile",
    path: "profile",
    element: React.lazy(() => import("./pages/Profile")),
    children: [],
  },
  {
    key: "store",
    path: "store",
    element: React.lazy(() => import("./pages/Store")),
    children: [],
  },
  {
    key: "media",
    path: "media",
    element: React.lazy(() => import("./pages/Media")),
    children: [
      {
        key: "media-stores",
        path: ":storeId",
        element: React.lazy(() => import("./pages/Media")),
        children: [
          {
            key: "media-show",
            path: ":categoryId",
            element: React.lazy(() => import("./pages/Media")),
            children: [],
          },
        ],
      },
    ],
  },
  {
    key: "training",
    path: "training/:id",
    element: React.lazy(() => import("./pages/Training")),
    children: [],
  },
  // {
  //   key: "timecard",
  //   path: "timecard",
  //   element: React.lazy(() => import("./pages/Timecard")),
  //   children: [],
  // },
  {
    key: "axo",
    path: "axo/:id",
    element: React.lazy(() => import("./pages/Axo")),
    children: [],
  },
  {
    key: "contact",
    path: "contact",
    element: React.lazy(() => import("./pages/Contact")),
    children: [],
  },
  {
    key: "inventory",
    path: "inventory/:id",
    element: React.lazy(() => import("./pages/Inventory")),
    children:[]
  },
];

export default routes;
