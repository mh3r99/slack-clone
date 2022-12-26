import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, percentUploaded }) => {
  return (
    uploadState && (
      <Progress
        className="progress__bar"
        percent={percentUploaded}
        progress
        indicating
        inverted
        size="medium"
      ></Progress>
    )
  );
};

export default ProgressBar;
