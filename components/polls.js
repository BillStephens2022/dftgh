import { Fragment } from "react";
import { useSession } from "next-auth/react";
import Button from "./buttons/button";
import DeleteButton from "./buttons/button";
import classes from "./polls.module.css";


const Polls = () => {
    const session = useSession();
    <Fragment>
        <div className={classes.polls_div}>
          <div className={classes.polls_header_div}>
            <h3 className={classes.polls_h3}>Polls</h3>
            {session && (
              <Button
                text="Add Poll"
                backgroundColor="seagreen"
                color="white"
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
                {session && <DeleteButton
                  onClick={() => handleDeletePoll(episodeId, poll._id)}
                />}
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
    </Fragment>
}

export default Polls;