import React from "react";


const PaymentAPI = ({ amount, onSuccess, onCancel }) => {
  // Simulate payment process
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [name, setName] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState("");

  const handlePay = (e) => {
    e.preventDefault();
    setError("");
    // Simple validation
    if (!cardNumber || !expiry || !cvv || !name) {
      setError("Please fill in all payment details.");
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError("Card number must be 16 digits.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Expiry must be MM/YY.");
      return;
    }
    if (cvv.length < 3) {
      setError("CVV must be at least 3 digits.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1500); // Simulate payment delay
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handlePay} className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2 text-primary">Secure Payment</h2>
        <p className="mb-4 text-sm">Amount to pay: <span className="font-semibold">Rs. {amount.toLocaleString()}</span></p>
        <div className="w-full space-y-3 mb-2">
          <div>
            <label className="block text-xs font-semibold mb-1">Cardholder Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Name on card"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={processing}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Card Number</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={e => {
                let val = e.target.value.replace(/[^\d]/g, '');
                // Insert a space every 4 digits
                val = val.replace(/(.{4})/g, '$1 ').trim();
                setCardNumber(val);
              }}
              maxLength={19}
              disabled={processing}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">Expiry</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="MM/YY"
                value={expiry}
                onChange={e => {
                  let val = e.target.value.replace(/[^\d]/g, '');
                  if (val.length > 2) {
                    val = val.slice(0, 2) + '/' + val.slice(2, 4);
                  }
                  setExpiry(val);
                }}
                maxLength={5}
                disabled={processing}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">CVV</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="123"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/[^\d]/g, ''))}
                maxLength={4}
                disabled={processing}
              />
            </div>
          </div>
        </div>
        {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-2 disabled:opacity-50"
          disabled={processing}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
        <button
          type="button"
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PaymentAPI;
