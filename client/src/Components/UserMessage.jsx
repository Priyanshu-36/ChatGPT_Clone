import React from "react";

function UserMessage({ message }) {
  return (
    <div className="flex justify-end">
      <div className="bg-neutral-700 px-4 py-3 rounded-2xl max-w-xl">
        {message}
      </div>
    </div>
  );
}

export default UserMessage;
