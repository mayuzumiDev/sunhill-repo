import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const TableSearchBar = ({ onSearch, searchTerm }) => {
  const handleInputChange = (event) => {
    const searchValue = event.target.value;
    onSearch(searchValue);
  };

  const handleReset = () => {
    onSearch("");
  };
  return (
    <StyledWrapper>
      <form className="form">
        <button>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <input
          className="input"
          placeholder="Search by Name"
          required
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button className="reset" type="reset" onClick={handleReset}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* From uiverse.io by @satyamchaudharydev */
  /* removing default style of button */

  .form button {
    border: none;
    background: none;
    color: #8b8ba7;
  }
  /* styling of whole input container */
  .form {
    --timing: 0.3s;
    --width-of-input: 200px;
    --height-of-input: 40px;
    --border-height: 2px;
    --input-bg: #fff;
    --border-color: #2196f3;
    --border-radius: 30px;
    --after-border-radius: 1px;
    position: relative;
    width: var(--width-of-input);
    height: var(--height-of-input);
    display: flex;
    align-items: center;
    padding-inline: 0.8em;
    border-radius: var(--border-radius);
    transition: border-radius 0.5s ease;
    background: var(--input-bg, #fff);
  }
  /* styling of Input */
  .input {
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    height: 100%;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: none;
  }
  /* styling of animated border */
  .form:before {
    content: "";
    position: absolute;
    background: var(--border-color);
    transform: scaleX(0);
    transform-origin: center;
    width: 100%;
    height: var(--border-height);
    left: 0;
    bottom: 0;
    border-radius: 1px;
    transition: transform var(--timing) ease;
  }
  /* Hover on Input */
  .form:focus-within {
    border-radius: var(--after-border-radius);
  }

  input:focus {
    outline: none;
  }
  /* here is code of animated border */
  .form:focus-within:before {
    transform: scale(1);
  }
  /* styling of close button */
  /* == you can click the close button to remove text == */
  .reset {
    border: none;
    background: none;
    opacity: 0;
    visibility: hidden;
  }
  /* close button shown when typing */
  input:not(:placeholder-shown) ~ .reset {
    opacity: 1;
    visibility: visible;
  }
  /* sizing svg icons */
  .form svg {
    width: 17px;
    margin-top: 3px;
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    /* Reduce width of the input */
    .form {
      --width-of-input: 170px;
      --height-of-input: 35px;
    }

    .input {
      font-size: 0.75rem; /* Smaller font size on mobile */
    }

    .form svg {
      width: 15px; /* Smaller icon size */
    }
  }

  @media (max-width: 480px) {
    /* Further reduce input size for very small screens */
    .form {
      --width-of-input: 150px;
      --height-of-input: 40px;
    }

    .input {
      font-size: 0.65rem; /* Even smaller font size */
    }

    .form svg {
      width: 10px; /* Even smaller icon size */
    }
  }
`;

export default TableSearchBar;
