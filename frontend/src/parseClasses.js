import Parse from "parse";

const Review = Parse.Object.extend("review");
const Song = Parse.Object.extend("song");
const Artist = Parse.Object.extend("artist");
const User = Parse.Object.extend("User");

export {Review, Song, Artist, User};
