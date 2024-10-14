import React from 'react';

const Rewards = ({ rewards }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-4">Rewards and Badges</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {rewards.map((reward, index) => (
          <div key={index} className="bg-blue-100 p-4 rounded-lg text-center">
            <img src={reward.icon} alt={reward.title} className="h-12 mx-auto mb-2" />
            <h3 className="font-semibold">{reward.title}</h3>
            <p>{reward.points} Points</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
