'use client';

import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

export default function LayoutWithRedux({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.userRoleFeatureListReponse);

  return (
    <>
      {/* You can now pass Redux state to children or use it directly */}
      {/* <div>{user?.name && `Welcome, ${user.name}`}</div> */}
      {children}
    </>
  );
}
