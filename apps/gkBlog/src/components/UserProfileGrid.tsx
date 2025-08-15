import Image from "next/image";
import React, { useState } from "react";

interface UserProfileProps {
  username: string;
  score: number;
  date: string;
}

function getScoreColor(score: number): string {
  if (score >= 100) return "bg-red-500";
  if (score >= 50) return "bg-yellow-500";
  if (score >= 5) return "bg-gray-500";
  return "bg-gray-400";
}

function UserProfileCard({
  username,
  score,
  date,
}: UserProfileProps): React.ReactElement {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-300 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 truncate text-[18px] font-semibold text-gray-900 dark:text-gray-100">
        {username}
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`${getScoreColor(
            score,
          )} rounded px-1.5 py-0.5 text-[10px] font-medium text-white`}
        >
          ¥ {score}
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          {date}
        </span>
      </div>
    </div>
  );
}

function UserProfileGrid({
  users,
}: {
  users: UserProfileProps[];
}): React.ReactElement {
  const [showQRCode, setShowQRCode] = useState(false);
  const totalScore = users.reduce((acc, user) => acc + user.score, 0);

  return (
    <div>
      <div className="mt-4 mb-4 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {users.map((user) => (
          <UserProfileCard
            key={user.username}
            username={user.username}
            score={user.score}
            date={user.date}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[15px] font-semibold">
        <span>
          总金额：¥ {totalScore.toFixed(2)}
          ，将全部用于网站的服务器、域名及云服务开销
        </span>
        <button
          type="button"
          onClick={() => setShowQRCode((prev) => !prev)}
          className="ml-4 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
        >
          {showQRCode ? "下次一定" : "支持一下"}
        </button>
      </div>

      {showQRCode && (
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex flex-col items-center">
            <Image
              src="https://cdn.qladgk.com/images/zanshang.png"
              alt="收款码"
              width={150}
              height={150}
            />
            <span className="mt-2 text-sm">微信</span>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="https://cdn.qladgk.com/images/zhifubao.jpg"
              alt="收款码"
              width={150}
              height={150}
            />
            <span className="mt-2 text-sm">支付宝</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfileGrid;
