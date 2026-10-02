import React from "react";

function AssistantMsg({ message }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-2xl text-neutral-200 leading-relaxed">
        {message}
      </div>
    </div>
  );
}

export default AssistantMsg;
