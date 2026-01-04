"use client";

import { ROUTES, UserRolesInterface } from "@/constant";
import { Amplify, type ResourcesConfig } from "aws-amplify";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from 'js-cookie';


import { fetchUserAttributes } from 'aws-amplify/auth';

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
  },
};

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true }
);

export interface loginInterface {
  username: string;
  userId: string;
  signInDetails?: {
    loginId: string,
    authFlowType: string
  }
}

export type HubPayload = {
  event: string,
  data?: any,
  message?: string
};

// export async function checkUser() {
//   try {
//     const user = await AuthUser.;
//     const userGroup = user.attributes["custom:group"];
//   } catch (error) {
//     console.log(error);
//   }
// }



async function handleFetchUserAttributes() {
  try {
     
    const userAttributes = await fetchUserAttributes();
    // console.log('SUI', JSON.stringify(userAttributes), userAttributes);
    if (userAttributes?.sub) {
      // console.log('attributes', userAttributes['custom:brewone_user_role'] || 'Admin')
      // localStorage.setItem('userRole', userAttributes['custom:brewone_user_role'] || 'unauthorized')
      // localStorage.setItem('userRole', UserRolesInterface.SUPERVISOR_QC || 'unauthorized')
      // cookies().set('userRole', UserRolesInterface.SUPERVISOR_QC || 'unauthorized')
      // Cookies.set('userRole', userAttributes['custom:brewone_user_role'] || 'Admin')
      Cookies.set('userRole',  userAttributes['custom:brewone_user_role'] || 'Unauthorized')
      Cookies.set('userName', userAttributes['email'] || '')
      
    }
    
    return userAttributes || "Unauthorized";
  } catch (error) {
    console.log(error);
    return 'Unauthorized';
  }
}

export default function ConfigureAmplifyClientSide() {
  const router = useRouter()
  // const role = handleFetchUserAttributes().then((res) => res);

  useEffect(() => {
    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          
          handleFetchUserAttributes().then(() => {
            const roles = Cookies.get('userRole')

            if (roles === UserRolesInterface.ASSISTANT_MANAGER_TEA || roles === UserRolesInterface.TEA_MASTER ||
              roles === UserRolesInterface.SUPERVISOR_TEA || roles === UserRolesInterface.GENERAL_MANAGER_PROCUREMENT_AND_ADMINISTRATION ||
              roles === UserRolesInterface.EXECUTIVE_PROCUREMENT) {
              router.push(ROUTES.CATALOGUE_MANAGEMENT);
            } else if (roles === UserRolesInterface.MANAGER_PRODUCTION || roles === UserRolesInterface.EXECUTIVE_PRODUCTION) {
              router.push(ROUTES.BLENDING_SHEETS);
            } else if (roles === UserRolesInterface.SUPERVISOR_QC) {
              router.push(ROUTES.PACKING_SHEETS);
            } else if (roles === UserRolesInterface.SUPERVISOR_WAREHOUSE || roles === UserRolesInterface.MANAGER_STORES) {
              router.push(ROUTES.SENDING_DELIVERY_ORDERS);
            }
            else {
              router.push(ROUTES.DASHBOARD);
            }
          })
          console.log('user have been signedIn successfully.');
          break;
        case 'signedOut':
          Cookies.remove('userRole')
          router.push(ROUTES.HOME)
          window.location.reload()
          break;
        case 'tokenRefresh':
          console.log('auth tokens have been refreshed.');
          break;
        case 'tokenRefresh_failure':
          console.log('failure while refreshing auth tokens.');
          break;
      }
    });
  }, [])

  return null;
}