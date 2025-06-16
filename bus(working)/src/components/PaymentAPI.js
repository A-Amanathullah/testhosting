import React from "react";

const PaymentAPI = ({ amount, onSuccess, onPayLater }) => {
  // Simulate payment process
  const handlePay = () => {
    setTimeout(() => {
      onSuccess();
    }, 1000); // Simulate payment delay
  };
  const handlePayLater = () => {
    setTimeout(() => {
      onPayLater();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2 text-primary">Payment</h2>
        <p className="mb-4 text-sm">Amount to pay: <span className="font-semibold">Rs. {amount.toLocaleString()}</span></p>
        <button
          onClick={handlePay}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-2"
        >
          Pay Now
        </button>
        <button
          onClick={handlePayLater}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 rounded mb-2"
        >
          Pay Later
        </button>
      </div>
    </div>
  );
};

export default PaymentAPI;
