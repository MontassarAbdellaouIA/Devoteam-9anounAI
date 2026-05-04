// src/contexts/SessionContext.tsx

"use client";



import React, { createContext, useState, ReactNode, useEffect } from 'react';



interface SessionContextType {

  userId: string | null;

}



export const SessionContext = createContext<SessionContextType | undefined>(undefined);



// A simple hook to generate a persistent unique ID

const usePersistentUserId = () => {

  const [userId, setUserId] = useState<string | null>(null);



  useEffect(() => {

    let storedId = localStorage.getItem('bct-user-id');

    if (!storedId) {

      storedId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      localStorage.setItem('bct-user-id', storedId);

    }

    setUserId(storedId);

  }, []);



  return userId;

};





export function SessionProvider({ children }: { children: ReactNode }) {

  const userId = usePersistentUserId();



  const value = {

    userId,

  };



  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;

}