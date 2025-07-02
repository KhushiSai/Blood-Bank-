import React, { createContext, useContext, useState, useEffect } from 'react';

interface BloodInventory {
  bloodType: string;
  quantity: number;
  lastUpdated: Date;
}

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  address: string;
  lastDonation?: Date;
  totalDonations: number;
  status: 'active' | 'inactive';
}

interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requestDate: Date;
  requiredBy: Date;
  status: 'pending' | 'approved' | 'fulfilled' | 'rejected';
  hospitalName: string;
  contactPerson: string;
  contactPhone: string;
}

interface BloodBankContextType {
  inventory: BloodInventory[];
  donors: Donor[];
  requests: BloodRequest[];
  addDonor: (donor: Omit<Donor, 'id'>) => void;
  updateInventory: (bloodType: string, quantity: number) => void;
  addRequest: (request: Omit<BloodRequest, 'id'>) => void;
  updateRequestStatus: (id: string, status: BloodRequest['status']) => void;
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export const BloodBankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<BloodInventory[]>([
    { bloodType: 'A+', quantity: 25, lastUpdated: new Date() },
    { bloodType: 'A-', quantity: 12, lastUpdated: new Date() },
    { bloodType: 'B+', quantity: 18, lastUpdated: new Date() },
    { bloodType: 'B-', quantity: 8, lastUpdated: new Date() },
    { bloodType: 'AB+', quantity: 15, lastUpdated: new Date() },
    { bloodType: 'AB-', quantity: 5, lastUpdated: new Date() },
    { bloodType: 'O+', quantity: 32, lastUpdated: new Date() },
    { bloodType: 'O-', quantity: 14, lastUpdated: new Date() },
  ]);

  const [donors, setDonors] = useState<Donor[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@email.com',
      phone: '+1-555-0123',
      bloodType: 'O+',
      address: '123 Main St, City, State',
      lastDonation: new Date('2024-01-15'),
      totalDonations: 12,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '+1-555-0124',
      bloodType: 'A+',
      address: '456 Oak Ave, City, State',
      lastDonation: new Date('2024-02-10'),
      totalDonations: 8,
      status: 'active'
    }
  ]);

  const [requests, setRequests] = useState<BloodRequest[]>([
    {
      id: '1',
      patientName: 'Emergency Patient',
      bloodType: 'O-',
      quantity: 2,
      urgency: 'critical',
      requestDate: new Date(),
      requiredBy: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
      hospitalName: 'City General Hospital',
      contactPerson: 'Dr. Williams',
      contactPhone: '+1-555-0200'
    }
  ]);

  const addDonor = (donor: Omit<Donor, 'id'>) => {
    const newDonor = {
      ...donor,
      id: Date.now().toString(),
      totalDonations: 0,
      status: 'active' as const
    };
    setDonors(prev => [...prev, newDonor]);
  };

  const updateInventory = (bloodType: string, quantity: number) => {
    setInventory(prev => 
      prev.map(item => 
        item.bloodType === bloodType 
          ? { ...item, quantity: item.quantity + quantity, lastUpdated: new Date() }
          : item
      )
    );
  };

  const addRequest = (request: Omit<BloodRequest, 'id'>) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending' as const
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const updateRequestStatus = (id: string, status: BloodRequest['status']) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status } : request
      )
    );
  };

  return (
    <BloodBankContext.Provider value={{
      inventory,
      donors,
      requests,
      addDonor,
      updateInventory,
      addRequest,
      updateRequestStatus
    }}>
      {children}
    </BloodBankContext.Provider>
  );
};

export const useBloodBank = () => {
  const context = useContext(BloodBankContext);
  if (!context) {
    throw new Error('useBloodBank must be used within a BloodBankProvider');
  }
  return context;
};