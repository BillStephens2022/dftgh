import { Fragment } from "react";
import classes from "@/components/featureCard.module.css";


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
            href: "/about"
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
                    <a key={feature.id} href={feature.href} className={classes.link}>
                        <div className={classes.card}>
                            <h4>{feature.title}</h4>
                            <p>{feature.content}</p>
                        </div>
                    </a>

                ))}
            </div>


        </Fragment>
    )
}

export default FeatureCard;
