import React, { useState } from "react";

export default function InvestorsPage() {
  const [investors, setInvestors] = useState([
    { id: 1, name: "Investor One", amount: 5000 },
    { id: 2, name: "Investor Two", amount: 10000 },
  ]);

  const handleDeleteInvestor = (id) => setInvestors(investors.filter((inv) => inv.id !== id));

  return (
    <div className="content">
      <h2>Investor Management</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Investment Amount</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {investors.map((investor) => (
            <tr key={investor.id}>
              <td>{investor.name}</td>
              <td>${investor.amount}</td>
              <td><button onClick={() => handleDeleteInvestor(investor.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
