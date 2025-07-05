import React, { createContext, useContext, useState } from 'react';
import { Passage } from '../types/Passage';

interface AdminContextType {
  passages: Passage[];
  setPassages: React.Dispatch<React.SetStateAction<Passage[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  passagesPerPage: number;
  testCategories: string[];
  editId: string | null;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const passagesPerPage = 10;
  const testCategories = ['SSC-CGL', 'SSC-CHSL', 'RRB-NTPC', 'Police', 'CPCT'];

  return (
    <AdminContext.Provider
      value={{
        passages,
        setPassages,
        currentPage,
        setCurrentPage,
        passagesPerPage,
        testCategories,
        editId,
        setEditId
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext; 