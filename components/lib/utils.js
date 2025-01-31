export const addReplyRecursively = (replies, parentId, newReply) => {
  return replies.map((reply) => {
    if (reply._id === parentId) {
      // Add the new reply to the correct parent
      return {
        ...reply,
        replies: [...reply.replies, newReply],
      };
    }
    return {
      ...reply,
      replies: addReplyRecursively(reply.replies, parentId, newReply),
    };
  });
};

// Utility to replace an optimistic reply with the new reply recursively
export const replaceReplyRecursively = (replies, tempId, newReply) => {
  return replies.map((reply) =>
    reply._id === tempId
      ? newReply
      : {
          ...reply,
          replies: replaceReplyRecursively(reply.replies, tempId, newReply),
        }
  );
};

// Utility to remove a reply recursively
export const removeReplyRecursively = (replies, replyId) => {
  return replies
    .filter((reply) => reply._id !== replyId)
    .map((reply) => ({
      ...reply,
      replies: removeReplyRecursively(reply.replies, replyId),
    }));
};

export const formatDate = (dateString) => {
  // Parse the input string to a JavaScript Date object
  if (!dateString) {
    return "N/A"; // Or any other placeholder for invalid dates
  }
  const inputDate = new Date(dateString);

  // Ensure inputDate is a valid JavaScript Date object
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date object");
  }

  // Options for formatting the date
  const options = { year: "numeric", month: "short", day: "2-digit" };

  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(inputDate);
  return formattedDate;
}

export const isSameDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
  );
};

export const getUsername =(username) => {
 if (username === "Roadkill") {
    return "Ed";
  } else if (username === "Flounder") {
    return "OB";
  } else {
    return username;
 }
}