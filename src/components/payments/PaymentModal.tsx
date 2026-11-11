import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Smartphone, 
  CreditCard, 
  Building, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Property, PaymentMethod, Transaction } from '../../types';
import { formatINR } from '../../utils';
import { usePaymentStore } from '../../stores/paymentStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (transaction: Transaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  property,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { user } = useAuthStore();
  const { processSimulatedPayment, isProcessing } = usePaymentStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Rahul Nair');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [forceFail, setForceFail] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    status: 'success' | 'failed' | null;
    transaction?: Transaction;
    message?: string;
  }>({ status: null });

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to proceed with contact unlock');
      return;
    }

    try {
      const result = await processSimulatedPayment({
        propertyId: property.id,
        userId: user.id,
        userName: user.name,
        paymentMethod,
        paymentDetails: {
          upiId: paymentMethod === 'upi' ? upiId : undefined,
          cardLast4: paymentMethod === 'card' ? '4242' : undefined,
          cardType: paymentMethod === 'card' ? 'Visa' : undefined,
          bankName: paymentMethod === 'netbanking' ? 'State Bank of India' : undefined,
        },
        forceFail,
      });

      if (result.success) {
        setPaymentResult({
          status: 'success',
          transaction: result.transaction,
        });
        toast.success('Broker contact unlocked successfully! (₹49 paid)');
        if (onPaymentSuccess) {
          onPaymentSuccess(result.transaction);
        }
      } else {
        setPaymentResult({
          status: 'failed',
          transaction: result.transaction,
          message: result.error || 'Simulated transaction failed.',
        });
        toast.error('Payment simulation failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Transaction could not be processed');
    }
  };

  const handleResetModal = () => {
    setPaymentResult({ status: null });
    setForceFail(false);
    onClose();
  };

  return (
    <div 
      onClick={handleResetModal}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] sm:max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-primary text-white p-3.5 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gold/20 border border-gold/40 flex items-center justify-center">
              <Lock size={15} className="text-gold" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Unlock Broker Contact</h3>
              <p className="text-[11px] sm:text-xs text-gray-300">One-time verified connection fee</p>
            </div>
          </div>
          <button
            onClick={handleResetModal}
            disabled={isProcessing}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body content based on state */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          {paymentResult.status === 'success' ? (
            /* SUCCESS SCREEN */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Payment Successful!</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Broker contact details for <span className="font-semibold">{property.title}</span> have been unlocked and saved to your account.
              </p>

              <div className="bg-gray-50 rounded-md p-4 text-left border border-gray-100 text-xs space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-mono font-medium text-gray-800">{paymentResult.transaction?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-primary tabular-nums">₹49.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Broker:</span>
                  <span className="font-medium text-gray-800">{property.brokerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact Number:</span>
                  <span className="font-bold text-emerald-700">{property.brokerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">WhatsApp:</span>
                  <span className="font-bold text-emerald-700">+{property.brokerWhatsapp}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handleResetModal}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>View Unlocked Details</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : paymentResult.status === 'failed' ? (
            /* FAILURE SCREEN */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-red-100 text-destructive rounded-md flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
                <AlertCircle size={36} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Payment Failed</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                {paymentResult.message || 'The simulated payment could not be completed. Broker contact remains protected.'}
              </p>

              <div className="bg-red-50/70 border border-red-100 rounded-md p-4 text-xs text-left text-red-800 space-y-1">
                <p className="font-semibold">Simulated Gateway Note:</p>
                <p>No charge was debited. You can retry with a different demo method or uncheck the test failure toggle.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    setPaymentResult({ status: null });
                    setForceFail(false);
                  }}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-semibold text-sm transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleResetModal}
                  className="w-1/3 border border-gray-200 py-3 rounded-md font-medium text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handlePay} className="space-y-5">
              {/* Summary Card */}
              <div className="bg-gray-50 rounded-md p-3.5 border border-gray-200/80 flex items-center gap-3">
                <img
                  src={property.coverImage}
                  alt={property.title}
                  className="w-14 h-14 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{property.title}</h4>
                  <p className="text-xs text-gray-500 truncate">Broker: {property.brokerName}</p>
                  <p className="text-xs text-gray-600 font-medium">{formatINR(property.monthlyRent)}/month</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-gray-400 block line-through">₹199</span>
                  <span className="text-base font-bold text-primary tabular-nums">₹49</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Select Demo Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-md border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs ring-1 ring-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone size={18} className="mx-auto mb-1 text-primary" />
                    <span className="text-xs">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-md border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs ring-1 ring-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard size={18} className="mx-auto mb-1 text-primary" />
                    <span className="text-xs">Debit / Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-md border text-center transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs ring-1 ring-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Building size={18} className="mx-auto mb-1 text-primary" />
                    <span className="text-xs">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Method Inputs */}
              {paymentMethod === 'upi' && (
                <div className="space-y-2 animate-in fade-in">
                  <label className="text-xs font-medium text-gray-700 block">Virtual Payment Address (Demo VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    placeholder="username@okhdfcbank"
                    className="w-full text-sm px-3.5 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-[11px] text-gray-500">Supports GPay, PhonePe, Paytm, or BHIM demo handles.</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Card Number (Demo)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full text-sm px-3.5 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Valid Thru</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        className="w-full text-sm px-3.5 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={3}
                        required
                        className="w-full text-sm px-3.5 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2 animate-in fade-in">
                  <label className="text-xs font-medium text-gray-700 block">Popular Bank</label>
                  <select className="w-full text-sm px-3.5 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Federal Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Demo Test Failure Toggle (Scenario C Requirement) */}
              <div className="p-3 bg-amber-50 rounded-md border border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-900 block">Simulate Gateway Failure</span>
                  <span className="text-[11px] text-amber-700">Test rejection scenario to verify contacts remain locked</span>
                </div>
                <input
                  type="checkbox"
                  id="forceFailToggle"
                  checked={forceFail}
                  onChange={(e) => setForceFail(e.target.checked)}
                  className="w-4 h-4 text-primary rounded-md border-amber-300 focus:ring-primary cursor-pointer"
                />
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-[11px] text-gray-500">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Demo Sandbox: No real money is charged. Clicking proceed simulates a ₹49 one-time unlock and registers the transaction in your history.
                </span>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-md font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-gold" />
                    <span>Processing ₹49 with Bank...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹49 to Reveal Contact</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
