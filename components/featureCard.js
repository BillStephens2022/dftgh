import { Fragment } from "react";
import classes from "./featureCard.module.css";


const FeatureCard = () => {

    const featureCardData = [
        {
            id: 1,
            title: "Episodes",
            content: "Check out all our episodes and leave some comments or vote in our user polls!",
            href: "/episodes"

        },
        {
            id: 2,
            title: "About Us",
            content: "Meet the 'Cast and listen to some sound clips from the show",
            href: "/bios"
        },
        {
            id: 3,
            title: "Feedback",
            content: "Leave us general feedback about the show.  Post it Publicly or Privately.",
            href: "/feedback"
        },
    ];

    return (
        <Fragment>
            <div className={classes.card_container}>
                {featureCardData.map((feature) =>
                (
                    <div key={feature.id} className={classes.card}>
                        <div className={classes.item}>
                            <a href={feature.href} className={classes.link}>
                                <div className={classes.item_bg}></div>

                                <div className={classes.item_title}>
                                    {feature.title}
                                </div>

                                <div className={classes.item_date_box}>
                                    {feature.content}

                                </div>
                            </a>
                        </div>
                    </div>

                ))}
            </div>


        </Fragment>
    )
}

export default FeatureCard;
