import React from 'react';

function LogoutPage({ onLogout }) {
  return (
    <div className="flex justify-end p-4">
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}

export default LogoutPage;
