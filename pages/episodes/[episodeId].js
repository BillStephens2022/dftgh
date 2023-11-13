// pages/episodes/[episodeId].js
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  getEpisodeById,
  addComment,
  deleteComment,
  addPoll,
  updateVoteCount,
  deletePoll,
} from "@/components/lib/api";
import Image from "next/image";
import ModalForm from "@/components/modalForm";
import AddPollForm from "@/components/addPollForm";
import { formatDate } from "@/components/lib/format";
import Button from "@/components/button";
import classes from "./episodeId.module.css";
import Comments from "@/components/comments";

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

function calculatePercentage(votes, totalVotes) {
  if (totalVotes === 0) {
    return 0;
  }
  return (votes / totalVotes) * 100;
}

function EpisodeDetail() {
  const router = useRouter();
  const { data: session } = useSession();
  const { episodeId } = router.query; // Get the episodeId from the route parameters
  const [episode, setEpisode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollFormData, setPollFormData] = useState(initialPollFormData);
  const [sortedComments, setSortedComments] = useState([]);


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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPollFormData(initialPollFormData); // reset formData state when closing the modal
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCommentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleAddComment(commentFormData) {
    
    try {
      console.log("from add comment handler: ", episodeId, commentFormData);
      const addedComment = await addComment(episodeId, commentFormData);
      setEpisode((prevEpisode) => {
        return {
          ...prevEpisode,
          comments: [...prevEpisode.comments, addedComment],
        };
      });
      setCommentFormData(initialCommentFormData);
      console.log("Comment added successfully:", addedComment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  async function handleDeleteComment(episodeId, commentId) {
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
  }

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
      console.log("Poll added successfully! ", addedPoll);
      closeModal();
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

  const handleDeletePoll = async (episodeId, pollId) => {
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

  // Define an array of poll results rendering
  const pollResultBarColors = ["red", "lightblue", "orange", "lightgreen"];

  return (
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
        <div className={classes.polls_div}>
          <h3 className={classes.polls_h3}>Polls</h3>
          <div className={classes.addPollButton_div}>
            {session && (
            <Button
              text="Add Poll"
              backgroundColor="steelblue"
              color="white"
              onClick={openModal}
            />
            )}
          </div>
          {modalOpen && (
            <ModalForm
              onClose={closeModal}
              modalTitle={"Add Poll"}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              form={
                <AddPollForm
                  onSubmit={handleAddPoll}
                  onSubmitSuccess={closeModal}
                />
              }
            />
          )}
          {episode.polls.map((poll) => {
            const pollHasVoted = hasVoted[poll._id];
            const totalVotes = poll.options.reduce(
              (acc, option) => acc + option.votes,
              0
            );
            return (
              <div className={classes.poll_div} key={poll._id}>
              {session && <button
                  type="button"
                  className={classes.delete_btn}
                  onClick={() => handleDeletePoll(episodeId, poll._id)}
                >
                  x
                </button>}
                <p className={classes.poll_question}>{poll.question}</p>
                {pollHasVoted ? (
                  // Render results if the user has voted
                  <ul className={classes.poll_ul}>
                    {poll.options.map((option, index) => (
                      <li className={classes.poll_li_results} key={option._id}>
                        {option.text}
                        <div
                          className={classes.poll_option_bar}
                          style={{
                            width: `${calculatePercentage(
                              option.votes,
                              totalVotes
                            )}%`,
                            backgroundColor: pollResultBarColors[index % 4], // Set different colors for even and odd options
                          }}
                        ></div>
                        {option.votes} votes (
                        {Math.round(
                          calculatePercentage(option.votes, totalVotes)
                        )}
                        %)
                      </li>
                    ))}
                  </ul>
                ) : (
                  // Render voting options and vote button if the user hasn't voted
                  <div>
                    <ul className={classes.poll_ul}>
                      {poll.options.map((option, index) => (
                        <li className={classes.poll_li} key={option._id}>
                          <label>
                            <input
                              type="radio"
                              name={`poll_${poll._id}`}
                              disabled={pollHasVoted} // Disable radio inputs if the user has voted
                              onChange={() => handleOptionChange(index)}
                            />
                            {option.text}
                          </label>
                        </li>
                      ))}
                    </ul>
                    <Button
                      text="Vote"
                      backgroundColor="steelblue"
                      color="white"
                      onClick={() => handleVote(poll._id, selectedPollOption)}
                      disabled={pollHasVoted} // Disable the button if the user has voted
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div>
          <Comments episodeId={episodeId} comments={sortedComments} handleAddComment={handleAddComment} handleDeleteComment={handleDeleteComment} />         
        </div>
      </div>
    </div>
  );
}

export default EpisodeDetail;
