import React from "react";
import styled from "styled-components";

const SchawnnahJLoader = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .loader {
    position: relative;
    width: 2.5em;
    height: 2.5em;
    transform: rotate(165deg);
  }

  .loader:before,
  .loader:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    transform: translate(-50%, -50%);
  }

  .loader:before {
    animation: before8 2s infinite;
  }

  .loader:after {
    animation: after6 2s infinite;
  }

  @keyframes before8 {
    0% {
      width: 0.5em;
      box-shadow: 1em -0.5em rgba(242, 96, 37, 1),
        // Bar 1 - Top
        -1em 0.5em rgba(129, 194, 68, 1); // Bar 3 - Bottom
    }

    35% {
      width: 2.5em;
      box-shadow: 0 -0.5em rgba(242, 96, 37, 1),
        // Bar 1 - Top
        0 0.5em rgba(129, 194, 68, 1); // Bar 3 - Bottom
    }

    70% {
      width: 0.5em;
      box-shadow: -1em -0.5em rgba(242, 96, 37, 1),
        // Bar 1 - Top
        1em 0.5em rgba(129, 194, 68, 1); // Bar 3 - Bottom
    }

    100% {
      box-shadow: 1em -0.5em rgba(242, 96, 37, 1),
        // Bar 1 - Top
        -1em 0.5em rgba(129, 194, 68, 1); // Bar 3 - Bottom
    }
  }

  @keyframes after6 {
    0% {
      height: 0.5em;
      box-shadow: 0.5em 1em rgba(71, 181, 228, 1),
        // Bar 4 - Left
        -0.5em -1em rgba(101, 48, 147, 1); // Bar 2 - Right
    }

    35% {
      height: 2.5em;
      box-shadow: 0.5em 0 rgba(71, 181, 228, 1),
        // Bar 4 - Left
        -0.5em 0 rgba(101, 48, 147, 1); // Bar 2 - Right
    }

    70% {
      height: 0.5em;
      box-shadow: 0.5em -1em rgba(71, 181, 228, 1),
        // Bar 4 - Left
        -0.5em 1em rgba(101, 48, 147, 1); // Bar 2 - Right
    }

    100% {
      box-shadow: 0.5em 1em rgba(71, 181, 228, 1),
        // Bar 4 - Left
        -0.5em -1em rgba(101, 48, 147, 1); // Bar 2 - Right
    }
  }

  .loader {
    position: absolute;
    top: calc(50% - 1.25em);
    left: calc(50% - 1.25em);
  }
`;

export default SchawnnahJLoader;
