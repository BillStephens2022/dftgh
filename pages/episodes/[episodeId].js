// pages/episodes/[episodeId].js
// Dynamic Episode page, When user clicks on a specific episode from the Episodes page,
// they are routed here.  This page shows the episode details (photo, title, description, date aired) as well as
// sections for Polls and Comments where users can vote in polls or comment on the episode.
// Logged in Users (i.e. the Podcasters/admin users) have ability to control content where they can add or delete
// a poll or delete harmful comments.
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import {
  getEpisodeById,
  addComment,
  deleteComment,
  addPoll,
  updateVoteCount,
  deletePoll,
} from "@/components/lib/api";
import { formatDate } from "@/components/lib/dates";
import Polls from "@/components/polls";
import Comments from "@/components/comments";
import classes from "@/pages/episodes/episodeId.module.css";
import Head from "next/head";

const initialCommentFormData = {
  name: "",
  commentText: "",
  episodeId: "",
  createdAt: "",
};

const initialPollFormData = {
  question: "",
  options: [],
};

const EpisodeDetail = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { episodeId } = router.query; // Get the episodeId from the route parameters
  const [episode, setEpisode] = useState(null);
  const [selectedPollOption, setSelectedPollOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortedComments, setSortedComments] = useState([]);
  const [pollFormData, setPollFormData] = useState(initialPollFormData);
  const [addCommentSuccess, setAddCommentSuccess] = useState(false);
  const [addPollSuccess, setAddPollSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);

  const initialHasVotedState = {};
  if (episode && episode.polls) {
    episode.polls.forEach((poll) => {
      initialHasVotedState[poll._id] = false;
    });
  }
  const [hasVoted, setHasVoted] = useState(initialHasVotedState);

  const [commentFormData, setCommentFormData] = useState(
    initialCommentFormData
  );

  useEffect(() => {
    if (episodeId) {
      // Set episodeId in the form data
      setCommentFormData((prevData) => ({
        ...prevData,
        episodeId: episodeId,
      }));

      const fetchEpisodeDetails = async () => {
        try {
          const data = await getEpisodeById(episodeId);
          setEpisode(data); // Update episode state with fetched data
          setLoading(false);
        } catch (error) {
          console.error("Error fetching episode details:", error);
        }
      };

      fetchEpisodeDetails();
    }
  }, [episodeId]);

  useEffect(() => {
    // Check local storage for the hasVoted flag
    if (episode && episode.polls) {
      const newHasVoted = {}; // Create a new object to store poll ID and hasVoted status
      episode.polls.forEach((poll) => {
        const hasVoted = localStorage.getItem(`voted_${episodeId}_${poll._id}`);
        newHasVoted[poll._id] = hasVoted; // Set poll ID as key and hasVoted status as boolean value
      });
      setHasVoted(newHasVoted);
    }
  }, [episode]);

  useEffect(() => {
    // Sort comments by createdAt date in descending order
    if (episode && episode.comments) {
      const sorted = episode.comments.slice().sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setSortedComments(sorted);
    }
  }, [episode]);

  if (loading || episode === null) {
    return <div>Loading...</div>; // Loading state while fetching episode details or if episode is null
  }

  const handleAddComment = async (commentFormData) => {
    try {
      console.log("from add comment handler: ", episodeId, commentFormData);
      const addedComment = await addComment(episodeId, commentFormData);

      setEpisode((prevEpisode) => {
        // Helper function to recursively find and update the parent comment
        const updateReplies = (comments) => {
          return comments.map((comment) => {
            // Ensure replies is always an array
            const replies = Array.isArray(comment.replies) ? comment.replies : [];
        
            if (comment._id === addedComment.parentId) {
              return {
                ...comment,
                replies: [
                  ...replies,  // Use the safe replies array
                  { ...addedComment, tempId: null }, // Add the new reply
                ],
              };
            } else if (replies.length > 0) {
              // Recursively update nested replies
              return {
                ...comment,
                replies: updateReplies(replies),
              };
            }
        
            return comment;
          });
        };

        if (addedComment.parentId) {
          // Update the parent comment's replies
          return {
            ...prevEpisode,
            comments: updateReplies(prevEpisode.comments),
          };
        } else {
          // If it's a top-level comment, just add it to the comments array
          return {
            ...prevEpisode,
            comments: [
              ...prevEpisode.comments,
              { ...addedComment, tempId: null }, // Add the new comment
            ],
          };
        }
      });

      setCommentFormData(initialCommentFormData);
      setAddCommentSuccess(true);
      console.log("Comment added successfully:", addedComment);
      return addedComment;
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (episodeId, commentId) => {
    console.log("delete comment clicked");
    setShowConfirmation([episodeId, commentId]);
    console.log(showConfirmation);
  };

  const confirmDeleteComment = async ([episodeId, commentId]) => {
    try {
      const success = await deleteComment(episodeId, commentId);
      if (success) {
        console.log("Comment deleted successfully");
        // Update the episode state to remove the deleted comment
        setEpisode((prevEpisode) => ({
          ...prevEpisode,
          comments: prevEpisode.comments.filter(
            (comment) => comment._id !== commentId
          ),
        }));
      } else {
        console.error("Error deleting comment");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const cancelDeleteComment = () => {
    setShowConfirmation(null); // Reset confirmation without deleting
  };

  const handleAddPoll = async (pollFormData) => {
    console.log(
      "adding poll for episode id: ",
      episodeId,
      "Poll Form Data: ",
      pollFormData
    );
    try {
      const addedPoll = await addPoll(episodeId, pollFormData);
      setEpisode((prevEpisode) => {
        return {
          ...prevEpisode,
          polls: [...prevEpisode.polls, addedPoll],
        };
      });
      setPollFormData(initialPollFormData);
      setAddPollSuccess(true);
      console.log("Poll added successfully! ", addedPoll);
    } catch (error) {
      console.error("Error adding poll:", error);
    }
  };

  const handleOptionChange = (index) => {
    setSelectedPollOption(index);
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      // Check if the user has already voted using a browser cookie or local storage
      const hasVotedForPoll = hasVoted[pollId];
      if (hasVotedForPoll) {
        console.log("User has already voted for this poll.");
        return;
      }

      // If the user hasn't voted, update the vote count and set the flag in local storage
      const updatedPoll = await updateVoteCount(episodeId, pollId, optionIndex);
      if (updatedPoll && updatedPoll._id) {
        // Update the hasVoted state for this poll
        setHasVoted((prevHasVoted) => ({
          ...prevHasVoted,
          [pollId]: true,
        }));
        // Store the voting status in local storage
        localStorage.setItem(`voted_${episodeId}_${pollId}`, true);

        setEpisode((prevEpisode) => {
          return {
            ...prevEpisode,
            polls: prevEpisode.polls.map((poll) =>
              poll._id === updatedPoll._id ? updatedPoll : poll
            ),
          };
        });
        console.log("Poll updated successfully with new Vote! ", updatedPoll);
      } else {
        console.error("Invalid poll data received:", updatedPoll);
      }
    } catch (error) {
      console.error("Error adding poll:", error);
    }
  };

  const handleDeletePoll = (episodeId, pollId) => {
    console.log("delete poll clicked");
    setShowConfirmation([episodeId, pollId]);
  };

  const confirmDeletePoll = async ([episodeId, pollId]) => {
    console.log("confirming delete of episode ID: ", episodeId);
    console.log("confirming delete of episode ID: ", pollId);
    try {
      const success = await deletePoll(episodeId, pollId);
      if (success) {
        console.log("Poll deleted successfully");
        // Update the episode state to remove the deleted poll
        setEpisode((prevEpisode) => ({
          ...prevEpisode,
          polls: prevEpisode.polls.filter((poll) => poll._id !== pollId),
        }));
      } else {
        console.error("Error deleting poll");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const cancelDeletePoll = () => {
    setShowConfirmation(null); // Reset confirmation without deleting
  };

  // Define an array of poll results rendering
  const pollResultBarColors = ["chartreuse", "red", "lightsteelblue", "yellow"];

  return (
    <Fragment>
      <Head>
        <title>Drinking From The Garden Hose - Episode {episode.title}</title>
        <meta
          name="description"
          content="Drinking From The Garden Hose Podcast Ed Philipp OB Spencer - Single Episode Page"
        />
      </Head>

      <div className={classes.episodeId_div}>
        <div className={classes.header_card}>
          <div className={classes.image_div}>
            <img src={episode.imageLink} width={200} height={200}></img>
          </div>
          <div className={classes.header_card_content}>
            <h1 className={classes.title}>{episode.title}</h1>
            <p className={classes.date_aired}>
              Aired: {formatDate(episode.dateAired)}
            </p>
            <p className={classes.description}>{episode.description}</p>
          </div>
        </div>
        <div className={classes.polls_and_comments_div}>
          <div>
            <Polls
              episodeId={episodeId}
              episode={episode}
              hasVoted={hasVoted}
              pollResultBarColors={pollResultBarColors}
              handleAddPoll={handleAddPoll}
              handleDeletePoll={handleDeletePoll}
              confirmDeletePoll={confirmDeletePoll}
              cancelDeletePoll={cancelDeletePoll}
              handleOptionChange={handleOptionChange}
              selectedPollOption={selectedPollOption}
              handleVote={handleVote}
              onSuccess={addPollSuccess}
              showConfirmation={showConfirmation}
              setShowConfirmation={setShowConfirmation}
            />
          </div>
          <div>
            <Comments
              episodeId={episodeId}
              comments={sortedComments}
              handleAddComment={handleAddComment}
              handleDeleteComment={handleDeleteComment}
              confirmDeleteComment={confirmDeleteComment}
              cancelDeleteComment={cancelDeleteComment}
              onSuccess={addCommentSuccess}
              showConfirmation={showConfirmation}
              setShowConfirmation={setShowConfirmation}
              setEpisode={setEpisode}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EpisodeDetail;
