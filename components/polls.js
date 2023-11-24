import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GoTrash } from "react-icons/go";
import DeleteConfirmation from "@/components/deleteConfirmation";
import ModalForm from "@/components/forms/modalForm";
import AddPollForm from "@/components/forms/addPollForm";
import IconButton from "@/components/buttons/iconButton";
import Button from "@/components/buttons/button";
import classes from "@/components/polls.module.css";

const calculatePercentage = (votes, totalVotes) => {
  if (totalVotes === 0) {
    return 0;
  }
  return (votes / totalVotes) * 100;
}

const Polls = ({ episodeId, episode, onSuccess, handleOptionChange, selectedPollOption, handleVote, hasVoted, pollResultBarColors, handleAddPoll, handleDeletePoll, confirmDeletePoll, cancelDeletePoll, showConfirmation }) => {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    if (onSuccess) {
      setModalOpen(false); // Close the modal when onSuccess becomes true
    }
  }, [onSuccess]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };



  return (
    <Fragment>
      <div className={classes.polls_div}>
        <div className={classes.polls_header_div}>
          <h3 className={classes.polls_h3}>Polls</h3>
          {session && (
            <Button
              text="Add Poll"
              margin="0 0 0 0.25rem"
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
                handleAddPoll={handleAddPoll}
                closeModal={closeModal}
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
            
              
              <p className={classes.poll_question}>{poll.question}</p>
              {pollHasVoted ? (
                // Render results if the user has voted
                <>
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
                {session && (<IconButton
                icon={<GoTrash />}
                style={{ position: "absolute", bottom: 7, right: 7 }}
                onClick={() =>
                  handleDeletePoll(episode._id, poll._id)
                }               
              />
              )}
              </>
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
                  {session && (<IconButton
                    icon={<GoTrash />}
                    style={{ bottom: 7, right: 7 }}
                    onClick={() =>
                      handleDeletePoll(episode._id, poll._id)
                    }
                  />
                  )}
                </div>
              )}
                 {(showConfirmation && showConfirmation[0] === episode._id && showConfirmation[1] === poll._id) && (
            <DeleteConfirmation itemToBeDeleted={"poll"} onClick1={confirmDeletePoll} onClick2={cancelDeletePoll} id={[episode._id, poll._id]} />
          )}
            </div>
          );
       
        })}
      
      </div>
    </Fragment>
  )
}

export default Polls;