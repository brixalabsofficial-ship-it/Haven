import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, UnlockedContact, PaymentMethod } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_UNLOCKED } from '../data/seedData';
import { usePropertyStore } from './propertyStore';

interface PaymentState {
  transactions: Transaction[];
  unlockedContacts: UnlockedContact[];
  isProcessing: boolean;
  activeProcessingPropertyId: string | null;

  isContactUnlocked: (propertyId: string, userId?: string) => boolean;
  getUnlockedContact: (propertyId: string, userId?: string) => UnlockedContact | undefined;
  getTransactionsByUser: (userId: string) => Transaction[];
  getTransactionsByBroker: (brokerId: string) => Transaction[];
  
  // Simulated payment processor
  processSimulatedPayment: (params: {
    propertyId: string;
    userId: string;
    userName: string;
    paymentMethod: PaymentMethod;
    paymentDetails?: {
      upiId?: string;
      cardLast4?: string;
      cardType?: string;
      bankName?: string;
    };
    forceFail?: boolean;
  }) => Promise<{ success: boolean; transaction: Transaction; error?: string }>;

  resetToDefault: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      transactions: INITIAL_TRANSACTIONS,
      unlockedContacts: INITIAL_UNLOCKED,
      isProcessing: false,
      activeProcessingPropertyId: null,

      isContactUnlocked: (propertyId: string, userId?: string) => {
        return get().unlockedContacts.some(
          (uc) => uc.propertyId === propertyId && (!userId || uc.userId === userId)
        );
      },

      getUnlockedContact: (propertyId: string, userId?: string) => {
        return get().unlockedContacts.find(
          (uc) => uc.propertyId === propertyId && (!userId || uc.userId === userId)
        );
      },

      getTransactionsByUser: (userId: string) => {
        return get().transactions.filter((t) => t.userId === userId);
      },

      getTransactionsByBroker: (brokerId: string) => {
        return get().transactions.filter((t) => t.brokerId === brokerId);
      },

      processSimulatedPayment: async ({
        propertyId,
        userId,
        userName,
        paymentMethod,
        paymentDetails,
        forceFail = false,
      }) => {
        // Idempotency check: if currently processing this exact property, return immediate fail to prevent double submit
        if (get().isProcessing && get().activeProcessingPropertyId === propertyId) {
          throw new Error('Payment already in progress. Please wait.');
        }

        // Check if already unlocked
        if (get().isContactUnlocked(propertyId, userId)) {
          const existing = get().getUnlockedContact(propertyId, userId)!;
          return {
            success: true,
            transaction: {
              id: existing.transactionId,
              propertyId: existing.propertyId,
              propertyTitle: existing.propertyTitle,
              propertyCategory: existing.propertyCategory,
              propertyLocation: existing.propertyLocation,
              brokerId: existing.brokerId,
              brokerName: existing.brokerName,
              userId: existing.userId,
              userName,
              amount: 49,
              status: 'successful',
              paymentMethod,
              createdAt: existing.unlockedAt,
            },
          };
        }

        const property = usePropertyStore.getState().getPropertyById(propertyId);
        if (!property) {
          throw new Error('Property listing not found');
        }

        set({ isProcessing: true, activeProcessingPropertyId: propertyId });

        // Simulate network / bank authorization latency
        await new Promise((resolve) => setTimeout(resolve, 1400));

        const txnId = `HVN-TXN-${Math.floor(10000 + Math.random() * 90000)}`;

        if (forceFail) {
          const failedTxn: Transaction = {
            id: txnId,
            propertyId: property.id,
            propertyTitle: property.title,
            propertyCategory: property.category,
            propertyLocation: `${property.locality}, ${property.city}`,
            brokerId: property.brokerId,
            brokerName: property.brokerName,
            userId,
            userName,
            amount: 49,
            status: 'failed',
            paymentMethod,
            paymentMethodDetails: paymentDetails,
            failureReason: 'Simulated bank declined: Insufficient funds or user cancelled',
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            transactions: [failedTxn, ...state.transactions],
            isProcessing: false,
            activeProcessingPropertyId: null,
          }));

          return {
            success: false,
            transaction: failedTxn,
            error: 'Simulated payment failed as requested. Broker contact remains locked.',
          };
        }

        // Successful Payment
        const successTxn: Transaction = {
          id: txnId,
          propertyId: property.id,
          propertyTitle: property.title,
          propertyCategory: property.category,
          propertyLocation: `${property.locality}, ${property.city}`,
          brokerId: property.brokerId,
          brokerName: property.brokerName,
          userId,
          userName,
          amount: 49,
          status: 'successful',
          paymentMethod,
          paymentMethodDetails: paymentDetails,
          createdAt: new Date().toISOString(),
        };

        const newUnlockedContact: UnlockedContact = {
          id: `unlocked-${Date.now()}`,
          propertyId: property.id,
          userId,
          brokerId: property.brokerId,
          brokerName: property.brokerName,
          brokerPhone: property.brokerPhone,
          brokerWhatsapp: property.brokerWhatsapp,
          propertyTitle: property.title,
          propertyCategory: property.category,
          propertyLocation: `${property.locality}, ${property.city}`,
          propertyCoverImage: property.coverImage,
          propertyRent: property.monthlyRent,
          amountPaid: 49,
          unlockedAt: new Date().toISOString(),
          transactionId: txnId,
        };

        set((state) => ({
          transactions: [successTxn, ...state.transactions],
          unlockedContacts: [newUnlockedContact, ...state.unlockedContacts],
          isProcessing: false,
          activeProcessingPropertyId: null,
        }));

        // Increment property unlock count
        usePropertyStore.getState().incrementUnlockCount(property.id);

        return {
          success: true,
          transaction: successTxn,
        };
      },

      resetToDefault: () => {
        set({
          transactions: INITIAL_TRANSACTIONS,
          unlockedContacts: INITIAL_UNLOCKED,
          isProcessing: false,
          activeProcessingPropertyId: null,
        });
      },
    }),
    {
      name: 'haven_payment_store',
    }
  )
);
