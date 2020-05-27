import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Parse from "parse";
import {Link} from "react-router-dom";

import {
  Review as ReviewClass,
  Song as SongClass,
  User as UserClass
} from "../parseClasses";

const Review = (props) => {
  const {reviewId, isListing, showLinkToSong} = props;
  const [reviewObj, setReviewObj] = useState(null);

  useEffect(() => {
    (async () => {
      const query = new Parse.Query(ReviewClass);
      query.get(reviewId);

      const resultWithPointers = await query.get(reviewId);;
      const result = (async (r) => {
        const {
          objectId,
          author: {objectId: authorId},
          song: {objectId: songId},
          review: ReviewText,
          rating
        } = r.toJSON();

        let song = await new Parse.Query(SongClass).get(songId);
        song = song.toJSON();
        const userQuery = new Parse.Query(UserClass);
        let author = await userQuery.get(authorId);
        author = author.toJSON();
        let artist = await userQuery.get(song.artist.objectId);
        artist = artist.toJSON();

        const review = {objectId, review: ReviewText, rating, authorId};
        review.author = author.name;
        review.song = song.name;
        review.songId = songId;
        review.artist = artist.name;
        review.artistId = song.artist.objectId;
        return review;
      })(resultWithPointers);

      setReviewObj(await result);
    })();
  }, [reviewId, setReviewObj]);

  return (
    <>
      {reviewObj
        ? (
          <div className="review">
            {isListing
              ? (
                <>
                  <Link to={`/user/${reviewObj.authorId}`}>
                    <h4>{reviewObj.author}</h4>
                  </Link>
                  <p>{reviewObj.rating} stars</p>
                  <p>{reviewObj.review}</p>
                </>
              ) : (
                <>
                  <h3>{reviewObj.song}</h3>
                  <p>
                    {"Artist: "}
                    {isListing
                      ? reviewObj.artist
                      : (
                        <Link to={`/user/${reviewObj.artistId}`}>
                          {reviewObj.artist}
                        </Link>
                      )}
                  </p>
                  <p>
                    {"By: "}
                    <Link to={`/user/${reviewObj.authorId}`}>
                      {reviewObj.author}
                    </Link>
                  </p>
                  <p>Rating: {reviewObj.rating}</p>
                  <p>Review: {reviewObj.review}</p>
                </>
              )}
            {showLinkToSong &&
              <Link to={`/song/${reviewObj.songId}`}>
                Visit song page for {reviewObj.song}
              </Link>}
          </div>
        ) : (
          <p>Loading review...</p>
        )}
    </>
  );
};

Review.propTypes = {
  reviewId: PropTypes.string.isRequired,
  isListing: PropTypes.bool,
  showLinkToSong: PropTypes.bool
};

Review.defaultProps = {
  isListing: false,
  showLinkToSong: false
};

export default Review;
