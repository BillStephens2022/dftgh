import { Fragment } from "react";
import classes from "./card.module.css";

const Card = () => {
    return (
        <Fragment>
            <div className={classes.card} key={episode._id}>
                <div className={classes.card_inner_wrapper}>
                    <div className={classes.banner_image} style={{ backgroundImage: `url()` }}> </div>
                    <div className={classes.card_header}>
                        <h3 className={classes.episode_title}></h3>
                        <h4 className={classes.episode_aired}>

                        </h4>
                    </div>
                    <div className={classes.card_main}>

                        <div className={classes.episode_details}>
                            <p className={classes.episode_detail}>

                            </p>


                        </div>

                    </div>
                </div>

            </div>

        </Fragment >
    );
}

export default Card;