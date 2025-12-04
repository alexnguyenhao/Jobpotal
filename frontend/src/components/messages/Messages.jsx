import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "@/hooks/useGetMessages";
import useListenMessages from "@/hooks/useListenMessages";
import { useSelector } from "react-redux";

const Messages = () => {
  const { messages, loading } = useSelector((state) => state.conversation);

  useGetMessages();
  useListenMessages();

  const scrollRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 py-2 flex-1 overflow-auto custom-scrollbar bg-white">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id}>
            <Message message={message} />
          </div>
        ))}

      <div ref={scrollRef} />

      {loading && (
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-spinner text-[#6A38C2]">
            Loading...
          </span>
        </div>
      )}

      {!loading && messages.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          Send a message to start the conversation
        </p>
      )}
    </div>
  );
};

export default Messages;
